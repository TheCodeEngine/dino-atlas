import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { useHaptics } from "../../../../packages/ui/src/hooks/useHaptics";

/**
 * Skelett-Puzzle
 * - Skelett in 6 Teile aufgeteilt
 * - Teile liegen unten durcheinander
 * - Antippen → Teil fliegt an die richtige Stelle
 * - Alle platziert → Skelett erwacht zum Leben
 */

const PIECES = [
  { id: "skull", label: "Schädel", emoji: "💀", targetX: "25%", targetY: "15%", width: "35%", height: "25%" },
  { id: "spine", label: "Wirbelsäule", emoji: "🦴", targetX: "45%", targetY: "30%", width: "40%", height: "15%" },
  { id: "ribs", label: "Rippen", emoji: "🦴", targetX: "40%", targetY: "45%", width: "30%", height: "20%" },
  { id: "frontlegs", label: "Vorderbeine", emoji: "🦵", targetX: "25%", targetY: "65%", width: "20%", height: "25%" },
  { id: "backlegs", label: "Hinterbeine", emoji: "🦵", targetX: "60%", targetY: "65%", width: "20%", height: "25%" },
  { id: "tail", label: "Schwanz", emoji: "🦴", targetX: "75%", targetY: "35%", width: "25%", height: "20%" },
];

const HINTS = [
  "Fang mit dem Kopf an! Der hat drei Hörner.",
  "Super! Jetzt die Wirbelsäule — das ist das Rückgrat!",
  "Weiter so! Die Rippen schützen das Herz.",
  "Toll! Jetzt die Vorderbeine.",
  "Fast geschafft! Noch die Hinterbeine!",
  "Letztes Teil — der Schwanz!",
];

export function PuzzleScreen() {
  const [placed, setPlaced] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const haptics = useHaptics();

  function handlePlace(id: string) {
    if (placed.includes(id) || complete) return;
    haptics.tap();
    const next = [...placed, id];
    setPlaced(next);
    if (next.length === PIECES.length) {
      setTimeout(() => { setComplete(true); haptics.success(); }, 600);
    }
  }

  const remaining = PIECES.filter((p) => !placed.includes(p.id));
  const hint = HINTS[Math.min(placed.length, HINTS.length - 1)]!;

  return (
    <div className="bg-[#2C1A0E] text-white min-h-screen flex flex-col" style={{ backgroundImage: "none" }}>
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3">
        <button className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-lg active-press">
          <span className="material-symbols-outlined text-white text-lg">close</span>
        </button>
        <p className="text-[10px] font-black uppercase tracking-wider text-[#ffc850]/80">Oskar's Expedition</p>
        <div className="w-9 h-9 rounded-full border-[3px] border-[#ffc850]/50 bg-[#ffc850]/20 flex items-center justify-center text-base">🦖</div>
      </header>

      {/* Progress */}
      <div className="px-4 mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#ffc850]">
            {placed.length} von {PIECES.length} Teilen
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#84c75d] to-[#ffc850] rounded-full"
            animate={{ width: `${(placed.length / PIECES.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Puzzle area */}
      <div className="flex-1 mx-4 mb-2 relative rounded-xl border-2 border-[#5a3a1a] overflow-hidden bg-[#3a2510]">
        {/* Skeleton outline as guide */}
        <img
          src="/dinos/triceratops/skeleton.png"
          alt="Umriss"
          className="absolute inset-0 w-full h-full object-contain opacity-15 p-4"
        />

        {/* Placed pieces */}
        <AnimatePresence>
          {placed.map((id) => {
            const piece = PIECES.find((p) => p.id === id)!;
            return (
              <motion.div
                key={id}
                className="absolute bg-[#ffc850]/20 border-2 border-[#ffc850]/40 rounded-lg flex items-center justify-center"
                style={{ left: piece.targetX, top: piece.targetY, width: piece.width, height: piece.height }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <div className="text-center">
                  <span className="text-2xl">{piece.emoji}</span>
                  <p className="text-[8px] font-black text-[#ffc850]/60 uppercase">{piece.label}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Completion animation */}
        {complete && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#2C1A0E]/80 backdrop-blur-sm z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.img
              src="/dinos/triceratops/skeleton.png"
              alt="Skelett"
              className="w-3/4 object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1.05, 1.1] }}
              transition={{ duration: 2, times: [0, 0.3, 0.7, 1] }}
            />
            <motion.img
              src="/dinos/triceratops/comic.png"
              alt="Triceratops"
              className="w-1/2 object-contain absolute"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: "spring", damping: 10 }}
            />
            <motion.p
              className="text-xl font-black uppercase text-[#ffc850] mt-4 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              🎉 Geschafft! 🎉
            </motion.p>
          </motion.div>
        )}
      </div>

      {/* Forscher hint */}
      <div className="px-4 mb-2">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
          <div className="w-7 h-7 bg-primary-fixed rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
          </div>
          <p className="text-[11px] font-bold text-white/70">{complete ? "Wow! Das Skelett erwacht zum Leben!" : hint}</p>
        </div>
      </div>

      {/* Bone pieces to place */}
      {!complete && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap justify-center gap-2">
            {remaining.map((piece, i) => (
              <motion.button
                key={piece.id}
                onClick={() => handlePlace(piece.id)}
                className="flex flex-col items-center gap-0.5 px-3 py-2 bg-[#5a3a1a] border-2 border-[#ffc850]/30 rounded-lg active:scale-90 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileTap={{ scale: 0.85 }}
              >
                <span className="text-xl">{piece.emoji}</span>
                <span className="text-[8px] font-black text-[#ffc850]/60 uppercase">{piece.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Continue button after completion */}
      {complete && (
        <motion.div
          className="px-4 pb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
        >
          <button className="w-full py-3 bg-[#1B5E20] text-white border-[3px] border-on-surface rounded-lg sticker-shadow font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-1.5 active-press">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
            Welcher Dino ist das?
          </button>
        </motion.div>
      )}
    </div>
  );
}
