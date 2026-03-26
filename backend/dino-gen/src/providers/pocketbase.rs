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
        // PocketBase v0.23+ uses _superusers collection auth
        let url = format!("{}/api/collections/_superusers/auth-with-password", self.base_url);
        let body = serde_json::json!({ "identity": email, "password": password });

        let res = self.client.post(&url).json(&body).send().await.map_err(|e| e.to_string())?;

        if !res.status().is_success() {
            // Fallback to legacy endpoint (PocketBase < v0.23)
            let url = format!("{}/api/admins/auth-with-password", self.base_url);
            let res = self.client.post(&url).json(&body).send().await.map_err(|e| e.to_string())?;
            let data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
            self.token = data["token"].as_str().map(|s| s.to_string());
        } else {
            let data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
            self.token = data["token"].as_str().map(|s| s.to_string());
        }

        if self.token.is_some() {
            tracing::info!("PocketBase auth OK");
            Ok(())
        } else {
            Err("Auth failed".to_string())
        }
    }

    fn auth_header(&self) -> Option<String> {
        self.token.as_ref().map(|t| format!("Bearer {}", t))
    }

    pub async fn create_record(&self, collection: &str, data: &serde_json::Value) -> Result<serde_json::Value, String> {
        let url = format!("{}/api/collections/{}/records", self.base_url, collection);
        let mut req = self.client.post(&url).json(data);
        if let Some(auth) = self.auth_header() {
            req = req.header("Authorization", auth);
        }
        let res = req.send().await.map_err(|e| e.to_string())?;
        if !res.status().is_success() {
            let text = res.text().await.unwrap_or_default();
            return Err(format!("Create record failed: {}", text));
        }
        res.json().await.map_err(|e| e.to_string())
    }

    pub async fn update_record(&self, collection: &str, id: &str, data: &serde_json::Value) -> Result<serde_json::Value, String> {
        let url = format!("{}/api/collections/{}/records/{}", self.base_url, collection, id);
        let mut req = self.client.patch(&url).json(data);
        if let Some(auth) = self.auth_header() {
            req = req.header("Authorization", auth);
        }
        let res = req.send().await.map_err(|e| e.to_string())?;
        if !res.status().is_success() {
            let text = res.text().await.unwrap_or_default();
            return Err(format!("Update record failed: {}", text));
        }
        res.json().await.map_err(|e| e.to_string())
    }

    pub async fn upload_file(&self, collection: &str, record_id: &str, field: &str, filename: &str, data: Vec<u8>, mime: &str) -> Result<(), String> {
        let url = format!("{}/api/collections/{}/records/{}", self.base_url, collection, record_id);
        let part = reqwest::multipart::Part::bytes(data)
            .file_name(filename.to_string())
            .mime_str(mime)
            .map_err(|e| e.to_string())?;
        let form = reqwest::multipart::Form::new().part(field.to_string(), part);

        let mut req = self.client.patch(&url).multipart(form);
        if let Some(auth) = self.auth_header() {
            req = req.header("Authorization", auth);
        }
        let res = req.send().await.map_err(|e| e.to_string())?;
        if res.status().is_success() {
            Ok(())
        } else {
            Err(format!("Upload failed: {}", res.text().await.unwrap_or_default()))
        }
    }

    pub async fn list_records(&self, collection: &str, filter: Option<&str>) -> Result<Vec<serde_json::Value>, String> {
        let mut url = format!("{}/api/collections/{}/records?perPage=500", self.base_url, collection);
        if let Some(f) = filter {
            url = format!("{}&filter={}", url, urlencoding::encode(f));
        }
        let mut req = self.client.get(&url);
        if let Some(auth) = self.auth_header() {
            req = req.header("Authorization", auth);
        }
        let res = req.send().await.map_err(|e| e.to_string())?;
        if !res.status().is_success() {
            let text = res.text().await.unwrap_or_default();
            return Err(format!("List records failed: {}", text));
        }
        let data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        Ok(data["items"].as_array().cloned().unwrap_or_default())
    }

    /// Find a single record by filter, returns None if not found
    pub async fn find_record(&self, collection: &str, filter: &str) -> Result<Option<serde_json::Value>, String> {
        let records = self.list_records(collection, Some(filter)).await?;
        Ok(records.into_iter().next())
    }

    /// Create a collection via Admin API
    pub async fn import_collection(&self, schema: &serde_json::Value) -> Result<(), String> {
        let url = format!("{}/api/collections", self.base_url);
        let mut req = self.client.post(&url).json(schema);
        if let Some(auth) = self.auth_header() {
            req = req.header("Authorization", auth);
        }
        let res = req.send().await.map_err(|e| e.to_string())?;
        if res.status().is_success() {
            Ok(())
        } else {
            Err(res.text().await.unwrap_or_default())
        }
    }
}
