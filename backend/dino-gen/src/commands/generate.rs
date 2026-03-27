use crate::ContentType;
use crate::pipeline;
use crate::providers::gemini::GeminiClient;
use crate::providers::pocketbase::PocketBaseClient;
use crate::providers::tts::TtsApiClient;

pub async fn run(
    pb_url: &str,
    api_url: &str,
    gemini_key: &Option<String>,
    pb_email: &Option<String>,
    pb_password: &Option<String>,
    api_email: &Option<String>,
    api_password: &Option<String>,
    slug: &str,
    only: Option<ContentType>,
    skip_existing: bool,
    force: bool,
) {
    let email = pb_email.as_deref().expect("POCKETBASE_ADMIN_EMAIL required");
    let password = pb_password.as_deref().expect("POCKETBASE_ADMIN_PASSWORD required");

    let mut pb = PocketBaseClient::new(pb_url);
    pb.auth(email, password).await.expect("PocketBase auth failed");

    // Init Gemini client if needed for images/texts
    let content_type = only.clone().unwrap_or(ContentType::All);
    let needs_gemini = content_type.needs_texts() || content_type.needs_images();
    let gemini = if needs_gemini {
        let key = gemini_key.as_deref().expect("GEMINI_API_KEY required for text/image generation");
        Some(GeminiClient::new(key))
    } else {
        None
    };

    // Init TTS API client if needed (calls the running Dino-Atlas API in Docker)
    let needs_tts = content_type.needs_audio();
    let tts = if needs_tts {
        let tts_email = api_email.as_deref().expect("DINO_GEN_API_EMAIL required for audio generation");
        let tts_password = api_password.as_deref().expect("DINO_GEN_API_PASSWORD required for audio generation");
        match TtsApiClient::new(api_url, tts_email, tts_password).await {
            Ok(client) => Some(client),
            Err(e) => {
                tracing::error!("TTS API init failed: {}. Audio generation will be skipped.", e);
                None
            }
        }
    } else {
        None
    };

    if slug == "all" {
        let all_dinos = pipeline::seed_data::all_dinos();

        // Check what already exists in PocketBase
        let existing = pb.list_records("dino_species", None).await.unwrap_or_default();
        let existing_slugs: Vec<String> = existing.iter()
            .filter_map(|r| r["slug"].as_str().map(|s| s.to_string()))
            .collect();

        println!("\n{} dinos in DB, {} in seed data\n", existing_slugs.len(), all_dinos.len());

        // Show status overview
        for dino in &all_dinos {
            let record = existing.iter().find(|r| r["slug"].as_str() == Some(&dino.slug));
            let status = match record {
                Some(r) => {
                    let has_text = !r["kid_summary"].as_str().unwrap_or("").is_empty();
                    let has_comic = !r["image_comic"].as_str().unwrap_or("").is_empty();
                    let has_audio = !r["audio_name"].as_str().unwrap_or("").is_empty();
                    format!("text:{} img:{} audio:{}",
                        if has_text { "✓" } else { "✗" },
                        if has_comic { "✓" } else { "✗" },
                        if has_audio { "✓" } else { "✗" })
                }
                None => "not seeded".into(),
            };
            println!("  {:20} {}", dino.slug, status);
        }
        println!();

        for (i, dino) in all_dinos.iter().enumerate() {
            tracing::info!("[{}/{}] {}", i + 1, all_dinos.len(), dino.slug);

            let record = match existing.iter().find(|r| r["slug"].as_str() == Some(&dino.slug)) {
                Some(r) => r.clone(),
                None => {
                    tracing::warn!("  {} not seeded, skipping (run `seed` first)", dino.slug);
                    continue;
                }
            };

            let record_id = record["id"].as_str().unwrap();
            generate_one(&pb, gemini.as_ref(), tts.as_ref(), dino, record_id, &record, &content_type, skip_existing, force).await;

            // Rate limit between dinos
            if i < all_dinos.len() - 1 {
                tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
            }
        }
    } else {
        // Single dino — check seed data first, then fall back to PocketBase record
        let filter = format!("slug='{}'", slug);
        let record = pb.find_record("dino_species", &filter).await
            .expect("PocketBase query failed")
            .unwrap_or_else(|| panic!("{} not found in PocketBase. Run `seed` first.", slug));

        let dino = pipeline::seed_data::all_dinos().into_iter()
            .find(|d| d.slug == slug)
            .unwrap_or_else(|| {
                // Build DinoSeed from PocketBase record (for discovered dinos)
                pipeline::seed_data::DinoSeed {
                    slug: record["slug"].as_str().unwrap_or(slug).to_string(),
                    display_name_de: record["display_name_de"].as_str().unwrap_or(slug).to_string(),
                    scientific_name: record["scientific_name"].as_str().unwrap_or("").to_string(),
                    period: record["period"].as_str().unwrap_or("").to_string(),
                    period_start_mya: record["period_start_mya"].as_u64().unwrap_or(0) as u32,
                    period_end_mya: record["period_end_mya"].as_u64().unwrap_or(0) as u32,
                    diet: record["diet"].as_str().unwrap_or("").to_string(),
                    length_m: record["length_m"].as_f64().unwrap_or(0.0) as f32,
                    weight_kg: record["weight_kg"].as_f64().unwrap_or(0.0) as f32,
                    continent: record["continent"].as_str().unwrap_or("").to_string(),
                    rarity: record["rarity"].as_str().unwrap_or("common").to_string(),
                    habitat_description: record["habitat_description"].as_str().unwrap_or("").to_string(),
                }
            });

        let record_id = record["id"].as_str().unwrap();
        generate_one(&pb, gemini.as_ref(), tts.as_ref(), &dino, record_id, &record, &content_type, skip_existing, force).await;
    }

    println!("\nDone! Run `costs` to see usage summary.");
}

