use reqwest::Client;
use serde::de::DeserializeOwned;
use serde::Serialize;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::RwLock;
use tokio::time::Instant;

use crate::config::Config;
use crate::error::AppError;

use super::models::*;

const TOKEN_TTL_SECS: u64 = 50 * 60;

#[derive(Clone)]
pub struct PbClient {
    http: Client,
    base_url: String,
    admin_email: String,
    admin_password: String,
    admin_token: Arc<RwLock<Option<(String, Instant)>>>,
}

impl PbClient {
    pub fn new(config: &Config) -> Self {
        let http = Client::builder()
            .timeout(Duration::from_secs(config.request_timeout_secs))
            .build()
            .expect("Failed to build HTTP client");

        Self {
            http,
            base_url: config.pocketbase_url.clone(),
            admin_email: config.pocketbase_admin_email.clone(),
            admin_password: config.pocketbase_admin_password.clone(),
            admin_token: Arc::new(RwLock::new(None)),
        }
    }

    /// PocketBase file URL
    pub fn file_url(&self, collection: &str, record_id: &str, filename: &str) -> String {
        format!("{}/api/files/{}/{}/{}", self.base_url, collection, record_id, filename)
    }

    // ── Admin Token Management ──

    async fn get_admin_token(&self) -> Result<String, AppError> {
        {
            let token = self.admin_token.read().await;
            if let Some((ref t, created_at)) = *token {
                if created_at.elapsed().as_secs() < TOKEN_TTL_SECS {
                    return Ok(t.clone());
                }
            }
        }

        let url = format!("{}/api/collections/_superusers/auth-with-password", self.base_url);
        let resp = self.http
            .post(&url)
            .json(&serde_json::json!({
                "identity": self.admin_email,
                "password": self.admin_password,
            }))
            .send()
            .await
            .map_err(|e| AppError::Network(format!("PB admin auth: {e}")))?;

        if !resp.status().is_success() {
            let status = resp.status().as_u16();
            let body = resp.text().await.unwrap_or_default();
            return Err(AppError::PocketBase { status, body });
        }

        let auth: PbAdminAuthResponse = resp.json().await
            .map_err(|e| AppError::Internal(format!("PB admin auth parse: {e}")))?;

        {
            let mut token = self.admin_token.write().await;
            *token = Some((auth.token.clone(), Instant::now()));
        }

        Ok(auth.token)
    }

    async fn clear_admin_token(&self) {
        let mut token = self.admin_token.write().await;
        *token = None;
    }

    async fn refresh_admin_token(&self) -> Result<String, AppError> {
        self.clear_admin_token().await;
        self.get_admin_token().await
    }

    async fn with_retry<F, Fut, T>(&self, op_name: &str, f: F) -> Result<T, AppError>
    where
        F: Fn(String) -> Fut,
        Fut: std::future::Future<Output = Result<(u16, T), AppError>>,
    {
        let mut token = self.get_admin_token().await?;

        for attempt in 0..2 {
            match f(token.clone()).await {
                Ok((status_code, result)) => {
                    if (status_code == 401 || status_code == 403) && attempt == 0 {
                        token = self.refresh_admin_token().await?;
                        continue;
                    }
                    return Ok(result);
                }
                Err(e) => return Err(e),
            }
        }

        Err(AppError::Internal(format!("{op_name}: auth retry exhausted")))
    }

    // ── Generic CRUD ──

