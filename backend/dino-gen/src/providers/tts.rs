/// HTTP-based TTS client that calls the Dino-Atlas API's /api/v1/tts endpoint.
/// Used when Piper is not available locally (e.g. running dino-gen outside Docker).

pub struct TtsApiClient {
    api_url: String,
    token: String,
    client: reqwest::Client,
}

impl TtsApiClient {
    /// Create a new TTS API client by logging in to the API
    pub async fn new(api_url: &str, email: &str, password: &str) -> Result<Self, String> {
        let client = reqwest::Client::new();
        let url = format!("{}/api/v1/auth/login", api_url.trim_end_matches('/'));

        let res = client.post(&url)
            .json(&serde_json::json!({ "email": email, "password": password }))
            .send()
            .await
            .map_err(|e| format!("API login request failed: {}", e))?;

        if !res.status().is_success() {
            let text = res.text().await.unwrap_or_default();
            return Err(format!("API login failed: {}", text));
        }

        let data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        let token = data["token"].as_str()
            .ok_or("No token in login response")?
            .to_string();

        tracing::info!("TTS API client authenticated");

        Ok(Self {
            api_url: api_url.trim_end_matches('/').to_string(),
            token,
            client,
        })
    }

    /// Generate speech via the API and return MP3 bytes
    pub async fn speak(&self, text: &str) -> Result<Vec<u8>, String> {
        let url = format!("{}/api/v1/tts", self.api_url);

        let res = self.client.post(&url)
            .header("Authorization", format!("Bearer {}", self.token))
            .json(&serde_json::json!({ "text": text }))
            .send()
            .await
            .map_err(|e| format!("TTS API request failed: {}", e))?;

        if !res.status().is_success() {
            let text = res.text().await.unwrap_or_default();
            return Err(format!("TTS API error: {}", text));
        }

        res.bytes().await
            .map(|b| b.to_vec())
            .map_err(|e| format!("TTS API read error: {}", e))
    }
}
