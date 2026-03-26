use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub pocketbase_url: String,
    pub pocketbase_admin_email: String,
    pub pocketbase_admin_password: String,
    pub jwt_secret: String,
    pub port: u16,
    pub allowed_origins: Vec<String>,
    pub request_timeout_secs: u64,
}

impl Config {
    pub fn from_env() -> Self {
        let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");
        if jwt_secret.len() < 32 {
            panic!("JWT_SECRET must be at least 32 characters");
        }

        let allowed_origins = env::var("ALLOWED_ORIGINS")
            .unwrap_or_else(|_| "http://localhost:5173,http://localhost".to_string())
            .split(',')
            .map(|s| s.trim().to_string())
            .collect();

        Self {
            pocketbase_url: env::var("POCKETBASE_URL")
                .unwrap_or_else(|_| "http://pocketbase:8090".to_string()),
            pocketbase_admin_email: env::var("POCKETBASE_ADMIN_EMAIL")
                .expect("POCKETBASE_ADMIN_EMAIL must be set"),
            pocketbase_admin_password: env::var("POCKETBASE_ADMIN_PASSWORD")
                .expect("POCKETBASE_ADMIN_PASSWORD must be set"),
            jwt_secret,
            port: env::var("PORT")
                .unwrap_or_else(|_| "3001".to_string())
                .parse()
                .unwrap_or(3001),
            allowed_origins,
            request_timeout_secs: env::var("REQUEST_TIMEOUT_SECS")
                .unwrap_or_else(|_| "30".to_string())
                .parse()
                .unwrap_or(30),
        }
    }
}
