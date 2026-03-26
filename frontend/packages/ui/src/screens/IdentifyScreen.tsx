import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ForscherSpeech } from "../components/ForscherSpeech";
import { IconButton } from "../primitives/IconButton";
import { Icon } from "../primitives/Icon";
import { useHaptics } from "../hooks/useHaptics";

export interface IdentifyOption {
  id: string;
  name: string;
  image: string;
  correct: boolean;
  hint: string;
}

export interface IdentifyScreenProps {
  skeletonImageUrl?: string;
  options?: IdentifyOption[];
  onComplete?: (attempts: number) => void;
  onClose?: () => void;
}

const DEMO_OPTIONS: IdentifyOption[] = [
  { id: "trex", name: "T-Rex", image: "/dinos/trex/comic.png", correct: false, hint: "Schau mal, der T-Rex hat kurze Arme und keinen Schild am Kopf!" },
  { id: "triceratops", name: "Triceratops", image: "/dinos/triceratops/comic.png", correct: true, hint: "" },
  { id: "stegosaurus", name: "Stegosaurus", image: "/dinos/stegosaurus/comic.png", correct: false, hint: "Der Stegosaurus hat Platten auf dem Rücken, nicht Hörner!" },
  { id: "brachiosaurus", name: "Brachiosaurus", image: "/dinos/brachiosaurus/comic.png", correct: false, hint: "Der Brachiosaurus hat einen ganz langen Hals — das Skelett hat aber Hörner!" },
];

export function IdentifyScreen({
  skeletonImageUrl = "/dinos/triceratops/skeleton.png",
  options = DEMO_OPTIONS,
  onComplete,
  onClose,
}: IdentifyScreenProps = {}) {
  const [eliminated, setEliminated] = useState<string[]>([]);
  const [result, setResult] = useState<"none" | "wrong" | "correct">("none");
  const [hint, setHint] = useState("");
  const [attempts, setAttempts] = useState(0);
  const haptics = useHaptics();

  const correctOption = options.find((o) => o.correct);

  function handleGuess(option: IdentifyOption) {
    if (result === "correct") return;
    setAttempts((a) => a + 1);
    if (option.correct) {
      setResult("correct");
      haptics.success();
    } else {
      setResult("wrong");
      setHint(option.hint);
      setEliminated((prev) => [...prev, option.id]);
      haptics.error();
      setTimeout(() => { setResult("none"); setHint(""); }, 2000);
    }
  }

  const remaining = options.filter((o) => !eliminated.includes(o.id));

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <header className="flex items-center px-4 py-2">
        <IconButton icon="close" variant="surface" label="Schließen" onClick={onClose} />
      </header>

      <main className="flex-1 px-4 pb-6 max-w-sm mx-auto w-full">
        <div className="rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden bg-[#2C1A0E] mb-3">
          <img src={skeletonImageUrl} alt="Skelett" className="w-full aspect-square object-cover" />
        </div>

        <div className="mb-3">
          {result === "correct" && correctOption ? (
            <ForscherSpeech text={`Genau! Das ist ein ${correctOption.name}! Mega!`} icon="celebration" />
          ) : hint ? (
            <ForscherSpeech text={hint} />
          ) : (
            <ForscherSpeech text="Welcher Dino versteckt sich hinter diesem Skelett?" />
          )}
        </div>

        {result !== "correct" ? (
          <div className="grid grid-cols-2 gap-2.5">
            <AnimatePresence>
              {remaining.map((dino) => (
                <motion.button
                  key={dino.id}
                  layout
                  onClick={() => handleGuess(dino)}
                  className="bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow active-press p-2 flex flex-col items-center gap-1"
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ layout: { duration: 0.3 } }}
                  disabled={result === "wrong"}
                >
                  <div className="w-full aspect-square bg-gradient-to-br from-primary-fixed/20 to-tertiary-fixed/10 rounded-lg overflow-hidden flex items-center justify-center">
                    <img src={dino.image} alt={dino.name} className="w-full h-full object-contain p-1" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider">{dino.name}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        ) : correctOption && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
          >
            <div className="w-full bg-gradient-to-br from-primary-container/20 to-tertiary-container/10 rounded-xl border-[3px] border-primary-container p-4 flex items-center justify-center shadow-[3px_3px_0px_0px_#1B5E20]">
              <img src={correctOption.image} alt={correctOption.name} className="w-32 h-32 object-contain drop-shadow-lg" />
            </div>
            <motion.p
              className="mt-3 text-lg font-black uppercase text-primary-container"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              🎉 {correctOption.name}! 🎉
            </motion.p>
            <motion.button
              onClick={() => onComplete?.(attempts)}
              className="mt-4 px-6 py-2.5 bg-primary-container text-white border-[3px] border-on-surface rounded-lg sticker-shadow font-bold uppercase tracking-wider text-sm flex items-center gap-1.5 active-press"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Icon name="arrow_forward" size="md" />
              Weiter zur Entdeckung!
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
