import { spawn } from "child_process";
import { createReadStream, existsSync, mkdirSync } from "fs";
import { createHash } from "crypto";
import { PassThrough } from "stream";
import type { Readable } from "stream";

export const CACHE_DIR = "./cache";
const MODEL = "models/de_DE-thorsten-high.onnx";
const SAMPLE_RATE = 22050;

// Ensure cache directory exists
if (!existsSync(CACHE_DIR)) {
  mkdirSync(CACHE_DIR, { recursive: true });
}

export function cacheKey(text: string): string {
  return createHash("md5").update(text).digest("hex");
}

export function cachedPath(text: string): string {
  return `${CACHE_DIR}/${cacheKey(text)}.mp3`;
}

export async function streamTts(
  text: string
): Promise<{ stream: Readable; cacheStatus: "HIT" | "MISS" }> {
  const mp3Path = cachedPath(text);

  // Cache hit
  if (existsSync(mp3Path)) {
    return {
      stream: createReadStream(mp3Path),
      cacheStatus: "HIT",
    };
  }

  // Cache miss — generate via Piper + ffmpeg
  const output = new PassThrough();

  const piper = spawn("venv/bin/python3", [
    "-m",
    "piper",
    "--model",
    MODEL,
    "--output-raw",
  ]);

  const ffmpeg = spawn("ffmpeg", [
    "-f", "s16le",
    "-ar", String(SAMPLE_RATE),
    "-ac", "1",
    "-i", "pipe:0",
    "-codec:a", "libmp3lame",
    "-qscale:a", "4",
    // Write to file AND stdout
    "-f", "mp3",
    "-y", mp3Path,
    "-f", "mp3",
    "pipe:1",
  ]);

  // Pipe: text → piper → pcm → ffmpeg → mp3
  piper.stdin.write(text);
  piper.stdin.end();
  piper.stdout.pipe(ffmpeg.stdin);
  ffmpeg.stdout.pipe(output);

  piper.stderr.on("data", (d) => console.error("piper:", d.toString()));
  ffmpeg.stderr.on("data", (d) => {
    // ffmpeg logs to stderr normally, only log errors
    const msg = d.toString();
    if (msg.includes("Error")) console.error("ffmpeg:", msg);
  });

  output.on("close", () => {
    piper.kill();
    ffmpeg.kill();
  });

  return { stream: output, cacheStatus: "MISS" };
}
