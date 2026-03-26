import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AudioPlayer } from "../../../../packages/ui/src/components/AudioPlayer";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { StatusBadge } from "../../../../packages/ui/src/components/StatusBadge";
import { ImageSwitcher } from "../../../../packages/ui/src/components/ImageSwitcher";
import { TimeSlider } from "../../../../packages/ui/src/components/TimeSlider";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { useHaptics } from "../../../../packages/ui/src/hooks/useHaptics";

// ── Interactive Dino Component ──────────────────────────────────

const FOOD_OPTIONS = [
  { id: "fern", emoji: "🌿", label: "Farn", correct: true },
  { id: "meat", emoji: "🥩", label: "Fleisch", correct: false },
  { id: "leaf", emoji: "🍃", label: "Blätter", correct: true },
];

function InteractiveDino({ name, image, diet }: { name: string; image: string; diet: string }) {
  const [mood, setMood] = useState<"idle" | "happy" | "love" | "eating" | "reject" | "done">("idle");
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [message, setMessage] = useState("");
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const heartId = useRef(0);
  const haptics = useHaptics();

  const spawnHearts = useCallback(() => {
    // Hearts burst out from dino center in all directions
    const emojis = ["❤️", "💕", "💖", "✨", "⭐"];
    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: heartId.current++,
      x: 50 + (Math.random() - 0.5) * 30, // % from center
      y: 50 + (Math.random() - 0.5) * 20,
      dx: (Math.random() - 0.5) * 120, // spread distance
      dy: -40 - Math.random() * 80, // always float up
      emoji: emojis[Math.floor(Math.random() * emojis.length)]!,
      size: 20 + Math.random() * 16,
      delay: i * 0.05,
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.find((n) => n.id === h.id)));
    }, 1500);
  }, []);

  function handlePet() {
    spawnHearts();
    haptics.tap();
    // Don't override done state - dino stays happy after feeding
    if (mood === "done") return;
    setMood("love");
    setTimeout(() => setMood("idle"), 800);
  }

  function handleFeed(food: typeof FOOD_OPTIONS[0]) {
    if (mood !== "idle") return;
    haptics.tap();
    if (food.correct) {
      setMood("eating");
      setMessage(`${name} liebt ${food.label}! 😋`);
      haptics.success();
      // After eating animation → happy done state
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
        <span className="material-symbols-outlined" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>favorite</span>
        Dein neuer Freund
      </p>

      <div className="bg-gradient-to-br from-primary-fixed/40 to-tertiary-fixed/30 rounded-xl border-[3px] border-on-surface sticker-shadow p-5">
        {/* Dino area — only image is touchable */}
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

          {/* Particle burst from dino */}
          <AnimatePresence>
            {hearts.map((heart) => (
              <motion.span
                key={heart.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${heart.x}%`,
                  top: `${heart.y}%`,
                  fontSize: `${heart.size}px`,
                }}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{ opacity: 0, x: heart.dx, y: heart.dy, scale: 1.3, rotate: (Math.random() - 0.5) * 40 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: heart.delay }}
              >
                {heart.emoji}
              </motion.span>
            ))}
          </AnimatePresence>

          {/* Reject: big red X */}
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

        {/* Message — fixed height to prevent layout shift */}
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

        {/* Food or Done — single container, no nesting */}
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
              {FOOD_OPTIONS.filter((f) => !wrongIds.includes(f.id)).map((food) => (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const DINO = {
  name: "Triceratops",
  latin: "Dreihorn-Gesicht",
  region: "Nordamerika",
  images: {
    real: "/dinos/triceratops/real.png",
    comic: "/dinos/triceratops/comic.png",
  },
  mainStory:
    "Stell dir vor, vor 68 Millionen Jahren lief durch die dichten Wälder Nordamerikas ein riesiges Tier. " +
    "Es hatte drei große Hörner auf dem Kopf und einen gewaltigen Knochenschild im Nacken. " +
    "Das war der Triceratops — einer der bekanntesten Dinosaurier überhaupt! " +
    "Mit seinen Hörnern konnte er sich gegen gefährliche Raubtiere wie den T-Rex verteidigen. " +
    "Obwohl er so groß war wie zwei Autos, war er ein friedlicher Pflanzenfresser.",
  facts: [
    {
      icon: "calendar_month", label: "Zeitalter", value: "Kreidezeit", sub: "68–66 Mio. Jahre",
      color: "bg-primary-fixed/40 border-primary/20",
      story: "Der Triceratops lebte ganz am Ende der Kreidezeit. Das war die allerletzte Zeit der Dinosaurier! Kurz danach schlug ein riesiger Asteroid auf der Erde ein.",
    },
    {
      icon: "restaurant", label: "Nahrung", value: "Pflanzenfresser",
      color: "bg-primary-fixed/40 border-primary/20",
      story: "Obwohl er so riesig war, fraß er nur Pflanzen! Farne, Palmblätter und Büsche. Mit seinem scharfen Schnabel knipste er Äste ab wie mit einer Schere.",
    },
    {
      icon: "straighten", label: "Länge", value: "9 Meter",
      color: "bg-tertiary-fixed/40 border-tertiary/20",
      story: "Neun Meter lang — so lang wie zwei große Autos hintereinander! Allein sein Kopf war über zwei Meter lang. Größer als ein Erwachsener!",
    },
    {
      icon: "scale", label: "Gewicht", value: "6–12 Tonnen",
      color: "bg-tertiary-fixed/40 border-tertiary/20",
      story: "So schwer wie zwei Elefanten zusammen! Trotzdem konnte er bis zu 30 km/h schnell rennen wenn er musste.",
    },
    {
      icon: "group", label: "Verhalten", value: "Herdentier",
      color: "bg-secondary-fixed/40 border-secondary/20",
      story: "Triceratops lebte in großen Herden. Die Großen beschützten die Babys in der Mitte — genau wie Elefanten heute!",
    },
    {
      icon: "lightbulb", label: "Wusstest du?", value: "800 Zähne!",
      color: "bg-secondary-fixed/40 border-secondary/20",
      story: "800 Zähne die ständig nachwuchsen — genau wie bei einem Hai! In seinem ganzen Leben hatte er tausende Zähne.",
    },
  ],
};

const DINO_IMAGES = [
  { id: "real", label: "Echt", icon: "photo_camera", url: "/dinos/triceratops/real.png" },
  { id: "comic", label: "Comic", icon: "brush", url: "/dinos/triceratops/comic.png", bg: "bg-gradient-to-br from-primary-fixed/30 to-tertiary-fixed/20", contain: true },
  { id: "skeleton", label: "Skelett", icon: "skeleton", url: "/dinos/triceratops/skeleton.png", bg: "bg-[#2C1A0E]" },
];

export function DiscoveryScreen() {
  const [activeFact, setActiveFact] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 z-10">
        <button className="w-9 h-9 flex items-center justify-center bg-surface-container-lowest border-[3px] border-on-surface rounded-lg sticker-shadow active-press">
          <span className="material-symbols-outlined text-on-surface text-lg">close</span>
        </button>
        <StatusBadge label="Neu entdeckt!" variant="warning" icon="new_releases" />
      </header>

      {/* Scrollable */}
      <main className="flex-1 overflow-y-auto pb-6 max-w-md mx-auto w-full">
        {/* Hero Image — square, switchable */}
        <div className="mx-4 mb-2">
          <ImageSwitcher views={DINO_IMAGES} alt={DINO.name} square />
        </div>

        {/* Name */}
        <div className="text-center mb-2 px-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black uppercase tracking-tight">{DINO.name}</h1>
            <button className="w-7 h-7 bg-surface-container-high border-2 border-outline-variant rounded-full flex items-center justify-center active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>volume_up</span>
            </button>
          </div>
          <p className="text-xs font-semibold text-on-surface-variant italic">{DINO.latin}</p>
        </div>

        {/* Main Story */}
        <div className="mb-4 px-4">
          <AudioPlayer text={DINO.mainStory} duration={35} />
        </div>

        {/* Fact Carousel */}
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1 px-4 mb-2">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>school</span>
            Steckbrief — wische durch
          </p>

          <div
            ref={scrollRef}
            className="flex gap-2.5 overflow-x-auto px-4 pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            onScroll={() => {
              if (!scrollRef.current) return;
              const cardWidth = 260 + 10;
              const idx = Math.round(scrollRef.current.scrollLeft / cardWidth);
              setActiveFact(Math.min(idx, DINO.facts.length - 1));
            }}
          >
            {DINO.facts.map((fact) => (
              <div key={fact.label} className={`flex-shrink-0 w-[260px] snap-center rounded-xl border-[3px] ${fact.color} p-3`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white/80 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-surface" style={{ fontSize: "18px" }}>{fact.icon}</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-on-surface-variant uppercase">{fact.label}</p>
                    <p className="text-sm font-black text-on-surface leading-tight">{fact.value}</p>
                    {fact.sub && <p className="text-[9px] text-on-surface-variant">{fact.sub}</p>}
                  </div>
                </div>
                <AudioPlayer text={fact.story} duration={12} compact />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-1.5 mt-2">
            {DINO.facts.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === activeFact ? "w-4 bg-primary-container" : "w-1.5 bg-outline-variant"}`} />
            ))}
          </div>
        </div>

        {/* Time Slider with real maps */}
        <div className="px-4 mb-4">
          <TimeSlider
            period="Kreide"
            startMya={68}
            endMya={66}
            dinoImage="/dinos/triceratops/comic.png"
            dinoMapPosition={{ left: "22%", top: "35%" }}
          />
        </div>

        {/* Fundorte heute */}
        <div className="px-4 mb-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>location_on</span>
            Wo findet man Skelette heute?
          </p>
          <div className="bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden">
            <div className="relative">
              <img src="/maps/heute.png" alt="Heutige Fundorte" className="w-full h-auto" />
              {/* Pins in USA/Canada */}
              {[
                { left: "18%", top: "38%" },
                { left: "22%", top: "33%" },
                { left: "15%", top: "42%" },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-secondary-container border-2 border-on-surface rounded-full shadow-md"
                  style={{ left: pos.left, top: pos.top, transform: "translate(-50%,-50%)" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.15, type: "spring", damping: 12 }}
                />
              ))}
              <div className="absolute bottom-2 left-2 bg-on-surface/70 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase">
                Fundorte · USA & Kanada
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Dino Friend */}
        <InteractiveDino name={DINO.name} image={DINO.images.comic} diet="Pflanzenfresser" />

        {/* Forscher */}
        <div className="mx-4 mb-4">
          <ForscherSpeech text="Streichle deinen neuen Freund! Und füttere ihn mit dem richtigen Futter!" />
        </div>

        {/* Museum CTA */}
        <div className="mx-4">
          <Button variant="primary" fullWidth icon="museum">Ab ins Museum!</Button>
        </div>
      </main>
    </div>
  );
}
