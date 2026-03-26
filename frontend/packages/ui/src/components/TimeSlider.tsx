import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

interface TimeSliderProps {
  period: "Trias" | "Jura" | "Kreide";
  startMya: number; // millions of years ago
  endMya: number;
}

const PERIODS = [
  { id: "Trias", label: "Trias", start: 252, end: 201, color: "#e8604c" },
  { id: "Jura", label: "Jura", start: 201, end: 145, color: "#5ba67a" },
  { id: "Kreide", label: "Kreide", start: 145, end: 66, color: "#7ab648" },
] as const;

const TOTAL_START = 252;
const TOTAL_END = 66;
const TOTAL_RANGE = TOTAL_START - TOTAL_END;

export function TimeSlider({ period, startMya, endMya }: TimeSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setVisible(true); },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Dino position on the bar
  const dinoLeft = ((TOTAL_START - startMya) / TOTAL_RANGE) * 100;
  const dinoRight = ((TOTAL_START - endMya) / TOTAL_RANGE) * 100;

  return (
    <div ref={ref} className="bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow p-3">
      <p className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-1">
        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>schedule</span>
        Zeitleiste der Dinosaurier
      </p>

      {/* Timeline bar */}
      <div className="relative h-8 rounded-full overflow-hidden border-2 border-on-surface/20 mb-1">
        {/* Period segments */}
        {PERIODS.map((p) => {
          const left = ((TOTAL_START - p.start) / TOTAL_RANGE) * 100;
          const width = ((p.start - p.end) / TOTAL_RANGE) * 100;
          const isActive = p.id === period;
          return (
            <div
              key={p.id}
              className="absolute top-0 h-full flex items-center justify-center"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: isActive ? p.color : `${p.color}33`,
              }}
            >
              <span className={`text-[8px] font-black uppercase ${isActive ? "text-white" : "text-on-surface-variant/60"}`}>
                {p.label}
              </span>
            </div>
          );
        })}

        {/* Dino range indicator - animates in */}
        <motion.div
          className="absolute top-0 h-full border-2 border-white rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
          initial={{ left: `${dinoLeft}%`, width: "0%" }}
          animate={visible ? { left: `${dinoLeft}%`, width: `${dinoRight - dinoLeft}%` } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />

        {/* Dino marker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-on-surface rounded-full flex items-center justify-center z-10 shadow-md"
          initial={{ left: "0%", opacity: 0 }}
          animate={visible ? { left: `${(dinoLeft + dinoRight) / 2}%`, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, type: "spring", damping: 15 }}
          style={{ marginLeft: "-10px" }}
        >
          <span className="text-[10px]">🦕</span>
        </motion.div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-[8px] font-bold text-on-surface-variant">
        <span>252 Mio. Jahre</span>
        <motion.span
          className="font-black text-[10px] text-primary-container"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          {startMya}–{endMya} Mio. Jahre
        </motion.span>
        <span>66 Mio. Jahre</span>
      </div>

      {/* Context */}
      <motion.p
        className="text-[10px] text-on-surface-variant text-center mt-1.5 font-semibold"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 1.8 }}
      >
        {endMya === 66 ? "Ganz am Ende — einer der allerletzten Dinos!" :
         startMya > 200 ? "Einer der ersten Dinosaurier!" :
         "Mitten in der Dino-Zeit!"}
      </motion.p>
    </div>
  );
}
