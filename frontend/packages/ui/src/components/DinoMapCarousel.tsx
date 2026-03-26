import { useState, useRef, type ReactNode } from "react";
import { Icon } from "../primitives/Icon";

export interface MapCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color?: string;
  content: ReactNode;
}

export interface DinoMapCarouselProps {
  cards: MapCard[];
  title?: string;
}

export function DinoMapCarousel({ cards, title = "Entdecke mehr — wische durch" }: DinoMapCarouselProps) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (cards.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1 px-4 mb-2">
        <Icon name="explore" size="xs" />
        {title}
      </p>
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto px-4 pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
        onScroll={() => {
          if (!scrollRef.current) return;
          const idx = Math.round(scrollRef.current.scrollLeft / (scrollRef.current.scrollWidth / cards.length));
          setActive(Math.min(idx, cards.length - 1));
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`flex-shrink-0 w-[300px] snap-center rounded-xl border-[3px] border-on-surface sticker-shadow bg-gradient-to-br ${card.color || "from-primary-fixed/20 to-primary-fixed/5"} p-3`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-white/80 rounded-lg flex items-center justify-center">
                <Icon name={card.icon} size="sm" className="text-on-surface" />
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
        {cards.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-primary-container" : "w-1.5 bg-outline-variant"}`} />
        ))}
      </div>
    </div>
  );
}

/** Helper: build default map cards for a dino (used in Storybook/demo mode) */
export function buildDefaultMapCards(dino: {
  comicImageUrl: string;
  period: string;
  periodStartMya?: number;
  periodEndMya?: number;
  continent: string;
}): MapCard[] {
  const periodEmoji = dino.period === "Trias" ? "🌋" : dino.period === "Jura" ? "🌿" : "☄️";
  const periodColor = dino.period === "Trias" ? "#e8604c" : dino.period === "Jura" ? "#5ba67a" : "#7ab648";

  return [
    {
      id: "wann",
      title: "Wann hat er gelebt?",
      subtitle: `${dino.period} · ${dino.periodStartMya ?? "?"}–${dino.periodEndMya ?? "?"} Mio. Jahre`,
      icon: "schedule",
      color: "from-[#7ab648]/20 to-[#7ab648]/5",
      content: (
        <div>
          <div className="flex gap-1 mb-1.5">
            {["Trias", "Jura", "Kreide"].map((p) => (
              <div
                key={p}
                className={`flex-1 h-8 rounded-lg flex flex-col items-center justify-center ${
                  p === dino.period
                    ? `bg-[${periodColor}] border-2 border-[${periodColor}] shadow-[2px_2px_0px_0px_#1c1c17]`
                    : `bg-[${p === "Trias" ? "#e8604c" : p === "Jura" ? "#5ba67a" : "#7ab648"}]/25`
                }`}
              >
                <span className="text-base leading-none">{p === "Trias" ? "🌋" : p === "Jura" ? "🌿" : "☄️"}</span>
                <span className={`text-[7px] font-black ${p === dino.period ? "text-white" : "opacity-50"}`}>{p.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "wo",
      title: "Wo hat er gelebt?",
      subtitle: dino.continent,
      icon: "public",
      color: "from-primary-fixed/30 to-primary-fixed/5",
      content: (
        <div className="flex items-center gap-2">
          <span className="text-3xl">{periodEmoji}</span>
          <p className="text-sm font-bold text-on-surface">{dino.continent}</p>
        </div>
      ),
    },
  ];
}
