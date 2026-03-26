import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "../primitives/Icon";
import { useHaptics } from "../hooks/useHaptics";

export interface FoodOption {
  id: string;
  emoji: string;
  label: string;
  correct: boolean;
}

export interface InteractiveDinoProps {
  name: string;
  image: string;
  foodOptions?: FoodOption[];
}

const DEFAULT_FOOD: FoodOption[] = [
  { id: "fern", emoji: "🌿", label: "Farn", correct: true },
  { id: "meat", emoji: "🥩", label: "Fleisch", correct: false },
  { id: "leaf", emoji: "🍃", label: "Blätter", correct: true },
];

export function InteractiveDino({ name, image, foodOptions = DEFAULT_FOOD }: InteractiveDinoProps) {
  const [mood, setMood] = useState<"idle" | "happy" | "love" | "eating" | "reject" | "done">("idle");
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; dx: number; dy: number; emoji: string; size: number; delay: number }[]>([]);
  const [message, setMessage] = useState("");
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const heartId = useRef(0);
  const haptics = useHaptics();

  const spawnHearts = useCallback(() => {
    const emojis = ["❤️", "💕", "💖", "✨", "⭐"];
    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: heartId.current++,
      x: 50 + (Math.random() - 0.5) * 30,
      y: 50 + (Math.random() - 0.5) * 20,
      dx: (Math.random() - 0.5) * 120,
      dy: -40 - Math.random() * 80,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]!,
      size: 20 + Math.random() * 16,
      delay: i * 0.05,
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.find((n) => n.id === h.id)));
    }, 1500);
  }, []);

  function handlePet(e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    spawnHearts();
    haptics.tap();
    if (mood === "done") return;
    setMood("love");
    setTimeout(() => setMood("idle"), 800);
  }

  function handleFeed(food: FoodOption) {
    if (mood !== "idle") return;
    haptics.tap();
    if (food.correct) {
      setMood("eating");
      setMessage(`${name} liebt ${food.label}! 😋`);
      haptics.success();
      setTimeout(() => {
        setMood("done");
        setMessage(`${name} ist satt und glücklich!`);
        spawnHearts();
      }, 1200);
    } else {
      setWrongIds((prev) => [...prev, food.id]);
      setMood("reject");
      setMessage(`Nein! ${name} frisst kein ${food.label}!`);
      haptics.error();
      setTimeout(() => { setMood("idle"); setMessage(""); }, 1500);
    }
  }

  return (
    <div className="mx-4 mb-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1 mb-2">
        <Icon name="favorite" size="xs" filled />
        Dein neuer Freund
      </p>

      <div className="bg-gradient-to-br from-primary-fixed/40 to-tertiary-fixed/30 rounded-xl border-[3px] border-on-surface sticker-shadow p-5">
        {/* Dino area */}
        <div className="relative flex items-center justify-center mb-4 h-52">
          <motion.img
            src={image}
            alt={name}
            onPointerDown={handlePet}
            className="w-48 h-48 object-contain drop-shadow-lg cursor-pointer select-none touch-none"
            animate={
              mood === "love" ? { rotate: [0, -5, 5, -3, 0], scale: [1, 1.05, 1] }
                : mood === "eating" ? { y: [0, -8, 0], scale: [1, 1.1, 1] }
                : mood === "reject" ? { x: [0, -15, 15, -12, 8, -4, 0], rotate: [0, -3, 3, -2, 0] }
                : mood === "done" ? { y: [0, -10, 0], scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] }
                : { y: [0, -2, 0] }
            }
            transition={
              mood === "done" ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                : mood === "idle" ? { repeat: Infinity, duration: 3, ease: "easeInOut" }
                : { duration: 0.5 }
            }
          />

          <AnimatePresence>
            {hearts.map((heart) => (
              <motion.span
                key={heart.id}
                className="absolute pointer-events-none"
                style={{ left: `${heart.x}%`, top: `${heart.y}%`, fontSize: `${heart.size}px` }}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{ opacity: 0, x: heart.dx, y: heart.dy, scale: 1.3, rotate: (Math.random() - 0.5) * 40 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: heart.delay }}
              >
                {heart.emoji}
              </motion.span>
            ))}
          </AnimatePresence>

          {mood === "reject" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 2.5, 2], opacity: [0, 1, 0.9] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="text-7xl font-black text-error drop-shadow-[0_4px_12px_rgba(186,26,26,0.5)]">✕</span>
            </motion.div>
          )}
        </div>

        <div className="h-5 flex items-center justify-center mb-2">
          <AnimatePresence mode="wait">
            {message ? (
              <motion.p
                key="msg"
                className="text-center text-xs font-bold text-on-surface"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {message}
              </motion.p>
            ) : (
              <motion.p
                key="hint"
                className="text-center text-[11px] text-on-surface-variant font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Streichle mich! Oder füttere mich!
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="min-h-[60px] flex items-center justify-center">
          {mood === "done" ? (
            <motion.p
              className="text-center text-sm font-black text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              🎉 Satt und glücklich! 🎉
            </motion.p>
          ) : (
            <div className="flex justify-center gap-3">
              <AnimatePresence>
                {foodOptions.filter((f) => !wrongIds.includes(f.id)).map((food) => (
                  <motion.button
                    key={food.id}
                    layout
                    onClick={() => handleFeed(food)}
                    className="flex flex-col items-center gap-1 px-4 py-3 bg-white/80 rounded-xl border-[3px] border-on-surface/20 sticker-shadow"
                    whileTap={{ scale: 0.85 }}
                    disabled={mood !== "idle"}
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ layout: { duration: 0.3 } }}
                  >
                    <span className="text-3xl">{food.emoji}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant">{food.label}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
