use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    tracing::info!("Dino-Atlas generator worker starting...");
    tracing::info!("Waiting for jobs on Valkey queue...");

    // TODO: Connect to Valkey, poll for jobs
    loop {
        tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
        tracing::debug!("Polling for jobs...");
    }
}
