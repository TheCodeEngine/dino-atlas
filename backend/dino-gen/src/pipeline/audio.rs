use crate::providers::pocketbase::PocketBaseClient;
use crate::pipeline::costs;
use dino_atlas_tts::{PiperTts, TtsConfig};
use std::path::PathBuf;

/// Generate TTS audio for a dino's name pronunciation + steckbrief narration.
/// Uses `_tts` variants of text fields which contain [[IPA]] phoneme annotations
/// for correct pronunciation of Latin/scientific terms by Piper.
pub async fn generate(
    pb: &PocketBaseClient,
    tts: &PiperTts,
    record_id: &str,
    dino_slug: &str,
    display_name: &str,
    kid_summary_tts: &str,
    name_ipa: &str,
    existing: &serde_json::Value,
    force: bool,
) -> Result<(), String> {
    // Audio: name pronunciation (use IPA if available)
    if force || existing["audio_name"].as_str().unwrap_or("").is_empty() {
        let name_text = if name_ipa.is_empty() {
            format!("Das ist der {}!", display_name)
        } else {
            format!("Das ist der [[{}]]!", name_ipa)
        };
        tracing::info!("  Generating name audio...");
        let start = std::time::Instant::now();
        let result = tts.speak(&name_text).await?;
        let duration = start.elapsed();

        let filename = format!("{}_name.mp3", dino_slug);
        pb.upload_file("dino_species", record_id, "audio_name", &filename, result.audio.clone(), "audio/mpeg").await?;

        let cost = costs::CostEntry {
            operation: "generate_audio_name".into(),
            model: "piper-de-thorsten-high".into(),
            dino_slug: dino_slug.into(),
            duration_ms: duration.as_millis() as u64,
            estimated_cost_usd: 0.0, // local, free
            details: format!("Name audio: {} ({} bytes, cached: {})", display_name, result.audio.len(), result.cached),
        };
        costs::log_cost(pb, &cost).await;

        tracing::info!("  Name audio uploaded ({} bytes, {:.1}s)", result.audio.len(), duration.as_secs_f32());
    } else {
        tracing::info!("  Skipping name audio (already exists)");
    }

    // Audio: steckbrief narration (uses kid_summary_tts with [[IPA]] tags)
    if force || existing["audio_steckbrief"].as_str().unwrap_or("").is_empty() {
        if kid_summary_tts.is_empty() {
            tracing::warn!("  No kid_summary_tts available, skipping steckbrief audio");
            return Ok(());
        }

        tracing::info!("  Generating steckbrief audio...");
        let start = std::time::Instant::now();
        let result = tts.speak(kid_summary_tts).await?;
        let duration = start.elapsed();

        let filename = format!("{}_steckbrief.mp3", dino_slug);
        pb.upload_file("dino_species", record_id, "audio_steckbrief", &filename, result.audio.clone(), "audio/mpeg").await?;

        let cost = costs::CostEntry {
            operation: "generate_audio_steckbrief".into(),
            model: "piper-de-thorsten-high".into(),
            dino_slug: dino_slug.into(),
            duration_ms: duration.as_millis() as u64,
            estimated_cost_usd: 0.0,
            details: format!("Steckbrief audio ({} bytes, cached: {})", result.audio.len(), result.cached),
        };
        costs::log_cost(pb, &cost).await;

        tracing::info!("  Steckbrief audio uploaded ({} bytes, {:.1}s)", result.audio.len(), duration.as_secs_f32());
    } else {
        tracing::info!("  Skipping steckbrief audio (already exists)");
    }

    Ok(())
}

/// Create a PiperTts instance from CLI args
pub fn create_tts(piper_bin: &str, model_path: &str) -> TtsConfig {
    TtsConfig {
        piper_bin: piper_bin.into(),
        model_path: PathBuf::from(model_path),
        ffmpeg_bin: std::env::var("FFMPEG_BIN").unwrap_or_else(|_| "ffmpeg".into()),
        cache_dir: PathBuf::from(std::env::var("TTS_CACHE_DIR").unwrap_or_else(|_| "cache/tts".into())),
        sample_rate: 22050,
    }
}
