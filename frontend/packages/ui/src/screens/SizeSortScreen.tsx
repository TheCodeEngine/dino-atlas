import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MinigameShell } from "../components/MinigameShell";
import { Button } from "../primitives/Button";
import { Icon } from "../primitives/Icon";
import { useHaptics } from "../hooks/useHaptics";

const DINOS = [
  { id: "brachio", name: "Brachiosaurus", length: 26, image: "/dinos/brachiosaurus/comic.png" },
  { id: "trex", name: "T-Rex", length: 12, image: "/dinos/trex/comic.png" },
  { id: "tricera", name: "Triceratops", length: 9, image: "/dinos/triceratops/comic.png" },
  { id: "stego", name: "Stegosaurus", length: 9, image: "/dinos/stegosaurus/comic.png" },
];

const CORRECT_ORDER = [...DINOS].sort((a, b) => b.length - a.length).map((d) => d.id);

function SortableDino({ dino, idx, checked, correct }: { dino: typeof DINOS[0]; idx: number; checked: boolean; correct: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: dino.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 p-2.5 rounded-lg border-[3px] touch-none ${
        isDragging ? "z-10 shadow-xl opacity-80 border-[#ffc850] bg-[#ffc850]/10" :
        checked && correct ? "border-[#1B5E20] bg-primary-fixed" :
        checked && !correct ? "border-error/50 bg-error-container/20" :
        "border-on-surface bg-surface-container-lowest sticker-shadow"
      }`}
      {...attributes}
      {...listeners}
    >
      <span className="text-sm font-black text-on-surface-variant w-5 text-center">{idx + 1}</span>
      <img src={dino.image} alt={dino.name} className="w-12 h-12 object-contain" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black uppercase">{dino.name}</p>
        <p className="text-[10px] text-on-surface-variant">{dino.length}m lang</p>
      </div>
      <Icon name="drag_indicator" size="md" className="text-on-surface-variant" />
    </div>
  );
}

export function SizeSortScreen() {
  const [order, setOrder] = useState(() => {
    const shuffled = [...DINOS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
  });
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const haptics = useHaptics();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    haptics.tap();
    setOrder((prev) => {
      const oldIdx = prev.findIndex((d) => d.id === active.id);
      const newIdx = prev.findIndex((d) => d.id === over.id);
      return arrayMove(prev, oldIdx, newIdx);
    });
  }

  function handleCheck() {
    haptics.tap();
    const isCorrect = order.every((d, i) => d.id === CORRECT_ORDER[i]);
    setChecked(true);
    setCorrect(isCorrect);
    if (isCorrect) haptics.success();
    else {
      haptics.error();
      setTimeout(() => setChecked(false), 1500);
    }
  }

  return (
    <MinigameShell
      title="Größen-Sortieren"
      instruction="Sortiere die Dinos! Der Größte nach oben, der Kleinste nach unten. Ziehe sie mit dem Finger!"
      done={checked && correct}
      doneTitle="Richtig sortiert!"
      donePraise="Super gemacht! Du weißt welcher Dino am größten ist!"
    >
      <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-1">
        <Icon name="drag_indicator" size="xs" />
        Ziehe die Dinos an die richtige Stelle
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 mb-4">
            {order.map((dino, idx) => (
              <SortableDino key={dino.id} dino={dino} idx={idx} checked={checked} correct={correct} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {!checked && (
        <Button variant="primary" fullWidth icon="check" onClick={handleCheck}>Überprüfen!</Button>
      )}
    </MinigameShell>
  );
}
