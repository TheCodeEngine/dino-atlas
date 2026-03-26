# Multi-stage build: Rust binary + Python Piper TTS + ffmpeg
# This runs as a CLI tool, not a long-running service.

# ── Stage 1: Build Rust binary ──
FROM rust:1.94-slim-bookworm AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    pkg-config libssl-dev ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN cargo build --release --bin dino-gen

# ── Stage 2: Runtime with Piper + ffmpeg ──
FROM python:3.11-slim-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Piper TTS
RUN pip install --no-cache-dir piper-tts

# Download German voice model
RUN mkdir -p /app/models && \
    python -c "from piper import PiperVoice; PiperVoice.load('/dev/null')" 2>/dev/null; \
    curl -L -o /app/models/de_DE-thorsten-high.onnx \
      "https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE/thorsten/high/de_DE-thorsten-high.onnx" && \
    curl -L -o /app/models/de_DE-thorsten-high.onnx.json \
      "https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE/thorsten/high/de_DE-thorsten-high.onnx.json"

# Copy Rust binary
COPY --from=builder /app/target/release/dino-gen /usr/local/bin/dino-gen

WORKDIR /app

# Defaults for Docker environment
ENV PIPER_BIN=piper
ENV PIPER_MODEL=/app/models/de_DE-thorsten-high.onnx
ENV FFMPEG_BIN=ffmpeg
ENV TTS_CACHE_DIR=/app/cache/tts
ENV POCKETBASE_URL=http://pocketbase:8090

ENTRYPOINT ["dino-gen"]
CMD ["--help"]
