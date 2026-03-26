use crate::ContentType;
use crate::pipeline;

pub async fn run(
    pb_url: &str,
    gemini_key: &Option<String>,
    tts_url: &str,
    slug: &str,
    only: Option<ContentType>,
    skip_existing: bool,
    force: bool,
) {
    let key = gemini_key.as_deref().expect("GEMINI_API_KEY required for generation");

    if slug == "all" {
        tracing::info!("Generating content for ALL dinos...");
        let dinos = pipeline::seed_data::all_dino_slugs();
        for (i, dino_slug) in dinos.iter().enumerate() {
            tracing::info!("[{}/{}] {}", i + 1, dinos.len(), dino_slug);
            generate_one(pb_url, key, tts_url, dino_slug, &only, skip_existing, force).await;
            // Rate limit
            tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
        }
    } else {
        generate_one(pb_url, key, tts_url, slug, &only, skip_existing, force).await;
    }
}

async fn generate_one(
    _pb_url: &str,
    gemini_key: &str,
    _tts_url: &str,
    slug: &str,
    only: &Option<ContentType>,
    _skip_existing: bool,
    _force: bool,
) {
    let content_type = only.clone().unwrap_or(ContentType::All);

    match content_type {
        ContentType::Texts | ContentType::All => {
            tracing::info!("  Generating texts for {}...", slug);
            // TODO: pipeline::texts::generate(pb_url, gemini_key, slug).await;
        }
        _ => {}
    }

    match content_type {
        ContentType::Images | ContentType::All => {
            tracing::info!("  Generating images for {}...", slug);
            // TODO: pipeline::images::generate_comic(pb_url, gemini_key, slug).await;
            // TODO: pipeline::images::generate_real(pb_url, gemini_key, slug).await;
            // TODO: pipeline::images::generate_skeleton(pb_url, gemini_key, slug).await;
            // TODO: pipeline::images::generate_shadow(pb_url, gemini_key, slug).await;
        }
        _ => {}
    }

    match content_type {
        ContentType::Audio | ContentType::All => {
            tracing::info!("  Generating audio for {}...", slug);
            // TODO: pipeline::audio::generate(pb_url, tts_url, slug).await;
        }
        _ => {}
    }

    tracing::info!("  Done: {}", slug);
}
