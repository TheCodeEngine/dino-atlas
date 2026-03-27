use crate::providers::pocketbase::PocketBaseClient;

/// A single cost entry for tracking AI usage
pub struct CostEntry {
    pub operation: String,
    pub model: String,
    pub dino_slug: String,
    pub duration_ms: u64,
    pub estimated_cost_usd: f64,
}

/// Log a cost entry to PocketBase ai_usage_log
pub async fn log_cost(pb: &PocketBaseClient, entry: &CostEntry) {
    let record = serde_json::json!({
        "operation": entry.operation,
        "model_id": entry.model,
        "triggered_by": "admin",
        "trigger_context": entry.dino_slug,
        "duration_ms": entry.duration_ms,
        "cost_estimate_usd": entry.estimated_cost_usd,
        "image_count": if entry.operation.starts_with("generate_image") { 1 } else { 0 },
        "success": true,
    });

    if let Err(e) = pb.create_record("ai_usage_log", &record).await {
        tracing::warn!("Failed to log cost (non-critical): {}", e);
    }
}

/// Cost summary per model
pub struct CostSummary {
    pub model: String,
    pub operation: String,
    pub count: usize,
    pub total_cost_usd: f64,
    pub total_duration_ms: u64,
}

/// Fetch and aggregate costs from PocketBase
pub async fn fetch_summary(pb: &PocketBaseClient) -> Result<Vec<CostSummary>, String> {
    let records = pb.list_records("ai_usage_log", None).await?;

    // Group by model + operation
    let mut groups: std::collections::HashMap<(String, String), CostSummary> = std::collections::HashMap::new();

    for record in &records {
        let model = record["model_id"].as_str().unwrap_or("unknown").to_string();
        let operation = record["operation"].as_str().unwrap_or("unknown").to_string();
        let cost = record["cost_estimate_usd"].as_f64().unwrap_or(0.0);
        let duration = record["duration_ms"].as_u64().unwrap_or(0);

        let key = (model.clone(), operation.clone());
        let entry = groups.entry(key).or_insert(CostSummary {
            model: model.clone(),
            operation: operation.clone(),
            count: 0,
            total_cost_usd: 0.0,
            total_duration_ms: 0,
        });
        entry.count += 1;
        entry.total_cost_usd += cost;
        entry.total_duration_ms += duration;
    }

    let mut summaries: Vec<CostSummary> = groups.into_values().collect();
    summaries.sort_by(|a, b| b.total_cost_usd.partial_cmp(&a.total_cost_usd).unwrap());
    Ok(summaries)
}
