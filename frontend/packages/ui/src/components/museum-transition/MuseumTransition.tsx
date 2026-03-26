import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useHaptics } from "../../hooks/useHaptics";

export type TransitionPhase = "idle" | "run" | "enter" | "done";

export interface MuseumTransitionProps {
  dinoImage: string;
  dinoName: string;
  scene: (phase: TransitionPhase, dinoImage: string) => ReactNode;
  onComplete?: () => void;
  children?: ReactNode;
}

export function MuseumTransition({ dinoImage, dinoName, scene, onComplete, children }: MuseumTransitionProps) {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const haptics = useHaptics();

  function handleClick() {
    if (phase !== "idle") return;
    haptics.success();
    setPhase("run");
    setTimeout(() => setPhase("enter"), 2500);
    setTimeout(() => setPhase("done"), 3100);
  }

  return (
    <>
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundImage: "none", background: "#4a90d9" }}
          >
            {/* Scene (sky, ground, dino, museum) */}
            {scene(phase, dinoImage)}

            {/* Done overlay — covers everything */}
            {phase === "done" && (
              <motion.div
                className="absolute inset-0 z-50 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="absolute inset-0 bg-primary-container/90" />

                <motion.div
                  className="relative flex flex-col items-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.15, 1] }}
                  transition={{ type: "spring", damping: 8 }}
                >
                  <span className="text-7xl mb-2">🏛️</span>
                  <img src={dinoImage} alt="" className="w-16 h-16 object-contain -mt-2 mb-2 drop-shadow-lg" />
                  <p
                    className="text-2xl font-black text-white uppercase"
                    style={{ textShadow: "0 3px 0 rgba(0,0,0,0.4)" }}
                  >
                    Im Museum!
                  </p>
                </motion.div>

                {/* Confetti */}
                {["🎉", "⭐", "✨", "🦕", "🌟", "🎊"].map((e, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-3xl z-40"
                    style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 15}%` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 0], y: [0, -40] }}
                    transition={{ delay: i * 0.08, duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  >{e}</motion.span>
                ))}

                {/* Continue button */}
                <motion.button
                  className="mt-8 px-8 py-3 bg-white text-primary-container border-[3px] border-on-surface rounded-xl sticker-shadow font-black uppercase tracking-wider text-sm flex items-center gap-2 relative z-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => { setPhase("idle"); onComplete?.(); }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>check</span>
                  Weiter geht's!
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <div className="mx-4" onClick={handleClick}>
        {children ?? (
          <button className="w-full bg-gradient-to-br from-primary-container to-[#2E7D32] rounded-xl border-[3px] border-on-surface sticker-shadow active-press overflow-hidden text-left">
            <div className="flex items-center gap-3 p-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>museum</span>
              </div>
              <div className="flex-1 text-white min-w-0">
                <p className="text-base font-black uppercase tracking-tight leading-tight">Ab ins Museum!</p>
              </div>
              <span className="material-symbols-outlined text-white/80" style={{ fontSize: "24px" }}>arrow_forward</span>
            </div>
          </button>
        )}
      </div>
    </>
  );
}
