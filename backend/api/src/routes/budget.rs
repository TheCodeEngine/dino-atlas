use axum::{
    extract::State,
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;

use utoipa::ToSchema;

use crate::error::AppError;
use crate::middleware::auth::AuthUser;
use crate::pocketbase::models::*;
use crate::routes::AppState;

#[derive(serde::Serialize, ToSchema)]
pub struct BudgetResponse {
    pub expeditions_used: i64,
    pub expeditions_max: i64,
    pub minigames_used: i64,
    pub minigames_max: i64,
    pub is_tired: bool,
}

#[derive(Deserialize, ToSchema)]
pub struct ResetRequest {
    pub player_id: String,
    pub math_answer: i64,
    pub math_expected: i64,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/budget", get(get_budget))
        .route("/budget/reset", post(reset_budget))
}

async fn get_budget(
    State(state): State<AppState>,
    auth: AuthUser,
    axum::extract::Query(params): axum::extract::Query<std::collections::HashMap<String, String>>,
) -> Result<Json<BudgetResponse>, AppError> {
    let player_id = params.get("player_id").ok_or(AppError::BadRequest("player_id required".into()))?;

    let player: PbPlayer = state.pb.get_one("players", player_id).await?;
    if player.family_id != auth.family_id {
        return Err(AppError::Unauthorized);
    }

    let today = chrono::Utc::now().format("%Y-%m-%d 00:00:00.000Z").to_string();
    let filter = format!("player_id='{}' && date='{}'", player_id, today);
    let resp: PbListResponse<PbDailyBudget> = state.pb
        .list("daily_budgets", Some(&filter), None, Some(1))
        .await?;

    let budget = match resp.items.into_iter().next() {
        Some(b) => b,
        None => {
            let b: PbDailyBudget = state.pb.create("daily_budgets", &serde_json::json!({
                "player_id": player_id,
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

    Ok(Json(BudgetResponse {
        expeditions_used: budget.expeditions_used,
        expeditions_max: budget.expeditions_max,
        minigames_used: budget.minigames_used,
        minigames_max: budget.minigames_max,
        is_tired: budget.is_tired,
    }))
}

async fn reset_budget(
    State(state): State<AppState>,
    auth: AuthUser,
    Json(req): Json<ResetRequest>,
) -> Result<Json<BudgetResponse>, AppError> {
    // Verify math answer (parent gate)
    if req.math_answer != req.math_expected {
        return Err(AppError::BadRequest("Falsche Antwort!".into()));
    }

    let player: PbPlayer = state.pb.get_one("players", &req.player_id).await?;
    if player.family_id != auth.family_id {
        return Err(AppError::Unauthorized);
    }

    let today = chrono::Utc::now().format("%Y-%m-%d 00:00:00.000Z").to_string();
    let filter = format!("player_id='{}' && date='{}'", req.player_id, today);
    let resp: PbListResponse<PbDailyBudget> = state.pb
        .list("daily_budgets", Some(&filter), None, Some(1))
        .await?;

    if let Some(budget) = resp.items.first() {
        let updated: PbDailyBudget = state.pb.update("daily_budgets", &budget.id, &serde_json::json!({
            "expeditions_used": 0,
            "minigames_used": 0,
            "is_tired": false,
        })).await?;

        // Log the reset
        let _ = state.pb.create::<serde_json::Value, _>("budget_resets", &serde_json::json!({
            "player_id": req.player_id,
            "date": today,
            "reset_by_user_id": auth.user_id,
            "math_question": format!("{}={}", req.math_expected, req.math_answer),
            "reset_at": chrono::Utc::now().to_rfc3339(),
        })).await;

        Ok(Json(BudgetResponse {
            expeditions_used: updated.expeditions_used,
            expeditions_max: updated.expeditions_max,
            minigames_used: updated.minigames_used,
            minigames_max: updated.minigames_max,
            is_tired: updated.is_tired,
        }))
    } else {
        Err(AppError::NotFound("Kein Budget für heute gefunden".into()))
    }
}
