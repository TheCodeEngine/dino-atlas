use crate::providers::pocketbase::PocketBaseClient;
use crate::providers::tts::TtsApiClient;
use crate::pipeline::costs;

/// Generate TTS audio for a dino's name pronunciation + steckbrief narration.
/// Uses the Dino-Atlas API's TTS endpoint (Piper running in Docker).
pub async fn generate(
    pb: &PocketBaseClient,
    tts: &TtsApiClient,
    record_id: &str,
    dino_slug: &str,
    display_name: &str,
    kid_summary_tts: &str,
    _name_ipa: &str,
    existing: &serde_json::Value,
    force: bool,
) -> Result<(), String> {
    // Audio: name pronunciation (use IPA if available)
    if force || existing["audio_name"].as_str().unwrap_or("").is_empty() {
        let name_text = format!("Das ist der {}!", display_name);
        tracing::info!("  Generating name audio via API...");
        let start = std::time::Instant::now();
        let audio = tts.speak(&name_text).await?;
        let duration = start.elapsed();

        let filename = format!("{}_name.mp3", dino_slug);
        pb.upload_file("dino_species", record_id, "audio_name", &filename, audio.clone(), "audio/mpeg").await?;

        let cost = costs::CostEntry {
            operation: "generate_audio_name".into(),
            model: "piper-de-thorsten-high".into(),
            dino_slug: dino_slug.into(),
            duration_ms: duration.as_millis() as u64,
            estimated_cost_usd: 0.0,
        };
        costs::log_cost(pb, &cost).await;

        tracing::info!("  Name audio uploaded ({} bytes, {:.1}s)", audio.len(), duration.as_secs_f32());
    } else {
        tracing::info!("  Skipping name audio (already exists)");
    }

    // Audio: steckbrief narration
    if force || existing["audio_steckbrief"].as_str().unwrap_or("").is_empty() {
        if kid_summary_tts.is_empty() {
            tracing::warn!("  No kid_summary_tts available, skipping steckbrief audio");
            return Ok(());
        }

        tracing::info!("  Generating steckbrief audio via API...");
        let start = std::time::Instant::now();
        let audio = tts.speak(kid_summary_tts).await?;
        let duration = start.elapsed();

        let filename = format!("{}_steckbrief.mp3", dino_slug);
        pb.upload_file("dino_species", record_id, "audio_steckbrief", &filename, audio.clone(), "audio/mpeg").await?;

        let cost = costs::CostEntry {
            operation: "generate_audio_steckbrief".into(),
            model: "piper-de-thorsten-high".into(),
            dino_slug: dino_slug.into(),
            duration_ms: duration.as_millis() as u64,
            estimated_cost_usd: 0.0,
        };
        costs::log_cost(pb, &cost).await;

        tracing::info!("  Steckbrief audio uploaded ({} bytes, {:.1}s)", audio.len(), duration.as_secs_f32());
    } else {
        tracing::info!("  Skipping steckbrief audio (already exists)");
    }

    Ok(())
}
