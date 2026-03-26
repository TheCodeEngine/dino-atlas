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
  const isRunning = phase === "run";
  const isArriving = phase === "enter" || phase === "done";

  return (
    <motion.div
      className="absolute z-20"
      style={{ right: "8%", bottom: "35.5%" }}
      initial={{ x: 180, y: 18, scale: 0.74, opacity: 0 }}
      animate={
        isRunning
          ? { x: [180, 0], y: [18, 0], scale: [0.74, 0.96], opacity: [0, 1] }
          : { x: 0, y: 0, scale: 0.96, opacity: 1 }
      }
      transition={
        isRunning
          ? { duration: 2.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
          : { duration: 0.35, ease: "easeOut" }
      }
    >
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          left: "50%",
          bottom: "0.9rem",
          width: "10rem",
          height: "5.75rem",
          transform: "translateX(-50%)",
          background: "radial-gradient(circle, rgba(255,229,165,0.85) 0%, rgba(255,229,165,0) 72%)",
        }}
        animate={isArriving ? { scale: [0.75, 1.2, 1], opacity: [0.18, 0.75, 0.48] } : { scale: 0.82, opacity: 0.18 }}
        transition={isArriving ? { duration: 0.45, ease: "easeOut" } : { duration: 0.3, ease: "easeOut" }}
      />

      <motion.div
        className="absolute left-1/2 blur-xl"
        style={{
          bottom: "1.4rem",
          width: "4rem",
          height: "6rem",
          transform: "translateX(-50%)",
          background: "linear-gradient(180deg, rgba(255,249,224,0.75) 0%, rgba(255,236,176,0.45) 45%, rgba(255,236,176,0) 100%)",
        }}
        animate={isArriving ? { opacity: [0.12, 0.92, 0.52], scaleY: [0.75, 1.18, 1] } : { opacity: 0.08, scaleY: 0.78 }}
        transition={isArriving ? { duration: 0.42, ease: "easeOut" } : { duration: 0.28, ease: "easeOut" }}
      />

      <div className="relative" style={{ width: "8.9rem" }}>
        <div
          className="absolute left-1/2"
          style={{
            top: "-1.85rem",
            width: "3.75rem",
            height: "2.2rem",
            transform: "translateX(-50%)",
            background: "linear-gradient(180deg, #f8eecf 0%, #d6b16a 100%)",
            border: "3px solid #1c1c17",
            borderBottom: "0",
            borderRadius: "999px 999px 0 0",
          }}
        />
        <div
          className="absolute left-1/2"
          style={{
            top: "-0.5rem",
            width: "8.5rem",
            height: "1.7rem",
            transform: "translateX(-50%)",
            background: "linear-gradient(180deg, #f7d08b 0%, #bd8240 100%)",
            border: "3px solid #1c1c17",
            clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
          }}
        />

        <div
          className="relative overflow-hidden"
          style={{
            height: "6.4rem",
            border: "3px solid #1c1c17",
            borderRadius: "1.35rem 1.35rem 1rem 1rem",
            background: "linear-gradient(180deg, #fff9ea 0%, #f1d7a1 55%, #d0a160 100%)",
            boxShadow: "0 16px 24px rgba(0,0,0,0.18)",
          }}
        >
          <div className="absolute inset-x-3 top-2 h-2 rounded-full bg-white/50" />
          <div
            className="absolute left-1/2 flex items-center justify-center rounded-full"
            style={{
              top: "0.65rem",
              width: "3.8rem",
              height: "1.6rem",
              transform: "translateX(-50%)",
              border: "2px solid #1c1c17",
              background: "#fff8e4",
            }}
          >
            <span
              className="material-symbols-outlined text-primary-container"
              style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}
            >
              museum
            </span>
          </div>
          <p
            className="absolute left-1/2 text-[8px] font-black uppercase tracking-[0.22em] text-[#7a5327]"
            style={{ top: "2.55rem", transform: "translateX(-50%)" }}
          >
            Museum
          </p>

          <div
            className="absolute rounded-md border-[2px] border-on-surface bg-[#df6f37]"
            style={{ left: "0.4rem", top: "1.9rem", width: "0.65rem", height: "1.4rem" }}
          />
          <div
            className="absolute rounded-md border-[2px] border-on-surface bg-[#df6f37]"
            style={{ right: "0.4rem", top: "1.9rem", width: "0.65rem", height: "1.4rem" }}
          />

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="absolute bottom-0 bg-[#fef3d1]"
              style={{
                left: `${1.2 + index * 1.65}rem`,
                width: "0.7rem",
                height: "3.15rem",
                borderLeft: "2px solid rgba(28,28,23,0.4)",
                borderRight: "2px solid rgba(28,28,23,0.4)",
              }}
            />
          ))}

          <div
            className="absolute left-1/2"
            style={{
              bottom: "0",
              width: "3.2rem",
              height: "3.35rem",
              transform: "translateX(-50%)",
              border: "3px solid #1c1c17",
              borderBottom: "0",
              borderRadius: "1rem 1rem 0 0",
              background: "#2b1307",
            }}
          />
          <div
            className="absolute left-1/2 overflow-hidden"
            style={{
              bottom: "0.15rem",
              width: "2.65rem",
              height: "2.85rem",
              transform: "translateX(-50%)",
              borderRadius: "0.85rem 0.85rem 0 0",
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(255,247,212,0.72) 0%, rgba(243,210,126,0.32) 100%)" }}
            />
            <motion.div
              className="absolute left-0 top-0 h-full w-1/2 border-r border-[#321607]"
              animate={isArriving ? { x: -8, scaleX: 0.72 } : { x: 0, scaleX: 1 }}
              transition={isArriving ? { duration: 0.24, ease: "easeOut" } : { duration: 0.22, ease: "easeOut" }}
              transformTemplate={({ x, scaleX }) => `translateX(${x ?? 0}px) scaleX(${scaleX ?? 1})`}
              style={{ transformOrigin: "left center", background: "linear-gradient(180deg, #7f4117 0%, #4a220c 100%)" }}
            />
            <motion.div
              className="absolute right-0 top-0 h-full w-1/2"
              animate={isArriving ? { x: 8, scaleX: 0.72 } : { x: 0, scaleX: 1 }}
              transition={isArriving ? { duration: 0.24, ease: "easeOut" } : { duration: 0.22, ease: "easeOut" }}
              transformTemplate={({ x, scaleX }) => `translateX(${x ?? 0}px) scaleX(${scaleX ?? 1})`}
              style={{ transformOrigin: "right center", background: "linear-gradient(180deg, #7f4117 0%, #4a220c 100%)" }}
            />
          </div>
          <div className="absolute bottom-0 h-3 w-full bg-[#d3b27e]" />
        </div>
        <div
          className="mx-auto flex items-center justify-center gap-1 rounded-b-2xl border-x-[3px] border-b-[3px] border-on-surface bg-[#f3e2bb]"
          style={{ width: "6.9rem", height: "1rem" }}
        >
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
      className="absolute inset-0 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#08131d]/12 to-[#061019]/42" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 38%, rgba(255,220,136,0.22) 0%, rgba(255,220,136,0) 34%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[44%] bg-gradient-to-t from-[#061019]/18 to-transparent" />

      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-40 rotate-45 rounded-[6px] bg-white/80"
          style={{
            left: `${14 + i * 11}%`,
            top: `${18 + (i % 3) * 10}%`,
            width: `${8 + (i % 2) * 4}px`,
            height: `${8 + (i % 2) * 4}px`,
            boxShadow: "0 0 18px rgba(255,229,164,0.65)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.15, 0.2], opacity: [0, 1, 0], y: [0, -26] }}
          transition={{ delay: i * 0.1, duration: 1.3, repeat: Infinity, repeatDelay: 1.2 }}
        />
      ))}

      <motion.div
        className="absolute inset-x-3 bottom-3 overflow-hidden rounded-[2rem] border-[3px] border-on-surface bg-[#fff8e8]/95 sticker-shadow"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
        initial={{ y: 42, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 240, damping: 22 }}
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#ffd171]/35 blur-3xl" />

        <div className="relative px-5 pt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border-[2px] border-on-surface bg-white/80 px-3 py-1">
              <span className="material-symbols-outlined text-secondary-container" style={{ fontSize: "18px" }}>
                auto_awesome
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface">Gesichert</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-on-surface-variant">Museumseintrag</p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-[4.5rem] w-[4.5rem] flex-shrink-0 items-center justify-center rounded-[1.4rem] border-[3px] border-on-surface bg-white/82">
              <img src={dinoImage} alt="" className="h-14 w-14 object-contain drop-shadow-md" />
            </div>

            <div className="relative flex flex-1 items-center">
              <div className="h-[4px] flex-1 rounded-full bg-gradient-to-r from-[#78a36d] via-[#dba95b] to-[#7ea36d]" />
              <motion.div
                className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-[2px] border-on-surface bg-white"
                animate={{ x: ["0%", "92%"] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <div className="flex h-[4rem] w-[4rem] flex-shrink-0 items-center justify-center rounded-[1.15rem] border-[3px] border-on-surface bg-[#fff2cf]">
              <span
                className="material-symbols-outlined text-primary-container"
                style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}
              >
                museum
              </span>
            </div>
          </div>

          <p className="mt-5 text-[2rem] font-black uppercase leading-[0.9] text-on-surface">
            {dinoName}
            <br />
            im Museum
          </p>
          <p className="mt-3 text-sm font-semibold leading-snug text-on-surface-variant">
            Dein Fund ist jetzt sauber archiviert und wartet in deiner Sammlung auf den nächsten Besuch.
          </p>

          <div className="mt-4 rounded-[1.35rem] border-[2px] border-on-surface/15 bg-white/65 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">Neuer Eintrag</p>
            <p className="mt-1 text-sm font-semibold text-on-surface">
              Abgelegt in der Vitrine und bereit fur deine Sammlung.
            </p>
          </div>

          <motion.button
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-on-surface bg-white py-3 text-sm font-black uppercase tracking-wider text-primary-container sticker-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, type: "spring" }}
            whileTap={{ scale: 0.97 }}
            onClick={onComplete}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>check</span>
            Weiter geht's!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
