use crate::providers::pocketbase::PocketBaseClient;

pub async fn run(pb_url: &str, email: &Option<String>, password: &Option<String>) {
    let email = email.as_deref().expect("POCKETBASE_ADMIN_EMAIL required");
    let password = password.as_deref().expect("POCKETBASE_ADMIN_PASSWORD required");

    let mut pb = PocketBaseClient::new(pb_url);
    pb.auth(email, password).await.expect("PocketBase auth failed");

    let schema_json = include_str!("../../../../services/pocketbase/seed/pb_schema.json");
    let collections: Vec<serde_json::Value> = serde_json::from_str(schema_json)
        .expect("Failed to parse pb_schema.json");

    tracing::info!("Importing {} collections...", collections.len());

    for collection in &collections {
        let name = collection["name"].as_str().unwrap_or("?");
        match pb.import_collection(collection).await {
            Ok(()) => tracing::info!("  [ok] {}", name),
            Err(e) => {
                if e.contains("already exists") || e.contains("unique") {
                    tracing::info!("  [skip] {} (already exists)", name);
                } else {
                    tracing::error!("  [fail] {}: {}", name, e);
                }
            }
        }
    }

    println!("\nSchema import complete!");
}
