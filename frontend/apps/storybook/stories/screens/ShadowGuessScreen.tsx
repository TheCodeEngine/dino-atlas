import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MinigameShell } from "../../../../packages/ui/src/components/MinigameShell";
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
    <MinigameShell
      title="Schatten-Raten"
      instruction="Welcher Dino versteckt sich im Schatten?"
      done={result === "correct"}
      doneEmoji="🔍"
      doneTitle={`${r.options.find((o) => o.id === r.answer)!.name}!`}
      donePraise="Genau! Du hast den Schatten erkannt! Du bist ein echter Dino-Experte!"
    >
      {/* Shadow display */}
      <div className="flex justify-center mb-4">
        <motion.div
          className="w-full aspect-square max-w-[250px] rounded-xl border-[3px] border-on-surface bg-surface-container-high sticker-shadow flex items-center justify-center p-6"
          animate={result === "wrong" ? { x: [0, -5, 5, -3, 0] } : {}}
        >
          <img src={r.shadow} alt="Schatten" className="w-full h-full object-contain drop-shadow-lg" />
        </motion.div>
      </div>

      {/* Options */}
      <div className="flex gap-2.5 justify-center">
        <AnimatePresence>
          {remaining.map((opt) => (
            <motion.button
              key={opt.id}
              onClick={() => handleGuess(opt.id)}
              className="flex flex-col items-center gap-1 p-2 bg-surface-container-lowest border-[3px] border-on-surface rounded-xl sticker-shadow"
              whileTap={{ scale: 0.9 }}
              layout
              exit={{ scale: 0, opacity: 0 }}
            >
              <img src={opt.image} alt={opt.name} className="w-16 h-16 object-contain" />
              <span className="text-[9px] font-black uppercase">{opt.name}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </MinigameShell>
  );
}
