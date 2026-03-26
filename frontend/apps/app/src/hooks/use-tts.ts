import { useRef, useState, useCallback } from "react";
import type { AudioPlayerStatus } from "@dino-atlas/ui";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

/**
 * Hook for TTS playback via backend API.
 * Returns props compatible with AudioPlayer component.
 */
export function useTts() {
  const [status, setStatus] = useState<AudioPlayerStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus("idle");
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const play = useCallback(async (text: string) => {
    // If already playing, pause
    if (audioRef.current && status === "playing") {
      audioRef.current.pause();
      setStatus("paused");
      return;
    }

    // If paused, resume
    if (audioRef.current && status === "paused") {
      audioRef.current.play();
      setStatus("playing");
      return;
    }

    // New playback — fetch from API
    setStatus("loading");
    setProgress(0);
    setCurrentTime(0);

    try {
      const resp = await fetch(`${BASE_URL}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });

      if (!resp.ok) throw new Error("TTS failed");

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });

      audio.addEventListener("ended", () => {
        stop();
        URL.revokeObjectURL(url);
      });

      audio.addEventListener("error", () => {
        setStatus("error");
        URL.revokeObjectURL(url);
      });

      await audio.play();
      setStatus("playing");

      // Progress tracking
      intervalRef.current = window.setInterval(() => {
        if (audio.duration > 0) {
          setCurrentTime(audio.currentTime);
          setProgress(audio.currentTime / audio.duration);
        }
      }, 100);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [status, stop]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setStatus("paused");
    }
  }, []);

  return { status, progress, currentTime, duration, play, pause, stop };
}
