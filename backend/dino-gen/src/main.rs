mod commands;
mod providers;
mod pipeline;

use clap::{Parser, Subcommand};
use tracing_subscriber::EnvFilter;

#[derive(Parser)]
#[command(name = "dino-gen", about = "Dino-Atlas Content Generator CLI")]
struct Cli {
    /// PocketBase URL
    #[arg(long, env = "POCKETBASE_URL", default_value = "http://localhost:8090")]
    pocketbase_url: String,

    /// PocketBase admin email
    #[arg(long, env = "POCKETBASE_ADMIN_EMAIL")]
    pb_email: Option<String>,

    /// PocketBase admin password
    #[arg(long, env = "POCKETBASE_ADMIN_PASSWORD")]
    pb_password: Option<String>,

    /// Google Gemini API key
    #[arg(long, env = "GEMINI_API_KEY")]
    gemini_key: Option<String>,

    /// Path to piper binary
    #[arg(long, env = "PIPER_BIN", default_value = "piper")]
    piper_bin: String,

    /// Path to piper voice model (.onnx)
    #[arg(long, env = "PIPER_MODEL", default_value = "models/de_DE-thorsten-high.onnx")]
    piper_model: String,

    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Generate content for a single dino or all dinos
    Generate {
        /// Dino slug (e.g. "triceratops") or "all" for batch
        slug: String,

        /// Only generate specific content type
        #[arg(long)]
        only: Option<ContentType>,

        /// Skip dinos that already have this content
        #[arg(long)]
        skip_existing: bool,

        /// Force regeneration even if content exists
        #[arg(long)]
        force: bool,
    },

    /// Evaluate a child's artwork photo
    EvaluatePhoto {
        /// URL or path to the photo
        photo: String,

        /// Dino slug for context
        #[arg(long)]
        dino: String,
    },

    /// Generate a bedtime story for a family
    GenerateStory {
        /// Family ID
        family_id: String,
    },

    /// Seed base dino data into PocketBase (no images/texts/audio)
    Seed {
        /// Only seed if collection is empty
        #[arg(long)]
        skip_existing: bool,
    },

    /// Import PocketBase schema
    Schema,

    /// Show AI usage costs summary
    Costs,

    /// Test TTS: generate audio from text
    TtsTest {
        /// Text to speak (German)
        text: String,

        /// Output MP3 file path
        #[arg(long, default_value = "test_output.mp3")]
        output: String,
    },

    /// Show status of all dinos (what content exists)
    Status,

    /// Discover new dinosaurs via AI and seed them into PocketBase
    Discover {
        /// How many new dinos to discover
        #[arg(long, default_value = "1")]
        count: u32,

        /// Also generate content (texts, images, audio) after seeding
        #[arg(long)]
        generate: bool,

        /// Only generate specific content type (use with --generate)
        #[arg(long)]
        only: Option<ContentType>,
    },
}

#[derive(Clone, Debug, clap::ValueEnum)]
pub enum ContentType {
    /// Texts: kid_summary, fun_fact, facts, quiz_questions, food_options, hints
    Texts,
    /// Images: all 4 image types (comic, real, skeleton, shadow)
    Images,
    /// Audio: name pronunciation, steckbrief narration
    Audio,
    /// All content
    All,
    /// Only the comic image
    #[value(alias = "comic")]
    ImageComic,
    /// Only the realistic image
    #[value(alias = "real")]
    ImageReal,
    /// Only the skeleton image
    #[value(alias = "skeleton")]
    ImageSkeleton,
    /// Only the shadow silhouette image
    #[value(alias = "shadow")]
    ImageShadow,
}

impl ContentType {
    /// Returns true if this content type includes the given image subtype
    pub fn includes_image(&self, image_type: &str) -> bool {
        match self {
            ContentType::All | ContentType::Images => true,
            ContentType::ImageComic => image_type == "comic",
            ContentType::ImageReal => image_type == "real",
            ContentType::ImageSkeleton => image_type == "skeleton",
            ContentType::ImageShadow => image_type == "shadow",
            _ => false,
        }
    }

    pub fn needs_images(&self) -> bool {
        matches!(self, ContentType::Images | ContentType::All
            | ContentType::ImageComic | ContentType::ImageReal
            | ContentType::ImageSkeleton | ContentType::ImageShadow)
    }

    pub fn needs_texts(&self) -> bool {
        matches!(self, ContentType::Texts | ContentType::All)
    }

    pub fn needs_audio(&self) -> bool {
        matches!(self, ContentType::Audio | ContentType::All)
    }
}

#[tokio::main]
async fn main() {
    // Load .env file from current dir or parents (ignore if missing)
    let _ = dotenvy::dotenv();

    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let cli = Cli::parse();

    match cli.command {
        Command::Generate { slug, only, skip_existing, force } => {
            commands::generate::run(
                &cli.pocketbase_url, &cli.gemini_key,
                &cli.piper_bin, &cli.piper_model,
                &cli.pb_email, &cli.pb_password,
                &slug, only, skip_existing, force,
            ).await;
        }
        Command::EvaluatePhoto { photo, dino } => {
            commands::evaluate::run(&cli.gemini_key, &photo, &dino).await;
        }
        Command::GenerateStory { family_id } => {
            commands::story::run(&cli.pocketbase_url, &cli.gemini_key, &cli.piper_bin, &cli.piper_model, &family_id).await;
        }
        Command::Seed { skip_existing } => {
            commands::seed::run(&cli.pocketbase_url, &cli.pb_email, &cli.pb_password, skip_existing).await;
        }
        Command::Schema => {
            commands::schema::run(&cli.pocketbase_url, &cli.pb_email, &cli.pb_password).await;
        }
        Command::Costs => {
            commands::costs::run(&cli.pocketbase_url, &cli.pb_email, &cli.pb_password).await;
        }
        Command::TtsTest { text, output } => {
            use dino_atlas_tts::{PiperTts, TtsConfig};
            use std::path::PathBuf;

            let config = TtsConfig {
                piper_bin: cli.piper_bin,
                phonemize_bin: std::env::var("PHONEMIZE_BIN").unwrap_or_else(|_| "piper_phonemize".into()),
                espeak_data: std::env::var("ESPEAK_DATA").unwrap_or_else(|_| "espeak-ng-data".into()),
                model_path: PathBuf::from(&cli.piper_model),
                ffmpeg_bin: "ffmpeg".into(),
                cache_dir: PathBuf::from("cache/tts"),
                sample_rate: 22050,
            };

            tracing::info!("Initializing TTS...");
            let tts = PiperTts::new(config).await.expect("TTS init failed");

            tracing::info!("Generating speech for: {}", &text);
            let result = tts.speak(&text).await.expect("TTS generation failed");

            tokio::fs::write(&output, &result.audio).await.expect("Failed to write output");
            println!(
                "Generated {} bytes MP3 → {} (cached: {})",
                result.audio.len(), output, result.cached
            );
        }
        Command::Status => {
            commands::status::run(&cli.pocketbase_url, &cli.pb_email, &cli.pb_password).await;
        }
        Command::Discover { count, generate, only } => {
            commands::discover::run(
                &cli.pocketbase_url, &cli.gemini_key,
                &cli.piper_bin, &cli.piper_model,
                &cli.pb_email, &cli.pb_password,
                count, generate, only,
            ).await;
        }
    }
}
