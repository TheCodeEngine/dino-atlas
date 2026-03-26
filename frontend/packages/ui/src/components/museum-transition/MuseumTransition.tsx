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
            {phase !== "done" && <MuseumBuilding phase={phase} />}

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
  const isDone = phase === "done";

  return (
    <motion.div
      className="absolute z-20"
      style={{ right: "6.5%", bottom: "43%" }}
      initial={{ x: 190, y: 20, scale: 0.68, opacity: 0 }}
      animate={
        isRunning
          ? { x: [190, 0], y: [20, 0], scale: [0.68, 0.92], opacity: [0, 1] }
          : isDone
            ? { x: 0, y: -12, scale: 1.02, opacity: 1 }
            : { x: 0, y: 0, scale: 0.92, opacity: 1 }
      }
      transition={
        isRunning
          ? { duration: 2.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
          : { duration: 0.45, ease: "easeOut" }
      }
    >
      <motion.div
        className="absolute left-1/2 top-[-5.5rem] h-[7.25rem] w-8 -translate-x-1/2 rounded-full blur-xl"
        style={{ background: "linear-gradient(180deg, rgba(255,244,205,0.5) 0%, rgba(255,244,205,0) 100%)" }}
        animate={isArriving ? { opacity: [0.08, 0.72, 0.22], scaleY: [0.7, 1.2, 1] } : { opacity: 0.1, scaleY: 0.82 }}
        transition={isArriving ? { duration: 0.42, ease: "easeOut" } : { duration: 0.3, ease: "easeOut" }}
      />
      <motion.div
        className="absolute left-[26%] top-[-4.6rem] h-[6.5rem] w-5 origin-bottom rounded-full blur-xl"
        style={{ background: "linear-gradient(180deg, rgba(255,241,196,0.32) 0%, rgba(255,241,196,0) 100%)" }}
        animate={isArriving ? { opacity: [0.02, 0.42, 0.08], rotate: [-28, -17, -24] } : { opacity: 0.04, rotate: -24 }}
        transition={isArriving ? { duration: 0.56, ease: "easeOut" } : { duration: 0.3, ease: "easeOut" }}
      />
      <motion.div
        className="absolute right-[26%] top-[-4.6rem] h-[6.5rem] w-5 origin-bottom rounded-full blur-xl"
        style={{ background: "linear-gradient(180deg, rgba(255,241,196,0.32) 0%, rgba(255,241,196,0) 100%)" }}
        animate={isArriving ? { opacity: [0.02, 0.42, 0.08], rotate: [28, 17, 24] } : { opacity: 0.04, rotate: 24 }}
        transition={isArriving ? { duration: 0.56, ease: "easeOut" } : { duration: 0.3, ease: "easeOut" }}
      />
      <div className="relative" style={{ width: "10rem" }}>
        <div
          className="absolute left-1/2 top-[7.5rem] h-4 w-[8.2rem] -translate-x-1/2 rounded-full bg-black/30 blur-md"
        />
        <div
          className="absolute left-1/2 top-[-1.45rem]"
          style={{
            width: "8.8rem",
            height: "2rem",
            transform: "translateX(-50%)",
            background: "linear-gradient(180deg, #f4cd85 0%, #be8548 100%)",
            clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
            border: "3px solid #1c1c17",
          }}
        />
        <div
          className="absolute left-1/2 top-[0.05rem]"
          style={{
            width: "8rem",
            height: "0.9rem",
            transform: "translateX(-50%)",
            border: "3px solid #1c1c17",
            borderRadius: "0.45rem",
            background: "linear-gradient(180deg, #fff4d8 0%, #dcb676 100%)",
          }}
        />

        <div
          className="relative overflow-hidden"
          style={{
            height: "7.6rem",
            border: "3px solid #1c1c17",
            borderRadius: "0.8rem 0.8rem 0.45rem 0.45rem",
            background: "linear-gradient(180deg, #fff9ea 0%, #f5dfb1 58%, #ddb067 100%)",
            boxShadow: "0 18px 26px rgba(0,0,0,0.22)",
          }}
        >
          <div className="absolute inset-x-3 top-2 h-2 rounded-full bg-white/55" />
          <div
            className="absolute left-1/2 top-[0.7rem] -translate-x-1/2 rounded-full border-[2px] border-on-surface bg-[#fff8e5] px-2.5 py-1"
          >
            <span
              className="material-symbols-outlined text-primary-container"
              style={{ fontSize: "15px", fontVariationSettings: "'FILL' 1" }}
            >
              museum
            </span>
          </div>
          <p
            className="absolute left-1/2 text-[8px] font-black uppercase tracking-[0.24em] text-[#6f4a1f]"
            style={{ top: "2.35rem", transform: "translateX(-50%)" }}
          >
            Museum
          </p>

          <div className="absolute left-[0.65rem] top-[2.1rem] h-[2.2rem] w-[0.75rem] rounded-md border-[2px] border-on-surface bg-[#2f6d36]" />
          <div className="absolute right-[0.65rem] top-[2.1rem] h-[2.2rem] w-[0.75rem] rounded-md border-[2px] border-on-surface bg-[#2f6d36]" />
          <div className="absolute left-[0.88rem] top-[2.45rem] h-[0.6rem] w-[0.3rem] rounded-full bg-[#ffd66e]" />
          <div className="absolute right-[0.88rem] top-[2.45rem] h-[0.6rem] w-[0.3rem] rounded-full bg-[#ffd66e]" />

          <div className="absolute inset-x-[1.05rem] bottom-[1.25rem] flex items-end justify-between">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative flex h-[3.7rem] w-[0.95rem] items-end justify-center overflow-hidden rounded-t-[0.35rem] border-x-[2px] border-[#694c25]/55 bg-[#fff0ca]"
              >
                <div className="absolute inset-x-0 top-0 h-[0.6rem] bg-[#ebcf95]" />
              </div>
            ))}
          </div>

          <div
            className="absolute left-1/2 bottom-[1.05rem] h-[3.85rem] w-[2.8rem] -translate-x-1/2 rounded-t-[0.95rem] border-[3px] border-on-surface bg-[#2b1307]"
          />
          <div
            className="absolute left-1/2 bottom-[1.2rem] h-[3.45rem] w-[2.3rem] -translate-x-1/2 overflow-hidden rounded-t-[0.78rem]"
          >
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(255,247,212,0.68) 0%, rgba(243,210,126,0.28) 100%)" }}
            />
            <motion.div
              className="absolute left-0 top-0 h-full w-1/2 border-r border-[#321607]"
              animate={isArriving ? { x: -7, scaleX: 0.74 } : { x: 0, scaleX: 1 }}
              transition={isArriving ? { duration: 0.24, ease: "easeOut" } : { duration: 0.22, ease: "easeOut" }}
              transformTemplate={({ x, scaleX }) => `translateX(${x ?? 0}px) scaleX(${scaleX ?? 1})`}
              style={{ transformOrigin: "left center", background: "linear-gradient(180deg, #7f4117 0%, #4a220c 100%)" }}
            />
            <motion.div
              className="absolute right-0 top-0 h-full w-1/2"
              animate={isArriving ? { x: 7, scaleX: 0.74 } : { x: 0, scaleX: 1 }}
              transition={isArriving ? { duration: 0.24, ease: "easeOut" } : { duration: 0.22, ease: "easeOut" }}
              transformTemplate={({ x, scaleX }) => `translateX(${x ?? 0}px) scaleX(${scaleX ?? 1})`}
              style={{ transformOrigin: "right center", background: "linear-gradient(180deg, #7f4117 0%, #4a220c 100%)" }}
            />
          </div>

          <div className="absolute bottom-[0.85rem] left-1/2 h-[0.45rem] w-[4rem] -translate-x-1/2 rounded-full bg-[#b88a4f]/60 blur-[1px]" />
          <div className="absolute bottom-0 h-[0.9rem] w-full bg-[#d0aa70]" />
        </div>

        <div className="mx-auto h-[0.55rem] w-[8.5rem] rounded-b-[0.8rem] border-x-[3px] border-b-[3px] border-on-surface bg-[#f1d7a5]" />
        <div className="mx-auto mt-[0.15rem] h-[0.55rem] w-[7.3rem] rounded-b-[0.7rem] border-x-[3px] border-b-[3px] border-on-surface bg-[#d3ab70]" />
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
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #101d33 0%, #1b3960 24%, #3d6da1 52%, #c99b59 83%, #f3d7a0 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.16), transparent 22%), radial-gradient(circle at 80% 24%, rgba(255,214,132,0.18), transparent 24%), radial-gradient(circle at 50% 38%, rgba(255,243,202,0.14), transparent 30%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2a1907]/24" />

      <div className="absolute inset-x-0 top-0 h-[58%] overflow-hidden">
        <div
          className="absolute left-1/2 top-[6%] h-[15rem] w-[18rem] -translate-x-1/2 rounded-t-[9rem]"
          style={{
            border: "3px solid rgba(28,28,23,0.24)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)",
          }}
        />
        <div className="absolute left-[-4%] top-[17%] h-[15rem] w-[3.8rem] rounded-t-[2rem] bg-gradient-to-b from-[#1f4468] to-[#112844]" />
        <div className="absolute right-[-4%] top-[17%] h-[15rem] w-[3.8rem] rounded-t-[2rem] bg-gradient-to-b from-[#1f4468] to-[#112844]" />
        <div className="absolute left-[2%] top-[15%] h-6 w-[4.5rem] rounded-t-[0.8rem] bg-[#ecd8a7] border-[3px] border-on-surface border-b-0" />
        <div className="absolute right-[2%] top-[15%] h-6 w-[4.5rem] rounded-t-[0.8rem] bg-[#ecd8a7] border-[3px] border-on-surface border-b-0" />
        <div className="absolute left-[10%] top-[20%] h-32 w-6 rounded-full bg-[#173250]/28 blur-[2px]" />
        <div className="absolute right-[10%] top-[20%] h-32 w-6 rounded-full bg-[#173250]/28 blur-[2px]" />

        <div
          className="absolute left-[8%] top-[23%] h-[3.1rem] w-[4.4rem]"
          style={{ clipPath: "polygon(0 0, 100% 0, 82% 100%, 0 100%)", background: "linear-gradient(180deg, #f4c56e 0%, #b66f2c 100%)" }}
        />
        <div
          className="absolute right-[8%] top-[23%] h-[3.1rem] w-[4.4rem]"
          style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)", background: "linear-gradient(180deg, #f4c56e 0%, #b66f2c 100%)" }}
        />
        <div className="absolute left-[9.5%] top-[22%] text-[10px] font-black uppercase tracking-[0.18em] text-[#6b3e11]">Top Fund</div>
        <div className="absolute right-[9.5%] top-[22%] text-[10px] font-black uppercase tracking-[0.18em] text-[#6b3e11]">Museum</div>

        <motion.div
          className="absolute left-1/2 top-[12%] h-56 w-24 -translate-x-1/2 blur-2xl"
          style={{ background: "linear-gradient(180deg, rgba(255,244,207,0.75) 0%, rgba(255,244,207,0) 100%)" }}
          animate={{ opacity: [0.5, 0.86, 0.58], scaleY: [0.92, 1.08, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[31%] top-[16%] h-44 w-12 origin-top rounded-full blur-xl"
          style={{ background: "linear-gradient(180deg, rgba(255,238,193,0.38) 0%, rgba(255,238,193,0) 100%)" }}
          animate={{ rotate: [-16, -8, -14], opacity: [0.18, 0.42, 0.18] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[31%] top-[16%] h-44 w-12 origin-top rounded-full blur-xl"
          style={{ background: "linear-gradient(180deg, rgba(255,238,193,0.38) 0%, rgba(255,238,193,0) 100%)" }}
          animate={{ rotate: [16, 8, 14], opacity: [0.18, 0.42, 0.18] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute left-1/2 top-[18%] h-36 w-36 -translate-x-1/2 rounded-full bg-[#ffd77e]/32 blur-3xl" />
        <motion.div
          className="absolute left-1/2 top-[20%] flex h-[7.4rem] w-[7.4rem] -translate-x-1/2 items-center justify-center rounded-full border-[4px] border-on-surface bg-[#fff4d9]"
          animate={{ y: [0, -4, 0], boxShadow: ["0 14px 0 #1c1c17", "0 18px 0 #1c1c17", "0 14px 0 #1c1c17"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-[0.45rem] rounded-full border-[2px] border-dashed border-[#d5ad5f]" />
          <div className="absolute inset-[0.9rem] rounded-full bg-[#fffaf0]" />
          <img src={dinoImage} alt="" className="relative h-[4.3rem] w-[4.3rem] object-contain drop-shadow-md" />
        </motion.div>

        <div className="absolute left-1/2 top-[47%] flex -translate-x-1/2 items-center gap-2 rounded-full border-[2px] border-on-surface bg-white/88 px-3 py-1">
          <span className="material-symbols-outlined text-primary-container" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>
            museum
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Neue Vitrine</span>
        </div>
        <p className="absolute inset-x-0 top-[55%] text-center text-[2rem] font-black uppercase leading-[0.9] text-white" style={{ textShadow: "0 4px 0 rgba(0,0,0,0.28)" }}>
          Im Museum
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#8b6132]/48 via-[#d2a15d]/24 to-transparent" />
      <div
        className="absolute inset-x-[-6%] bottom-0 h-[18%]"
        style={{
          background: "linear-gradient(180deg, #efddb4 0%, #d9af6d 44%, #b88443 100%)",
          clipPath: "polygon(0 100%, 100% 100%, 100% 26%, 74% 18%, 50% 8%, 28% 18%, 0 26%)",
        }}
      />
      <div
        className="absolute inset-x-[12%] bottom-[16.4%] h-[1.25rem] rounded-full bg-[#6c4a27]/35 blur-[2px]"
      />

      {Array.from({ length: 7 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-40 rounded-full bg-white/75 blur-[1px]"
          style={{
            left: `${10 + i * 12}%`,
            top: `${10 + (i % 3) * 8}%`,
            width: `${5 + (i % 2) * 3}px`,
            height: `${5 + (i % 2) * 3}px`,
            boxShadow: "0 0 16px rgba(255,229,164,0.55)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.05, 0.2], opacity: [0, 0.95, 0], y: [0, -20] }}
          transition={{ delay: i * 0.1, duration: 1.2, repeat: Infinity, repeatDelay: 1.3 }}
        />
      ))}

      <motion.div
        className="absolute inset-x-3 overflow-hidden rounded-[1.85rem] border-[3px] border-on-surface bg-[#fff7e8]/97 sticker-shadow"
        style={{ top: "42%", paddingBottom: "calc(0.9rem + env(safe-area-inset-bottom, 0px))" }}
        initial={{ y: 46, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 220, damping: 24 }}
      >
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/68 to-transparent" />
        <div className="absolute -right-8 top-[-1.4rem] h-28 w-28 rounded-full bg-[#ffd171]/28 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#efcc8d]/32 to-transparent" />
        <div
          className="absolute right-[-1.2rem] top-8 h-24 w-24 rounded-full border-[2px] border-dashed border-[#dcb77a]/55"
        />

        <div className="relative px-4 pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border-[2px] border-on-surface bg-white/86 px-3 py-1">
              <span className="material-symbols-outlined text-secondary-container" style={{ fontSize: "18px" }}>
                auto_awesome
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface">Gesichert</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Museum Pass</p>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <div className="flex h-[4.15rem] w-[4.15rem] flex-shrink-0 items-center justify-center rounded-[1.35rem] border-[3px] border-on-surface bg-white/90">
              <img src={dinoImage} alt="" className="h-12 w-12 object-contain drop-shadow-md" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[1.8rem] font-black uppercase leading-[0.9] text-on-surface">
                {dinoName}
                <br />
                im Museum
              </p>
              <p className="mt-2 text-sm font-semibold leading-snug text-on-surface-variant">
                Dein Fund ist jetzt archiviert und wartet in deiner Sammlung auf den nachsten Besuch.
              </p>
            </div>

            <div className="flex h-[3.75rem] w-[3.75rem] flex-shrink-0 items-center justify-center rounded-[1.15rem] border-[3px] border-on-surface bg-[#fff1ce]">
              <span
                className="material-symbols-outlined text-primary-container"
                style={{ fontSize: "26px", fontVariationSettings: "'FILL' 1" }}
              >
                museum
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-[1.2rem] border-[2px] border-on-surface/15 bg-white/72 px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-[2px] border-on-surface bg-[#fff7df]">
                <span className="material-symbols-outlined text-primary-container" style={{ fontSize: "18px" }}>
                  inventory_2
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">Neuer Eintrag</p>
                <p className="mt-1 text-sm font-semibold leading-snug text-on-surface">
                  Abgelegt in der Vitrine und bereit fur deine Sammlung.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[2px] border-on-surface bg-white">
              <img src={dinoImage} alt="" className="h-6 w-6 object-contain" />
            </div>
            <div className="relative flex flex-1 items-center">
              <div
                className="h-[4px] flex-1 rounded-full"
                style={{ background: "linear-gradient(90deg, #7ba56f 0%, #dbaa5d 50%, #7ba56f 100%)" }}
              />
              <motion.div
                className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-[2px] border-on-surface bg-white"
                animate={{ x: ["0%", "94%"] }}
                transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[2px] border-on-surface bg-[#fff3d2]">
              <span className="material-symbols-outlined text-primary-container" style={{ fontSize: "18px" }}>
                museum
              </span>
            </div>
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
