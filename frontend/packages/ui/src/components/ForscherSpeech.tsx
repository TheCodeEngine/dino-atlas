import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface ForscherSpeechProps {
  text: string;
  subtext?: string;
  icon?: string;
  /** Enable play button for TTS voiceover */
  playable?: boolean;
  /** Called when play is pressed — integrate with TTS service */
  onPlay?: () => void;
}

export function ForscherSpeech({ text, subtext, icon = "face", playable = true, onPlay }: ForscherSpeechProps) {
  const [playing, setPlaying] = useState(false);

  // Demo: auto-stop after simulated duration
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setPlaying(false), 3000 + text.length * 30);
    return () => clearTimeout(t);
  }, [playing, text.length]);

  function handlePlay() {
    if (playing) {
      setPlaying(false);
    } else {
      setPlaying(true);
      onPlay?.();
    }
  }

  return (
    <div className="flex items-start gap-2.5">
      <div className="flex-shrink-0 w-10 h-10 bg-primary-fixed border-[3px] border-on-surface rounded-lg sticker-shadow flex items-center justify-center">
        <span
          className="material-symbols-outlined text-lg text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div className="bg-surface-container-lowest border-[3px] border-on-surface rounded-lg rounded-tl-none p-3 sticker-shadow flex-1">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-on-surface">{text}</p>
            {subtext && <p className="text-[11px] text-on-surface-variant mt-0.5">{subtext}</p>}
          </div>
          {playable && (
            <motion.button
              onClick={handlePlay}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                playing ? "bg-primary-container text-white" : "bg-surface-container-high text-on-surface-variant"
              }`}
              whileTap={{ scale: 0.85 }}
              aria-label={playing ? "Pause" : "Vorlesen"}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}
              >
                {playing ? "pause" : "volume_up"}
              </span>
            </motion.button>
          )}
        </div>
        {/* Playing indicator */}
        {playing && (
          <div className="flex items-center gap-1 mt-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary-container rounded-full"
                animate={{ height: [4, 12, 4] }}
                transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
            <span className="text-[9px] font-bold text-primary-container ml-1">Vorlesen...</span>
          </div>
        )}
      </div>
    </div>
  );
}
