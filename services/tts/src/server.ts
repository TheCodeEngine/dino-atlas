import express from "express";
import { streamTts, cacheKey, cachedPath, CACHE_DIR } from "./piper.js";
import { requireAuth } from "./auth.js";
import { readdirSync, statSync, unlinkSync } from "fs";

const app = express();
const PORT = process.env.PORT || 3100;

// Health check (no auth)
app.get("/tts/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Generate & stream TTS audio
app.get("/tts/audio", requireAuth, async (req, res) => {
  const text = req.query.text as string;
  if (!text) {
    res.status(400).json({ error: "text parameter required" });
    return;
  }

  try {
    const { stream, cacheStatus } = await streamTts(text);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("X-Cache", cacheStatus);
    stream.pipe(res);

    req.on("close", () => {
      stream.destroy();
    });
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ error: "TTS generation failed" });
  }
});

// Cache stats
app.get("/tts/cache", (_req, res) => {
  try {
    const files = readdirSync(CACHE_DIR);
    const totalSize = files.reduce((sum, f) => {
      return sum + statSync(`${CACHE_DIR}/${f}`).size;
    }, 0);
    res.json({
      count: files.length,
      sizeKb: Math.round(totalSize / 1024),
    });
  } catch {
    res.json({ count: 0, sizeKb: 0 });
  }
});

// Clear cache
app.delete("/tts/cache", (_req, res) => {
  try {
    const files = readdirSync(CACHE_DIR);
    files.forEach((f) => unlinkSync(`${CACHE_DIR}/${f}`));
    res.json({ cleared: files.length });
  } catch {
    res.json({ cleared: 0 });
  }
});

app.listen(PORT, () => {
  console.log(`TTS API listening on port ${PORT}`);
});