    pub async fn list<T: DeserializeOwned>(
        &self,
        collection: &str,
        filter: Option<&str>,
        sort: Option<&str>,
        per_page: Option<u32>,
    ) -> Result<PbListResponse<T>, AppError> {
        let collection = collection.to_string();
        let filter = filter.map(|s| s.to_string());
        let sort = sort.map(|s| s.to_string());

        self.with_retry(&format!("PB list {collection}"), |token| {
            let http = self.http.clone();
            let base_url = self.base_url.clone();
            let collection = collection.clone();
            let filter = filter.clone();
            let sort = sort.clone();

            async move {
                let url = format!("{}/api/collections/{}/records", base_url, collection);
                let mut req = http.get(&url).header("Authorization", &token);

                if let Some(ref f) = filter {
                    req = req.query(&[("filter", f.as_str())]);
                }
                if let Some(ref s) = sort {
                    req = req.query(&[("sort", s.as_str())]);
                }
                if let Some(pp) = per_page {
                    req = req.query(&[("perPage", &pp.to_string())]);
                }

                let resp = req.send().await.map_err(|e| {
                    AppError::Network(format!("PB list {collection}: {e}"))
                })?;

                let status_code = resp.status().as_u16();
                if status_code == 401 || status_code == 403 {
                    return Ok((status_code, Err(())));
                }

                if !resp.status().is_success() {
                    let body = resp.text().await.unwrap_or_default();
                    return Err(AppError::PocketBase { status: status_code, body });
                }

                let parsed: PbListResponse<T> = resp.json().await.map_err(|e| {
                    AppError::Internal(format!("PB list {collection} parse: {e}"))
                })?;
                Ok((status_code, Ok(parsed)))
            }
        })
        .await
        .and_then(|r| r.map_err(|()| AppError::Internal(format!("PB list {collection}: auth failure"))))
    }

    pub async fn get_one<T: DeserializeOwned>(
        &self,
        collection: &str,
        id: &str,
    ) -> Result<T, AppError> {
        let collection = collection.to_string();
        let id = id.to_string();

        self.with_retry(&format!("PB get {collection}/{id}"), |token| {
            let http = self.http.clone();
            let base_url = self.base_url.clone();
            let collection = collection.clone();
            let id = id.clone();

            async move {
                let url = format!("{}/api/collections/{}/records/{}", base_url, collection, id);
                let resp = http.get(&url).header("Authorization", &token).send().await
                    .map_err(|e| AppError::Network(format!("PB get {collection}/{id}: {e}")))?;

                let status_code = resp.status().as_u16();
                if status_code == 401 || status_code == 403 {
                    return Ok((status_code, Err(None::<T>)));
                }
                if status_code == 404 {
                    return Err(AppError::NotFound(format!("{collection}/{id}")));
                }
                if !resp.status().is_success() {
                    let body = resp.text().await.unwrap_or_default();
                    return Err(AppError::PocketBase { status: status_code, body });
                }

                let parsed: T = resp.json().await.map_err(|e| {
                    AppError::Internal(format!("PB get {collection}/{id} parse: {e}"))
                })?;
                Ok((status_code, Ok(parsed)))
            }
        })
        .await
        .and_then(|r| r.map_err(|_| AppError::Internal(format!("PB get {collection}/{id}: auth failure"))))
    }

    pub async fn create<T: DeserializeOwned, B: Serialize + Clone + Send + Sync>(
        &self,
        collection: &str,
        body: &B,
    ) -> Result<T, AppError> {
        let collection = collection.to_string();
        let body = body.clone();

        self.with_retry(&format!("PB create {collection}"), |token| {
            let http = self.http.clone();
            let base_url = self.base_url.clone();
            let collection = collection.clone();
            let body = body.clone();

            async move {
                let url = format!("{}/api/collections/{}/records", base_url, collection);
                let resp = http.post(&url).header("Authorization", &token).json(&body).send().await
                    .map_err(|e| AppError::Network(format!("PB create {collection}: {e}")))?;

                let status_code = resp.status().as_u16();
                if status_code == 401 || status_code == 403 {
                    return Ok((status_code, Err(())));
                }
                if !resp.status().is_success() {
                    let body = resp.text().await.unwrap_or_default();
                    return Err(AppError::PocketBase { status: status_code, body });
                }

                let parsed: T = resp.json().await.map_err(|e| {
                    AppError::Internal(format!("PB create {collection} parse: {e}"))
                })?;
                Ok((status_code, Ok(parsed)))
            }
        })
        .await
        .and_then(|r| r.map_err(|()| AppError::Internal(format!("PB create {collection}: auth failure"))))
    }

