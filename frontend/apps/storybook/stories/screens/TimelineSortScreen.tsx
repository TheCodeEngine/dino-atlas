import { useState } from "react";
import { motion } from "motion/react";
import { FullscreenHeader } from "../../../../packages/ui/src/components/FullscreenHeader";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { useHaptics } from "../../../../packages/ui/src/hooks/useHaptics";

const PERIODS = [
  { id: "trias", label: "Trias", emoji: "🌋", color: "bg-[#e8604c]", years: "252–201 Mio." },
  { id: "jura", label: "Jura", emoji: "🌿", color: "bg-[#5ba67a]", years: "201–145 Mio." },
  { id: "kreide", label: "Kreide", emoji: "☄️", color: "bg-[#7ab648]", years: "145–66 Mio." },
];

const DINOS = [
  { id: "tricera", name: "Triceratops", image: "/dinos/triceratops/comic.png", period: "kreide" },
  { id: "stego", name: "Stegosaurus", image: "/dinos/stegosaurus/comic.png", period: "jura" },
  { id: "trex", name: "T-Rex", image: "/dinos/trex/comic.png", period: "kreide" },
  { id: "brachio", name: "Brachiosaurus", image: "/dinos/brachiosaurus/comic.png", period: "jura" },
];

export function TimelineSortScreen() {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<"none" | "checking" | "done">("none");
  const haptics = useHaptics();

  const unplaced = DINOS.filter((d) => !assignments[d.id]);

  function handleSelectDino(id: string) {
    if (result !== "none") return;
    haptics.tap();
    setSelected(id === selected ? null : id);
  }

  function handleDropOnPeriod(periodId: string) {
    if (!selected || result !== "none") return;
    haptics.tap();
    const dino = DINOS.find((d) => d.id === selected)!;
    const isCorrect = dino.period === periodId;
    setAssignments((a) => ({ ...a, [selected]: periodId }));
    setSelected(null);

    if (isCorrect) haptics.success();
    else {
      haptics.error();
      setTimeout(() => setAssignments((a) => { const n = { ...a }; delete n[dino.id]; return n; }), 1000);
    }

    // Check if all placed correctly
    const nextAssignments = { ...assignments, [selected]: periodId };
    const allPlaced = DINOS.every((d) => nextAssignments[d.id]);
    const allCorrect = DINOS.every((d) => nextAssignments[d.id] === d.period);
    if (allPlaced && allCorrect) {
      setTimeout(() => { setResult("done"); haptics.success(); }, 500);
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <FullscreenHeader title="Zeitleiste" playerEmoji="🦖" />

      <main className="flex-1 flex flex-col px-4 pb-6 max-w-sm mx-auto w-full">
        <div className="mb-3">
          <ForscherSpeech text="In welcher Zeit hat jeder Dino gelebt? Wähle einen Dino und tippe auf die richtige Zeit!" />
        </div>

        {/* Period slots */}
        <div className="flex flex-col gap-2 mb-4">
          {PERIODS.map((period) => {
            const dinosHere = DINOS.filter((d) => assignments[d.id] === period.id);
            return (
              <button
                key={period.id}
                onClick={() => handleDropOnPeriod(period.id)}
                className={`rounded-xl border-[3px] p-3 text-left transition-all ${
                  selected ? "border-[#ffc850] ring-2 ring-[#ffc850]/30" : "border-on-surface"
                } ${period.color}/15`}
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
                    {dinosHere.map((d) => (
                      <img key={d.id} src={d.image} alt={d.name} className="w-10 h-10 object-contain" />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Dino tray */}
        {result !== "done" && unplaced.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2">Wähle einen Dino:</p>
            <div className="flex gap-2 justify-center">
              {unplaced.map((dino) => (
                <motion.button
                  key={dino.id}
                  onClick={() => handleSelectDino(dino.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-[3px] transition-all ${
                    selected === dino.id ? "border-[#ffc850] bg-[#ffc850]/10 shadow-[0_0_12px_rgba(255,200,80,0.3)]" : "border-on-surface bg-surface-container-lowest sticker-shadow"
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <img src={dino.image} alt={dino.name} className="w-14 h-14 object-contain" />
                  <span className="text-[9px] font-black uppercase">{dino.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {result === "done" && (
          <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-lg font-black text-primary-container mb-3">🎉 Alle richtig zugeordnet!</p>
            <Button variant="primary" fullWidth icon="check">Fertig!</Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
