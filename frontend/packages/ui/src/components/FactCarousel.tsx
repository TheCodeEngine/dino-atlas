import { useState, useRef } from "react";
import { AudioPlayer } from "./AudioPlayer";
import { Icon } from "../primitives/Icon";

export interface Fact {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  story: string;
  color?: string;
}

export interface FactCarouselProps {
  facts: Fact[];
  title?: string;
}

const DEFAULT_COLORS = [
  "bg-primary-fixed/40 border-primary/20",
  "bg-primary-fixed/40 border-primary/20",
  "bg-tertiary-fixed/40 border-tertiary/20",
  "bg-tertiary-fixed/40 border-tertiary/20",
  "bg-secondary-fixed/40 border-secondary/20",
  "bg-secondary-fixed/40 border-secondary/20",
  "bg-primary-fixed/40 border-primary/20",
];

export function FactCarousel({ facts, title = "Steckbrief — wische durch" }: FactCarouselProps) {
  const [activeFact, setActiveFact] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mb-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1 px-4 mb-2">
        <Icon name="school" size="xs" />
        {title}
      </p>

      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto px-4 pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        onScroll={() => {
          if (!scrollRef.current) return;
          const cardWidth = 260 + 10;
          const idx = Math.round(scrollRef.current.scrollLeft / cardWidth);
          setActiveFact(Math.min(idx, facts.length - 1));
        }}
      >
        {facts.map((fact, i) => (
          <div
            key={fact.label}
            className={`flex-shrink-0 w-[260px] snap-center rounded-xl border-[3px] ${fact.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} p-3`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white/80 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={fact.icon} size="md" className="text-on-surface" />
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
        {facts.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === activeFact ? "w-4 bg-primary-container" : "w-1.5 bg-outline-variant"}`}
          />
        ))}
      </div>
    </div>
  );
}
