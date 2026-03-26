use axum::{
    extract::{Path, State},
    routing::get,
    Json, Router,
};

use utoipa::ToSchema;

use crate::error::AppError;
use crate::middleware::auth::AuthUser;
use crate::pocketbase::models::*;
use crate::routes::AppState;

#[derive(serde::Serialize, ToSchema)]
pub struct MuseumItem {
    pub dino_slug: String,
    pub display_name_de: String,
    pub rarity: String,
    pub discovered_at: String,
    pub stars: Option<i64>,
    pub favorite: bool,
    pub image_comic_url: Option<String>,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/museum", get(list_museum))
        .route("/museum/{slug}", get(get_museum_detail))
}

async fn list_museum(
    State(state): State<AppState>,
    auth: AuthUser,
    axum::extract::Query(params): axum::extract::Query<std::collections::HashMap<String, String>>,
) -> Result<Json<Vec<MuseumItem>>, AppError> {
    let player_id = params.get("player_id").ok_or(AppError::BadRequest("player_id required".into()))?;

    // Verify player belongs to family
    let player: PbPlayer = state.pb.get_one("players", player_id).await?;
    if player.family_id != auth.family_id {
        return Err(AppError::Unauthorized);
    }

    let filter = format!("player_id='{}'", player_id);
    let entries: PbListResponse<PbMuseumEntry> = state.pb
        .list("museum_entries", Some(&filter), Some("-discovered_at"), Some(500))
        .await?;

    let mut items = Vec::new();
    for entry in entries.items {
        let dino: PbDinoSpecies = state.pb.get_one("dino_species", &entry.dino_species_id).await?;
        items.push(MuseumItem {
            image_comic_url: if dino.image_comic.is_empty() { None } else {
                Some(format!("/api/v1/dinos/{}/file/image_comic", dino.slug))
            },
            dino_slug: dino.slug,
            display_name_de: dino.display_name_de,
            rarity: dino.rarity,
            discovered_at: entry.discovered_at,
            stars: entry.stars,
            favorite: entry.favorite,
        });
    }

    Ok(Json(items))
}

async fn get_museum_detail(
    State(state): State<AppState>,
    auth: AuthUser,
    Path(slug): Path<String>,
    axum::extract::Query(params): axum::extract::Query<std::collections::HashMap<String, String>>,
) -> Result<Json<serde_json::Value>, AppError> {
    let player_id = params.get("player_id").ok_or(AppError::BadRequest("player_id required".into()))?;

    let player: PbPlayer = state.pb.get_one("players", player_id).await?;
    if player.family_id != auth.family_id {
        return Err(AppError::Unauthorized);
    }

    // Get dino
    let dino_resp: PbListResponse<PbDinoSpecies> = state.pb
        .list("dino_species", Some(&format!("slug='{slug}'")), None, Some(1))
        .await?;
    let dino = dino_resp.items.into_iter().next()
        .ok_or_else(|| AppError::NotFound(format!("Dino '{slug}'")))?;

    // Get museum entry
    let entry_filter = format!("player_id='{}' && dino_species_id='{}'", player_id, dino.id);
    let entry_resp: PbListResponse<PbMuseumEntry> = state.pb
        .list("museum_entries", Some(&entry_filter), None, Some(1))
        .await?;

    let detail = super::dinos::DinoDetail::from_pb(dino);

    Ok(Json(serde_json::json!({
        "dino": detail,
        "museum_entry": entry_resp.items.first(),
    })))
}
