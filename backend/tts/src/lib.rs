mod piper;
mod cache;

pub use piper::PiperTts;
pub use cache::TtsCache;

use std::path::PathBuf;

/// TTS configuration
#[derive(Debug, Clone)]
pub struct TtsConfig {
    /// Path to piper binary (or "piper" if in PATH)
    pub piper_bin: String,
    /// Path to the voice model (.onnx)
    pub model_path: PathBuf,
    /// Path to ffmpeg binary (or "ffmpeg" if in PATH)
    pub ffmpeg_bin: String,
    /// Cache directory for generated audio
    pub cache_dir: PathBuf,
    /// Sample rate of the model
    pub sample_rate: u32,
}

impl Default for TtsConfig {
    fn default() -> Self {
        Self {
            piper_bin: "piper".into(),
            model_path: PathBuf::from("models/de_DE-thorsten-high.onnx"),
            ffmpeg_bin: "ffmpeg".into(),
            cache_dir: PathBuf::from("cache/tts"),
            sample_rate: 22050,
        }
    }
}

/// TTS result
pub struct TtsResult {
    /// MP3 audio bytes
    pub audio: Vec<u8>,
    /// Whether this was served from cache
    pub cached: bool,
}
