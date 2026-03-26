import { useRef, useEffect, useState } from "react";

export type AudioPlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";

export interface AudioPlayerProps {
  text: string;
  status?: AudioPlayerStatus;
  progress?: number;
  currentTime?: number;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function splitSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
}

export function AudioPlayer({
  text,
  status = "idle",
  progress = 0,
  currentTime = 0,
  duration,
  onPlay,
  onPause,
}: AudioPlayerProps) {
  const isPlaying = status === "playing";
  const isLoading = status === "loading";
  const isError = status === "error";
  const isActive = status === "playing" || status === "paused";

  const sentences = splitSentences(text);
  const currentIdx = isActive
    ? Math.min(Math.floor(progress * sentences.length), sentences.length - 1)
    : -1;

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentenceRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Demo mode: simulate playback when no real audio
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const isDemo = !onPlay;
  const effectiveProgress = isDemo ? demoProgress : progress;
  const effectiveStatus = isDemo ? (demoPlaying ? "playing" : "idle") : status;
  const effectivePlaying = isDemo ? demoPlaying : isPlaying;
  const effectiveActive = isDemo ? demoPlaying : isActive;
  const effectiveIdx = effectiveActive
    ? Math.min(Math.floor(effectiveProgress * sentences.length), sentences.length - 1)
    : -1;

  useEffect(() => {
    if (!demoPlaying) return;
    const interval = setInterval(() => {
      setDemoProgress((p) => {
        if (p >= 1) { setDemoPlaying(false); return 0; }
        return Math.min(p + 0.008, 1);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [demoPlaying]);

  // Auto-scroll to current sentence
  useEffect(() => {
    const el = sentenceRefs.current[effectiveIdx];
    const container = scrollRef.current;
    if (!el || !container) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const top = container.scrollTop + (elRect.top - containerRect.top) - container.clientHeight / 2 + el.clientHeight / 2;
    container.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [effectiveIdx]);

  function handleClick() {
    if (isDemo) {
      if (demoPlaying) { setDemoPlaying(false); }
      else { setDemoProgress(0); setDemoPlaying(true); }
      return;
    }
    if (isPlaying) onPause?.();
    else onPlay?.();
  }

  return (
    <div className="flex flex-col gap-3 p-3 bg-surface-container-lowest border-[3px] border-on-surface rounded-xl sticker-shadow">
      {/* Karaoke text area */}
      <div
        className="h-[100px] overflow-hidden relative"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      >
        <div
          ref={scrollRef}
          className="flex flex-col gap-1 h-full overflow-y-scroll py-4 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {sentences.map((sentence, i) => (
            <span
              key={i}
              ref={(el) => { sentenceRefs.current[i] = el; }}
              className={[
                "block text-sm leading-relaxed flex-shrink-0 transition-all duration-250",
                i < effectiveIdx ? "text-on-surface-variant/35" : "",
                i === effectiveIdx ? "text-primary-container font-bold text-[15px]" : "",
                i > effectiveIdx || !effectiveActive ? "text-on-surface-variant/50" : "",
              ].filter(Boolean).join(" ")}
            >
              {sentence}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause button */}
        <button
          onClick={handleClick}
          disabled={effectiveStatus === "loading"}
          className={[
            "w-10 h-10 rounded-full grid place-items-center flex-shrink-0 text-white font-bold transition-all",
            effectiveStatus === "loading"
              ? "bg-primary-container/50 cursor-wait"
              : isError
                ? "bg-error shadow-[0_6px_16px_rgba(186,26,26,0.28)] active:scale-95"
                : "bg-primary-container shadow-[0_6px_16px_rgba(27,94,32,0.28)] hover:scale-105 active:scale-95",
          ].join(" ")}
          aria-label={effectivePlaying ? "Pause" : "Vorlesen"}
        >
          {effectiveStatus === "loading" ? (
            <span className="block w-5 h-5 rounded-full border-[3px] border-white/35 border-t-white animate-spin" />
          ) : isError ? (
            <span className="material-symbols-outlined text-lg">refresh</span>
          ) : effectivePlaying ? (
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
          ) : (
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          )}
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-[5px] rounded-full bg-surface-container-high overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-container transition-[width] duration-200"
            style={{ width: `${Math.min(effectiveProgress * 100, 100)}%` }}
          />
        </div>

        {/* Time */}
        <span className="text-[11px] font-extrabold text-on-surface-variant whitespace-nowrap min-w-[3rem] text-right">
          {effectiveStatus === "loading"
            ? "…"
            : duration
              ? `${formatTime(isDemo ? effectiveProgress * (duration ?? 60) : currentTime)} / ${formatTime(duration)}`
              : effectiveActive
                ? formatTime(isDemo ? effectiveProgress * 60 : currentTime)
                : ""}
        </span>
      </div>
    </div>
  );
}
