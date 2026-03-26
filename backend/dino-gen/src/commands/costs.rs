use crate::providers::pocketbase::PocketBaseClient;
use crate::pipeline::costs;

pub async fn run(pb_url: &str, pb_email: &Option<String>, pb_password: &Option<String>) {
    let email = pb_email.as_deref().expect("POCKETBASE_ADMIN_EMAIL required");
    let password = pb_password.as_deref().expect("POCKETBASE_ADMIN_PASSWORD required");

    let mut pb = PocketBaseClient::new(pb_url);
    pb.auth(email, password).await.expect("PocketBase auth failed");

    let summaries = costs::fetch_summary(&pb).await.expect("Failed to fetch costs");

    if summaries.is_empty() {
        println!("No AI usage logged yet.");
        return;
    }

    println!("\n{:<30} {:<25} {:>6} {:>10} {:>10}", "Operation", "Model", "Count", "Cost ($)", "Time (s)");
    println!("{}", "-".repeat(85));

    let mut total_cost = 0.0;
    let mut total_count = 0;

    for s in &summaries {
        println!("{:<30} {:<25} {:>6} {:>10.4} {:>10.1}",
            s.operation, s.model, s.count, s.total_cost_usd, s.total_duration_ms as f64 / 1000.0);
        total_cost += s.total_cost_usd;
        total_count += s.count;
    }

    println!("{}", "-".repeat(85));
    println!("{:<30} {:<25} {:>6} {:>10.4}", "TOTAL", "", total_count, total_cost);

    // Per-dino breakdown
    println!("\nPer-dino cost estimate:");
    println!("  4 Imagen images × $0.04 = $0.16");
    println!("  1 Gemini text   × $0.001 = $0.001");
    println!("  2 Piper audio   × $0.00  = $0.00");
    println!("  ─────────────────────────");
    println!("  Total per dino ≈ $0.16");
    println!("  15 dinos × $0.16 = ${:.2}", 15.0 * 0.161);
}
