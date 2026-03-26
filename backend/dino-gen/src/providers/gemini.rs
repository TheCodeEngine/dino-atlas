use serde::{Deserialize, Serialize};

const IMAGEN_MODEL: &str = "imagen-4.0-generate-001";
const TEXT_MODEL: &str = "gemini-2.5-flash";

pub struct GeminiClient {
    api_key: String,
    client: reqwest::Client,
}

#[derive(Serialize)]
struct ImagenRequest {
    instances: Vec<ImagenInstance>,
    parameters: ImagenParams,
}

#[derive(Serialize)]
struct ImagenInstance {
    prompt: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ImagenParams {
    sample_count: u32,
    aspect_ratio: String,
}

#[derive(Deserialize)]
struct ImagenResponse {
    predictions: Option<Vec<ImagenPrediction>>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ImagenPrediction {
    bytes_base64_encoded: String,
}

impl GeminiClient {
    pub fn new(api_key: &str) -> Self {
        Self {
            api_key: api_key.to_string(),
            client: reqwest::Client::new(),
        }
    }

    /// Generate an image via Imagen 4 Ultra
    pub async fn generate_image(&self, prompt: &str, aspect_ratio: &str) -> Result<Vec<u8>, String> {
        let url = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/{}:predict?key={}",
            IMAGEN_MODEL, self.api_key
        );

        let body = ImagenRequest {
            instances: vec![ImagenInstance { prompt: prompt.to_string() }],
            parameters: ImagenParams {
                sample_count: 1,
                aspect_ratio: aspect_ratio.to_string(),
            },
        };

        let res = self.client.post(&url).json(&body).send().await.map_err(|e| e.to_string())?;

        if !res.status().is_success() {
            let text = res.text().await.unwrap_or_default();
            return Err(format!("Imagen API error: {}", text));
        }

        let data: ImagenResponse = res.json().await.map_err(|e| e.to_string())?;
        let prediction = data.predictions.and_then(|p| p.into_iter().next())
            .ok_or("No prediction in response")?;

        use base64::Engine;
        base64::engine::general_purpose::STANDARD
            .decode(&prediction.bytes_base64_encoded)
            .map_err(|e| e.to_string())
    }

    /// Generate text via Gemini Flash
    pub async fn generate_text(&self, prompt: &str) -> Result<String, String> {
        let url = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent?key={}",
            TEXT_MODEL, self.api_key
        );

        let body = serde_json::json!({
            "contents": [{"parts": [{"text": prompt}]}],
        });

        let res = self.client.post(&url).json(&body).send().await.map_err(|e| e.to_string())?;

        if !res.status().is_success() {
            let text = res.text().await.unwrap_or_default();
            return Err(format!("Gemini API error: {}", text));
        }

        let data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        let text = data["candidates"][0]["content"]["parts"][0]["text"]
            .as_str()
            .ok_or("No text in response")?
            .to_string();

        Ok(text)
    }
}
