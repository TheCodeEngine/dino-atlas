import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FullscreenHeader } from "../../../../packages/ui/src/components/FullscreenHeader";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { useHaptics } from "../../../../packages/ui/src/hooks/useHaptics";

const ROUNDS = [
  {
    shadow: "/dinos/triceratops/shadow.png",
    answer: "tricera",
    options: [
      { id: "tricera", name: "Triceratops", image: "/dinos/triceratops/comic.png" },
      { id: "trex", name: "T-Rex", image: "/dinos/trex/comic.png" },
      { id: "stego", name: "Stegosaurus", image: "/dinos/stegosaurus/comic.png" },
    ],
  },
];

export function ShadowGuessScreen() {
  const [round] = useState(0);
  const [result, setResult] = useState<"none" | "correct" | "wrong">("none");
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const haptics = useHaptics();

  const r = ROUNDS[round]!;

  function handleGuess(id: string) {
    if (result === "correct") return;
    haptics.tap();
    if (id === r.answer) {
      setResult("correct");
      setTimeout(() => haptics.success(), 100);
    } else {
      setResult("wrong");
      setWrongIds((prev) => [...prev, id]);
      setTimeout(() => haptics.error(), 100);
      setTimeout(() => setResult("none"), 1000);
    }
  }

  const remaining = r.options.filter((o) => !wrongIds.includes(o.id));

  return (
    <div className="bg-[#1a1530] text-white min-h-screen flex flex-col" style={{ backgroundImage: "none" }}>
      <FullscreenHeader title="Schatten-Raten" playerEmoji="🦖" variant="dark" />

      <main className="flex-1 flex flex-col items-center px-4 pb-6 max-w-sm mx-auto w-full">
        <div className="mb-4 w-full">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
            <div className="w-7 h-7 bg-primary-fixed rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
            </div>
            <p className="text-[11px] font-bold text-white/70">
              {result === "correct" ? "Genau! Du hast den Schatten erkannt!" : "Welcher Dino versteckt sich im Schatten?"}
            </p>
          </div>
        </div>

        {/* Shadow display */}
        <motion.div
          className={`w-full aspect-square max-w-[280px] rounded-xl border-[3px] mb-4 flex items-center justify-center p-8 ${
            result === "correct" ? "border-[#ffc850] bg-[#ffc850]/10" : "border-white/20 bg-white/5"
          }`}
          animate={result === "wrong" ? { x: [0, -5, 5, -3, 0] } : {}}
        >
          <AnimatePresence mode="wait">
            {result === "correct" ? (
              <motion.img
                key="reveal"
                src={r.options.find((o) => o.id === r.answer)!.image}
                alt=""
                className="w-full h-full object-contain drop-shadow-xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 10 }}
              />
            ) : (
              <motion.img
                key="shadow"
                src={r.shadow}
                alt="Schatten"
                className="w-full h-full object-contain"
                style={{ filter: "brightness(0)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Options */}
        {result !== "correct" ? (
          <div className="flex gap-2.5 justify-center">
            <AnimatePresence>
              {remaining.map((opt) => (
                <motion.button
                  key={opt.id}
                  onClick={() => handleGuess(opt.id)}
                  className="flex flex-col items-center gap-1 p-2 bg-white/5 border-[3px] border-white/20 rounded-xl"
                  whileTap={{ scale: 0.9 }}
                  layout
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <img src={opt.image} alt={opt.name} className="w-16 h-16 object-contain" />
                  <span className="text-[9px] font-black uppercase text-white/70">{opt.name}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <p className="text-xl font-black text-[#ffc850] mb-4">🎉 {r.options.find((o) => o.id === r.answer)!.name}!</p>
            <Button variant="primary" fullWidth icon="check">Fertig!</Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
