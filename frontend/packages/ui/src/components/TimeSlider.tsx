import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { AudioPlayer } from "./AudioPlayer";

interface TimeSliderProps {
  period: "Trias" | "Jura" | "Kreide";
  startMya: number;
  endMya: number;
  dinoName?: string;
}

const PERIODS = [
  { id: "Trias", emoji: "🌋", label: "Trias", desc: "Erste Dinos", start: 252, end: 201, color: "#e8604c" },
  { id: "Jura", emoji: "🌿", label: "Jura", desc: "Riesen-Dinos", start: 201, end: 145, color: "#5ba67a" },
  { id: "Kreide", emoji: "☄️", label: "Kreide", desc: "Letzte Dinos", start: 145, end: 66, color: "#7ab648" },
] as const;

const TOTAL_START = 252;
const TOTAL_END = 66;
const TOTAL_RANGE = TOTAL_START - TOTAL_END;

function getStoryText(period: string, dinoName: string, startMya: number, endMya: number): string {
  const pos = endMya === 66 ? "ganz am Ende der Dino-Zeit, kurz bevor ein Asteroid alles veränderte"
    : startMya > 200 ? "ganz am Anfang, als die ersten Dinosaurier die Erde eroberten"
    : "mitten in der Dino-Zeit, als riesige Dinosaurier die Erde beherrschten";
  return `Der ${dinoName} lebte vor ${startMya} bis ${endMya} Millionen Jahren in der ${period}. ` +
    `Das war ${pos}. ` +
    `Die Dino-Zeit dauerte fast 200 Millionen Jahre — viel länger als es Menschen gibt!`;
}

export function TimeSlider({ period, startMya, endMya, dinoName = "Dino" }: TimeSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setVisible(true); },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dinoLeft = ((TOTAL_START - startMya) / TOTAL_RANGE) * 100;
  const dinoRight = ((TOTAL_START - endMya) / TOTAL_RANGE) * 100;

  return (
    <div ref={ref} className="bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow p-3">
      <p className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1">
        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>schedule</span>
        Wann hat er gelebt?
      </p>

      {/* Period icons row */}
      <div className="flex justify-between mb-2">
        {PERIODS.map((p) => {
          const isActive = p.id === period;
          return (
            <div key={p.id} className="flex flex-col items-center gap-0.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-[3px] transition-all ${
                  isActive ? "border-on-surface scale-110 shadow-[2px_2px_0px_0px_#1c1c17]" : "border-outline-variant opacity-40"
                }`}
                style={{ backgroundColor: isActive ? p.color : `${p.color}22` }}
              >
                {p.emoji}
              </div>
              <span className={`text-[9px] font-black uppercase ${isActive ? "text-on-surface" : "text-on-surface-variant/40"}`}>
                {p.label}
              </span>
              <span className={`text-[7px] font-semibold ${isActive ? "text-on-surface-variant" : "text-on-surface-variant/30"}`}>
                {p.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Timeline bar */}
      <div className="relative h-6 rounded-full overflow-hidden border-2 border-on-surface/20 mb-2">
        {PERIODS.map((p) => {
          const left = ((TOTAL_START - p.start) / TOTAL_RANGE) * 100;
          const width = ((p.start - p.end) / TOTAL_RANGE) * 100;
          const isActive = p.id === period;
          return (
            <div
              key={p.id}
              className="absolute top-0 h-full"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: isActive ? p.color : `${p.color}22`,
              }}
            />
          );
        })}

        {/* Animated dino marker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-on-surface rounded-full flex items-center justify-center z-10 shadow-md"
          initial={{ left: "0%", opacity: 0 }}
          animate={visible ? { left: `${(dinoLeft + dinoRight) / 2}%`, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3, type: "spring", damping: 15 }}
          style={{ marginLeft: "-12px" }}
        >
          <span className="text-xs">🦕</span>
        </motion.div>
      </div>

      {/* Year labels */}
      <div className="flex justify-between text-[8px] font-bold text-on-surface-variant mb-2">
        <span>252 Mio.</span>
        <motion.span
          className="font-black text-[10px] text-primary-container"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          ← {startMya}–{endMya} Mio. Jahre →
        </motion.span>
        <span>66 Mio.</span>
      </div>

      {/* Story AudioPlayer */}
      <AudioPlayer
        text={getStoryText(period, dinoName, startMya, endMya)}
        duration={18}
        compact
      />
    </div>
  );
}
