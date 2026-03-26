FROM node:22-slim

# Piper needs glibc (not Alpine), plus ffmpeg for PCM→MP3
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Node dependencies
COPY package.json ./
RUN npm install

# Python venv + Piper TTS
RUN python3 -m venv venv \
    && ./venv/bin/pip install --no-cache-dir piper-tts

# Source
COPY src ./src

EXPOSE 3100
CMD ["node", "--experimental-strip-types", "src/server.ts"]
