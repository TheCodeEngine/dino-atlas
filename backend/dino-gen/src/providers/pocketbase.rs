/// PocketBase admin client for dino-gen CLI
pub struct PocketBaseClient {
    base_url: String,
    token: Option<String>,
    client: reqwest::Client,
}

impl PocketBaseClient {
    pub fn new(base_url: &str) -> Self {
        Self {
            base_url: base_url.trim_end_matches('/').to_string(),
            token: None,
            client: reqwest::Client::new(),
        }
    }

    pub async fn auth(&mut self, email: &str, password: &str) -> Result<(), String> {
        let url = format!("{}/api/admins/auth-with-password", self.base_url);
        let body = serde_json::json!({ "identity": email, "password": password });

        let res = self.client.post(&url).json(&body).send().await.map_err(|e| e.to_string())?;
        let data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        self.token = data["token"].as_str().map(|s| s.to_string());

        if self.token.is_some() {
            tracing::info!("PocketBase auth OK");
            Ok(())
        } else {
            Err("Auth failed".to_string())
        }
    }

    pub async fn create_record(&self, collection: &str, data: &serde_json::Value) -> Result<serde_json::Value, String> {
        let url = format!("{}/api/collections/{}/records", self.base_url, collection);
        let mut req = self.client.post(&url).json(data);
        if let Some(token) = &self.token {
            req = req.header("Authorization", format!("Bearer {}", token));
        }
        let res = req.send().await.map_err(|e| e.to_string())?;
        res.json().await.map_err(|e| e.to_string())
    }

    pub async fn upload_file(&self, collection: &str, record_id: &str, field: &str, filename: &str, data: Vec<u8>) -> Result<(), String> {
        let url = format!("{}/api/collections/{}/records/{}", self.base_url, collection, record_id);
        let part = reqwest::multipart::Part::bytes(data)
            .file_name(filename.to_string())
            .mime_str("image/png")
            .map_err(|e| e.to_string())?;
        let form = reqwest::multipart::Form::new().part(field.to_string(), part);

        let mut req = self.client.patch(&url).multipart(form);
        if let Some(token) = &self.token {
            req = req.header("Authorization", format!("Bearer {}", token));
        }
        let res = req.send().await.map_err(|e| e.to_string())?;
        if res.status().is_success() {
            Ok(())
        } else {
            Err(format!("Upload failed: {}", res.text().await.unwrap_or_default()))
        }
    }

    pub async fn list_records(&self, collection: &str, filter: Option<&str>) -> Result<Vec<serde_json::Value>, String> {
        let mut url = format!("{}/api/collections/{}/records", self.base_url, collection);
        if let Some(f) = filter {
            url = format!("{}?filter={}", url, f);
        }
        let mut req = self.client.get(&url);
        if let Some(token) = &self.token {
            req = req.header("Authorization", format!("Bearer {}", token));
        }
        let res = req.send().await.map_err(|e| e.to_string())?;
        let data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        Ok(data["items"].as_array().cloned().unwrap_or_default())
    }
}
