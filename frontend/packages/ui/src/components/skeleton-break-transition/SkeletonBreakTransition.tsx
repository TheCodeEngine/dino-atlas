import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useHaptics } from "../../hooks/useHaptics";

export type BreakTransitionPhase =
  | "skeleton"
  | "falling"
  | "crash"
  | "reveal"
  | "prompt";

export interface SkeletonBreakTransitionProps {
  skeletonImageUrl: string;
  dinoName: string;
  onComplete: () => void;
  /** Start at a specific phase (for Storybook). Skips auto-advance when set. */
  initialPhase?: BreakTransitionPhase;
}

const GRID = { cols: 3, rows: 3 };
const TOTAL = GRID.cols * GRID.rows;

const SCATTER: { x: number; y: number; rotate: number }[] = [
  { x: -90, y: -70, rotate: -22 },
  { x: 15, y: -100, rotate: 18 },
  { x: 100, y: -50, rotate: -8 },
  { x: -110, y: 10, rotate: 14 },
  { x: 5, y: 20, rotate: -30 },
  { x: 95, y: -10, rotate: 25 },
  { x: -80, y: 90, rotate: -16 },
  { x: 20, y: 110, rotate: 10 },
  { x: 105, y: 80, rotate: -20 },
];

// Pre-computed dust puffs — use large soft radial gradients instead of blur filter
const DUST_PUFFS = [
  { size: 200, color: "rgba(200,169,106,0.5)", delay: 0, x: -30, y: 10 },
  { size: 160, color: "rgba(160,128,80,0.45)", delay: 0.04, x: 40, y: -20 },
  { size: 240, color: "rgba(212,184,150,0.4)", delay: 0.08, x: 0, y: 0 },
  { size: 130, color: "rgba(184,152,96,0.45)", delay: 0.06, x: -60, y: -30 },
  { size: 180, color: "rgba(200,169,106,0.4)", delay: 0.1, x: 50, y: 20 },
];

// Pre-computed debris positions — no Math.random() in render
const DEBRIS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2;
  const dist = 80 + (((i * 37) % 17) / 17) * 60; // deterministic pseudo-random
  return {
    angle,
    dist,
    tx: Math.cos(angle) * dist,
    ty: Math.sin(angle) * dist - 30,
    color: i % 2 === 0 ? "#c8a96a" : "#8b6914",
  };
});

// Pre-computed piece grid positions
const PIECE_LAYOUT = Array.from({ length: TOTAL }, (_, i) => {
  const row = Math.floor(i / GRID.cols);
  const col = i % GRID.cols;
  const w = 100 / GRID.cols;
  const h = 100 / GRID.rows;
  return {
    left: `${col * w}%`,
    top: `${row * h}%`,
    width: `${w}%`,
    height: `${h}%`,
    bgSize: `${GRID.cols * 100}% ${GRID.rows * 100}%`,
    bgPos: `${col * (100 / (GRID.cols - 1))}% ${row * (100 / (GRID.rows - 1))}%`,
  };
});

