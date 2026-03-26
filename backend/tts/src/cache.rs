use md5::{Md5, Digest};
use std::path::{Path, PathBuf};
use tokio::fs;

/// File-based TTS cache — same text = same audio
pub struct TtsCache {
    cache_dir: PathBuf,
}

impl TtsCache {
    pub fn new(cache_dir: &Path) -> Self {
        Self {
            cache_dir: cache_dir.to_path_buf(),
        }
    }

    pub async fn init(&self) -> Result<(), std::io::Error> {
        fs::create_dir_all(&self.cache_dir).await
    }

    /// Get cache key for text (MD5 hash)
    pub fn key(&self, text: &str) -> String {
        let mut hasher = Md5::new();
        hasher.update(text.as_bytes());
        hex::encode(hasher.finalize())
    }

    /// Path to cached MP3
    pub fn path(&self, text: &str) -> PathBuf {
        self.cache_dir.join(format!("{}.mp3", self.key(text)))
    }

    /// Check if cached audio exists
    pub async fn get(&self, text: &str) -> Option<Vec<u8>> {
        let path = self.path(text);
        fs::read(&path).await.ok()
    }

    /// Store audio in cache
    pub async fn put(&self, text: &str, audio: &[u8]) -> Result<(), std::io::Error> {
        let path = self.path(text);
        fs::write(&path, audio).await
    }

    /// Cache stats
    pub async fn stats(&self) -> (usize, u64) {
        let mut count = 0usize;
        let mut size = 0u64;
        if let Ok(mut entries) = fs::read_dir(&self.cache_dir).await {
            while let Ok(Some(entry)) = entries.next_entry().await {
                if let Ok(meta) = entry.metadata().await {
                    count += 1;
                    size += meta.len();
                }
            }
        }
        (count, size)
    }

    /// Clear cache
    pub async fn clear(&self) -> Result<usize, std::io::Error> {
        let mut count = 0;
        let mut entries = fs::read_dir(&self.cache_dir).await?;
        while let Some(entry) = entries.next_entry().await? {
            fs::remove_file(entry.path()).await?;
            count += 1;
        }
        Ok(count)
    }
}
