/// TTS client for generating audio via Piper
pub struct TtsClient {
    base_url: String,
    client: reqwest::Client,
}

impl TtsClient {
    pub fn new(base_url: &str) -> Self {
        Self {
            base_url: base_url.trim_end_matches('/').to_string(),
            client: reqwest::Client::new(),
        }
    }

    /// Generate audio for text, returns MP3 bytes
    pub async fn generate(&self, text: &str) -> Result<Vec<u8>, String> {
        let url = format!("{}/tts/audio?text={}", self.base_url, urlencoding::encode(text));
        let res = self.client.get(&url).send().await.map_err(|e| e.to_string())?;

        if !res.status().is_success() {
            return Err(format!("TTS error: {}", res.status()));
        }

        res.bytes().await.map(|b| b.to_vec()).map_err(|e| e.to_string())
    }
}
