import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AudioPlayer } from "../../../../packages/ui/src/components/AudioPlayer";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { useHaptics } from "../../../../packages/ui/src/hooks/useHaptics";

// ── Interactive Dino Component ──────────────────────────────────

const FOOD_OPTIONS = [
  { id: "fern", emoji: "🌿", label: "Farn", correct: true },
  { id: "meat", emoji: "🥩", label: "Fleisch", correct: false },
  { id: "leaf", emoji: "🍃", label: "Blätter", correct: true },
];

function InteractiveDino({ name, image, diet }: { name: string; image: string; diet: string }) {
  const [mood, setMood] = useState<"idle" | "happy" | "love" | "eating" | "reject">("idle");
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [fedCount, setFedCount] = useState(0);
  const [message, setMessage] = useState("");
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
    setMood("love");
    haptics.tap();
    setTimeout(() => setMood("idle"), 800);
  }

  function handleFeed(food: typeof FOOD_OPTIONS[0]) {
    haptics.tap();
    if (food.correct) {
      setMood("eating");
      setFedCount((c) => c + 1);
      setMessage(`${name} liebt ${food.label}! 😋`);
      haptics.success();
    } else {
      setMood("reject");
      setMessage(`${name} mag kein ${food.label}! 🙅`);
      haptics.error();
    }
    setTimeout(() => { setMood("idle"); setMessage(""); }, 1500);
  }

  return (
    <div className="mx-4 mb-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1 mb-2">
        <span className="material-symbols-outlined" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>favorite</span>
        Dein neuer Freund
      </p>

      <div className="bg-gradient-to-br from-primary-fixed/40 to-tertiary-fixed/30 rounded-xl border-[3px] border-on-surface sticker-shadow p-5">
        {/* Dino touch area — touch-none prevents scroll hijack */}
        <div
          className="relative flex items-center justify-center mb-4 cursor-pointer select-none h-52 touch-none"
          onPointerDown={handlePet}
        >
          <motion.img
            src={image}
            alt={name}
            className="w-48 h-48 object-contain drop-shadow-lg"
            animate={
              mood === "love" ? { rotate: [0, -5, 5, -3, 0], scale: [1, 1.05, 1] }
                : mood === "eating" ? { y: [0, -5, 0], scale: [1, 1.08, 1] }
                : mood === "reject" ? { x: [0, -15, 15, -12, 8, -4, 0], rotate: [0, -3, 3, -2, 0] }
                : { y: [0, -2, 0] }
            }
            transition={
              mood === "idle" ? { repeat: Infinity, duration: 3, ease: "easeInOut" } : { duration: 0.5 }
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

          {/* Mood indicator */}
          {mood === "eating" && (
            <motion.span
              className="absolute -top-2 right-2 text-4xl"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 10 }}
            >
              😋
            </motion.span>
          )}
          {mood === "reject" && (
            <>
              {/* Big red X flies toward viewer */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: [0.2, 2.5, 2], opacity: [0, 1, 0.9] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <span className="text-7xl font-black text-error drop-shadow-[0_4px_12px_rgba(186,26,26,0.5)]">✕</span>
              </motion.div>
              {/* Shake ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-error/40 pointer-events-none"
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            </>
          )}
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.p
              className="text-center text-xs font-bold text-on-surface mb-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        {!message && (
          <p className="text-center text-[11px] text-on-surface-variant font-semibold mb-3">
            Streichle mich! Oder füttere mich mit dem richtigen Futter!
          </p>
        )}

        {/* Food options */}
        <div className="flex justify-center gap-3">
          {FOOD_OPTIONS.map((food) => (
            <motion.button
              key={food.id}
              onClick={() => handleFeed(food)}
              className="flex flex-col items-center gap-1 px-4 py-3 bg-white/80 rounded-xl border-[3px] border-on-surface/20 sticker-shadow"
              whileTap={{ scale: 0.85 }}
              disabled={mood !== "idle"}
            >
              <span className="text-3xl">{food.emoji}</span>
              <span className="text-[10px] font-bold text-on-surface-variant">{food.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Fed counter */}
        {fedCount > 0 && (
          <p className="text-center text-[10px] font-bold text-primary mt-2">
            {fedCount}x gefüttert! {fedCount >= 3 ? "🎉 Satt und glücklich!" : ""}
          </p>
        )}
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
        <span className="bg-secondary-container text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>new_releases</span>
          Neu entdeckt!
        </span>
      </header>

      {/* Scrollable */}
      <main className="flex-1 overflow-y-auto pb-6 max-w-md mx-auto w-full">
        {/* Hero: Echtes Bild */}
        <div className="mx-4 rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden mb-3">
          <img src={DINO.images.real} alt={DINO.name} className="w-full h-44 object-cover" />
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

        {/* Two Maps */}
        <div className="px-4 mb-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>public</span>
            Wo hat er gelebt?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {/* Damals (Kreidezeit Kontinent) */}
            <div className="bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow overflow-hidden">
              <div className="bg-primary-container/15 p-2 relative h-24">
                <svg viewBox="0 0 200 120" className="w-full h-full" style={{ fill: "#c0c9bb", stroke: "#a0a99c", strokeWidth: 0.5 }}>
                  <path d="M30,40 Q60,20 100,30 Q140,15 170,35 Q180,55 160,70 Q130,85 90,80 Q50,90 30,70 Q20,55 30,40Z" />
                </svg>
                <div className="absolute" style={{ top: "30%", left: "30%", transform: "translate(-50%,-50%)" }}>
                  <div className="w-4 h-4 bg-secondary-container border-2 border-on-surface rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: "10px", fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <p className="text-[9px] font-black uppercase text-on-surface-variant">Damals</p>
                <p className="text-[11px] font-bold text-on-surface">Kreidezeit</p>
              </div>
            </div>

            {/* Heute (Fundorte) */}
            <div className="bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow overflow-hidden">
              <div className="bg-tertiary-fixed/20 p-2 relative h-24">
                <svg viewBox="0 0 200 120" className="w-full h-full" style={{ fill: "#c0c9bb", stroke: "#a0a99c", strokeWidth: 0.5 }}>
                  <ellipse cx="50" cy="50" rx="30" ry="30" />
                  <ellipse cx="55" cy="85" rx="15" ry="20" />
                  <ellipse cx="105" cy="45" rx="15" ry="25" />
                  <ellipse cx="120" cy="70" rx="22" ry="30" />
                  <ellipse cx="155" cy="45" rx="28" ry="28" />
                  <ellipse cx="170" cy="95" rx="15" ry="12" />
                </svg>
                {[{ top: "35%", left: "20%" }, { top: "30%", left: "28%" }, { top: "40%", left: "24%" }].map((pos, i) => (
                  <div key={i} className="absolute w-2.5 h-2.5 bg-secondary-container border border-on-surface rounded-full" style={{ top: pos.top, left: pos.left, transform: "translate(-50%,-50%)" }} />
                ))}
              </div>
              <div className="p-2">
                <p className="text-[9px] font-black uppercase text-on-surface-variant">Heute (Funde)</p>
                <p className="text-[11px] font-bold text-on-surface">USA & Kanada</p>
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
