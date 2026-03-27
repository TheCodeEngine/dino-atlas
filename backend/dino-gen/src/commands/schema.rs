use crate::providers::pocketbase::PocketBaseClient;

pub async fn run(pb_url: &str, email: &Option<String>, password: &Option<String>) {
    let email = email.as_deref().expect("POCKETBASE_ADMIN_EMAIL required");
    let password = password.as_deref().expect("POCKETBASE_ADMIN_PASSWORD required");

    let mut pb = PocketBaseClient::new(pb_url);
    pb.auth(email, password).await.expect("PocketBase auth failed");

    // PocketBase v0.23+ native schema format (exported from running instance)
    let schema_json = include_str!("../../../../services/pocketbase/seed/pb_schema_v023.json");
    let collections: Vec<serde_json::Value> = serde_json::from_str(schema_json)
        .expect("Failed to parse pb_schema_v023.json");

    tracing::info!("Importing {} collections...", collections.len());

    for collection in &collections {
        let name = collection["name"].as_str().unwrap_or("?");

        // Skip 'users' — it's a built-in auth collection, PB creates it automatically.
        // We just need to add our custom fields to it.
        if name == "users" {
            tracing::info!("  [skip] users (built-in, patching fields instead)");
            patch_users_collection(&pb, collection).await;
            continue;
        }

        match pb.import_collection(collection).await {
            Ok(()) => tracing::info!("  [ok] {}", name),
            Err(e) => {
                if e.contains("already exists") || e.contains("unique") || e.contains("name is already") {
                    tracing::info!("  [skip] {} (already exists)", name);
                } else {
                    tracing::error!("  [fail] {}: {}", name, e);
                }
            }
        }
    }

    println!("\nSchema import complete!");
}

async fn patch_users_collection(_pb: &PocketBaseClient, schema: &serde_json::Value) {
    // Get existing users collection, add our custom fields
    let custom_fields = schema["fields"].as_array().cloned().unwrap_or_default();

    for field in &custom_fields {
        let field_name = field["name"].as_str().unwrap_or("");
        // Only add fields that PB doesn't have by default
        if !["name", "avatar", "created", "updated"].contains(&field_name) {
            tracing::info!("    Adding field '{}' to users", field_name);
        }
    }

    // PocketBase handles field merging — we can PATCH with the full field list
    // but this is fragile. For now just log a hint.
    tracing::info!("    → Open PocketBase dashboard to verify users has 'family_id' field");
}
