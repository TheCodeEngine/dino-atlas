import express from "express";

const app = express();
const PORT = process.env.PORT || 3100;

app.get("/tts/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/tts/audio", (req, res) => {
  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ error: "text parameter required" });
  }
  // TODO: Piper TTS integration
  res.status(501).json({ error: "TTS not yet implemented", text });
});

app.get("/tts/timestamps", (req, res) => {
  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ error: "text parameter required" });
  }
  // TODO: Generate word timestamps for karaoke
  res.status(501).json({ error: "Timestamps not yet implemented", text });
});

app.listen(PORT, () => {
  console.log(`TTS API listening on port ${PORT}`);
});
