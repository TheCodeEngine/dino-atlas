use axum::{
    extract::State,
    routing::{get, post},
    Json, Router,
};
use rand::seq::SliceRandom;
use serde::Deserialize;
use utoipa::ToSchema;

use crate::error::AppError;
use crate::middleware::auth::AuthUser;
use crate::pocketbase::models::*;
use crate::routes::AppState;

const MINIGAME_DINO_SAMPLE: usize = 10;

#[derive(serde::Serialize, ToSchema)]
pub struct MinigameInfo {
    pub id: String,
    pub name: String,
    pub icon: String,
    pub description: String,
    pub available: bool,
    pub min_dinos: i64,
}

#[derive(serde::Serialize, ToSchema)]
pub struct MinigameDino {
    pub id: String,
    pub slug: String,
    pub name: String,
    pub period: String,
    pub diet: String,
    pub length_m: Option<f64>,
    pub image_comic_url: Option<String>,
    pub image_shadow_url: Option<String>,
    pub quiz_questions: Option<serde_json::Value>,
}

#[derive(serde::Serialize, ToSchema)]
pub struct AvailableResponse {
    pub games: Vec<MinigameInfo>,
    pub minigames_remaining: i64,
    pub is_tired: bool,
    pub discovered_count: i64,
    pub dinos: Vec<MinigameDino>,
}

#[derive(Deserialize, ToSchema)]
pub struct CompleteRequest {
    pub player_id: String,
    pub game_type: String,
    pub score: Option<i64>,
    pub stars_earned: Option<i64>,
    pub time_ms: Option<i64>,
}

#[derive(serde::Serialize, ToSchema)]
pub struct CompleteResponse {
    pub session_id: String,
    pub minigames_used: i64,
    pub minigames_max: i64,
    pub is_tired: bool,
}

const GAMES: &[(&str, &str, &str, &str, i64)] = &[
    ("quiz", "Dino-Quiz", "quiz", "Teste dein Wissen!", 1),
    ("size_sort", "Größen-Sortieren", "straighten", "Sortiere Dinos nach Größe", 3),
    ("timeline", "Zeitleiste", "schedule", "Ordne Dinos in die richtige Zeit", 3),
    ("food_match", "Futter-Match", "restaurant", "Was frisst welcher Dino?", 2),
    ("shadow_guess", "Schatten-Raten", "visibility", "Erkenne den Dino am Schatten", 2),
];

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/minigames/available", get(available))
        .route("/minigames/complete", post(complete))
}

