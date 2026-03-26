use axum::{
    extract::State,
    http::header::SET_COOKIE,
    response::AppendHeaders,
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use utoipa::ToSchema;

use crate::error::AppError;
use crate::pocketbase::models::*;
use crate::routes::AppState;

#[derive(Deserialize, ToSchema)]
pub struct PlayerInput {
    pub name: String,
    pub emoji: String,
    pub birth_year: i32,
}

#[derive(Deserialize, ToSchema)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub family_name: String,
    pub players: Vec<PlayerInput>,
}

#[derive(Deserialize, ToSchema)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(serde::Serialize, ToSchema)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserResponse,
}

#[derive(serde::Serialize, ToSchema)]
pub struct UserResponse {
    pub id: String,
    pub email: String,
    pub family_id: String,
}

#[derive(serde::Serialize, ToSchema)]
pub struct MeResponse {
    pub user: UserResponse,
    pub family: PbFamily,
    pub players: Vec<PbPlayer>,
}

impl From<&PbUser> for UserResponse {
    fn from(u: &PbUser) -> Self {
        Self {
            id: u.id.clone(),
            email: u.email.clone(),
            family_id: u.family_id.clone(),
        }
    }
}

pub fn public_routes() -> Router<AppState> {
    Router::new()
        .route("/auth/register", post(register))
        .route("/auth/login", post(login))
        .route("/auth/logout", post(logout))
}

pub fn protected_routes() -> Router<AppState> {
    Router::new()
        .route("/auth/me", get(me))
}

fn make_auth_cookie(token: &str) -> String {
    format!("dino_token={token}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=604800")
}

fn make_clear_cookie() -> String {
    "dino_token=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0".to_string()
}

#[utoipa::path(
    post, path = "/api/v1/auth/register", tag = "Auth",
    request_body = RegisterRequest,
    responses(
        (status = 200, description = "Registration successful", body = AuthResponse),
        (status = 400, description = "Invalid input"),
    )
)]
pub(crate) async fn register(
    State(state): State<AppState>,
    Json(req): Json<RegisterRequest>,
) -> Result<(AppendHeaders<[(axum::http::HeaderName, String); 1]>, Json<AuthResponse>), AppError> {
    if req.email.is_empty() || req.password.len() < 8 {
        return Err(AppError::BadRequest("E-Mail und Passwort (min. 8 Zeichen) erforderlich".into()));
    }
    if req.players.is_empty() {
        return Err(AppError::BadRequest("Mindestens ein Kind erforderlich".into()));
    }

    let family: PbFamily = state.pb.create("families", &serde_json::json!({
        "name": req.family_name,
    })).await?;

    let auth = state.pb.auth_register(&req.email, &req.password, &family.id).await?;

    for kid in &req.players {
        let _player: PbPlayer = state.pb.create("players", &serde_json::json!({
            "family_id": family.id,
            "name": kid.name,
            "avatar_emoji": kid.emoji,
            "birth_year": kid.birth_year,
            "level": 1,
            "dinos_discovered": 0,
        })).await?;
    }

    let cookie = make_auth_cookie(&auth.token);
    Ok((
        AppendHeaders([(SET_COOKIE, cookie)]),
        Json(AuthResponse {
            token: auth.token,
            user: UserResponse::from(&auth.record),
        }),
    ))
}

#[utoipa::path(
    post, path = "/api/v1/auth/login", tag = "Auth",
    request_body = LoginRequest,
    responses(
        (status = 200, description = "Login successful", body = AuthResponse),
        (status = 401, description = "Invalid credentials"),
    )
)]
pub(crate) async fn login(
    State(state): State<AppState>,
    Json(req): Json<LoginRequest>,
) -> Result<(AppendHeaders<[(axum::http::HeaderName, String); 1]>, Json<AuthResponse>), AppError> {
    let auth = state.pb.auth_login(&req.email, &req.password).await?;

    let cookie = make_auth_cookie(&auth.token);
    Ok((
        AppendHeaders([(SET_COOKIE, cookie)]),
        Json(AuthResponse {
            token: auth.token,
            user: UserResponse::from(&auth.record),
        }),
    ))
}

async fn logout() -> AppendHeaders<[(axum::http::HeaderName, String); 1]> {
    AppendHeaders([(SET_COOKIE, make_clear_cookie())])
}

#[utoipa::path(
    get, path = "/api/v1/auth/me", tag = "Auth",
    responses(
        (status = 200, description = "Current user + family + players", body = MeResponse),
        (status = 401, description = "Not authenticated"),
    ),
    security(("bearer" = []))
)]
pub(crate) async fn me(
    State(state): State<AppState>,
    auth: crate::middleware::auth::AuthUser,
) -> Result<Json<MeResponse>, AppError> {
    let user: PbUser = state.pb.get_one("users", &auth.user_id).await?;
    let family: PbFamily = state.pb.get_one("families", &user.family_id).await?;

    let players_resp: PbListResponse<PbPlayer> = state.pb
        .list("players", Some(&format!("family_id='{}'", user.family_id)), Some("name"), None)
        .await?;

    Ok(Json(MeResponse {
        user: UserResponse::from(&user),
        family,
        players: players_resp.items,
    }))
}
