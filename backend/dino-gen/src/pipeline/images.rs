use crate::ContentType;
use crate::providers::gemini::GeminiClient;
use crate::providers::pocketbase::PocketBaseClient;
use crate::pipeline::{prompts, cutout, costs};
use crate::pipeline::seed_data::DinoSeed;

/// Image types generated via Imagen 4 (shadow is computed, not generated)
const GENERATED_TYPES: &[(&str, &str)] = &[
    ("real", "image_real"),
    ("comic", "image_comic"),
    ("skeleton", "image_skeleton"),
];

/// Generate images for a dino.
/// - real, comic, skeleton: generated via Imagen 4, then background removed
/// - shadow: computed from the real cutout (all pixels → black)
pub async fn generate(
    pb: &PocketBaseClient,
    gemini: &GeminiClient,
    dino: &DinoSeed,
    record_id: &str,
    existing: &serde_json::Value,
    force: bool,
    content_type: &ContentType,
) -> Result<(), String> {
    let mut real_transparent: Option<Vec<u8>> = None;

    // Step 0: Research how the dino actually looked via Gemini Flash
    let needs_generation = GENERATED_TYPES.iter().any(|&(t, f)|
        content_type.includes_image(t) && (force || existing[f].as_str().unwrap_or("").is_empty())
    );
    let appearance = if needs_generation {
        println!("      Researching appearance via Gemini Flash...");
        let research_prompt = prompts::research_appearance(&dino.display_name_de);
        match gemini.generate_text(&research_prompt).await {
            Ok(desc) => {
                println!("      → {}", &desc[..desc.len().min(120)]);
                desc
            }
            Err(e) => {
                println!("      ⚠ Research failed: {}, using name only", e);
                format!("A {} dinosaur.", dino.display_name_de)
            }
        }
    } else {
        String::new()
    };

    for &(image_type, field) in GENERATED_TYPES {
        if !content_type.includes_image(image_type) {
            continue;
        }

        if !force && !existing[field].as_str().unwrap_or("").is_empty() {
            println!("      {} — skipped (exists)", image_type);
            continue;
        }

        let prompt = build_prompt(image_type, dino, &appearance);

        println!("      {} — generating via Imagen 4...", image_type);
        let start = std::time::Instant::now();
        let raw_png = gemini.generate_image(&prompt, "1:1").await?;
        let gen_duration = start.elapsed();
        println!("      {} — generated ({:.1}s, {} KB)", image_type, gen_duration.as_secs_f32(), raw_png.len() / 1024);

        // Remove background
        println!("      {} — removing background...", image_type);
        let transparent_png = cutout::remove_background(&raw_png)?;
        println!("      {} — background removed ({} KB → {} KB)", image_type, raw_png.len() / 1024, transparent_png.len() / 1024);

        if image_type == "real" {
            real_transparent = Some(transparent_png.clone());
        }

        let filename = format!("{}_{}.png", dino.slug, image_type);
        println!("      {} — uploading to PocketBase...", image_type);
        pb.upload_file("dino_species", record_id, field, &filename, transparent_png.clone(), "image/png").await?;

        let cost = costs::CostEntry {
            operation: format!("generate_image_{}", image_type),
            model: "imagen-4.0".into(),
            dino_slug: dino.slug.clone(),
            duration_ms: gen_duration.as_millis() as u64,
            estimated_cost_usd: 0.04,
        };
        costs::log_cost(pb, &cost).await;

        println!("      {} ✓ (${:.2})", image_type, 0.04);

        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    }

    // Shadow: computed from the real cutout, no Imagen call needed
    if content_type.includes_image("shadow") {
        let shadow_field = "image_shadow";
        if !force && !existing[shadow_field].as_str().unwrap_or("").is_empty() {
            println!("      shadow — skipped (exists)");
        } else {
            let transparent = match real_transparent {
                Some(ref bytes) => Some(bytes.clone()),
                None => {
                    println!("      shadow — downloading real image cutout...");
                    download_file(pb, existing, record_id, "image_real").await
                }
            };

            if let Some(ref cutout_bytes) = transparent {
                println!("      shadow — computing from real cutout...");
                let start = std::time::Instant::now();
                let shadow_png = cutout::make_shadow(cutout_bytes)?;
                let duration = start.elapsed();

                let filename = format!("{}_shadow.png", dino.slug);
                pb.upload_file("dino_species", record_id, shadow_field, &filename, shadow_png.clone(), "image/png").await?;

                let cost = costs::CostEntry {
                    operation: "compute_shadow".into(),
                    model: "cutout".into(),
                    dino_slug: dino.slug.clone(),
                    duration_ms: duration.as_millis() as u64,
                    estimated_cost_usd: 0.0,
                };
                costs::log_cost(pb, &cost).await;

                println!("      shadow ✓ ({} KB, {:.0}ms, free)", shadow_png.len() / 1024, duration.as_secs_f64() * 1000.0);
            } else {
                println!("      shadow — SKIPPED (no real image available, generate real first)");
            }
        }
    }

    Ok(())
}

async fn download_file(pb: &PocketBaseClient, existing: &serde_json::Value, record_id: &str, field: &str) -> Option<Vec<u8>> {
    let filename = existing[field].as_str().unwrap_or("");
    if filename.is_empty() {
        return None;
    }
    pb.download_file("dino_species", record_id, filename).await.ok()
}

fn build_prompt(image_type: &str, dino: &DinoSeed, appearance: &str) -> String {
    match image_type {
        "real" => prompts::real_prompt(&dino.display_name_de, appearance),
        "comic" => prompts::comic_prompt(&dino.display_name_de, appearance),
        "skeleton" => prompts::skeleton_prompt(&dino.display_name_de, appearance),
        _ => unreachable!(),
    }
}
