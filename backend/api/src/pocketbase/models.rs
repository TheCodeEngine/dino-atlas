use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

/// Generic PocketBase list response
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PbListResponse<T> {
    pub items: Vec<T>,
    pub total_items: u32,
    pub total_pages: u32,
}

/// PocketBase auth response (user login/register)
#[derive(Debug, Deserialize)]
pub struct PbAuthResponse {
    pub token: String,
    pub record: PbUser,
}

/// PocketBase admin auth response
#[derive(Debug, Deserialize)]
pub struct PbAdminAuthResponse {
    pub token: String,
}

/// User record (PocketBase auth collection)
#[derive(Debug, Deserialize, Clone)]
pub struct PbUser {
    pub id: String,
    pub email: String,
    #[serde(default)]
    pub family_id: String,
}

/// Family record
#[derive(Debug, Deserialize, Serialize, Clone, ToSchema)]
pub struct PbFamily {
    pub id: String,
    pub name: String,
}

/// Player (child profile)
#[derive(Debug, Deserialize, Serialize, Clone, ToSchema)]
pub struct PbPlayer {
    pub id: String,
    pub family_id: String,
    pub name: String,
    pub avatar_emoji: String,
    pub birth_year: i32,
    #[serde(default)]
    pub interests: Option<serde_json::Value>,
    #[serde(default)]
    pub level: i64,
    #[serde(default)]
    pub dinos_discovered: i64,
    #[serde(default)]
    pub minigames_remaining: i64,
}

/// Dino species record
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct PbDinoSpecies {
    pub id: String,
    #[serde(default)]
    pub collection_id: Option<String>,
    #[serde(rename = "collectionId", default)]
    pub collection_id_alt: Option<String>,
    pub slug: String,
    pub display_name_de: String,
    pub scientific_name: String,
    #[serde(default)]
    pub period: String,
    #[serde(default)]
    pub period_start_mya: Option<f64>,
    #[serde(default)]
    pub period_end_mya: Option<f64>,
    #[serde(default)]
    pub diet: String,
    #[serde(default)]
    pub length_m: Option<f64>,
    #[serde(default)]
    pub weight_kg: Option<f64>,
    #[serde(default)]
    pub continent: String,
    #[serde(default)]
    pub rarity: String,
    #[serde(default)]
    pub habitat_description: String,
    #[serde(default)]
    pub kid_summary: String,
    #[serde(default)]
    pub kid_summary_tts: String,
    #[serde(default)]
    pub fun_fact: String,
    #[serde(default)]
    pub fun_fact_tts: String,
    #[serde(default)]
    pub name_ipa: String,
    #[serde(default)]
    pub size_comparison: String,
    #[serde(default)]
    pub image_comic: String,
    #[serde(default)]
    pub image_real: String,
    #[serde(default)]
    pub image_skeleton: String,
    #[serde(default)]
    pub image_shadow: String,
    #[serde(default)]
    pub audio_name: String,
    #[serde(default)]
    pub audio_steckbrief: String,
    #[serde(default)]
    pub facts: Option<serde_json::Value>,
    #[serde(default)]
    pub quiz_questions: Option<serde_json::Value>,
    #[serde(default)]
    pub food_options: Option<serde_json::Value>,
    #[serde(default)]
    pub identify_hints: Option<serde_json::Value>,
}

/// Expedition record
#[derive(Debug, Deserialize, Serialize, Clone, ToSchema)]
pub struct PbExpedition {
    pub id: String,
    pub player_id: String,
    pub dino_species_id: String,
    #[serde(default)]
    pub date: String,
    #[serde(default)]
    pub biom: String,
    pub status: String,
    #[serde(default)]
    pub excavation_time_ms: Option<i64>,
    #[serde(default)]
    pub puzzle_time_ms: Option<i64>,
    #[serde(default)]
    pub identify_attempts: Option<i64>,
}

/// Museum entry
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct PbMuseumEntry {
    pub id: String,
    pub player_id: String,
    pub dino_species_id: String,
    #[serde(default)]
    pub discovered_at: String,
    #[serde(default)]
    pub stars: Option<i64>,
    #[serde(default)]
    pub favorite: bool,
}

/// Daily budget
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct PbDailyBudget {
    pub id: String,
    pub player_id: String,
    pub date: String,
    #[serde(default)]
    pub expeditions_used: i64,
    #[serde(default)]
    pub expeditions_max: i64,
    #[serde(default)]
    pub minigames_used: i64,
    #[serde(default)]
    pub minigames_max: i64,
    #[serde(default)]
    pub is_tired: bool,
}

/// Minigame session
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct PbMinigameSession {
    pub id: String,
    pub player_id: String,
    pub game_type: String,
    #[serde(default)]
    pub score: Option<i64>,
    #[serde(default)]
    pub stars_earned: Option<i64>,
    #[serde(default)]
    pub time_ms: Option<i64>,
}
