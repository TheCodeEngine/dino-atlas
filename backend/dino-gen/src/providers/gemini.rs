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

    /// Generate an image via Imagen 4 (with retry on transient errors)
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

        let max_retries = 3;
        let mut last_error = String::new();

        for attempt in 1..=max_retries {
            let res = self.client.post(&url).json(&body).send().await.map_err(|e| e.to_string())?;
            let status = res.status();

            if status.is_success() {
                let data: ImagenResponse = res.json().await.map_err(|e| e.to_string())?;
                let prediction = data.predictions.and_then(|p| p.into_iter().next())
                    .ok_or("No prediction in response")?;

                use base64::Engine;
                return base64::engine::general_purpose::STANDARD
                    .decode(&prediction.bytes_base64_encoded)
                    .map_err(|e| e.to_string());
            }

            let text = res.text().await.unwrap_or_default();
            let is_retryable = status.as_u16() == 503 || status.as_u16() == 429 || status.as_u16() == 500;

            if is_retryable && attempt < max_retries {
                let wait = attempt as u64 * 5;
                println!("      ⚠ Imagen API error ({}), retrying in {}s... ({}/{})", status, wait, attempt, max_retries);
                tokio::time::sleep(tokio::time::Duration::from_secs(wait)).await;
                last_error = text;
                continue;
            }

            return Err(format!("Imagen API error ({}): {}", status, text));
        }

        Err(format!("Imagen API failed after {} retries: {}", max_retries, last_error))
    }

    /// Describe an image using Gemini Flash (vision) — returns a text description
    #[allow(dead_code)]
    pub async fn describe_image(&self, image_png: &[u8], instruction: &str) -> Result<String, String> {
        let url = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent?key={}",
            TEXT_MODEL, self.api_key
        );

        use base64::Engine;
        let img_b64 = base64::engine::general_purpose::STANDARD.encode(image_png);

        let body = serde_json::json!({
            "contents": [{
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": "image/png",
                            "data": img_b64
                        }
                    },
                    { "text": instruction }
                ]
            }]
        });

        let res = self.client.post(&url).json(&body).send().await.map_err(|e| e.to_string())?;

        if !res.status().is_success() {
            let text = res.text().await.unwrap_or_default();
            return Err(format!("Gemini vision API error: {}", text));
        }

        let data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        let text = data["candidates"][0]["content"]["parts"][0]["text"]
            .as_str()
            .ok_or("No text in Gemini vision response")?
            .to_string();

        Ok(text)
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
