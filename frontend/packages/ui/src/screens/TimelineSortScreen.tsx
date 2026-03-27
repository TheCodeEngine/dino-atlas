import { useState, useMemo } from "react";
import { motion } from "motion/react";
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
import { MinigameShell } from "../components/MinigameShell";
import { Icon } from "../primitives/Icon";
import { useHaptics } from "../hooks/useHaptics";
import type { MinigameDino } from "../types/minigame";

const PERIODS = [
  { id: "trias", label: "Trias", emoji: "🌋", color: "bg-[#e8604c]/15 border-[#e8604c]/30", years: "252–201 Mio." },
  { id: "jura", label: "Jura", emoji: "🌿", color: "bg-[#5ba67a]/15 border-[#5ba67a]/30", years: "201–145 Mio." },
  { id: "kreide", label: "Kreide", emoji: "☄️", color: "bg-[#7ab648]/15 border-[#7ab648]/30", years: "145–66 Mio." },
];

interface TLDino { id: string; name: string; image: string; period: string }

const FALLBACK: TLDino[] = [
  { id: "tricera", name: "Triceratops", image: "", period: "kreide" },
  { id: "stego", name: "Stegosaurus", image: "", period: "jura" },
  { id: "trex", name: "T-Rex", image: "", period: "kreide" },
  { id: "brachio", name: "Brachiosaurus", image: "", period: "jura" },
];

function mapPeriod(p: string): string {
  const lower = p.toLowerCase();
  if (lower.includes("trias")) return "trias";
  if (lower.includes("jura")) return "jura";
  if (lower.includes("kreide") || lower.includes("cretaceous")) return "kreide";
  return "jura";
}

function DraggableDino({ dino }: { dino: TLDino }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: dino.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-[3px] border-on-surface bg-surface-container-lowest sticker-shadow touch-none ${isDragging ? "opacity-30" : ""}`}
    >
      {dino.image ? (
        <img src={dino.image} alt={dino.name} className="w-14 h-14 object-contain" />
      ) : (
        <span className="text-3xl w-14 h-14 flex items-center justify-center">🦕</span>
      )}
      <span className="text-[9px] font-black uppercase">{dino.name}</span>
    </div>
  );
}

function PeriodDropZone({ period, dinosHere, isOver }: { period: typeof PERIODS[0]; dinosHere: TLDino[]; isOver: boolean }) {
  const { setNodeRef } = useDroppable({ id: period.id });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-[3px] p-3 min-h-[80px] transition-all ${period.color} ${
        isOver ? "ring-2 ring-[#ffc850]/60 border-[#ffc850]" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{period.emoji}</span>
        <div>
          <p className="text-xs font-black uppercase">{period.label}</p>
          <p className="text-[9px] text-on-surface-variant">{period.years}</p>
        </div>
      </div>
      {dinosHere.length > 0 && (
        <div className="flex gap-1 mt-1">
          {dinosHere.map((d) => d.image ? (
            <motion.img key={d.id} src={d.image} alt={d.name} className="w-10 h-10 object-contain" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }} />
          ) : (
            <motion.span key={d.id} className="text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }}>🦕</motion.span>
          ))}
        </div>
      )}
    </div>
  );
}

export interface TimelineSortScreenProps { dinos?: MinigameDino[]; onComplete?: (score: number) => void; onClose?: () => void; }
export function TimelineSortScreen({ dinos: rawDinos, onComplete, onClose }: TimelineSortScreenProps = {}) {
  const gameDinos = useMemo<TLDino[]>(() => {
    const withPeriod = (rawDinos ?? []).filter((d) => d.period);
    if (withPeriod.length >= 3) {
      return withPeriod.slice(0, 6).map((d) => ({
        id: d.id,
        name: d.name,
        image: d.image_comic_url ?? "",
        period: mapPeriod(d.period),
      }));
    }
    return FALLBACK;
  }, [rawDinos]);

  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [activeDino, setActiveDino] = useState<string | null>(null);
  const [overZone, setOverZone] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const haptics = useHaptics();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  const unplaced = gameDinos.filter((d) => !assignments[d.id]);

  function handleDragStart(event: DragStartEvent) {
    setActiveDino(String(event.active.id));
    haptics.tap();
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDino(null);
    setOverZone(null);
    const { active, over } = event;
    if (!over) return;

    const dinoId = String(active.id);
    const periodId = String(over.id);
    const dino = gameDinos.find((d) => d.id === dinoId)!;

    if (dino.period === periodId) {
      haptics.success();
      const next = { ...assignments, [dinoId]: periodId };
      setAssignments(next);
      const allCorrect = gameDinos.every((d) => next[d.id] === d.period);
      if (allCorrect) setTimeout(() => { setDone(true); haptics.success(); }, 500);
    } else {
      haptics.error();
    }
  }

  return (
    <MinigameShell onClose={onClose}
      title="Zeitleiste"
      instruction="In welcher Zeit hat jeder Dino gelebt? Ziehe sie in die richtige Epoche!"
      done={done}
      doneTitle="Alle richtig!"
      donePraise="Du weißt genau wann jeder Dino gelebt hat! Klasse!"
      onFinish={() => onComplete?.(gameDinos.length)}
    >
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={(e) => setOverZone(e.over ? String(e.over.id) : null)}>
        <div className="flex flex-col gap-2 mb-4">
          {PERIODS.map((period) => (
            <PeriodDropZone key={period.id} period={period} dinosHere={gameDinos.filter((d) => assignments[d.id] === period.id)} isOver={overZone === period.id} />
          ))}
        </div>

        {unplaced.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-1">
              <Icon name="drag_indicator" size="xs" />
              Ziehe die Dinos:
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {unplaced.map((dino) => (
                <DraggableDino key={dino.id} dino={dino} />
              ))}
            </div>
          </div>
        )}

        <DragOverlay>
          {activeDino && (() => {
            const d = gameDinos.find((d) => d.id === activeDino)!;
            return (
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl border-[3px] border-[#ffc850] bg-white shadow-xl">
                {d.image ? <img src={d.image} alt={d.name} className="w-14 h-14 object-contain" /> : <span className="text-3xl">🦕</span>}
                <span className="text-[9px] font-black uppercase">{d.name}</span>
              </div>
            );
          })()}
        </DragOverlay>
      </DndContext>
    </MinigameShell>
  );
}