export function SkeletonBreakTransition({
  skeletonImageUrl,
  dinoName,
  onComplete,
  initialPhase,
}: SkeletonBreakTransitionProps) {
  const [phase, setPhase] = useState<BreakTransitionPhase>(initialPhase ?? "skeleton");
  const [imageLoaded, setImageLoaded] = useState(false);
  const haptics = useHaptics();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!imageLoaded || initialPhase || startedRef.current) return;
    startedRef.current = true;
    setTimeout(() => { setPhase("falling"); haptics.tap(); }, 800);
    setTimeout(() => { setPhase("crash"); haptics.success(); }, 1400);
    setTimeout(() => setPhase("reveal"), 2600);
    setTimeout(() => setPhase("prompt"), 3600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageLoaded]);

  // Memoize derived booleans to avoid object churn
  const vis = useMemo(() => ({
    skeleton: phase === "skeleton" || phase === "falling",
    dust: phase === "crash" || phase === "reveal",
    pieces: phase === "crash" || phase === "reveal" || phase === "prompt",
    text: phase === "reveal" || phase === "prompt",
    button: phase === "prompt",
  }), [phase]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#2C1A0E", contain: "layout style paint" }}
    >
      {/* Preload image */}
      <img
        src={skeletonImageUrl}
        alt=""
        className="hidden"
        onLoad={() => setImageLoaded(true)}
      />

      {/* Screen-shake wrapper — GPU-promoted */}
      <motion.div
        className="relative flex flex-col items-center justify-center w-full h-full"
        style={{ willChange: "transform" }}
        animate={
          phase === "crash"
            ? { x: [0, -10, 10, -6, 6, -3, 0], y: [0, 5, -5, 3, -2, 0] }
            : { x: 0, y: 0 }
        }
        transition={phase === "crash" ? { duration: 0.5 } : { duration: 0 }}
      >
        {/* Full skeleton image */}
        <AnimatePresence>
          {vis.skeleton && (
            <motion.div
              className="absolute"
              style={{
                width: "min(300px, 75vw)",
                aspectRatio: "1",
                willChange: "transform, opacity",
              }}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={
                phase === "falling"
                  ? { y: 350, rotate: 14, opacity: 1, scale: 1 }
                  : { opacity: 1, scale: 1, y: 0, rotate: 0 }
              }
              exit={{ opacity: 0 }}
              transition={
                phase === "falling"
                  ? { duration: 0.6, ease: [0.55, 0, 1, 0.45] }
                  : { duration: 0.4 }
              }
            >
              <img
                src={skeletonImageUrl}
                alt={`${dinoName} Skelett`}
                className="w-full h-full object-contain"
                draggable={false}
              />
              {/* Glow — static opacity pulse via CSS, not motion */}
              {phase === "skeleton" && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse"
                  style={{
                    background: "radial-gradient(circle at center, rgba(255,220,100,0.25) 0%, transparent 70%)",
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dust cloud — fades out smoothly in reveal phase */}
        <AnimatePresence>
          {vis.dust && (
            <motion.div
              className="absolute pointer-events-none"
              style={{ top: "55%", willChange: "transform, opacity" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {DUST_PUFFS.map((puff, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: puff.size,
                    height: puff.size,
                    left: puff.x - puff.size / 2,
                    top: puff.y - puff.size / 2,
                    background: `radial-gradient(circle, ${puff.color} 0%, transparent 60%)`,
                    willChange: "transform, opacity",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 2.5, 3.5], opacity: [0, 0.85, 0] }}
                  transition={{ duration: 1.1, delay: puff.delay, ease: "easeOut" }}
                />
              ))}

              {/* Debris particles */}
              {DEBRIS.map((d, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ left: 0, top: 0, background: d.color, willChange: "transform, opacity" }}
                  initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                  animate={{
                    x: d.tx,
                    y: d.ty,
                    scale: [0, 1.5, 0],
                    opacity: [1, 0.8, 0],
                  }}
                  transition={{ duration: 0.8, delay: 0.05, ease: "easeOut" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scattered puzzle pieces — all rendered once, persist through phases */}
        {vis.pieces && (
          <div
            className="absolute"
            style={{ width: "min(300px, 75vw)", aspectRatio: "1" }}
          >
            {PIECE_LAYOUT.map((layout, i) => (
              <motion.div
                key={i}
                className="absolute rounded-md overflow-hidden border-2 border-[#5a3a1a]/60"
                style={{
                  width: layout.width,
                  height: layout.height,
                  left: layout.left,
                  top: layout.top,
                  willChange: "transform, opacity",
                }}
                initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 }}
                animate={{
                  opacity: 1,
                  x: SCATTER[i]!.x,
                  y: SCATTER[i]!.y,
                  rotate: SCATTER[i]!.rotate,
                  scale: 0.85,
                }}
                transition={{ duration: 0.6, delay: i * 0.03, ease: "easeOut" }}
              >
                <div
                  className="w-full h-full rounded"
                  style={{
                    backgroundImage: `url(${skeletonImageUrl})`,
                    backgroundSize: layout.bgSize,
                    backgroundPosition: layout.bgPos,
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* "Ohhhh neinnn!!" text */}
        <AnimatePresence>
          {vis.text && (
            <motion.div
              className="absolute z-20 flex flex-col items-center gap-1"
              style={{ top: "18%" }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: [0.4, 1.12, 1] }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 8, stiffness: 200 }}
            >
              <motion.p
                className="text-4xl md:text-5xl font-black text-white"
                style={{
                  textShadow: "0 4px 0 rgba(120,50,0,0.5), 0 0 30px rgba(255,180,60,0.4)",
                  willChange: "transform",
                }}
                animate={{ rotate: [-3, 3, -1.5, 0] }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Ohhhh neinnn!!
              </motion.p>
              <motion.p
                className="text-base font-bold text-[#ffc850]/90"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Das Skelett ist zerbrochen!
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompt + CTA */}
        <AnimatePresence>
          {vis.button && (
            <motion.div
              className="absolute z-20 flex flex-col items-center gap-3"
              style={{ bottom: "12%" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <p className="text-sm font-bold text-white/80 text-center px-8">
                Schnell! Setz das Skelett wieder zusammen!
              </p>
              <motion.button
                onClick={() => { haptics.tap(); onComplete(); }}
                className="px-8 py-3 bg-[#1B5E20] text-white border-[3px] border-on-surface rounded-xl sticker-shadow font-bold uppercase tracking-wider text-sm flex items-center gap-2"
                whileTap={{ scale: 0.93 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  arrow_forward
                </span>
                Los geht's!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
