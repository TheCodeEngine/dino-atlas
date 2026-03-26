import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { FullscreenHeader } from "../components/FullscreenHeader";
import { Icon } from "../primitives/Icon";
import { useHaptics } from "../hooks/useHaptics";

export interface PuzzleScreenProps {
  skeletonImageUrl?: string;
  comicImageUrl?: string;
  playerEmoji?: string;
  onComplete?: (timeMs: number) => void;
  onClose?: () => void;
}

const GRID = { cols: 3, rows: 3 };
const TOTAL = GRID.cols * GRID.rows;
const DEFAULT_IMAGE = "/dinos/triceratops/skeleton.png";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function PieceTile({ piece, size, imageUrl }: { piece: number; size: number; imageUrl: string }) {
  const row = Math.floor(piece / GRID.cols);
  const col = piece % GRID.cols;
  return (
    <div
      className="w-full h-full rounded"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${GRID.cols * 100}% ${GRID.rows * 100}%`,
        backgroundPosition: `${col * (100 / (GRID.cols - 1))}% ${row * (100 / (GRID.rows - 1))}%`,
      }}
    />
  );
}

function DraggablePiece({ piece, size, imageUrl }: { piece: number; size: number; imageUrl: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `piece-${piece}` });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`rounded-lg overflow-hidden border-[3px] border-[#5a3a1a] touch-none ${isDragging ? "opacity-30" : ""}`}
      style={{ width: size, height: size }}
    >
      <PieceTile piece={piece} size={size} imageUrl={imageUrl} />
    </div>
  );
}

function DroppableSlot({ position, piece, size, imageUrl }: { position: number; piece: number | null; size: number; imageUrl: string }) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${position}` });
  const isCorrect = piece === position;
  return (
    <div
      ref={setNodeRef}
      className={`aspect-square overflow-hidden ${
        piece !== null ? (isCorrect ? "border border-[#84c75d]/60" : "") :
        isOver ? "bg-[#ffc850]/20 border border-[#ffc850]/60" :
        "bg-[#3a2510] border border-[#5a3a1a]/30"
      }`}
    >
      {piece !== null ? (
        <PieceTile piece={piece} size={size} imageUrl={imageUrl} />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white/10 text-xs font-black">{position + 1}</span>
        </div>
      )}
    </div>
  );
}

export function PuzzleScreen({
  skeletonImageUrl = DEFAULT_IMAGE,
  comicImageUrl = "/dinos/triceratops/comic.png",
  playerEmoji = "🦖",
  onComplete,
  onClose,
}: PuzzleScreenProps = {}) {
  const imageUrl = skeletonImageUrl;
  const [board, setBoard] = useState<(number | null)[]>(() => Array(TOTAL).fill(null));
  const [tray, setTray] = useState<number[]>(() => shuffle(Array.from({ length: TOTAL }, (_, i) => i)));
  const [activePiece, setActivePiece] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const haptics = useHaptics();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  const placedCount = board.filter((v) => v !== null).length;
  const pieceSize = 72;

  function handleDragStart(event: DragStartEvent) {
    const pieceId = Number(String(event.active.id).replace("piece-", ""));
    setActivePiece(pieceId);
    haptics.tap();
  }

  function handleDragEnd(event: DragEndEvent) {
    setActivePiece(null);
    const { active, over } = event;
    if (!over) return;

    const piece = Number(String(active.id).replace("piece-", ""));
    const slot = Number(String(over.id).replace("slot-", ""));

    if (board[slot] !== null) return;

    if (piece === slot) {
      // Correct position
      haptics.success();
      const newBoard = [...board];
      newBoard[slot] = piece;
      const newTray = tray.filter((p) => p !== piece);
      setBoard(newBoard);
      setTray(newTray);

      if (newTray.length === 0) {
        setTimeout(() => setComplete(true), 500);
      }
    } else {
      haptics.error();
    }
  }

  return (
    <div className="bg-[#2C1A0E] text-white min-h-screen flex flex-col" style={{ backgroundImage: "none" }}>
      <FullscreenHeader title="Skelett-Puzzle" playerEmoji={playerEmoji} variant="dark" onClose={onClose} />

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

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Board */}
        <div className="mx-4 mb-3 relative">
          <div
            className="grid gap-0.5 rounded-xl overflow-hidden border-2 border-[#5a3a1a]"
            style={{ gridTemplateColumns: `repeat(${GRID.cols}, 1fr)` }}
          >
            {Array.from({ length: TOTAL }).map((_, pos) => (
              <DroppableSlot key={pos} position={pos} piece={board[pos] ?? null} size={pieceSize} imageUrl={imageUrl} />
            ))}
          </div>

          {/* Completion */}
          <AnimatePresence>
            {complete && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#2C1A0E]/60 backdrop-blur-sm rounded-xl z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.img
                  src={comicImageUrl}
                  alt="Dino"
                  className="w-32 h-32 object-contain drop-shadow-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
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
              <Icon name="face" size="sm" filled className="text-primary" />
            </div>
            <p className="text-[11px] font-bold text-white/70">
              {complete ? "Wow! Das Skelett ist komplett!" : "Ziehe die Teile an die richtige Stelle!"}
            </p>
          </div>
        </div>

        {/* Tray */}
        {!complete && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap justify-center gap-1.5">
              {tray.map((piece) => (
                <DraggablePiece key={piece} piece={piece} size={pieceSize} imageUrl={imageUrl} />
              ))}
            </div>
          </div>
        )}

        {/* Drag overlay */}
        <DragOverlay>
          {activePiece !== null && (
            <div className="rounded-lg overflow-hidden border-[3px] border-[#ffc850] shadow-xl" style={{ width: pieceSize, height: pieceSize }}>
              <PieceTile piece={activePiece} size={pieceSize} imageUrl={imageUrl} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {complete && (
        <motion.div className="px-4 pb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <button onClick={() => onComplete?.(0)} className="w-full py-3 bg-[#1B5E20] text-white border-[3px] border-on-surface rounded-lg sticker-shadow font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-1.5 active-press">
            <Icon name="arrow_forward" size="md" />
            Welcher Dino ist das?
          </button>
        </motion.div>
      )}
    </div>
  );
}
