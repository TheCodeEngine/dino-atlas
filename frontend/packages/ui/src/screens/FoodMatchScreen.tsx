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
import { useHaptics } from "../hooks/useHaptics";
import type { MinigameDino } from "../types/minigame";

interface FMDino { id: string; name: string; image: string; food: string }

const FOODS = [
  { id: "plants", emoji: "🌿", label: "Pflanzen" },
  { id: "meat", emoji: "🥩", label: "Fleisch" },
];

const FALLBACK: FMDino[] = [
  { id: "tricera", name: "Triceratops", image: "", food: "plants" },
  { id: "trex", name: "T-Rex", image: "", food: "meat" },
  { id: "brachio", name: "Brachiosaurus", image: "", food: "plants" },
  { id: "stego", name: "Stegosaurus", image: "", food: "plants" },
];

function mapDiet(diet: string): string {
  const lower = diet.toLowerCase();
  if (lower.includes("fleisch") || lower.includes("carni") || lower === "meat") return "meat";
  return "plants";
}

function DraggableDino({ dino, disabled }: { dino: FMDino; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: dino.id, disabled });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-[3px] border-on-surface bg-surface-container-lowest sticker-shadow touch-none ${
        isDragging ? "opacity-30" : ""
      } ${disabled ? "opacity-40 grayscale" : ""}`}
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

function FoodDropZone({ food, dinosHere, isOver }: { food: typeof FOODS[0]; dinosHere: FMDino[]; isOver: boolean }) {
  const { setNodeRef } = useDroppable({ id: food.id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 rounded-xl border-[3px] p-3 min-h-[120px] transition-all ${
        isOver ? "border-[#ffc850] bg-[#ffc850]/10" : "border-on-surface bg-surface-container-lowest"
      }`}
    >
      <div className="text-center mb-2">
        <span className="text-3xl">{food.emoji}</span>
        <p className="text-[10px] font-black uppercase">{food.label}</p>
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        {dinosHere.map((d) => d.image ? (
          <motion.img key={d.id} src={d.image} alt={d.name} className="w-10 h-10 object-contain" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }} />
        ) : (
          <motion.span key={d.id} className="text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }}>🦕</motion.span>
        ))}
      </div>
    </div>
  );
}

export interface FoodMatchScreenProps { dinos?: MinigameDino[]; onComplete?: (score: number) => void; onClose?: () => void; }
export function FoodMatchScreen({ dinos: rawDinos, onComplete, onClose }: FoodMatchScreenProps = {}) {
  const gameDinos = useMemo<FMDino[]>(() => {
    const withDiet = (rawDinos ?? []).filter((d) => d.diet);
    if (withDiet.length >= 2) {
      return withDiet.slice(0, 6).map((d) => ({
        id: d.id,
        name: d.name,
        image: d.image_comic_url ?? "",
        food: mapDiet(d.diet),
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
  const score = gameDinos.filter((d) => assignments[d.id] === d.food).length;

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
    const foodId = String(over.id);
    const dino = gameDinos.find((d) => d.id === dinoId)!;

    if (dino.food === foodId) {
      haptics.success();
      const next = { ...assignments, [dinoId]: foodId };
      setAssignments(next);
      if (Object.keys(next).length === gameDinos.length) {
        setTimeout(() => setDone(true), 500);
      }
    } else {
      haptics.error();
    }
  }

  return (
    <MinigameShell onClose={onClose}
      title="Futter-Zuordnung"
      instruction="Ziehe jeden Dino zum richtigen Futter! Frisst er Pflanzen oder Fleisch?"
      done={done}
      doneTitle="Perfekt!"
      donePraise="Du weißt genau was jeder Dino frisst! Klasse!"
      onFinish={() => onComplete?.(score)}
    >
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={(e) => setOverZone(e.over ? String(e.over.id) : null)}>
        <div className="flex gap-3 mb-4">
          {FOODS.map((food) => (
            <FoodDropZone key={food.id} food={food} dinosHere={gameDinos.filter((d) => assignments[d.id] === food.id)} isOver={overZone === food.id} />
          ))}
        </div>

        {unplaced.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2">Ziehe die Dinos:</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {unplaced.map((dino) => (
                <DraggableDino key={dino.id} dino={dino} disabled={false} />
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
