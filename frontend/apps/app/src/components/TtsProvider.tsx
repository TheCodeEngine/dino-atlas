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
    // Toggle: same text → pause/resume
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

    // Stop any current playback first (only one at a time)
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

  const isActive = status !== "idle";

  return (
    <TtsContext.Provider value={{ speak, stop, activeText, status, progress, currentTime, duration }}>
      {children}
      {isActive && (
        <MiniPlayer
          text={activeText ?? ""}
          status={status}
          progress={progress}
          currentTime={currentTime}
          duration={duration}
          onToggle={() => {
            if (activeText) speak(activeText);
          }}
          onStop={stop}
        />
      )}
    </TtsContext.Provider>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function MiniPlayer({
  text,
  status,
  progress,
  currentTime,
  duration,
  onToggle,
  onStop,
}: {
  text: string;
  status: AudioPlayerStatus;
  progress: number;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  onStop: () => void;
}) {
  const isPlaying = status === "playing";
  const isLoading = status === "loading";
  const preview = text.length > 60 ? text.slice(0, 57) + "..." : text;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 px-2 pb-1">
      <div className="max-w-lg mx-auto bg-primary-container text-white rounded-xl border-[3px] border-on-surface shadow-[0_-2px_12px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-white/20">
          <div
            className="h-full bg-white/80 transition-[width] duration-200"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-2">
          {/* Play/Pause */}
          <button
            onClick={onToggle}
            disabled={isLoading}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
          >
            {isLoading ? (
              <span className="block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            )}
          </button>

          {/* Text preview */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Vorlesen</p>
            <p className="text-xs font-semibold truncate">{preview}</p>
          </div>

          {/* Time */}
          <span className="text-[10px] font-bold text-white/60 whitespace-nowrap">
            {duration > 0 ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "..."}
          </span>

          {/* Stop/Close */}
          <button
            onClick={onStop}
            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
