import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useHaptics } from "../../../../packages/ui/src/hooks/useHaptics";

/**
 * Bild-Puzzle: Skelett wird in Kacheln geschnitten, shuffled, Kind tippt
 * auf ein Teil und dann auf die Zielposition um es zu platzieren.
 */

const GRID = { cols: 3, rows: 3 };
const TOTAL = GRID.cols * GRID.rows;
const IMAGE = "/dinos/triceratops/skeleton.png";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const HINTS = [
  "Tippe auf ein Teil, dann auf die richtige Stelle!",
  "Super! Weiter so!",
  "Du bist richtig gut darin!",
  "Fast geschafft!",
  "Noch ein paar Teile!",
  "Gleich hast du es!",
];

export function PuzzleScreen() {
  // Board: index = position, value = which piece is there (null = empty)
  const [board, setBoard] = useState<(number | null)[]>(() => Array(TOTAL).fill(null));
  // Tray: shuffled pieces not yet placed
  const [tray, setTray] = useState<number[]>(() => shuffle(Array.from({ length: TOTAL }, (_, i) => i)));
  // Selected piece from tray
  const [selected, setSelected] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const haptics = useHaptics();

  const placedCount = board.filter((v) => v !== null).length;
  const hint = HINTS[Math.min(Math.floor(placedCount / 2), HINTS.length - 1)]!;

  function handleTrayTap(piece: number) {
    if (complete) return;
    haptics.tap();
    setSelected(piece === selected ? null : piece);
  }

  function handleBoardTap(position: number) {
    if (complete || selected === null) return;
    if (board[position] !== null) return; // already filled

    // Place piece
    haptics.tap();
    const newBoard = [...board];
    newBoard[position] = selected;

    // Remove from tray
    const newTray = tray.filter((p) => p !== selected);
    setBoard(newBoard);
    setTray(newTray);
    setSelected(null);

    // Check if correct position (piece index matches board position)
    if (selected !== position) {
      // Wrong position — shake and return to tray after delay
      haptics.error();
      setTimeout(() => {
        setBoard((b) => { const nb = [...b]; nb[position] = null; return nb; });
        setTray((t) => [...t, selected]);
      }, 600);
    } else {
      // Correct!
      haptics.success();
      if (newTray.length === 0) {
        setTimeout(() => setComplete(true), 500);
      }
    }
  }

  return (
    <div className="bg-[#2C1A0E] text-white min-h-screen flex flex-col" style={{ backgroundImage: "none" }}>
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3">
        <button className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-lg">
          <span className="material-symbols-outlined text-white text-lg">close</span>
        </button>
        <p className="text-[10px] font-black uppercase tracking-wider text-[#ffc850]/80">Skelett-Puzzle</p>
        <div className="w-9 h-9 rounded-full border-[3px] border-[#ffc850]/50 bg-[#ffc850]/20 flex items-center justify-center text-base">🦖</div>
      </header>

      {/* Progress */}
      <div className="px-4 mb-2">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#84c75d] to-[#ffc850] rounded-full"
            animate={{ width: `${(placedCount / TOTAL) * 100}%` }}
          />
        </div>
        <p className="text-[9px] font-bold text-white/40 mt-1 text-center">{placedCount} von {TOTAL}</p>
      </div>

      {/* Puzzle board */}
      <div className="mx-4 mb-3 relative">
        <div
          className="grid gap-1 rounded-xl overflow-hidden border-2 border-[#5a3a1a]"
          style={{ gridTemplateColumns: `repeat(${GRID.cols}, 1fr)`, aspectRatio: "1" }}
        >
          {Array.from({ length: TOTAL }).map((_, pos) => {
            const piece = board[pos];
            const isCorrect = piece === pos;
            const row = Math.floor(pos / GRID.cols);
            const col = pos % GRID.cols;

            return (
              <motion.button
                key={pos}
                onClick={() => handleBoardTap(pos)}
                className={`relative aspect-square overflow-hidden ${
                  piece !== null ? "" : "bg-[#3a2510] border border-[#5a3a1a]/50"
                } ${selected !== null && piece === null ? "ring-2 ring-[#ffc850]/60" : ""}`}
                animate={piece !== null && !isCorrect ? { x: [0, -4, 4, -2, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                {piece !== null ? (
                  // Show the piece image (clipped to its original position)
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${IMAGE})`,
                      backgroundSize: `${GRID.cols * 100}% ${GRID.rows * 100}%`,
                      backgroundPosition: `${(piece % GRID.cols) * (100 / (GRID.cols - 1))}% ${Math.floor(piece / GRID.cols) * (100 / (GRID.rows - 1))}%`,
                    }}
                  />
                ) : (
                  // Empty slot — show faint grid number
                  <span className="text-white/10 text-lg font-black">{pos + 1}</span>
                )}
                {/* Correct indicator */}
                {isCorrect && (
                  <div className="absolute inset-0 border-2 border-[#84c75d]/60 rounded-sm" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Completion overlay */}
        <AnimatePresence>
          {complete && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#2C1A0E]/60 backdrop-blur-sm rounded-xl z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.img
                src="/dinos/triceratops/comic.png"
                alt="Triceratops"
                className="w-32 h-32 object-contain drop-shadow-xl"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, delay: 0.3 }}
              />
              <motion.p
                className="text-xl font-black uppercase text-[#ffc850] mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                🎉 Geschafft!
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hint */}
      <div className="px-4 mb-2">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
          <div className="w-7 h-7 bg-primary-fixed rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
          </div>
          <p className="text-[11px] font-bold text-white/70">
            {complete ? "Wow! Das Skelett ist komplett!" : selected !== null ? "Jetzt tippe auf die richtige Stelle!" : hint}
          </p>
        </div>
      </div>

      {/* Tray — pieces to place */}
      {!complete && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap justify-center gap-1.5">
            {tray.map((piece) => {
              const row = Math.floor(piece / GRID.cols);
              const col = piece % GRID.cols;
              const isSelected = selected === piece;

              return (
                <motion.button
                  key={piece}
                  onClick={() => handleTrayTap(piece)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-[3px] transition-all ${
                    isSelected ? "border-[#ffc850] shadow-[0_0_12px_rgba(255,200,80,0.5)] scale-110" : "border-[#5a3a1a] active:scale-95"
                  }`}
                  layout
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${IMAGE})`,
                      backgroundSize: `${GRID.cols * 100}% ${GRID.rows * 100}%`,
                      backgroundPosition: `${col * (100 / (GRID.cols - 1))}% ${row * (100 / (GRID.rows - 1))}%`,
                    }}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Continue */}
      {complete && (
        <motion.div
          className="px-4 pb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
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
