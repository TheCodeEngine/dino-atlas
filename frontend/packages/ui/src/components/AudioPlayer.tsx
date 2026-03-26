import { useRef, useEffect, useState, createContext, useContext } from "react";
import { Icon } from "../primitives/Icon";

export type AudioPlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";

/** TTS context — provide from app to enable real voiceover */
export interface TtsContextValue {
  speak: (text: string) => void;
  stop: () => void;
  activeText: string | null;
  status: AudioPlayerStatus;
  progress: number;
  currentTime: number;
  duration: number;
}

export const TtsContext = createContext<TtsContextValue | null>(null);

export interface AudioPlayerProps {
  text: string;
  status?: AudioPlayerStatus;
  progress?: number;
  currentTime?: number;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  compact?: boolean;
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
  status: statusProp = "idle",
  progress: progressProp = 0,
  currentTime: currentTimeProp = 0,
  duration: durationProp,
  onPlay: onPlayProp,
  onPause: onPauseProp,
  compact = false,
}: AudioPlayerProps) {
  // Check TTS context — if available and no explicit onPlay, use it
  const ttsCtx = useContext(TtsContext);
  const hasTts = !!ttsCtx && !onPlayProp;
  const ttsActive = hasTts && ttsCtx!.activeText === text;

  const status = ttsActive ? ttsCtx!.status : statusProp;
  const progress = ttsActive ? ttsCtx!.progress : progressProp;
  const currentTime = ttsActive ? ttsCtx!.currentTime : currentTimeProp;
  const duration = ttsActive ? ttsCtx!.duration : durationProp;
  const onPlay = hasTts ? () => ttsCtx!.speak(text) : onPlayProp;
  const onPause = hasTts ? () => ttsCtx!.stop() : onPauseProp;

  const isPlaying = status === "playing";
  const isLoading = status === "loading";
  const isError = status === "error";
  const isActive = status === "playing" || status === "paused";

  const sentences = splitSentences(text);

  // Demo mode (no onPlay and no TTS context)
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const isDemo = !onPlay;
  const effectiveProgress = isDemo ? demoProgress : progress;
  const effectivePlaying = isDemo ? demoPlaying : isPlaying;
  const effectiveActive = isDemo ? demoPlaying : isActive;
  const effectiveStatus = isDemo ? (demoPlaying ? "playing" as const : "idle" as const) : status;
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentenceRefs = useRef<(HTMLSpanElement | null)[]>([]);

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
      if (demoPlaying) setDemoPlaying(false);
      else { setDemoProgress(0); setDemoPlaying(true); }
      return;
    }
    if (isPlaying) onPause?.();
    else onPlay?.();
  }

  const playBtn = (
    <button
      onClick={handleClick}
      disabled={effectiveStatus === "loading"}
      className={[
        "w-8 h-8 rounded-full grid place-items-center flex-shrink-0 text-white transition-all active:scale-90",
        effectiveStatus === "loading"
          ? "bg-primary-container/50 cursor-wait"
          : isError
            ? "bg-error"
            : "bg-primary-container",
      ].join(" ")}
      aria-label={effectivePlaying ? "Pause" : "Vorlesen"}
    >
      {effectiveStatus === "loading" ? (
        <span className="block w-4 h-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
      ) : (
        <Icon name={effectivePlaying ? "pause" : "play_arrow"} size="sm" filled />
      )}
    </button>
  );

  // Compact mode: just controls bar, no text
  if (compact) {
    return (
      <div className="flex items-center gap-2.5">
        {playBtn}
        <div className="flex-1 h-1 rounded-full bg-surface-container-high overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-container transition-[width] duration-200"
            style={{ width: `${Math.min(effectiveProgress * 100, 100)}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-on-surface-variant whitespace-nowrap">
          {duration ? formatTime(isDemo ? effectiveProgress * duration : currentTime) + " / " + formatTime(duration) : ""}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-surface-container-lowest border-[3px] border-on-surface rounded-xl sticker-shadow">
      {/* Karaoke text area */}
      <div
        className="h-[90px] overflow-hidden relative"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div
          ref={scrollRef}
          className="flex flex-col gap-0.5 h-full overflow-y-scroll py-3 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {sentences.map((sentence, i) => (
            <span
              key={i}
              ref={(el) => { sentenceRefs.current[i] = el; }}
              className={[
                "block text-[13px] leading-snug flex-shrink-0 transition-all duration-200",
                i < effectiveIdx ? "text-on-surface-variant/30" : "",
                i === effectiveIdx ? "text-primary-container font-bold" : "",
                i > effectiveIdx || !effectiveActive ? "text-on-surface-variant/50" : "",
              ].filter(Boolean).join(" ")}
            >
              {sentence}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2.5">
        {playBtn}
        <div className="flex-1 h-1 rounded-full bg-surface-container-high overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-container transition-[width] duration-200"
            style={{ width: `${Math.min(effectiveProgress * 100, 100)}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-on-surface-variant whitespace-nowrap">
          {effectiveStatus === "loading"
            ? "…"
            : duration
              ? `${formatTime(isDemo ? effectiveProgress * duration : currentTime)} / ${formatTime(duration)}`
              : ""}
        </span>
      </div>
    </div>
  );
}
