import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useHaptics } from "../../hooks/useHaptics";

export type TransitionPhase = "idle" | "run" | "enter" | "done";

const RUN_PHASE_MS = 2800;
const DONE_PHASE_MS = 3600;

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
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, []);

  function handleClick() {
    if (phase !== "idle") return;

    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    haptics.success();
    setPhase("run");
    timers.current.push(window.setTimeout(() => setPhase("enter"), RUN_PHASE_MS));
    timers.current.push(window.setTimeout(() => setPhase("done"), DONE_PHASE_MS));
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
            {phase === "done" && (
              <DoneOverlay
                dinoImage={dinoImage}
                dinoName={dinoName}
                onComplete={() => {
                  setPhase("idle");
                  onComplete?.();
                }}
              />
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

/** Museum building — shared across all transition variants */
function MuseumBuilding({ phase }: { phase: TransitionPhase }) {
  const isArriving = phase === "enter" || phase === "done";

  return (
    <motion.div
      className="absolute bottom-[28.5%] right-[4%] z-20 flex flex-col items-center"
      initial={{ x: 220, y: 12, scale: 0.84, opacity: 0.7 }}
      animate={
        phase === "run"
          ? { x: [220, 0], y: [12, 0], scale: [0.84, 1], opacity: [0.7, 1] }
          : { x: 0, y: 0, scale: 1, opacity: 1 }
      }
      transition={
        phase === "run"
          ? { duration: 2.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }
          : { duration: 0.35, ease: "easeOut" }
      }
    >
      <motion.div
        className="absolute bottom-[3.6rem] h-24 w-36 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,229,165,0.85) 0%, rgba(255,229,165,0) 72%)" }}
        animate={isArriving ? { scale: [0.75, 1.2, 1], opacity: [0.18, 0.75, 0.48] } : { scale: 0.82, opacity: 0.18 }}
        transition={isArriving ? { duration: 0.45, ease: "easeOut" } : { duration: 0.3, ease: "easeOut" }}
      />

      <motion.div
        className="absolute bottom-[3rem] left-1/2 h-24 w-16 -translate-x-1/2 blur-xl"
        style={{ background: "linear-gradient(180deg, rgba(255,249,224,0.75) 0%, rgba(255,236,176,0.45) 45%, rgba(255,236,176,0) 100%)" }}
        animate={isArriving ? { opacity: [0.12, 0.92, 0.52], scaleY: [0.75, 1.18, 1] } : { opacity: 0.08, scaleY: 0.78 }}
        transition={isArriving ? { duration: 0.42, ease: "easeOut" } : { duration: 0.28, ease: "easeOut" }}
      />

      <div className="relative flex flex-col items-center">
        <div className="h-3 w-36 rounded-t-[28px] border-[3px] border-on-surface bg-[#83532a]" />
        <div className="relative -mt-1 flex h-24 w-32 items-end justify-center overflow-hidden border-[3px] border-on-surface bg-gradient-to-b from-[#f7efd9] to-[#dfbf8a] rounded-t-[18px]">
          <div className="absolute inset-x-3 top-2 h-2 rounded-full bg-white/45" />
          <div className="absolute top-3 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full border-[2px] border-on-surface bg-[#fff8e4] px-3 py-1">
            <span
              className="material-symbols-outlined text-primary-container"
              style={{ fontSize: "17px", fontVariationSettings: "'FILL' 1" }}
            >
              museum
            </span>
          </div>
          <p className="absolute bottom-[4.15rem] text-[8px] font-black uppercase tracking-[0.22em] text-[#7a5327]">
            Museum
          </p>

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="absolute bottom-0 h-14 w-4 border-x-[2px] border-on-surface/55 bg-[#f6e5bf]"
              style={{ left: `${17 + index * 21}%` }}
            />
          ))}

          <div className="absolute bottom-0 left-1/2 h-12 w-12 -translate-x-1/2 rounded-t-[14px] border-[3px] border-on-surface bg-[#2b1307]" />
          <div className="absolute bottom-[2px] left-1/2 h-[42px] w-[42px] -translate-x-1/2 rounded-t-[10px] bg-gradient-to-b from-[#fff7d4]/70 to-[#f3d27e]/30" />
          <div className="absolute bottom-[2px] left-1/2 flex h-[42px] w-[42px] -translate-x-1/2 overflow-hidden rounded-t-[10px]">
            <motion.div
              className="h-full w-1/2 border-r border-[#321607] bg-gradient-to-b from-[#7f4117] to-[#4a220c]"
              animate={isArriving ? { x: -9, scaleX: 0.72 } : { x: 0, scaleX: 1 }}
              transition={isArriving ? { duration: 0.24, ease: "easeOut" } : { duration: 0.22, ease: "easeOut" }}
              style={{ transformOrigin: "left center" }}
            />
            <motion.div
              className="h-full w-1/2 bg-gradient-to-b from-[#7f4117] to-[#4a220c]"
              animate={isArriving ? { x: 9, scaleX: 0.72 } : { x: 0, scaleX: 1 }}
              transition={isArriving ? { duration: 0.24, ease: "easeOut" } : { duration: 0.22, ease: "easeOut" }}
              style={{ transformOrigin: "right center" }}
            />
          </div>
          <div className="absolute bottom-0 h-3 w-full bg-[#d3b27e]" />
        </div>
        <div className="flex h-4 w-28 items-center justify-center gap-1 rounded-b-2xl border-x-[3px] border-b-[3px] border-on-surface bg-[#f3e2bb]">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-2 w-3 rounded-full bg-[#986d42]/45" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/** Done overlay — shared across all transition variants */
function DoneOverlay({ dinoImage, dinoName, onComplete }: { dinoImage: string; dinoName: string; onComplete: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-[#061019]/48 backdrop-blur-[6px]" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at center, rgba(255,220,136,0.18) 0%, rgba(255,220,136,0) 44%)" }}
      />
      <motion.div
        className="relative mx-6 w-[min(90vw,24rem)] rounded-[2rem] border-[3px] border-on-surface bg-gradient-to-br from-[#fff8e7] via-[#ffe3ab] to-[#e9b45e] px-6 py-7 text-center sticker-shadow"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ type: "spring", damping: 8 }}
      >
        <div className="absolute inset-x-6 top-4 h-16 rounded-full bg-white/30 blur-2xl" />
        <div className="relative flex items-center justify-center gap-3">
          <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.5rem] border-[3px] border-on-surface bg-white/70">
            <img src={dinoImage} alt="" className="h-14 w-14 object-contain drop-shadow-md" />
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] border-[3px] border-on-surface bg-[#fff5db]">
            <span
              className="material-symbols-outlined text-primary-container"
              style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}
            >
              museum
            </span>
          </div>
        </div>

        <div className="relative mt-4 inline-flex items-center gap-2 rounded-full border-[2px] border-on-surface bg-white/65 px-3 py-1">
          <span className="material-symbols-outlined text-secondary-container" style={{ fontSize: "18px" }}>
            auto_awesome
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface">Gesichert</span>
        </div>

        <p className="relative mt-4 text-3xl font-black uppercase leading-none text-on-surface">
          {dinoName}
          <br />
          im Museum!
        </p>
        <p className="relative mt-3 text-sm font-semibold text-on-surface-variant">
          Dein Dino ist angekommen und wartet jetzt in der Sammlung auf seinen großen Auftritt.
        </p>
      </motion.div>

      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-40 rotate-45 rounded-[8px] bg-white/85"
          style={{
            left: `${10 + i * 10}%`,
            top: `${16 + (i % 4) * 14}%`,
            width: `${10 + (i % 3) * 4}px`,
            height: `${10 + (i % 3) * 4}px`,
            boxShadow: "0 0 24px rgba(255,230,170,0.7)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.4, 0.25], opacity: [0, 1, 0], y: [0, -34] }}
          transition={{ delay: i * 0.08, duration: 1.45, repeat: Infinity, repeatDelay: 1 }}
        />
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
