import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useHaptics } from "../../hooks/useHaptics";

export type TransitionPhase = "idle" | "run" | "enter" | "done";

export interface MuseumTransitionProps {
  dinoImage: string;
  dinoName: string;
  /** The scene renderer — receives phase and renders sky/ground/environment */
  scene: (phase: TransitionPhase, dinoImage: string) => ReactNode;
  /** Called when "Weiter" is pressed */
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
    setTimeout(() => setPhase("done"), 3200);
  }

  return (
    <>
      {/* Fullscreen animation */}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundImage: "none" }}
          >
            {/* Scene (sky, ground, environment — provided by variant) */}
            {scene(phase, dinoImage)}

            {/* Museum building (shared across all variants) */}
            <MuseumBuilding phase={phase} />

            {/* Done overlay (shared) */}
            {phase === "done" && <DoneOverlay onComplete={() => { setPhase("idle"); onComplete?.(); }} />}
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

/** Museum building — shared across all transition variants */
function MuseumBuilding({ phase }: { phase: TransitionPhase }) {
  return (
    <motion.div
      className="absolute bottom-[30%] right-4 flex flex-col items-center z-10"
      initial={{ x: 200 }}
      animate={phase === "run" ? { x: [200, 0] } : { x: 0 }}
      transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
    >
      <div className="w-0 h-0 border-l-[50px] border-r-[50px] border-b-[24px] border-l-transparent border-r-transparent border-b-[#d4a56a] mb-[-2px]" />
      <div className="bg-[#f5e6c8] border-[3px] border-on-surface w-24 h-24 flex flex-col items-center justify-between py-1.5 shadow-xl">
        <span className="material-symbols-outlined text-primary-container" style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>museum</span>
        <p className="text-[7px] font-black uppercase text-on-surface-variant">Museum</p>
        <motion.div
          className="w-9 h-11 bg-[#6B3410] border-[2px] border-on-surface rounded-t-lg"
          animate={phase === "enter" || phase === "done" ? { scaleX: [1, 0.05] } : {}}
          transition={{ duration: 0.25 }}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </motion.div>
  );
}

/** Done overlay — shared across all transition variants */
function DoneOverlay({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-on-surface/30" />
      <motion.div
        className="flex flex-col items-center relative"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ type: "spring", damping: 8 }}
      >
        <span className="text-7xl mb-3">🏛️</span>
        <p className="text-3xl font-black text-white uppercase" style={{ textShadow: "0 4px 0 rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.4)" }}>
          Im Museum!
        </p>
      </motion.div>

      {["🎉", "⭐", "✨", "🦕", "🌟", "🎊", "💫", "🎉", "⭐", "✨"].map((e, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl z-40"
          style={{ left: `${5 + i * 10}%`, top: `${15 + (i % 4) * 15}%` }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [0, 1.8, 0], rotate: [0, 360], y: [0, -60] }}
          transition={{ delay: i * 0.06, duration: 1.5, repeat: Infinity, repeatDelay: 1.2 }}
        >{e}</motion.span>
      ))}

      <motion.button
        className="mt-10 px-8 py-3 bg-white text-primary-container border-[3px] border-on-surface rounded-xl sticker-shadow font-black uppercase tracking-wider text-sm flex items-center gap-2 relative z-40"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring" }}
        whileTap={{ scale: 0.93 }}
        onClick={onComplete}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>check</span>
        Weiter geht's!
      </motion.button>
    </motion.div>
  );
}
