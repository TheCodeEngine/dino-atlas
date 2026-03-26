use crate::pipeline::seed_data;

pub async fn run(pb_url: &str, email: &Option<String>, password: &Option<String>, skip_existing: bool) {
    let _email = email.as_deref().expect("POCKETBASE_ADMIN_EMAIL required");
    let _password = password.as_deref().expect("POCKETBASE_ADMIN_PASSWORD required");

    tracing::info!("Seeding dino base data to {}...", pb_url);

    let dinos = seed_data::all_dinos();
    tracing::info!("Found {} dinos to seed", dinos.len());

    for dino in &dinos {
        tracing::info!("  {} ({})", dino.display_name_de, dino.scientific_name);
        // TODO: Check if exists (skip_existing), then create via PocketBase API
    }

    tracing::info!("Seed complete!");
}
