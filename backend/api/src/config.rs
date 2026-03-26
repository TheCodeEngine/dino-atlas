pub struct Config {
    pub port: u16,
    pub pocketbase_url: String,
    pub jwt_secret: String,
    pub gemini_api_key: Option<String>,
    pub valkey_url: String,
    pub tts_url: String,
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            port: std::env::var("PORT")
                .unwrap_or_else(|_| "3001".to_string())
                .parse()
                .expect("PORT must be a number"),
            pocketbase_url: std::env::var("POCKETBASE_URL")
                .unwrap_or_else(|_| "http://localhost:8090".to_string()),
            jwt_secret: std::env::var("JWT_SECRET")
                .unwrap_or_else(|_| "dev-secret-change-me-in-production".to_string()),
            gemini_api_key: std::env::var("GEMINI_API_KEY").ok(),
            valkey_url: std::env::var("VALKEY_URL")
                .unwrap_or_else(|_| "redis://localhost:6379".to_string()),
            tts_url: std::env::var("TTS_URL")
                .unwrap_or_else(|_| "http://localhost:3100".to_string()),
        }
    }
}
