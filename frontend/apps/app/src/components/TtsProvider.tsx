import { useRef, useState, useCallback, type ReactNode } from "react";
import { TtsContext, type AudioPlayerStatus } from "@dino-atlas/ui";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export function TtsProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AudioPlayerStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeText, setActiveText] = useState<string | null>(null);
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
    setActiveText(null);
  }, []);

  const speak = useCallback(async (text: string) => {
    if (activeText === text && audioRef.current) {
      if (status === "playing") {
        audioRef.current.pause();
        setStatus("paused");
        return;
      }
      if (status === "paused") {
        audioRef.current.play();
        setStatus("playing");
        return;
      }
    }

    stop();
    setActiveText(text);
    setStatus("loading");

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

      audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
      audio.addEventListener("ended", () => { stop(); URL.revokeObjectURL(url); });
      audio.addEventListener("error", () => { setStatus("error"); URL.revokeObjectURL(url); });

      await audio.play();
      setStatus("playing");

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
  }, [activeText, status, stop]);

  return (
    <TtsContext.Provider value={{ speak, stop, activeText, status, progress, currentTime, duration }}>
      {children}
    </TtsContext.Provider>
  );
}
