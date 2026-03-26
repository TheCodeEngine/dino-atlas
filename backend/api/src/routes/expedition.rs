use axum::{
    extract::State,
    routing::{get, post},
    Json, Router,
};
use rand::prelude::IndexedRandom;
use serde::Deserialize;

use utoipa::ToSchema;

use crate::error::AppError;
use crate::middleware::auth::AuthUser;
use crate::pocketbase::models::*;
use crate::routes::AppState;

#[derive(Deserialize, ToSchema)]
pub struct StartRequest {
    pub player_id: String,
    pub biom: String,
}

#[derive(Deserialize, ToSchema)]
pub struct AdvanceRequest {
    pub player_id: String,
    pub expedition_id: String,
    /// Data from the completed phase
    #[serde(default)]
    pub excavation_time_ms: Option<i64>,
    #[serde(default)]
    pub puzzle_time_ms: Option<i64>,
    #[serde(default)]
    pub identify_attempts: Option<i64>,
}

#[derive(serde::Serialize, ToSchema)]
pub struct ExpeditionResponse {
    pub expedition: PbExpedition,
    pub dino: super::dinos::DinoDetail,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/expedition/active", get(get_active))
        .route("/expedition/start", post(start))
        .route("/expedition/advance", post(advance))
}

#[utoipa::path(get, path = "/api/v1/expedition/active", tag = "Expedition",
    params(("player_id" = String, Query, description = "Player ID")),
    responses((status = 200, body = Option<ExpeditionResponse>)),
    security(("bearer" = []))
)]
pub(crate) async fn get_active(
    State(state): State<AppState>,
    auth: AuthUser,
    axum::extract::Query(params): axum::extract::Query<std::collections::HashMap<String, String>>,
) -> Result<Json<Option<ExpeditionResponse>>, AppError> {
    let player_id = params.get("player_id").ok_or(AppError::BadRequest("player_id required".into()))?;

    // Verify player belongs to this family
    let player: PbPlayer = state.pb.get_one("players", player_id).await?;
    if player.family_id != auth.family_id {
        return Err(AppError::Unauthorized);
    }

    let filter = format!("player_id='{}' && status!='complete'", player_id);

    let resp: PbListResponse<PbExpedition> = state.pb
        .list("expeditions", Some(&filter), Some("-created"), Some(1))
        .await?;

    match resp.items.into_iter().next() {
        Some(exp) => {
            let dino: PbDinoSpecies = state.pb.get_one("dino_species", &exp.dino_species_id).await?;
            Ok(Json(Some(ExpeditionResponse {
                expedition: exp,
                dino: super::dinos::DinoDetail::from_pb(dino),
            })))
        }
        None => Ok(Json(None)),
    }
}

#[utoipa::path(post, path = "/api/v1/expedition/start", tag = "Expedition",
    request_body = StartRequest,
    responses((status = 200, body = ExpeditionResponse)),
    security(("bearer" = []))
)]
pub(crate) async fn start(
    State(state): State<AppState>,
    auth: AuthUser,
    Json(req): Json<StartRequest>,
) -> Result<Json<ExpeditionResponse>, AppError> {
    // Verify player belongs to family
    let player: PbPlayer = state.pb.get_one("players", &req.player_id).await?;
    if player.family_id != auth.family_id {
        return Err(AppError::Unauthorized);
    }

    // Check daily budget
    let today = chrono::Utc::now().format("%Y-%m-%d 00:00:00.000Z").to_string();
    let budget_filter = format!("player_id='{}' && date='{}'", req.player_id, today);
    let budget_resp: PbListResponse<PbDailyBudget> = state.pb
        .list("daily_budgets", Some(&budget_filter), None, Some(1))
        .await?;

    let budget = match budget_resp.items.into_iter().next() {
        Some(b) => b,
        None => {
            // Create today's budget
            let b: PbDailyBudget = state.pb.create("daily_budgets", &serde_json::json!({
                "player_id": req.player_id,
                "date": today,
                "expeditions_used": 0,
                "expeditions_max": 3,
                "minigames_used": 0,
                "minigames_max": 5,
                "is_tired": false,
            })).await?;
            b
        }
    };

    if budget.expeditions_used >= budget.expeditions_max || budget.is_tired {
        return Err(AppError::BadRequest("Tagesbudget aufgebraucht! Die Dinos schlafen jetzt.".into()));
    }

    // Pick a random undiscovered dino
    let all_dinos: PbListResponse<PbDinoSpecies> = state.pb
        .list("dino_species", None, None, Some(500))
        .await?;

    let discovered_filter = format!("player_id='{}'", req.player_id);
    let discovered: PbListResponse<PbMuseumEntry> = state.pb
        .list("museum_entries", Some(&discovered_filter), None, Some(500))
        .await?;

    let discovered_ids: Vec<&str> = discovered.items.iter()
        .map(|e| e.dino_species_id.as_str())
        .collect();

    let undiscovered: Vec<&PbDinoSpecies> = all_dinos.items.iter()
        .filter(|d| !discovered_ids.contains(&d.id.as_str()))
        .filter(|d| !d.kid_summary.is_empty()) // only dinos with generated content
        .collect();

    if undiscovered.is_empty() {
        return Err(AppError::BadRequest("Alle Dinos entdeckt! Du bist ein Meister-Forscher!".into()));
    }

    let chosen = undiscovered.choose(&mut rand::rng())
        .ok_or_else(|| AppError::Internal("Random dino pick failed".into()))?;

    // Create expedition
    let exp: PbExpedition = state.pb.create("expeditions", &serde_json::json!({
        "player_id": req.player_id,
        "dino_species_id": chosen.id,
        "date": chrono::Utc::now().format("%Y-%m-%d 00:00:00.000Z").to_string(),
        "biom": req.biom,
        "status": "excavation",
    })).await?;

    Ok(Json(ExpeditionResponse {
        expedition: exp,
        dino: super::dinos::DinoDetail::from_pb((*chosen).clone()),
    }))
}

