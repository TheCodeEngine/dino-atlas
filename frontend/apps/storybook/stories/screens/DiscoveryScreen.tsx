import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AudioPlayer } from "../../../../packages/ui/src/components/AudioPlayer";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { ImageSwitcher } from "../../../../packages/ui/src/components/ImageSwitcher";
import { useHaptics } from "../../../../packages/ui/src/hooks/useHaptics";

// ── Map Carousel: Wann → Wo damals → Wo heute ──────────────────

const MAP_CARDS = [
  {
    id: "wann",
    title: "Wann hat er gelebt?",
    subtitle: "Kreidezeit · 68–66 Mio. Jahre",
    icon: "schedule",
    color: "from-[#7ab648]/20 to-[#7ab648]/5",
    content: (
      <div className="relative">
        {/* Dino bubble pointing to Kreide */}
        <div className="flex justify-end pr-4 mb-1">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-[3px] border-[#7ab648] bg-white shadow-[2px_2px_0px_0px_#1c1c17] flex items-center justify-center overflow-hidden">
              <img src="/dinos/triceratops/comic.png" alt="" className="w-10 h-10 object-contain" />
            </div>
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#7ab648] -mt-0.5" />
          </div>
        </div>
        {/* Timeline bar */}
        <div className="flex gap-1 mb-1.5">
          <div className="flex-1 h-8 rounded-lg bg-[#e8604c]/25 flex flex-col items-center justify-center">
            <span className="text-base leading-none">🌋</span>
            <span className="text-[7px] font-black text-[#e8604c]/50">TRIAS</span>
          </div>
          <div className="flex-1 h-8 rounded-lg bg-[#5ba67a]/25 flex flex-col items-center justify-center">
            <span className="text-base leading-none">🌿</span>
            <span className="text-[7px] font-black text-[#5ba67a]/50">JURA</span>
          </div>
          <div className="flex-1 h-8 rounded-lg bg-[#7ab648] border-2 border-[#7ab648] flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_#1c1c17]">
            <span className="text-base leading-none">☄️</span>
            <span className="text-[7px] font-black text-white">KREIDE</span>
          </div>
        </div>
        <p className="text-[10px] text-on-surface text-center font-bold">
          Ganz am Ende der Dino-Zeit! ☄️
        </p>
        <p className="text-[9px] text-on-surface-variant text-center">
          Einer der allerletzten Dinosaurier überhaupt.
        </p>
      </div>
    ),
  },
  {
    id: "damals",
    title: "Wo hat er gelebt?",
    subtitle: "Kreidezeit-Kontinente",
    icon: "public",
    color: "from-primary-fixed/30 to-primary-fixed/5",
    content: (
      <div>
        <div className="relative rounded-lg overflow-hidden border-2 border-on-surface/20">
          <img src="/maps/kreide.png" alt="Kreidezeit" className="w-full h-auto" />
          <div className="absolute" style={{ left: "22%", top: "32%", transform: "translate(-50%,-100%)" }}>
            <img src="/dinos/triceratops/comic.png" alt="" className="w-10 h-10 object-contain drop-shadow-md" />
            <div className="w-2.5 h-2.5 bg-secondary-container border-2 border-on-surface rounded-full mx-auto -mt-1" />
          </div>
          <div className="absolute bottom-1.5 left-1.5 bg-on-surface/70 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
            Laramidia (Nordamerika)
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "heute",
    title: "Wo findet man ihn heute?",
    subtitle: "Skelett-Fundorte",
    icon: "location_on",
    color: "from-tertiary-fixed/30 to-tertiary-fixed/5",
    content: (
      <div>
        <div className="relative rounded-lg overflow-hidden border-2 border-on-surface/20">
          <img src="/maps/heute.png" alt="Heute" className="w-full h-auto" />
          {[
            { left: "18%", top: "38%" },
            { left: "22%", top: "33%" },
            { left: "15%", top: "42%" },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-secondary-container border-2 border-on-surface rounded-full shadow-md"
              style={{ left: pos.left, top: pos.top, transform: "translate(-50%,-50%)" }}
            />
          ))}
          <div className="absolute bottom-1.5 left-1.5 bg-on-surface/70 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
            USA & Kanada
          </div>
        </div>
      </div>
    ),
  },
];

function MapCarousel({ dinoImage }: { dinoImage: string }) {
  const [activeMap, setActiveMap] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mb-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1 px-4 mb-2">
        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>explore</span>
        Entdecke mehr — wische durch
      </p>
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto px-4 pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
        onScroll={() => {
          if (!scrollRef.current) return;
          const idx = Math.round(scrollRef.current.scrollLeft / (scrollRef.current.scrollWidth / MAP_CARDS.length));
          setActiveMap(Math.min(idx, MAP_CARDS.length - 1));
        }}
      >
        {MAP_CARDS.map((card) => (
          <div
            key={card.id}
            className={`flex-shrink-0 w-[300px] snap-center rounded-xl border-[3px] border-on-surface sticker-shadow bg-gradient-to-br ${card.color} p-3`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-white/80 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface" style={{ fontSize: "16px" }}>{card.icon}</span>
              </div>
              <div>
                <p className="text-xs font-black text-on-surface">{card.title}</p>
                <p className="text-[9px] text-on-surface-variant font-semibold">{card.subtitle}</p>
              </div>
            </div>
            {card.content}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mt-2">
        {MAP_CARDS.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === activeMap ? "w-4 bg-primary-container" : "w-1.5 bg-outline-variant"}`} />
        ))}
      </div>
    </div>
  );
}

// ── Museum CTA with animation ───────────────────────────────────

function MuseumCTA({ dinoImage, dinoName }: { dinoImage: string; dinoName: string }) {
  const [phase, setPhase] = useState<"idle" | "run" | "enter" | "done">("idle");
  const haptics = useHaptics();

  function handleClick() {
    if (phase !== "idle") return;
    haptics.success();
    setPhase("run");
    setTimeout(() => setPhase("enter"), 2500);
    setTimeout(() => setPhase("done"), 3200);
  }

  return (
    <>
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundImage: "none" }}
          >
            {/* Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#3d7cc9] via-[#7ec8e3] to-[#b5dfef]" />

            {/* Sun */}
            <motion.div
              className="absolute top-[8%] right-[15%] w-16 h-16 rounded-full bg-[#FFD93D]"
              style={{ boxShadow: "0 0 40px 15px rgba(255,217,61,0.4)" }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Background mountains (parallax slow) */}
            <motion.div
              className="absolute bottom-[30%] left-0 right-0 h-[20%]"
              animate={phase === "run" ? { x: [0, -60] } : {}}
              transition={{ duration: 2.5, ease: "linear" }}
            >
              {[0, 80, 170, 260, 350, 440].map((x, i) => (
                <div
                  key={i}
                  className="absolute bottom-0"
                  style={{ left: `${x}px`, width: 0, height: 0, borderLeft: `${40 + i * 5}px solid transparent`, borderRight: `${40 + i * 5}px solid transparent`, borderBottom: `${50 + i * 8}px solid ${i % 2 === 0 ? "#5a9e4b" : "#4a8c3f"}` }}
                />
              ))}
            </motion.div>

            {/* Mid-ground trees (parallax medium) */}
            <motion.div
              className="absolute bottom-[28%] left-0 flex gap-12"
              animate={phase === "run" ? { x: [100, -200] } : {}}
              transition={{ duration: 2.5, ease: "linear" }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="text-3xl">{i % 2 === 0 ? "🌲" : "🌳"}</span>
              ))}
            </motion.div>

            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[#2d5a1e] via-[#3d7a2e] to-[#5aad3e]" />

            {/* Foreground grass (parallax fast - 3D effect) */}
            <motion.div
              className="absolute bottom-[27%] left-0 flex gap-4 z-20"
              animate={phase === "run" ? { x: [200, -400] } : {}}
              transition={{ duration: 2.5, ease: "linear" }}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <span key={i} className="text-2xl" style={{ transform: `rotate(${(i % 3 - 1) * 20}deg)` }}>
                  {i % 4 === 0 ? "🌿" : i % 4 === 1 ? "🌾" : i % 4 === 2 ? "🍃" : "🌱"}
                </span>
              ))}
            </motion.div>

            {/* Dust particles */}
            {phase === "run" && Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[#c8a96a]/60 z-10"
                style={{ bottom: `${28 + Math.random() * 4}%`, left: "35%" }}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: [0, 0.8, 0], x: -(30 + Math.random() * 40), y: -(10 + Math.random() * 20) }}
                transition={{ duration: 0.6, delay: i * 0.3, repeat: 4, ease: "easeOut" }}
              />
            ))}

            {/* Museum (appears from right) */}
            <motion.div
              className="absolute bottom-[30%] right-4 flex flex-col items-center z-10"
              initial={{ x: 200 }}
              animate={phase === "run" ? { x: [200, 0] } : { x: 0 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            >
              <div className="w-0 h-0 border-l-[50px] border-r-[50px] border-b-[24px] border-l-transparent border-r-transparent border-b-[#d4a56a] mb-[-2px]" />
              <div className="bg-[#f5e6c8] border-[3px] border-on-surface w-24 h-24 flex flex-col items-center justify-between py-1.5 shadow-xl">
                <span className="material-symbols-outlined text-primary-container" style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>museum</span>
                <p className="text-[7px] font-black uppercase text-on-surface-variant">Museum</p>
                <motion.div
                  className="w-9 h-11 bg-[#6B3410] border-[2px] border-on-surface rounded-t-lg"
                  animate={phase === "enter" || phase === "done" ? { scaleX: [1, 0.05] } : {}}
                  transition={{ duration: 0.25 }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            </motion.div>

            {/* Dino running on ground */}
            <motion.div
              className="absolute bottom-[30%] z-10"
              style={{ marginBottom: "-4px" }}
              initial={{ left: "-15%" }}
              animate={
                phase === "run" ? { left: "60%" }
                : phase === "enter" ? { left: "72%", scale: 0.3, opacity: 0 }
                : {}
              }
              transition={
                phase === "run" ? { duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }
                : { duration: 0.4, ease: "easeIn" }
              }
            >
              <motion.img
                src={dinoImage}
                alt=""
                className="w-16 h-16 object-contain drop-shadow-lg -translate-y-full"
                style={{ scaleX: -1 }}
                animate={phase === "run" ? { y: [0, -12, 0] } : {}}
                transition={{ duration: 0.35, repeat: 7, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Done state */}
            {phase === "done" && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="absolute inset-0 bg-on-surface/30" />
                <motion.div
                  className="flex flex-col items-center relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ type: "spring", damping: 8 }}
                >
                  <span className="text-7xl mb-3">🏛️</span>
                  <p className="text-3xl font-black text-white uppercase" style={{ textShadow: "0 4px 0 rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.4)" }}>
                    Im Museum!
                  </p>
                </motion.div>

                {["🎉", "⭐", "✨", "🦕", "🌟", "🎊", "💫", "🎉", "⭐", "✨"].map((e, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-3xl z-40"
                    style={{ left: `${5 + i * 10}%`, top: `${15 + (i % 4) * 15}%` }}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: [0, 1.8, 0], rotate: [0, 360], y: [0, -60] }}
                    transition={{ delay: i * 0.06, duration: 1.5, repeat: Infinity, repeatDelay: 1.2 }}
                  >{e}</motion.span>
                ))}

                <motion.button
                  className="mt-10 px-8 py-3 bg-white text-primary-container border-[3px] border-on-surface rounded-xl sticker-shadow font-black uppercase tracking-wider text-sm flex items-center gap-2 relative z-40"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setPhase("idle")}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>check</span>
                  Weiter geht's!
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button - Museum icon instead of dino */}
      <div className="mx-4">
        <button
          onClick={handleClick}
          className="w-full bg-gradient-to-br from-primary-container to-[#2E7D32] rounded-xl border-[3px] border-on-surface sticker-shadow active-press overflow-hidden text-left"
        >
          <div className="flex items-center gap-3 p-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>museum</span>
            </div>
            <div className="flex-1 text-white min-w-0">
              <p className="text-base font-black uppercase tracking-tight leading-tight">Ab ins Museum!</p>
            </div>
            <span className="material-symbols-outlined text-white/80" style={{ fontSize: "24px" }}>arrow_forward</span>
          </div>
        </button>
      </div>
    </>
  );
}

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

  function handlePet(e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    spawnHearts();
    haptics.tap();
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
        <span className="bg-secondary-container text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>new_releases</span>
          Neu entdeckt!
        </span>
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

        {/* Map Carousel: Wann → Wo damals → Wo heute */}
        <MapCarousel dinoImage="/dinos/triceratops/comic.png" />

        {/* Interactive Dino Friend */}
        <InteractiveDino name={DINO.name} image={DINO.images.comic} diet="Pflanzenfresser" />

        {/* Forscher */}
        <div className="mx-4 mb-4">
          <ForscherSpeech text="Streichle deinen neuen Freund! Und füttere ihn mit dem richtigen Futter!" />
        </div>

        {/* Museum CTA with animation */}
        <MuseumCTA dinoImage={DINO.images.comic} dinoName={DINO.name} />
      </main>
    </div>
  );
}
