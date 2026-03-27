import { useState, useEffect, useContext } from "react";
import { motion } from "motion/react";
import { Icon } from "../primitives/Icon";
import { TtsContext } from "./AudioPlayer";

interface ForscherSpeechProps {
  text: string;
  /** TTS text with [[IPA]] phonemes — falls back to text if not set */
  ttsText?: string;
  subtext?: string;
  icon?: string;
  playable?: boolean;
  onPlay?: () => void;
}

export function ForscherSpeech({ text, ttsText, subtext, icon = "face", playable = true, onPlay }: ForscherSpeechProps) {
  const ttsCtx = useContext(TtsContext);
  // Send clean display text to Piper TTS (Piper 1.2 can't process [[IPA]] tags).
  const spokenText = text;

  // TTS context: check if this text is currently playing
  const ttsActive = ttsCtx?.activeText === spokenText;
  const ttsPlaying = ttsActive && ttsCtx?.status === "playing";
  const ttsLoading = ttsActive && ttsCtx?.status === "loading";

  // Demo mode: no TTS context and no onPlay
  const [demoPlaying, setDemoPlaying] = useState(false);
  const isDemo = !ttsCtx && !onPlay;
  const playing = isDemo ? demoPlaying : (ttsPlaying || false);
  const loading = ttsLoading || false;

  useEffect(() => {
    if (!demoPlaying) return;
    const t = setTimeout(() => setDemoPlaying(false), 3000 + text.length * 30);
    return () => clearTimeout(t);
  }, [demoPlaying, text.length]);

  function handlePlay() {
    if (isDemo) {
      setDemoPlaying(!demoPlaying);
      return;
    }
    if (ttsCtx) {
      // Use TTS context
      if (ttsPlaying) {
        ttsCtx.stop();
      } else {
        ttsCtx.speak(spokenText);
      }
      return;
    }
    // Custom onPlay handler
    onPlay?.();
  }

  return (
    <div className="flex items-start gap-2.5">
      <div className="flex-shrink-0 w-10 h-10 bg-primary-fixed border-[3px] border-on-surface rounded-lg sticker-shadow flex items-center justify-center">
        <Icon name={icon} size="md" filled className="text-primary" />
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
              disabled={loading}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                loading ? "bg-primary-container/50 text-white cursor-wait"
                : playing ? "bg-primary-container text-white"
                : "bg-surface-container-high text-on-surface-variant"
              }`}
              whileTap={{ scale: 0.85 }}
              aria-label={playing ? "Pause" : "Vorlesen"}
            >
              {loading ? (
                <span className="block w-4 h-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
              ) : (
                <Icon name={playing ? "pause" : "volume_up"} size="sm" filled />
              )}
            </motion.button>
          )}
        </div>
        {(playing || loading) && (
          <div className="flex items-center gap-1 mt-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary-container rounded-full"
                animate={{ height: [4, 12, 4] }}
                transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
            <span className="text-[9px] font-bold text-primary-container ml-1">
              {loading ? "Lade..." : "Vorlesen..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
