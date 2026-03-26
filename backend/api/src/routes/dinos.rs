use axum::{
    extract::{Path, State},
    http::header,
    response::IntoResponse,
    routing::get,
    Json, Router,
};

use utoipa::ToSchema;

use crate::error::AppError;
use crate::pocketbase::models::*;
use crate::routes::AppState;

/// Public dino info (no hints/answers)
#[derive(serde::Serialize, ToSchema)]
pub struct DinoListItem {
    pub id: String,
    pub slug: String,
    pub display_name_de: String,
    pub scientific_name: String,
    pub period: String,
    pub diet: String,
    pub length_m: Option<f64>,
    pub weight_kg: Option<f64>,
    pub rarity: String,
    pub has_content: bool,
}

/// Full dino profile (for discovery/museum detail)
#[derive(serde::Serialize, ToSchema)]
pub struct DinoDetail {
    pub id: String,
    pub slug: String,
    pub display_name_de: String,
    pub scientific_name: String,
    pub period: String,
    pub period_start_mya: Option<f64>,
    pub period_end_mya: Option<f64>,
    pub diet: String,
    pub length_m: Option<f64>,
    pub weight_kg: Option<f64>,
    pub continent: String,
    pub rarity: String,
    pub kid_summary: String,
    pub kid_summary_tts: String,
    pub fun_fact: String,
    pub fun_fact_tts: String,
    pub size_comparison: String,
    pub name_ipa: String,
    pub facts: Option<serde_json::Value>,
    pub quiz_questions: Option<serde_json::Value>,
    pub food_options: Option<serde_json::Value>,
    pub identify_hints: Option<serde_json::Value>,
    // Image/audio URLs (proxied through our API)
    pub image_comic_url: Option<String>,
    pub image_real_url: Option<String>,
    pub image_skeleton_url: Option<String>,
    pub image_shadow_url: Option<String>,
    pub audio_name_url: Option<String>,
    pub audio_steckbrief_url: Option<String>,
}

fn file_url_or_none(slug: &str, filename: &str, file_type: &str) -> Option<String> {
    if filename.is_empty() {
        None
    } else {
        Some(format!("/api/v1/dinos/{}/file/{}", slug, file_type))
    }
}

impl DinoDetail {
    pub fn from_pb(d: PbDinoSpecies) -> Self {
        Self {
            image_comic_url: file_url_or_none(&d.slug, &d.image_comic, "image_comic"),
            image_real_url: file_url_or_none(&d.slug, &d.image_real, "image_real"),
            image_skeleton_url: file_url_or_none(&d.slug, &d.image_skeleton, "image_skeleton"),
            image_shadow_url: file_url_or_none(&d.slug, &d.image_shadow, "image_shadow"),
            audio_name_url: file_url_or_none(&d.slug, &d.audio_name, "audio_name"),
            audio_steckbrief_url: file_url_or_none(&d.slug, &d.audio_steckbrief, "audio_steckbrief"),
            id: d.id,
            slug: d.slug,
            display_name_de: d.display_name_de,
            scientific_name: d.scientific_name,
            period: d.period,
            period_start_mya: d.period_start_mya,
            period_end_mya: d.period_end_mya,
            diet: d.diet,
            length_m: d.length_m,
            weight_kg: d.weight_kg,
            continent: d.continent,
            rarity: d.rarity,
            kid_summary: d.kid_summary,
            kid_summary_tts: d.kid_summary_tts,
            fun_fact_tts: d.fun_fact_tts,
            fun_fact: d.fun_fact,
            size_comparison: d.size_comparison,
            name_ipa: d.name_ipa,
            facts: d.facts,
            quiz_questions: d.quiz_questions,
            food_options: d.food_options,
            identify_hints: d.identify_hints,
        }
    }
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/dinos", get(list_dinos))
        .route("/dinos/{slug}", get(get_dino))
        .route("/dinos/{slug}/file/{file_type}", get(get_dino_file))
}

#[utoipa::path(
    get, path = "/api/v1/dinos", tag = "Dinos",
    responses((status = 200, description = "All dino species", body = Vec<DinoListItem>)),
)]
pub(crate) async fn list_dinos(
    State(state): State<AppState>,
) -> Result<Json<Vec<DinoListItem>>, AppError> {
    let resp: PbListResponse<PbDinoSpecies> = state.pb
        .list("dino_species", None, Some("display_name_de"), Some(500))
        .await?;

    let items = resp.items.into_iter().map(|d| DinoListItem {
        has_content: !d.kid_summary.is_empty(),
        id: d.id,
        slug: d.slug,
        display_name_de: d.display_name_de,
        scientific_name: d.scientific_name,
        period: d.period,
        diet: d.diet,
        length_m: d.length_m,
        weight_kg: d.weight_kg,
        rarity: d.rarity,
    }).collect();

    Ok(Json(items))
}

#[utoipa::path(
    get, path = "/api/v1/dinos/{slug}", tag = "Dinos",
    params(("slug" = String, Path, description = "Dino slug")),
    responses((status = 200, description = "Dino detail", body = DinoDetail)),
)]
pub(crate) async fn get_dino(
    State(state): State<AppState>,
    Path(slug): Path<String>,
) -> Result<Json<DinoDetail>, AppError> {
    let resp: PbListResponse<PbDinoSpecies> = state.pb
        .list("dino_species", Some(&format!("slug='{slug}'")), None, Some(1))
        .await?;

    let dino = resp.items.into_iter().next()
        .ok_or_else(|| AppError::NotFound(format!("Dino '{slug}' not found")))?;

    Ok(Json(DinoDetail::from_pb(dino)))
}

async fn get_dino_file(
    State(state): State<AppState>,
    Path((slug, file_type)): Path<(String, String)>,
) -> Result<impl IntoResponse, AppError> {
    // Find dino by slug
    let resp: PbListResponse<PbDinoSpecies> = state.pb
        .list("dino_species", Some(&format!("slug='{slug}'")), None, Some(1))
        .await?;

    let dino = resp.items.into_iter().next()
        .ok_or_else(|| AppError::NotFound(format!("Dino '{slug}'")))?;

    let collection_id = dino.collection_id_alt.as_deref()
        .or(dino.collection_id.as_deref())
        .unwrap_or("dino_species");

    let filename = match file_type.as_str() {
        "image_comic" => &dino.image_comic,
        "image_real" => &dino.image_real,
        "image_skeleton" => &dino.image_skeleton,
        "image_shadow" => &dino.image_shadow,
        "audio_name" => &dino.audio_name,
        "audio_steckbrief" => &dino.audio_steckbrief,
        _ => return Err(AppError::NotFound(format!("File type '{file_type}'"))),
    };

    if filename.is_empty() {
        return Err(AppError::NotFound(format!("No {file_type} for '{slug}'")));
    }

    let (bytes, content_type) = state.pb.fetch_file(collection_id, &dino.id, filename).await?;

    Ok((
        [
            (header::CONTENT_TYPE, content_type),
            (header::CACHE_CONTROL, "public, max-age=86400".to_string()),
        ],
        bytes,
    ))
}
