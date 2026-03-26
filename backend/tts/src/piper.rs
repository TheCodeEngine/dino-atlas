use crate::{TtsConfig, TtsCache, TtsResult};
use tokio::io::AsyncWriteExt;
use tokio::process::Command;
use tracing;

/// Piper TTS engine — generates speech from text using local model
pub struct PiperTts {
    config: TtsConfig,
    cache: TtsCache,
}

impl PiperTts {
    pub async fn new(config: TtsConfig) -> Result<Self, String> {
        let cache = TtsCache::new(&config.cache_dir);
        cache.init().await.map_err(|e| format!("Cache init failed: {}", e))?;

        // Verify piper is available
        let check = Command::new(&config.piper_bin)
            .arg("--help")
            .output()
            .await;

        if check.is_err() {
            tracing::warn!("Piper binary not found at '{}'. TTS will not work.", config.piper_bin);
        }

        // Verify model exists
        if !config.model_path.exists() {
            tracing::warn!("Piper model not found at '{:?}'. Download it first.", config.model_path);
        }

        Ok(Self { config, cache })
    }

    /// Generate MP3 audio for text
    pub async fn speak(&self, text: &str) -> Result<TtsResult, String> {
        // Check cache first
        if let Some(audio) = self.cache.get(text).await {
            tracing::debug!("TTS cache hit for: {}...", &text[..text.len().min(40)]);
            return Ok(TtsResult { audio, cached: true });
        }

        tracing::info!("TTS generating: {}...", &text[..text.len().min(40)]);

        let pcm_data = self.run_piper(text).await?;
        tracing::debug!("Piper produced {} bytes PCM", pcm_data.len());

        let mp3_data = self.run_ffmpeg(&pcm_data).await?;
        tracing::info!("TTS complete: {} bytes MP3", mp3_data.len());

        // Cache the result
        if let Err(e) = self.cache.put(text, &mp3_data).await {
            tracing::warn!("Cache write failed: {}", e);
        }

        Ok(TtsResult { audio: mp3_data, cached: false })
    }

    /// Run piper subprocess: text → raw PCM.
    /// Writes stdin and reads stdout concurrently to avoid pipe deadlocks.
    async fn run_piper(&self, text: &str) -> Result<Vec<u8>, String> {
        let mut child = Command::new(&self.config.piper_bin)
            .args(["--model", &self.config.model_path.to_string_lossy()])
            .arg("--output-raw")
            .stdin(std::process::Stdio::piped())
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .spawn()
            .map_err(|e| format!("Failed to spawn piper: {}", e))?;

        // Take stdin before spawning the reader task
        let mut stdin = child.stdin.take().ok_or("Failed to open piper stdin")?;
        let text_bytes = text.as_bytes().to_vec();

        // Write stdin in a separate task to prevent deadlock:
        // piper may fill its stdout buffer before reading all of stdin
        let write_handle = tokio::spawn(async move {
            let _ = stdin.write_all(&text_bytes).await;
            drop(stdin); // close to signal EOF
        });

        let output = child.wait_with_output().await.map_err(|e| e.to_string())?;
        let _ = write_handle.await;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(format!("Piper failed: {}", stderr));
        }

        Ok(output.stdout)
    }

    /// Run ffmpeg subprocess: raw PCM → MP3.
    /// Same concurrent stdin/stdout pattern to avoid deadlocks.
    async fn run_ffmpeg(&self, pcm_data: &[u8]) -> Result<Vec<u8>, String> {
        let mut child = Command::new(&self.config.ffmpeg_bin)
            .args([
                "-f", "s16le",
                "-ar", &self.config.sample_rate.to_string(),
                "-ac", "1",
                "-i", "pipe:0",
                "-codec:a", "libmp3lame",
                "-qscale:a", "4",
                "-f", "mp3",
                "pipe:1",
            ])
            .stdin(std::process::Stdio::piped())
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .spawn()
            .map_err(|e| format!("Failed to spawn ffmpeg: {}", e))?;

        let mut stdin = child.stdin.take().ok_or("Failed to open ffmpeg stdin")?;
        let pcm = pcm_data.to_vec();

        let write_handle = tokio::spawn(async move {
            let _ = stdin.write_all(&pcm).await;
            drop(stdin);
        });

        let output = child.wait_with_output().await.map_err(|e| e.to_string())?;
        let _ = write_handle.await;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(format!("ffmpeg failed: {}", stderr));
        }

        Ok(output.stdout)
    }

    /// Get cache stats
    pub async fn cache_stats(&self) -> (usize, u64) {
        self.cache.stats().await
    }

    /// Clear cache
    pub async fn clear_cache(&self) -> Result<usize, String> {
        self.cache.clear().await.map_err(|e| e.to_string())
    }
}
