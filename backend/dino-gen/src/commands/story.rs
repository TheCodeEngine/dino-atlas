pub async fn run(pb_url: &str, gemini_key: &Option<String>, tts_url: &str, family_id: &str) {
    let _key = gemini_key.as_deref().expect("GEMINI_API_KEY required");
    tracing::info!("Generating bedtime story for family {}...", family_id);
    // TODO:
    // 1. Fetch today's dinos for each child in the family
    // 2. Generate combination story via Gemini
    // 3. Generate TTS audio via Piper
    // 4. Generate word timestamps for karaoke
    // 5. Save to PocketBase stories collection
    tracing::info!("Story generation not yet implemented");
}
