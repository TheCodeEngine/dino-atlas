use crate::ContentType;
use crate::pipeline;
use crate::providers::gemini::GeminiClient;
use crate::providers::pocketbase::PocketBaseClient;
use dino_atlas_tts::PiperTts;

pub async fn run(
    pb_url: &str,
    gemini_key: &Option<String>,
    piper_bin: &str,
    piper_model: &str,
    pb_email: &Option<String>,
    pb_password: &Option<String>,
    count: u32,
    generate: bool,
    only: Option<ContentType>,
) {
    let email = pb_email.as_deref().expect("POCKETBASE_ADMIN_EMAIL required");
    let password = pb_password.as_deref().expect("POCKETBASE_ADMIN_PASSWORD required");
    let key = gemini_key.as_deref().expect("GEMINI_API_KEY required for discover");

    let mut pb = PocketBaseClient::new(pb_url);
    pb.auth(email, password).await.expect("PocketBase auth failed");
    let gemini = GeminiClient::new(key);

    // 1. Fetch all existing dino slugs from PocketBase + seed data
    let existing = pb.list_records("dino_species", None).await.unwrap_or_default();
    let pb_slugs: Vec<String> = existing
        .iter()
        .filter_map(|r| r["slug"].as_str().map(|s| s.to_string()))
        .collect();
    let seed_slugs = pipeline::seed_data::all_dino_slugs();
    let mut existing_slugs: Vec<String> = pb_slugs;
    for s in seed_slugs {
        if !existing_slugs.contains(&s) {
            existing_slugs.push(s);
        }
    }

    println!("Bereits {} Dinos in der Datenbank.", existing_slugs.len());
    println!("Entdecke {} neue Dinos...\n", count);

    // 2. Ask Gemini to suggest new dinos
    let prompt = pipeline::prompts::discover_prompt(&existing_slugs, count);
    let response = gemini
        .generate_text(&prompt)
        .await
        .expect("Gemini discover request failed");

    // 3. Parse response — strip markdown fences if present
    let json_str = extract_json(&response);
    let new_dinos: Vec<DiscoveredDino> = serde_json::from_str(json_str)
        .unwrap_or_else(|e| panic!("Failed to parse Gemini response as JSON: {}\n\nResponse:\n{}", e, response));

    if new_dinos.is_empty() {
        println!("Keine neuen Dinos vorgeschlagen.");
        return;
    }

    println!("Gemini hat {} neue Dinos vorgeschlagen:\n", new_dinos.len());

    // 4. Seed each new dino into PocketBase
    let mut seeded: Vec<(pipeline::seed_data::DinoSeed, String)> = Vec::new();

    for dino in &new_dinos {
        println!(
            "  {} — {} ({}, {}, {}m, {}kg, {})",
            dino.slug, dino.display_name_de, dino.period, dino.diet, dino.length_m, dino.weight_kg, dino.continent,
        );

        // Check if already exists (e.g. from a previous run)
        let filter = format!("slug='{}'", dino.slug);
        if pb.find_record("dino_species", &filter).await.unwrap_or(None).is_some() {
            println!("    [skip] already exists");
            continue;
        }

        let seed = dino.to_seed();
        let data = serde_json::to_value(&seed).expect("serialize seed");
        match pb.create_record("dino_species", &data).await {
            Ok(record) => {
                let id = record["id"].as_str().unwrap_or("?").to_string();
                println!("    [created] {}", id);
                seeded.push((seed, id));
            }
            Err(e) => {
                tracing::error!("    [error] Failed to seed {}: {}", dino.slug, e);
            }
        }
    }

    println!("\n{} neue Dinos angelegt.", seeded.len());

    // 5. Optionally run the content generation pipeline
    if generate && !seeded.is_empty() {
        println!("\nStarte Content-Generierung...\n");

        let content_type = only.unwrap_or(ContentType::All);
        let needs_tts = content_type.needs_audio();
        let tts = if needs_tts {
            let config = pipeline::audio::create_tts(piper_bin, piper_model);
            Some(PiperTts::new(config).await.expect("TTS init failed"))
        } else {
            None
        };

        for (i, (seed, record_id)) in seeded.iter().enumerate() {
            tracing::info!("[{}/{}] Generating content for {}", i + 1, seeded.len(), seed.slug);

            let filter = format!("slug='{}'", seed.slug);
            let record = pb
                .find_record("dino_species", &filter)
                .await
                .expect("PocketBase query failed")
                .expect("Record should exist after seeding");

            super::generate::generate_one(
                &pb,
                Some(&gemini),
                tts.as_ref(),
                seed,
                record_id,
                &record,
                &content_type,
                false,
                false,
            )
            .await;

            // Rate limit between dinos
            if i < seeded.len() - 1 {
                tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
            }
        }
    }

    println!("\nFertig! Nutze `status` um den Ueberblick zu sehen.");
}

/// Extract JSON array from a response that might be wrapped in markdown fences
fn extract_json(text: &str) -> &str {
    let trimmed = text.trim();
    // Strip ```json ... ``` fences
    if let Some(start) = trimmed.find('[') {
        if let Some(end) = trimmed.rfind(']') {
            return &trimmed[start..=end];
        }
    }
    trimmed
}

#[derive(Debug, serde::Deserialize)]
struct DiscoveredDino {
    slug: String,
    display_name_de: String,
    scientific_name: String,
    period: String,
    period_start_mya: f32,
    period_end_mya: f32,
    diet: String,
    length_m: f32,
    weight_kg: f32,
    continent: String,
    rarity: String,
    habitat_description: String,
}

impl DiscoveredDino {
    fn to_seed(&self) -> pipeline::seed_data::DinoSeed {
        pipeline::seed_data::DinoSeed {
            slug: self.slug.clone(),
            display_name_de: self.display_name_de.clone(),
            scientific_name: self.scientific_name.clone(),
            period: self.period.clone(),
            period_start_mya: self.period_start_mya.round() as u32,
            period_end_mya: self.period_end_mya.round() as u32,
            diet: self.diet.clone(),
            length_m: self.length_m,
            weight_kg: self.weight_kg,
            continent: self.continent.clone(),
            rarity: self.rarity.clone(),
            habitat_description: self.habitat_description.clone(),
        }
    }
}
