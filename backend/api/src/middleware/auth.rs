use axum::{
    extract::{FromRequestParts, Request, State},
    http::{header, request::Parts},
    middleware::Next,
    response::Response,
};

use crate::error::AppError;
use crate::routes::AppState;

/// Extracted authenticated user — available in handlers after auth middleware
#[derive(Debug, Clone)]
pub struct AuthUser {
    pub user_id: String,
    pub family_id: String,
    pub email: String,
}

impl<S: Send + Sync> FromRequestParts<S> for AuthUser {
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        parts
            .extensions
            .get::<AuthUser>()
            .cloned()
            .ok_or(AppError::Unauthorized)
    }
}

fn extract_cookie_token(headers: &axum::http::HeaderMap) -> Option<String> {
    headers
        .get(header::COOKIE)
        .and_then(|v| v.to_str().ok())
        .and_then(|cookies| {
            cookies.split(';').find_map(|c| {
                let c = c.trim();
                c.strip_prefix("dino_token=").map(|t| t.to_string())
            })
        })
}

/// Middleware that validates PB JWT and injects AuthUser into request extensions.
pub async fn auth_middleware(
    State(state): State<AppState>,
    mut request: Request,
    next: Next,
) -> Result<Response, AppError> {
    let token = request
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .and_then(|h| h.strip_prefix("Bearer ").map(|t| t.to_string()))
        .or_else(|| extract_cookie_token(request.headers()))
        .ok_or(AppError::Unauthorized)?;

    let pb_user = state.pb.auth_validate(&token).await?;

    let auth_user = AuthUser {
        user_id: pb_user.id,
        family_id: pb_user.family_id,
        email: pb_user.email,
    };

    request.extensions_mut().insert(auth_user);

    Ok(next.run(request).await)
}