pub async fn generate_one(
    pb: &PocketBaseClient,
    gemini: Option<&GeminiClient>,
    tts: Option<&TtsApiClient>,
    dino: &pipeline::seed_data::DinoSeed,
    record_id: &str,
    existing: &serde_json::Value,
    content_type: &ContentType,
    skip_existing: bool,
    force: bool,
) {
    println!("\n🦕 {} ({})", dino.display_name_de, dino.slug);
    println!("   Record: {}\n", record_id);

    // Texts
    if content_type.needs_texts() {
        let has_text = !existing["kid_summary"].as_str().unwrap_or("").is_empty();
        if force || !has_text || !skip_existing {
            if let Some(gemini) = gemini {
                println!("   📝 [1/3] Generating texts via Gemini Flash...");
                match pipeline::texts::generate(pb, gemini, dino, record_id).await {
                    Ok(()) => println!("   📝 Texts done ✓"),
                    Err(e) => println!("   📝 Texts FAILED ✗ — {}", e),
                }
            }
        } else {
            println!("   📝 [1/3] Texts — skipped (already exists)");
        }
    }

    // Images
    if content_type.needs_images() {
        if let Some(gemini) = gemini {
            println!("   🖼️  [2/3] Generating images...");
            match pipeline::images::generate(pb, gemini, dino, record_id, existing, force, content_type).await {
                Ok(()) => println!("   🖼️  Images done ✓"),
                Err(e) => println!("   🖼️  Images FAILED ✗ — {}", e),
            }
        }
    }

    // Audio (needs texts to be generated first for steckbrief)
    if content_type.needs_audio() {
        if let Some(tts) = tts {
            println!("   🔊 [3/3] Generating audio via TTS API...");
            // Re-fetch record to get latest kid_summary (may have just been generated)
            let fresh = pb.find_record("dino_species", &format!("slug='{}'", dino.slug)).await
                .unwrap_or(Some(existing.clone()))
                .unwrap_or_else(|| existing.clone());

            let kid_summary_tts = fresh["kid_summary_tts"].as_str()
                .filter(|s| !s.is_empty())
                .or_else(|| fresh["kid_summary"].as_str())
                .unwrap_or("");
            let name_ipa = fresh["name_ipa"].as_str().unwrap_or("");
            match pipeline::audio::generate(pb, tts, record_id, &dino.slug, &dino.display_name_de, kid_summary_tts, name_ipa, &fresh, force).await {
                Ok(()) => println!("   🔊 Audio done ✓"),
                Err(e) => println!("   🔊 Audio FAILED ✗ — {}", e),
            }
        }
    }

    println!("\n   ✅ {} complete!\n", dino.slug);
}
