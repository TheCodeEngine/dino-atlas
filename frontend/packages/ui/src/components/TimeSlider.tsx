import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

interface TimeSliderProps {
  period: "Trias" | "Jura" | "Kreide";
  startMya: number;
  endMya: number;
  dinoImage?: string;
  /** Position on the active period map where the dino lived (% from left, % from top) */
  dinoMapPosition?: { left: string; top: string };
}

const PERIODS = [
  { id: "Trias", label: "Trias", start: 252, end: 201, color: "#e8604c", map: "/maps/trias.png" },
  { id: "Jura", label: "Jura", start: 201, end: 145, color: "#5ba67a", map: "/maps/jura.png" },
  { id: "Kreide", label: "Kreide", start: 145, end: 66, color: "#7ab648", map: "/maps/kreide.png" },
] as const;

const TOTAL_START = 252;
const TOTAL_END = 66;
const TOTAL_RANGE = TOTAL_START - TOTAL_END;

export function TimeSlider({ period, startMya, endMya, dinoImage, dinoMapPosition }: TimeSliderProps) {
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
  const activePeriod = PERIODS.find((p) => p.id === period)!;

  return (
    <div ref={ref} className="bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden">
      {/* Active period map with dino position */}
      <div className="relative">
        <img
          src={activePeriod.map}
          alt={`Erde in der ${period}`}
          className="w-full h-auto"
        />
        {/* Dino marker on map */}
        {dinoImage && dinoMapPosition && (
          <motion.div
            className="absolute"
            style={{ left: dinoMapPosition.left, top: dinoMapPosition.top, transform: "translate(-50%, -100%)" }}
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={visible ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.6, type: "spring", damping: 12 }}
          >
            <img src={dinoImage} alt="" className="w-10 h-10 object-contain drop-shadow-md" />
            <div className="w-2 h-2 bg-secondary-container border border-on-surface rounded-full mx-auto -mt-1" />
          </motion.div>
        )}
        {/* Period label overlay */}
        <div className="absolute bottom-2 left-2 bg-on-surface/70 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase">
          {period} · {startMya}–{endMya} Mio. Jahre
        </div>
      </div>

      {/* Timeline bar + period bubbles */}
      <div className="p-3">
        {/* Period selector bubbles */}
        <div className="flex justify-between mb-2">
          {PERIODS.map((p) => {
            const isActive = p.id === period;
            return (
              <div key={p.id} className="flex flex-col items-center gap-0.5">
                <div
                  className={`rounded-lg overflow-hidden border-[3px] transition-all ${
                    isActive
                      ? "w-16 h-9 border-on-surface shadow-[2px_2px_0px_0px_#1c1c17]"
                      : "w-12 h-7 border-outline-variant opacity-35"
                  }`}
                >
                  <img src={p.map} alt={p.label} className="w-full h-full object-cover" />
                </div>
                <span className={`text-[8px] font-black uppercase ${isActive ? "text-on-surface" : "text-on-surface-variant/40"}`}>
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Timeline bar */}
        <div className="relative h-4 rounded-full overflow-hidden border-2 border-on-surface/20 mb-1">
          {PERIODS.map((p) => {
            const left = ((TOTAL_START - p.start) / TOTAL_RANGE) * 100;
            const width = ((p.start - p.end) / TOTAL_RANGE) * 100;
            const isActive = p.id === period;
            return (
              <div
                key={p.id}
                className="absolute top-0 h-full"
                style={{ left: `${left}%`, width: `${width}%`, backgroundColor: isActive ? p.color : `${p.color}22` }}
              />
            );
          })}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-on-surface rounded-full flex items-center justify-center z-10 shadow-md"
            initial={{ left: "0%", opacity: 0 }}
            animate={visible ? { left: `${(dinoLeft + dinoRight) / 2}%`, opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, type: "spring", damping: 15 }}
            style={{ marginLeft: "-8px" }}
          >
            <span className="text-[8px]">🦕</span>
          </motion.div>
        </div>

        <div className="flex justify-between text-[7px] font-bold text-on-surface-variant">
          <span>252 Mio.</span>
          <span>66 Mio.</span>
        </div>
      </div>
    </div>
  );
}
