import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { FullscreenHeader } from "../../../../packages/ui/src/components/FullscreenHeader";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { ProgressBar } from "../../../../packages/ui/src/primitives/ProgressBar";
import { StarRating } from "../../../../packages/ui/src/primitives/StarRating";
import { useHaptics } from "../../../../packages/ui/src/hooks/useHaptics";

const QUESTIONS = [
  {
    question: "Was hat der Triceratops gefressen?",
    options: [
      { label: "Pflanzen", emoji: "🌿", correct: true },
      { label: "Fleisch", emoji: "🥩", correct: false },
      { label: "Fisch", emoji: "🐟", correct: false },
      { label: "Insekten", emoji: "🐛", correct: false },
    ],
    explanation: "Richtig! Der Triceratops war ein Pflanzenfresser. Er liebte Farne und Blätter!",
  },
  {
    question: "Wie viele Hörner hatte der Triceratops?",
    options: [
      { label: "1 Horn", emoji: "☝️", correct: false },
      { label: "2 Hörner", emoji: "✌️", correct: false },
      { label: "3 Hörner", emoji: "🤟", correct: true },
      { label: "4 Hörner", emoji: "🖖", correct: false },
    ],
    explanation: "Genau! Tri-ceratops bedeutet Drei-Horn-Gesicht!",
  },
  {
    question: "In welcher Zeit lebte der Triceratops?",
    options: [
      { label: "Trias", emoji: "🌋", correct: false },
      { label: "Jura", emoji: "🌿", correct: false },
      { label: "Kreide", emoji: "☄️", correct: true },
      { label: "Eiszeit", emoji: "🧊", correct: false },
    ],
    explanation: "Super! Der Triceratops lebte in der Kreidezeit — ganz am Ende der Dino-Zeit!",
  },
];

type Phase = "question" | "correct" | "wrong" | "done";

export function QuizScreen() {
  const [current, setCurrent] = useState(0);
  const [stars, setStars] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [explanation, setExplanation] = useState("");
  const haptics = useHaptics();

  const q = QUESTIONS[current]!;
  const total = QUESTIONS.length;

  function handleAnswer(correct: boolean) {
    if (phase !== "question") return;
    haptics.tap();
    if (correct) {
      setTimeout(() => haptics.success(), 150);
      setStars((s) => s + 1);
      setPhase("correct");
      setExplanation(q.explanation);
    } else {
      setTimeout(() => haptics.error(), 150);
      setPhase("wrong");
      setExplanation("Hmm, nicht ganz! Versuch es nochmal!");
      setTimeout(() => setPhase("question"), 1500);
    }
  }

  function handleNext() {
    haptics.tap();
    if (current + 1 >= total) {
      setPhase("done");
      haptics.success();
    } else {
      setCurrent((c) => c + 1);
      setPhase("question");
      setExplanation("");
    }
  }

  const progress = ((current + (phase === "correct" || phase === "done" ? 1 : 0)) / total) * 100;

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <FullscreenHeader title="Dino-Quiz" playerEmoji="🦖" />

      <main className="flex-1 flex flex-col px-4 pb-6 max-w-sm mx-auto w-full">
        {/* Progress + Stars */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-black text-on-surface-variant whitespace-nowrap">
            {Math.min(current + 1, total)}/{total}
          </span>
          <ProgressBar value={progress} className="flex-1" />
          <StarRating count={total} filled={stars} size="sm" />
        </div>

        <AnimatePresence mode="wait">
          {phase === "done" ? (
            /* Quiz complete */
            <motion.div
              key="done"
              className="flex-1 flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex gap-2 mb-4">
                {Array.from({ length: total }).map((_, i) => (
                  <motion.span
                    key={i}
                    className={`text-4xl ${i < stars ? "" : "opacity-20 grayscale"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.2, duration: 0.4, ease: "easeOut" }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
              <h2 className="text-2xl font-black uppercase mb-2">
                {stars === total ? "Perfekt!" : stars > 0 ? "Gut gemacht!" : "Weiter üben!"}
              </h2>
              <p className="text-sm text-on-surface-variant mb-6">
                {stars} von {total} Fragen richtig beantwortet
              </p>
              <ForscherSpeech
                text={stars === total
                  ? "Wow, du weißt alles über den Triceratops! Du bist ein echter Dino-Experte!"
                  : "Super gemacht! Beim nächsten Mal schaffst du bestimmt noch mehr!"}
              />
              <div className="w-full mt-6">
                <Button variant="primary" fullWidth icon="check">Fertig!</Button>
              </div>
            </motion.div>
          ) : (
            /* Question */
            <motion.div
              key={`q-${current}`}
              className="flex-1 flex flex-col"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              {/* Forscher question */}
              <div className="mb-4">
                <ForscherSpeech text={q.question} />
              </div>

              {/* Answer grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {q.options.map((opt) => (
                  <motion.button
                    key={opt.label}
                    onClick={() => handleAnswer(opt.correct)}
                    disabled={phase !== "question"}
                    className={`bg-surface-container-lowest rounded-xl border-[3px] p-4 flex flex-col items-center gap-2 transition-all ${
                      phase === "correct" && opt.correct
                        ? "border-[#1B5E20] bg-primary-fixed shadow-[3px_3px_0px_0px_#1B5E20]"
                        : phase === "wrong" && !opt.correct
                          ? "border-on-surface sticker-shadow"
                          : "border-on-surface sticker-shadow active-press"
                    }`}
                    whileTap={phase === "question" ? { scale: 0.93 } : {}}
                    animate={phase === "wrong" && !opt.correct ? {} : phase === "correct" && opt.correct ? { scale: [1, 1.05, 1] } : {}}
                  >
                    <span className="text-4xl">{opt.emoji}</span>
                    <span className="text-xs font-black uppercase">{opt.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {explanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4"
                  >
                    <ForscherSpeech
                      text={explanation}
                      icon={phase === "correct" ? "celebration" : "face"}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next button (only after correct answer) */}
              {phase === "correct" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button variant="primary" fullWidth icon="arrow_forward" onClick={handleNext}>
                    {current + 1 >= total ? "Ergebnis!" : "Nächste Frage"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
