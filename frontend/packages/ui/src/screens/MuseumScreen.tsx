import { ProgressBar } from "../primitives/ProgressBar";
import { StarRating } from "../primitives/StarRating";
import { Skeleton } from "../primitives/Skeleton";
import { ForscherSpeech } from "../components/ForscherSpeech";

export interface MuseumDino {
  id: string;
  name: string;
  image: string | null;
  rarity: string;
  discovered: boolean;
  stars: number;
}

export interface MuseumScreenProps {
  dinos?: MuseumDino[];
  loading?: boolean;
  onSelectDino?: (id: string) => void;
}

const DEMO_DINOS: MuseumDino[] = [
  { id: "trex", name: "T-Rex", image: null, rarity: "legendary", discovered: true, stars: 3 },
  { id: "triceratops", name: "Triceratops", image: "/dinos/triceratops/comic.png", rarity: "rare", discovered: true, stars: 2 },
  { id: "stegosaurus", name: "Stegosaurus", image: null, rarity: "uncommon", discovered: true, stars: 1 },
  { id: "velociraptor", name: "Velociraptor", image: null, rarity: "rare", discovered: true, stars: 0 },
  { id: "brachiosaurus", name: "Brachiosaurus", image: null, rarity: "epic", discovered: false, stars: 0 },
  { id: "ankylosaurus", name: "Ankylosaurus", image: null, rarity: "uncommon", discovered: false, stars: 0 },
  { id: "pteranodon", name: "Pteranodon", image: null, rarity: "rare", discovered: false, stars: 0 },
  { id: "spinosaurus", name: "Spinosaurus", image: null, rarity: "epic", discovered: false, stars: 0 },
  { id: "parasaurolophus", name: "Parasauro.", image: null, rarity: "common", discovered: false, stars: 0 },
];

const RARITY_COLORS: Record<string, string> = {
  common: "bg-surface-container-high text-on-surface-variant",
  uncommon: "bg-primary-fixed text-on-primary-fixed",
  rare: "bg-tertiary-fixed text-on-tertiary-fixed",
  epic: "bg-secondary-fixed text-on-secondary-fixed",
  legendary: "bg-secondary-container text-white",
};

export function MuseumScreen({
  dinos = DEMO_DINOS,
  loading = false,
  onSelectDino,
}: MuseumScreenProps = {}) {
  if (loading) return <MuseumSkeleton />;

  const discovered = dinos.filter((d) => d.discovered).length;
  const total = dinos.length;
  const percent = total > 0 ? Math.round((discovered / total) * 100) : 0;

  return (
    <div className="px-3 pt-3 pb-4 max-w-3xl mx-auto">
      {/* Forscher */}
      <div className="mb-3">
        <ForscherSpeech
          text={discovered === 0
            ? "Dein Museum ist noch leer! Starte eine Expedition!"
            : discovered === total
              ? "Wahnsinn! Du hast alle Dinos entdeckt! 🏆"
              : "Dein Museum wächst! Morgen finden wir bestimmt noch einen!"
          }
        />
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-primary">{discovered} von {total} entdeckt</span>
          <span className="text-[10px] font-bold text-on-surface-variant">{percent}%</span>
        </div>
        <ProgressBar value={percent} />
      </div>

      {/* Dino Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
        {dinos.map((dino) => (
          <button
            key={dino.id}
            onClick={() => dino.discovered ? onSelectDino?.(dino.id) : undefined}
            disabled={!dino.discovered}
            className={[
              "flex flex-col items-center p-2 lg:p-3 rounded-lg border-[3px] transition-all",
              dino.discovered
                ? "bg-surface-container-lowest border-on-surface sticker-shadow active-press"
                : "bg-surface-container-high border-outline-variant opacity-50",
            ].join(" ")}
          >
            <div className={[
              "w-12 h-12 lg:w-16 lg:h-16 rounded-full border-[3px] flex items-center justify-center text-xl lg:text-2xl mb-1 overflow-hidden",
              dino.discovered ? "border-on-surface bg-primary-fixed" : "border-outline-variant bg-surface-container-highest",
            ].join(" ")}>
              {dino.discovered
                ? dino.image
                  ? <img src={dino.image} alt={dino.name} className="w-full h-full object-contain rounded-full" />
                  : "🦕"
                : "?"
              }
            </div>

            <span className={[
              "text-[9px] lg:text-[10px] font-black uppercase tracking-wider text-center leading-tight",
              dino.discovered ? "text-on-surface" : "text-on-surface-variant",
            ].join(" ")}>
              {dino.discovered ? dino.name : "???"}
            </span>

            <span className={[
              "mt-0.5 px-1.5 py-px rounded text-[7px] lg:text-[8px] font-black uppercase",
              RARITY_COLORS[dino.rarity] ?? RARITY_COLORS.common,
            ].join(" ")}>
              {dino.rarity}
            </span>

            {dino.discovered && dino.stars > 0 && (
              <StarRating count={3} filled={dino.stars} size="xs" className="mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function MuseumSkeleton() {
  return (
    <div className="px-3 pt-3 pb-4 max-w-3xl mx-auto">
      <Skeleton className="h-14 w-full mb-3" />
      <Skeleton className="h-3 w-full mb-4" />
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}
