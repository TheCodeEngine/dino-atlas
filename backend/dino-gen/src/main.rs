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

    /// TTS service URL
    #[arg(long, env = "TTS_URL", default_value = "http://localhost:3100")]
    tts_url: String,

    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Generate content for a single dino
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

    /// Seed base dino data into PocketBase (no images)
    Seed {
        /// Only seed if collection is empty
        #[arg(long)]
        skip_existing: bool,
    },

    /// Import PocketBase schema
    Schema,

    /// Show generation costs summary
    Costs,
}

#[derive(Clone, Debug, clap::ValueEnum)]
enum ContentType {
    /// Texts: kid_summary, fun_fact, facts, quiz_questions, food_options, hints
    Texts,
    /// Images: comic, real, skeleton, shadow
    Images,
    /// Audio: name pronunciation, steckbrief narration
    Audio,
    /// All content
    All,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let cli = Cli::parse();

    match cli.command {
        Command::Generate { slug, only, skip_existing, force } => {
            commands::generate::run(&cli.pocketbase_url, &cli.gemini_key, &cli.tts_url, &slug, only, skip_existing, force).await;
        }
        Command::EvaluatePhoto { photo, dino } => {
            commands::evaluate::run(&cli.gemini_key, &photo, &dino).await;
        }
        Command::GenerateStory { family_id } => {
            commands::story::run(&cli.pocketbase_url, &cli.gemini_key, &cli.tts_url, &family_id).await;
        }
        Command::Seed { skip_existing } => {
            commands::seed::run(&cli.pocketbase_url, &cli.pb_email, &cli.pb_password, skip_existing).await;
        }
        Command::Schema => {
            commands::schema::run(&cli.pocketbase_url, &cli.pb_email, &cli.pb_password).await;
        }
        Command::Costs => {
            commands::costs::run(&cli.pocketbase_url).await;
        }
    }
}
