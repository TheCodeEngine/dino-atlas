use axum::{
    extract::State,
    http::header,
    response::IntoResponse,
    routing::post,
    Json, Router,
};
use serde::Deserialize;
use utoipa::ToSchema;

use crate::error::AppError;
use crate::routes::AppState;

#[derive(Deserialize, ToSchema)]
pub struct TtsRequest {
    pub text: String,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/tts", post(generate_speech))
}

#[utoipa::path(
    post, path = "/api/v1/tts", tag = "TTS",
    request_body = TtsRequest,
    responses((status = 200, description = "MP3 audio", content_type = "audio/mpeg")),
    security(("bearer" = []))
)]
pub(crate) async fn generate_speech(
    State(state): State<AppState>,
    Json(req): Json<TtsRequest>,
) -> Result<impl IntoResponse, AppError> {
    if req.text.is_empty() || req.text.len() > 2000 {
        return Err(AppError::BadRequest("Text muss 1-2000 Zeichen lang sein".into()));
    }

    let tts = state.tts.as_ref()
        .ok_or_else(|| AppError::Internal("TTS nicht konfiguriert".into()))?;

    let result = tts.speak(&req.text).await
        .map_err(|e| AppError::Internal(format!("TTS Fehler: {e}")))?;

    tracing::info!("TTS generated {} bytes (cached: {})", result.audio.len(), result.cached);

    Ok((
        [
            (header::CONTENT_TYPE, "audio/mpeg"),
            (header::CACHE_CONTROL, "public, max-age=3600"),
        ],
        result.audio,
    ))
}