#[utoipa::path(post, path = "/api/v1/expedition/advance", tag = "Expedition",
    request_body = AdvanceRequest,
    responses((status = 200, body = ExpeditionResponse)),
    security(("bearer" = []))
)]
pub(crate) async fn advance(
    State(state): State<AppState>,
    auth: AuthUser,
    Json(req): Json<AdvanceRequest>,
) -> Result<Json<ExpeditionResponse>, AppError> {
    // Verify player
    let player: PbPlayer = state.pb.get_one("players", &req.player_id).await?;
    if player.family_id != auth.family_id {
        return Err(AppError::Unauthorized);
    }

    let exp: PbExpedition = state.pb.get_one("expeditions", &req.expedition_id).await?;
    if exp.player_id != req.player_id {
        return Err(AppError::Unauthorized);
    }

    // State machine: determine next phase
    let (next_status, update) = match exp.status.as_str() {
        "excavation" => ("puzzle", serde_json::json!({
            "status": "puzzle",
            "excavation_time_ms": req.excavation_time_ms,
        })),
        "puzzle" => ("identify", serde_json::json!({
            "status": "identify",
            "puzzle_time_ms": req.puzzle_time_ms,
        })),
        "identify" => ("discovery", serde_json::json!({
            "status": "discovery",
            "identify_attempts": req.identify_attempts,
        })),
        "discovery" => {
            // Complete expedition: create museum entry + increment budget
            let _museum: PbMuseumEntry = state.pb.create("museum_entries", &serde_json::json!({
                "player_id": req.player_id,
                "dino_species_id": exp.dino_species_id,
                "discovered_at": chrono::Utc::now().to_rfc3339(),
                "stars": 1,
            })).await?;

            // Increment budget
            let today = chrono::Utc::now().format("%Y-%m-%d 00:00:00.000Z").to_string();
            let budget_filter = format!("player_id='{}' && date='{}'", req.player_id, today);
            let budget_resp: PbListResponse<PbDailyBudget> = state.pb
                .list("daily_budgets", Some(&budget_filter), None, Some(1))
                .await?;

            if let Some(budget) = budget_resp.items.first() {
                let new_used = budget.expeditions_used + 1;
                let is_tired = new_used >= budget.expeditions_max;
                let _: PbDailyBudget = state.pb.update("daily_budgets", &budget.id, &serde_json::json!({
                    "expeditions_used": new_used,
                    "is_tired": is_tired,
                })).await?;
            }

            // Update player stats
            let _: PbPlayer = state.pb.update("players", &req.player_id, &serde_json::json!({
                "dinos_discovered": player.dinos_discovered + 1,
            })).await?;

            ("complete", serde_json::json!({ "status": "complete" }))
        }
        other => return Err(AppError::BadRequest(format!("Cannot advance from status '{other}'"))),
    };

    let updated: PbExpedition = state.pb.update("expeditions", &req.expedition_id, &update).await?;
    let dino: PbDinoSpecies = state.pb.get_one("dino_species", &exp.dino_species_id).await?;

    tracing::info!("Expedition {} advanced: {} → {}", req.expedition_id, exp.status, next_status);

    Ok(Json(ExpeditionResponse {
        expedition: updated,
        dino: super::dinos::DinoDetail::from_pb(dino),
    }))
}
