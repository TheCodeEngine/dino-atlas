use crate::pipeline::seed_data;
use crate::providers::pocketbase::PocketBaseClient;

pub async fn run(pb_url: &str, email: &Option<String>, password: &Option<String>, skip_existing: bool) {
    let email = email.as_deref().expect("POCKETBASE_ADMIN_EMAIL required");
    let password = password.as_deref().expect("POCKETBASE_ADMIN_PASSWORD required");

    let mut pb = PocketBaseClient::new(pb_url);
    pb.auth(email, password).await.expect("PocketBase auth failed");

    let dinos = seed_data::all_dinos();
    tracing::info!("Seeding {} dinos to {}...", dinos.len(), pb_url);

    let mut created = 0;
    let mut skipped = 0;

    for dino in &dinos {
        // Check if already exists
        let filter = format!("slug='{}'", dino.slug);
        match pb.find_record("dino_species", &filter).await {
            Ok(Some(existing)) => {
                if skip_existing {
                    tracing::info!("  [skip] {} (id: {})", dino.display_name_de, existing["id"].as_str().unwrap_or("?"));
                    skipped += 1;
                    continue;
                }
                tracing::info!("  [update] {}", dino.display_name_de);
                let id = existing["id"].as_str().unwrap();
                let data = serde_json::json!({
                    "display_name_de": dino.display_name_de,
                    "scientific_name": dino.scientific_name,
                    "period": dino.period,
                    "period_start_mya": dino.period_start_mya,
                    "period_end_mya": dino.period_end_mya,
                    "diet": dino.diet,
                    "length_m": dino.length_m,
                    "weight_kg": dino.weight_kg,
                    "continent": dino.continent,
                    "rarity": dino.rarity,
                    "habitat_description": dino.habitat_description,
                });
                if let Err(e) = pb.update_record("dino_species", id, &data).await {
                    tracing::error!("  Failed to update {}: {}", dino.slug, e);
                }
            }
            Ok(None) => {
                tracing::info!("  [create] {}", dino.display_name_de);
                let data = serde_json::json!({
                    "slug": dino.slug,
                    "display_name_de": dino.display_name_de,
                    "scientific_name": dino.scientific_name,
                    "period": dino.period,
                    "period_start_mya": dino.period_start_mya,
                    "period_end_mya": dino.period_end_mya,
                    "diet": dino.diet,
                    "length_m": dino.length_m,
                    "weight_kg": dino.weight_kg,
                    "continent": dino.continent,
                    "rarity": dino.rarity,
                    "habitat_description": dino.habitat_description,
                });
                match pb.create_record("dino_species", &data).await {
                    Ok(record) => {
                        created += 1;
                        tracing::info!("    → id: {}", record["id"].as_str().unwrap_or("?"));
                    }
                    Err(e) => tracing::error!("  Failed to create {}: {}", dino.slug, e),
                }
            }
            Err(e) => tracing::error!("  Failed to check {}: {}", dino.slug, e),
        }
    }

    println!("\nSeed complete: {} created, {} skipped", created, skipped);
}
