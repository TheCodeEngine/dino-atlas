pub async fn run(gemini_key: &Option<String>, photo: &str, dino: &str) {
    let _key = gemini_key.as_deref().expect("GEMINI_API_KEY required");
    tracing::info!("Evaluating photo {} for dino {}...", photo, dino);
    // TODO: Send photo to Gemini Vision with kid-friendly prompt
    // Return positive, encouraging feedback
    tracing::info!("Photo evaluation not yet implemented");
}