    pub async fn update<T: DeserializeOwned, B: Serialize + Clone + Send + Sync>(
        &self,
        collection: &str,
        id: &str,
        body: &B,
    ) -> Result<T, AppError> {
        let collection = collection.to_string();
        let id = id.to_string();
        let body = body.clone();

        self.with_retry(&format!("PB update {collection}/{id}"), |token| {
            let http = self.http.clone();
            let base_url = self.base_url.clone();
            let collection = collection.clone();
            let id = id.clone();
            let body = body.clone();

            async move {
                let url = format!("{}/api/collections/{}/records/{}", base_url, collection, id);
                let resp = http.patch(&url).header("Authorization", &token).json(&body).send().await
                    .map_err(|e| AppError::Network(format!("PB update {collection}/{id}: {e}")))?;

                let status_code = resp.status().as_u16();
                if status_code == 401 || status_code == 403 {
                    return Ok((status_code, Err(())));
                }
                if !resp.status().is_success() {
                    let body = resp.text().await.unwrap_or_default();
                    return Err(AppError::PocketBase { status: status_code, body });
                }

                let parsed: T = resp.json().await.map_err(|e| {
                    AppError::Internal(format!("PB update {collection}/{id} parse: {e}"))
                })?;
                Ok((status_code, Ok(parsed)))
            }
        })
        .await
        .and_then(|r| r.map_err(|()| AppError::Internal(format!("PB update {collection}/{id}: auth failure"))))
    }

    // ── Auth Methods ──

    pub async fn auth_register(
        &self,
        email: &str,
        password: &str,
        family_id: &str,
    ) -> Result<PbAuthResponse, AppError> {
        let url = format!("{}/api/collections/users/records", self.base_url);

        let resp = self.http
            .post(&url)
            .json(&serde_json::json!({
                "email": email,
                "password": password,
                "passwordConfirm": password,
                "family_id": family_id,
            }))
            .send()
            .await
            .map_err(|e| AppError::Network(format!("PB register: {e}")))?;

        if resp.status().as_u16() == 400 {
            let body = resp.text().await.unwrap_or_default();
            let msg = if body.contains("email") {
                "E-Mail wird bereits verwendet"
            } else {
                "Registrierung fehlgeschlagen"
            };
            return Err(AppError::BadRequest(msg.to_string()));
        }

        if !resp.status().is_success() {
            let status = resp.status().as_u16();
            let body = resp.text().await.unwrap_or_default();
            return Err(AppError::PocketBase { status, body });
        }

        // After creating user, login to get token
        self.auth_login(email, password).await
    }

    pub async fn auth_login(
        &self,
        email: &str,
        password: &str,
    ) -> Result<PbAuthResponse, AppError> {
        let url = format!("{}/api/collections/users/auth-with-password", self.base_url);

        let resp = self.http
            .post(&url)
            .json(&serde_json::json!({
                "identity": email,
                "password": password,
            }))
            .send()
            .await
            .map_err(|e| AppError::Network(format!("PB login: {e}")))?;

        if resp.status().as_u16() == 400 {
            return Err(AppError::Unauthorized);
        }

        if !resp.status().is_success() {
            let status = resp.status().as_u16();
            let body = resp.text().await.unwrap_or_default();
            return Err(AppError::PocketBase { status, body });
        }

        resp.json().await
            .map_err(|e| AppError::Internal(format!("PB login parse: {e}")))
    }

    pub async fn auth_validate(&self, token: &str) -> Result<PbUser, AppError> {
        let url = format!("{}/api/collections/users/auth-refresh", self.base_url);

        let resp = self.http
            .post(&url)
            .header("Authorization", token)
            .send()
            .await
            .map_err(|e| AppError::Network(format!("PB auth validate: {e}")))?;

        if !resp.status().is_success() {
            return Err(AppError::Unauthorized);
        }

        let auth: PbAuthResponse = resp.json().await
            .map_err(|e| AppError::Internal(format!("PB auth validate parse: {e}")))?;

        Ok(auth.record)
    }

    /// Proxy a PocketBase file — fetches bytes from PB and returns them
    pub async fn fetch_file(&self, collection: &str, record_id: &str, filename: &str) -> Result<(Vec<u8>, String), AppError> {
        let url = self.file_url(collection, record_id, filename);
        let token = self.get_admin_token().await?;

        let resp = self.http.get(&url).header("Authorization", &token).send().await
            .map_err(|e| AppError::Network(format!("PB file fetch: {e}")))?;

        if !resp.status().is_success() {
            return Err(AppError::NotFound(format!("File {collection}/{record_id}/{filename}")));
        }

        let content_type = resp.headers()
            .get("content-type")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("application/octet-stream")
            .to_string();

        let bytes = resp.bytes().await
            .map_err(|e| AppError::Internal(format!("PB file read: {e}")))?;

        Ok((bytes.to_vec(), content_type))
    }
}
