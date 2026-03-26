use crate::providers::gemini::GeminiClient;
use crate::providers::pocketbase::PocketBaseClient;
use crate::pipeline::prompts;
use crate::pipeline::seed_data::DinoSeed;
use crate::pipeline::costs;

/// Image types we generate per dino
const IMAGE_TYPES: &[(&str, &str)] = &[
    ("comic", "image_comic"),
    ("real", "image_real"),
    ("skeleton", "image_skeleton"),
    ("shadow", "image_shadow"),
];

/// Generate all 4 image types for a dino
pub async fn generate(
    pb: &PocketBaseClient,
    gemini: &GeminiClient,
    dino: &DinoSeed,
    record_id: &str,
    existing: &serde_json::Value,
    force: bool,
) -> Result<(), String> {
    for &(image_type, field) in IMAGE_TYPES {
        // Skip if already exists and not forcing
        if !force && !existing[field].as_str().unwrap_or("").is_empty() {
            tracing::info!("  Skipping {} (already exists)", image_type);
            continue;
        }

        let prompt = match image_type {
            "comic" => prompts::comic_prompt(&dino.display_name_de, &dino.scientific_name),
            "real" => prompts::real_prompt(&dino.display_name_de, &dino.scientific_name, &dino.habitat_description),
            "skeleton" => prompts::skeleton_prompt(&dino.display_name_de, &dino.scientific_name),
            "shadow" => prompts::shadow_prompt(&dino.display_name_de),
            _ => unreachable!(),
        };

        tracing::info!("  Generating {} image...", image_type);
        let start = std::time::Instant::now();
        let png_bytes = gemini.generate_image(&prompt, "1:1").await?;
        let duration = start.elapsed();

        let filename = format!("{}_{}.png", dino.slug, image_type);
        pb.upload_file("dino_species", record_id, field, &filename, png_bytes.clone(), "image/png").await?;

        // Log cost (Imagen 4 ≈ $0.04/image)
        let cost = costs::CostEntry {
            operation: format!("generate_image_{}", image_type),
            model: "imagen-4.0".into(),
            dino_slug: dino.slug.clone(),
            duration_ms: duration.as_millis() as u64,
            estimated_cost_usd: 0.04,
            details: format!("{} image for {} ({} bytes)", image_type, dino.display_name_de, png_bytes.len()),
        };
        costs::log_cost(pb, &cost).await;

        tracing::info!("  {} uploaded ({} bytes, {:.1}s)", image_type, png_bytes.len(), duration.as_secs_f32());

        // Rate limit between images
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    }

    Ok(())
}
