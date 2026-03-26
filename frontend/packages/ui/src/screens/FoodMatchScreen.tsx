import { useState } from "react";
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

const DINOS = [
  { id: "tricera", name: "Triceratops", image: "/dinos/triceratops/comic.png", food: "plants" },
  { id: "trex", name: "T-Rex", image: "/dinos/trex/comic.png", food: "meat" },
  { id: "brachio", name: "Brachiosaurus", image: "/dinos/brachiosaurus/comic.png", food: "plants" },
  { id: "stego", name: "Stegosaurus", image: "/dinos/stegosaurus/comic.png", food: "plants" },
];

const FOODS = [
  { id: "plants", emoji: "🌿", label: "Pflanzen" },
  { id: "meat", emoji: "🥩", label: "Fleisch" },
];

function DraggableDino({ dino, disabled }: { dino: typeof DINOS[0]; disabled: boolean }) {
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
      <img src={dino.image} alt={dino.name} className="w-14 h-14 object-contain" />
      <span className="text-[9px] font-black uppercase">{dino.name}</span>
    </div>
  );
}

function FoodDropZone({ food, dinosHere, isOver }: { food: typeof FOODS[0]; dinosHere: typeof DINOS; isOver: boolean }) {
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
        {dinosHere.map((d) => (
          <motion.img
            key={d.id}
            src={d.image}
            alt={d.name}
            className="w-10 h-10 object-contain"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
          />
        ))}
      </div>
    </div>
  );
}

export interface FoodMatchScreenProps { onComplete?: (score: number) => void; onClose?: () => void; }
export function FoodMatchScreen({ onComplete, onClose }: FoodMatchScreenProps = {}) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [activeDino, setActiveDino] = useState<string | null>(null);
  const [overZone, setOverZone] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const haptics = useHaptics();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  const unplaced = DINOS.filter((d) => !assignments[d.id]);
  const score = DINOS.filter((d) => assignments[d.id] === d.food).length;

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
    const dino = DINOS.find((d) => d.id === dinoId)!;

    if (dino.food === foodId) {
      haptics.success();
      const next = { ...assignments, [dinoId]: foodId };
      setAssignments(next);
      if (Object.keys(next).length === DINOS.length) {
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
    >
      <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => setOverZone(e.over ? String(e.over.id) : null)}
              >
                {/* Drop zones */}
                <div className="flex gap-3 mb-4">
                  {FOODS.map((food) => (
                    <FoodDropZone
                      key={food.id}
                      food={food}
                      dinosHere={DINOS.filter((d) => assignments[d.id] === food.id)}
                      isOver={overZone === food.id}
                    />
                  ))}
                </div>

                {/* Dino tray */}
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

                {/* Drag overlay */}
                <DragOverlay>
                  {activeDino && (() => {
                    const d = DINOS.find((d) => d.id === activeDino)!;
                    return (
                      <div className="flex flex-col items-center gap-1 p-2 rounded-xl border-[3px] border-[#ffc850] bg-white shadow-xl">
                        <img src={d.image} alt={d.name} className="w-14 h-14 object-contain" />
                        <span className="text-[9px] font-black uppercase">{d.name}</span>
                      </div>
                    );
                  })()}
                </DragOverlay>
      </DndContext>
    </MinigameShell>
  );
}
