mod config;
mod error;
mod middleware;
mod pocketbase;
mod routes;

use axum::http::{HeaderName, Method};
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

use config::Config;
use pocketbase::client::PbClient;
use routes::{AppState, create_router};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let config = Config::from_env();

    let pb = PbClient::new(&config);

    // Initialize TTS if piper binary is available
    let tts = {
        let piper_bin = std::env::var("PIPER_BIN").unwrap_or_else(|_| "piper".into());
        let piper_model = std::env::var("PIPER_MODEL").unwrap_or_else(|_| "models/de_DE-thorsten-high.onnx".into());
        let tts_config = dino_atlas_tts::TtsConfig {
            piper_bin,
            model_path: std::path::PathBuf::from(&piper_model),
            ffmpeg_bin: std::env::var("FFMPEG_BIN").unwrap_or_else(|_| "ffmpeg".into()),
            cache_dir: std::path::PathBuf::from(std::env::var("TTS_CACHE_DIR").unwrap_or_else(|_| "cache/tts".into())),
            sample_rate: 22050,
        };
        match dino_atlas_tts::PiperTts::new(tts_config).await {
            Ok(tts) => {
                tracing::info!("TTS initialized (Piper)");
                Some(std::sync::Arc::new(tts))
            }
            Err(e) => {
                tracing::warn!("TTS not available: {e}");
                None
            }
        }
    };

    let state = AppState { pb, tts };

    let cors = CorsLayer::new()
        .allow_origin(
            config.allowed_origins.iter()
                .filter_map(|o| o.parse().ok())
                .collect::<Vec<_>>(),
        )
        .allow_methods([Method::GET, Method::POST, Method::PATCH, Method::DELETE, Method::OPTIONS])
        .allow_headers([
            HeaderName::from_static("content-type"),
            HeaderName::from_static("authorization"),
        ])
        .allow_credentials(true);

    let app = create_router(state)
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    let addr = format!("0.0.0.0:{}", config.port);
    tracing::info!("Dino-Atlas API listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
