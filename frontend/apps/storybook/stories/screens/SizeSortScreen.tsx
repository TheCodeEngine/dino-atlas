import { useState } from "react";
import { motion } from "motion/react";
import { FullscreenHeader } from "../../../../packages/ui/src/components/FullscreenHeader";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { useHaptics } from "../../../../packages/ui/src/hooks/useHaptics";

const DINOS = [
  { id: "brachio", name: "Brachiosaurus", length: 26, image: "/dinos/brachiosaurus/comic.png" },
  { id: "trex", name: "T-Rex", length: 12, image: "/dinos/trex/comic.png" },
  { id: "tricera", name: "Triceratops", length: 9, image: "/dinos/triceratops/comic.png" },
  { id: "stego", name: "Stegosaurus", length: 9, image: "/dinos/stegosaurus/comic.png" },
];

const CORRECT_ORDER = [...DINOS].sort((a, b) => b.length - a.length).map((d) => d.id);

export function SizeSortScreen() {
  const [order, setOrder] = useState(() => [...DINOS].sort(() => Math.random() - 0.5));
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const haptics = useHaptics();

  function moveUp(idx: number) {
    if (idx === 0 || checked) return;
    haptics.tap();
    const next = [...order];
    [next[idx - 1], next[idx]] = [next[idx]!, next[idx - 1]!];
    setOrder(next);
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
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <FullscreenHeader title="Größen-Sortieren" playerEmoji="🦖" />

      <main className="flex-1 flex flex-col px-4 pb-6 max-w-sm mx-auto w-full">
        <div className="mb-3">
          <ForscherSpeech text="Sortiere die Dinos! Der Größte nach oben, der Kleinste nach unten!" />
        </div>

        <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>swap_vert</span>
          Tippe ↑ um nach oben zu verschieben
        </p>

        <div className="flex flex-col gap-2 mb-4">
          {order.map((dino, idx) => (
            <motion.div
              key={dino.id}
              layout
              className={`flex items-center gap-3 p-2.5 rounded-lg border-[3px] ${
                checked && correct ? "border-[#1B5E20] bg-primary-fixed" :
                checked && !correct ? "border-error/50 bg-error-container/20" :
                "border-on-surface bg-surface-container-lowest sticker-shadow"
              }`}
              transition={{ layout: { duration: 0.25 } }}
            >
              <span className="text-sm font-black text-on-surface-variant w-5 text-center">{idx + 1}</span>
              <img src={dino.image} alt={dino.name} className="w-12 h-12 object-contain" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase">{dino.name}</p>
                <p className="text-[10px] text-on-surface-variant">{dino.length}m lang</p>
              </div>
              {idx > 0 && !checked && (
                <button
                  onClick={() => moveUp(idx)}
                  className="w-8 h-8 bg-surface-container-high rounded-lg flex items-center justify-center active:scale-90"
                >
                  <span className="material-symbols-outlined text-on-surface" style={{ fontSize: "18px" }}>arrow_upward</span>
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {!checked && (
          <Button variant="primary" fullWidth icon="check" onClick={handleCheck}>Überprüfen!</Button>
        )}

        {checked && correct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <p className="text-lg font-black text-primary-container mb-3">🎉 Richtig sortiert!</p>
            <Button variant="primary" fullWidth icon="check">Fertig!</Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
