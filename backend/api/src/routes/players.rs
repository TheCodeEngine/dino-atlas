use axum::{
    extract::State,
    routing::post,
    Json, Router,
};
use serde::Deserialize;
use utoipa::ToSchema;

use crate::error::AppError;
use crate::middleware::auth::AuthUser;
use crate::pocketbase::models::*;
use crate::routes::AppState;

#[derive(Deserialize, ToSchema)]
pub struct AddPlayerRequest {
    pub name: String,
    pub emoji: String,
    pub birth_year: i32,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/players", post(add_player))
}

#[utoipa::path(
    post, path = "/api/v1/players", tag = "Players",
    request_body = AddPlayerRequest,
    responses((status = 200, description = "Player created", body = PbPlayer)),
    security(("bearer" = []))
)]
pub(crate) async fn add_player(
    State(state): State<AppState>,
    auth: AuthUser,
    Json(req): Json<AddPlayerRequest>,
) -> Result<Json<PbPlayer>, AppError> {
    if req.name.trim().is_empty() {
        return Err(AppError::BadRequest("Name erforderlich".into()));
    }

    let player: PbPlayer = state.pb.create("players", &serde_json::json!({
        "family_id": auth.family_id,
        "name": req.name.trim(),
        "avatar_emoji": req.emoji,
        "birth_year": req.birth_year,
        "level": 1,
        "dinos_discovered": 0,
    })).await?;

    tracing::info!("Player created: {} for family {}", player.name, auth.family_id);
    Ok(Json(player))
}
