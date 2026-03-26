import { useState } from "react";
import { motion } from "motion/react";
import { FullscreenHeader } from "../../../../packages/ui/src/components/FullscreenHeader";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { useHaptics } from "../../../../packages/ui/src/hooks/useHaptics";

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

export function FoodMatchScreen() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">("none");
  const [done, setDone] = useState(false);
  const haptics = useHaptics();

  const dino = DINOS[current]!;

  function handleAnswer(foodId: string) {
    if (feedback !== "none") return;
    haptics.tap();
    const isCorrect = foodId === dino.food;

    if (isCorrect) {
      setFeedback("correct");
      setScore((s) => s + 1);
      setTimeout(() => haptics.success(), 100);
    } else {
      setFeedback("wrong");
      setTimeout(() => haptics.error(), 100);
    }

    setTimeout(() => {
      setFeedback("none");
      if (current + 1 >= DINOS.length) {
        setDone(true);
        if (isCorrect) setScore((s) => s); // already incremented
      } else {
        setCurrent((c) => c + 1);
      }
    }, 1200);
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <FullscreenHeader title="Futter-Zuordnung" playerEmoji="🦖" />

      <main className="flex-1 flex flex-col items-center px-4 pb-6 max-w-sm mx-auto w-full">
        {!done ? (
          <>
            {/* Progress */}
            <div className="w-full flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black text-on-surface-variant">{current + 1}/{DINOS.length}</span>
              <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary-container rounded-full" style={{ width: `${((current + (feedback === "correct" ? 1 : 0)) / DINOS.length) * 100}%` }} />
              </div>
            </div>

            <div className="mb-3 w-full">
              <ForscherSpeech text={`Was frisst der ${dino.name}?`} />
            </div>

            {/* Dino */}
            <motion.div
              key={dino.id}
              className={`w-full bg-surface-container-lowest rounded-xl border-[3px] p-6 flex items-center justify-center mb-4 ${
                feedback === "correct" ? "border-[#1B5E20] bg-primary-fixed" :
                feedback === "wrong" ? "border-error" :
                "border-on-surface sticker-shadow"
              }`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center">
                <img src={dino.image} alt={dino.name} className="w-28 h-28 object-contain mx-auto mb-2" />
                <p className="text-sm font-black uppercase">{dino.name}</p>
              </div>
            </motion.div>

            {/* Food options */}
            <div className="flex gap-3">
              {FOODS.map((food) => (
                <motion.button
                  key={food.id}
                  onClick={() => handleAnswer(food.id)}
                  disabled={feedback !== "none"}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow"
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-5xl">{food.emoji}</span>
                  <span className="text-xs font-black uppercase">{food.label}</span>
                </motion.button>
              ))}
            </div>

            {feedback !== "none" && (
              <motion.p
                className={`mt-3 text-sm font-black ${feedback === "correct" ? "text-primary-container" : "text-error"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {feedback === "correct" ? "✅ Richtig!" : "❌ Falsch!"}
              </motion.p>
            )}
          </>
        ) : (
          <motion.div className="flex-1 flex flex-col items-center justify-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-6xl mb-4">{score === DINOS.length ? "🎉" : "👍"}</span>
            <h2 className="text-2xl font-black uppercase mb-2">
              {score === DINOS.length ? "Perfekt!" : `${score} von ${DINOS.length} richtig!`}
            </h2>
            <ForscherSpeech text={score === DINOS.length ? "Du weißt genau was jeder Dino frisst!" : "Beim nächsten Mal klappt es noch besser!"} />
            <div className="w-full mt-6">
              <Button variant="primary" fullWidth icon="check">Fertig!</Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