#[utoipa::path(
    get, path = "/api/v1/minigames/available", tag = "Minigames",
    params(("player_id" = String, Query, description = "Player ID")),
    responses((status = 200, body = AvailableResponse)),
    security(("bearer" = []))
)]
pub(crate) async fn available(
    State(state): State<AppState>,
    auth: AuthUser,
    axum::extract::Query(params): axum::extract::Query<std::collections::HashMap<String, String>>,
) -> Result<Json<AvailableResponse>, AppError> {
    let player_id = params.get("player_id").ok_or(AppError::BadRequest("player_id required".into()))?;

    let player: PbPlayer = state.pb.get_one("players", player_id).await?;
    if player.family_id != auth.family_id {
        return Err(AppError::Unauthorized);
    }

    // Get all discovered dino IDs (only IDs, cheap query)
    let discovered_filter = format!("player_id='{}'", player_id);
    let discovered: PbListResponse<PbMuseumEntry> = state.pb
        .list("museum_entries", Some(&discovered_filter), None, Some(500))
        .await?;
    let discovered_count = std::cmp::max(discovered.total_items as i64, discovered.items.len() as i64);

    // Get budget
    let today = chrono::Utc::now().format("%Y-%m-%d 00:00:00.000Z").to_string();
    let budget_filter = format!("player_id='{}' && date='{}'", player_id, today);
    let budget_resp: PbListResponse<PbDailyBudget> = state.pb
        .list("daily_budgets", Some(&budget_filter), None, Some(1))
        .await?;

    let budget = match budget_resp.items.into_iter().next() {
        Some(b) => b,
        None => {
            state.pb.create::<PbDailyBudget, _>("daily_budgets", &serde_json::json!({
                "player_id": player_id,
                "date": today,
                "expeditions_used": 0, "expeditions_max": 3,
                "minigames_used": 0, "minigames_max": 5,
                "is_tired": false,
            })).await?
        }
    };

    let remaining = (budget.minigames_max - budget.minigames_used).max(0);

    let games = GAMES.iter().map(|(id, name, icon, desc, min)| MinigameInfo {
        id: id.to_string(),
        name: name.to_string(),
        icon: icon.to_string(),
        description: desc.to_string(),
        available: discovered_count >= *min,
        min_dinos: *min,
    }).collect();

    // Pick a random sample of discovered dino IDs (max MINIGAME_DINO_SAMPLE)
    let mut dino_ids: Vec<&str> = discovered.items.iter().map(|e| e.dino_species_id.as_str()).collect();
    {
        let mut rng = rand::rng();
        dino_ids.shuffle(&mut rng);
    }
    dino_ids.truncate(MINIGAME_DINO_SAMPLE);

    // Load dino details in a single batch query
    let dinos = if dino_ids.is_empty() {
        Vec::new()
    } else {
        let id_filter = dino_ids.iter()
            .map(|id| format!("id='{}'", id))
            .collect::<Vec<_>>()
            .join(" || ");
        let dino_resp: PbListResponse<PbDinoSpecies> = state.pb
            .list("dino_species", Some(&id_filter), None, Some(MINIGAME_DINO_SAMPLE as u32))
            .await?;
        dino_resp.items.into_iter().map(|d| {
            let slug = &d.slug;
            MinigameDino {
                id: d.id.clone(),
                slug: d.slug.clone(),
                name: d.display_name_de.clone(),
                period: d.period.clone(),
                diet: d.diet.clone(),
                length_m: d.length_m,
                image_comic_url: if d.image_comic.is_empty() { None } else { Some(format!("/api/v1/dinos/{slug}/file/image_comic")) },
                image_shadow_url: if d.image_shadow.is_empty() { None } else { Some(format!("/api/v1/dinos/{slug}/file/image_shadow")) },
                quiz_questions: d.quiz_questions.clone(),
            }
        }).collect()
    };

    Ok(Json(AvailableResponse {
        games,
        minigames_remaining: remaining,
        is_tired: budget.is_tired,
        discovered_count,
        dinos,
    }))
}

#[utoipa::path(
    post, path = "/api/v1/minigames/complete", tag = "Minigames",
    request_body = CompleteRequest,
    responses((status = 200, body = CompleteResponse)),
    security(("bearer" = []))
)]
pub(crate) async fn complete(
    State(state): State<AppState>,
    auth: AuthUser,
    Json(req): Json<CompleteRequest>,
) -> Result<Json<CompleteResponse>, AppError> {
    let player: PbPlayer = state.pb.get_one("players", &req.player_id).await?;
    if player.family_id != auth.family_id {
        return Err(AppError::Unauthorized);
    }

    // Create session record
    let session: PbMinigameSession = state.pb.create("minigame_sessions", &serde_json::json!({
        "player_id": req.player_id,
        "game_type": req.game_type,
        "score": req.score,
        "stars_earned": req.stars_earned,
        "time_ms": req.time_ms,
        "completed_at": chrono::Utc::now().to_rfc3339(),
    })).await?;

    // Increment budget
    let today = chrono::Utc::now().format("%Y-%m-%d 00:00:00.000Z").to_string();
    let budget_filter = format!("player_id='{}' && date='{}'", req.player_id, today);
    let budget_resp: PbListResponse<PbDailyBudget> = state.pb
        .list("daily_budgets", Some(&budget_filter), None, Some(1))
        .await?;

    let (used, max, tired) = if let Some(budget) = budget_resp.items.first() {
        let new_used = budget.minigames_used + 1;
        let is_tired = new_used >= budget.minigames_max;
        let _: PbDailyBudget = state.pb.update("daily_budgets", &budget.id, &serde_json::json!({
            "minigames_used": new_used,
            "is_tired": is_tired,
        })).await?;
        (new_used, budget.minigames_max, is_tired)
    } else {
        (1, 5, false)
    };

    Ok(Json(CompleteResponse {
        session_id: session.id,
        minigames_used: used,
        minigames_max: max,
        is_tired: tired,
    }))
}
