pub mod auth;
pub mod dinos;
pub mod expedition;
pub mod museum;
pub mod budget;
pub mod players;
pub mod tts;

use axum::{middleware, Router};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::pocketbase::client::PbClient;
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub pb: PbClient,
    pub tts: Option<Arc<dino_atlas_tts::PiperTts>>,
}

#[derive(OpenApi)]
#[openapi(
    info(
        title = "Dino-Atlas API",
        version = "1.0.0",
        description = "Dinosaurier-Lern-App fuer Kinder — API fuer Expeditionen, Museum, Minigames und mehr"
    ),
    paths(
        auth::register,
        auth::login,
        auth::me,
        players::add_player,
        dinos::list_dinos,
        dinos::get_dino,
        expedition::get_active,
        expedition::start,
        expedition::advance,
        tts::generate_speech,
    ),
    components(schemas(
        auth::RegisterRequest,
        auth::LoginRequest,
        auth::AuthResponse,
        auth::UserResponse,
        auth::MeResponse,
        dinos::DinoListItem,
        dinos::DinoDetail,
        expedition::StartRequest,
        expedition::AdvanceRequest,
        expedition::ExpeditionResponse,
        budget::BudgetResponse,
        budget::ResetRequest,
        museum::MuseumItem,
        crate::pocketbase::models::PbFamily,
        crate::pocketbase::models::PbPlayer,
    )),
    tags(
        (name = "Auth", description = "Registrierung, Login, Logout"),
        (name = "Dinos", description = "Dinosaurier-Daten und Bilder"),
        (name = "Expedition", description = "Expeditions-Gameloop"),
        (name = "Museum", description = "Dino-Sammlung"),
        (name = "Budget", description = "Tagesbudget und Eltern-Reset"),
    ),
    security(("bearer" = []))
)]
struct ApiDoc;

pub fn create_router(state: AppState) -> Router {
    let public = Router::new()
        .merge(auth::public_routes())
        .merge(dinos::routes());

    let protected = Router::new()
        .merge(auth::protected_routes())
        .merge(expedition::routes())
        .merge(museum::routes())
        .merge(budget::routes())
        .merge(players::routes())
        .merge(tts::routes())
        .layer(middleware::from_fn_with_state(
            state.clone(),
            crate::middleware::auth::auth_middleware,
        ));

    Router::new()
        .merge(SwaggerUi::new("/api/docs").url("/api/docs/openapi.json", ApiDoc::openapi()))
        .nest("/api/v1", public.merge(protected))
        .route("/api/v1/health", axum::routing::get(health))
        .with_state(state)
}

async fn health() -> &'static str {
    "ok"
}
