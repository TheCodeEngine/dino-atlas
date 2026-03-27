import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MinigameShell } from "../components/MinigameShell";
import { useHaptics } from "../hooks/useHaptics";
import type { MinigameDino } from "../types/minigame";

interface SGOption { id: string; name: string; image: string }
interface SGRound { shadow: string; answer: string; options: SGOption[] }

const FALLBACK_ROUNDS: SGRound[] = [
  {
    shadow: "",
    answer: "tricera",
    options: [
      { id: "tricera", name: "Triceratops", image: "" },
      { id: "trex", name: "T-Rex", image: "" },
      { id: "stego", name: "Stegosaurus", image: "" },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j]!, s[i]!];
  }
  return s;
}

function buildRounds(dinos: MinigameDino[]): SGRound[] {
  const withShadow = dinos.filter((d) => d.image_shadow_url && d.image_comic_url);
  if (withShadow.length < 2) return FALLBACK_ROUNDS;

  const rounds: SGRound[] = [];
  const picked = shuffle(withShadow).slice(0, 3);

  for (const target of picked) {
    const others = shuffle(dinos.filter((d) => d.id !== target.id && d.image_comic_url)).slice(0, 2);
    const options = shuffle([
      { id: target.id, name: target.name, image: target.image_comic_url! },
      ...others.map((d) => ({ id: d.id, name: d.name, image: d.image_comic_url! })),
    ]);
    rounds.push({
      shadow: target.image_shadow_url!,
      answer: target.id,
      options,
    });
  }

  return rounds;
}

export interface ShadowGuessScreenProps { dinos?: MinigameDino[]; onComplete?: (score: number) => void; onClose?: () => void; }
export function ShadowGuessScreen({ dinos: rawDinos, onComplete, onClose }: ShadowGuessScreenProps = {}) {
  const rounds = useMemo(() => (rawDinos?.length ?? 0) >= 2 ? buildRounds(rawDinos!) : FALLBACK_ROUNDS, [rawDinos]);

  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<"none" | "correct" | "wrong">("none");
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [allDone, setAllDone] = useState(false);
  const haptics = useHaptics();

  const r = rounds[roundIdx]!;

  function handleGuess(id: string) {
    if (result === "correct") return;
    haptics.tap();
    if (id === r.answer) {
      setResult("correct");
      setScore((s) => s + 1);
      setTimeout(() => haptics.success(), 100);
      // Move to next round or finish
      setTimeout(() => {
        if (roundIdx + 1 >= rounds.length) {
          setAllDone(true);
        } else {
          setRoundIdx((i) => i + 1);
          setResult("none");
          setWrongIds([]);
        }
      }, 1200);
    } else {
      setResult("wrong");
      setWrongIds((prev) => [...prev, id]);
      setTimeout(() => haptics.error(), 100);
      setTimeout(() => setResult("none"), 1000);
    }
  }

  const remaining = r.options.filter((o) => !wrongIds.includes(o.id));
  const answerName = r.options.find((o) => o.id === r.answer)?.name ?? "";

  return (
    <MinigameShell onClose={onClose}
      title="Schatten-Raten"
      instruction={`Runde ${roundIdx + 1}/${rounds.length} — Welcher Dino versteckt sich im Schatten?`}
      done={allDone}
      doneEmoji="🔍"
      doneTitle={`${score}/${rounds.length} erkannt!`}
      donePraise={score === rounds.length ? "Perfekt! Du erkennst jeden Dino am Schatten!" : "Gut gemacht! Du wirst immer besser!"}
      onFinish={() => onComplete?.(score)}
    >
      {/* Shadow display */}
      <div className="flex justify-center mb-4">
        <motion.div
          className="w-full aspect-square max-w-[250px] rounded-xl border-[3px] border-on-surface bg-surface-container-high sticker-shadow flex items-center justify-center p-6"
          animate={result === "wrong" ? { x: [0, -5, 5, -3, 0] } : {}}
        >
          {r.shadow ? (
            <img src={r.shadow} alt="Schatten" className="w-full h-full object-contain drop-shadow-lg" />
          ) : (
            <span className="text-8xl opacity-20">🦕</span>
          )}
        </motion.div>
      </div>

      {/* Correct feedback */}
      <AnimatePresence>
        {result === "correct" && (
          <motion.p
            className="text-center text-sm font-black text-[#1B5E20] mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Richtig! Das ist {answerName}!
          </motion.p>
        )}
      </AnimatePresence>

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
              {opt.image ? (
                <img src={opt.image} alt={opt.name} className="w-16 h-16 object-contain" />
              ) : (
                <span className="text-4xl w-16 h-16 flex items-center justify-center">🦕</span>
              )}
              <span className="text-[9px] font-black uppercase">{opt.name}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </MinigameShell>
  );
}
