import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth-store";
import { useDinos } from "@/hooks/use-dinos";
import { useMuseum } from "@/hooks/use-museum";
import { Skeleton, Icon, Card, ProgressBar, StarRating } from "@dino-atlas/ui";

const RARITY_COLORS: Record<string, string> = {
  common: "bg-surface-container-high text-on-surface-variant",
  uncommon: "bg-primary-fixed text-on-primary-fixed",
  rare: "bg-tertiary-fixed text-on-tertiary-fixed",
  epic: "bg-secondary-fixed text-on-secondary-fixed",
  legendary: "bg-secondary-container text-white",
};

export function MuseumPage() {
  const navigate = useNavigate();
  const player = useAuthStore((s) => s.activePlayer);
  const { data: allDinos, isLoading: dinosLoading } = useDinos();
  const { data: museum, isLoading: museumLoading } = useMuseum(player?.id);

  const loading = dinosLoading || museumLoading;

  if (loading) {
    return (
      <div className="px-4 py-4 max-w-lg mx-auto">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-3 w-full mb-6" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  const dinos = (allDinos ?? []).map((d) => {
    const entry = museum?.find((m) => m.dino_slug === d.slug);
    return {
      ...d,
      discovered: !!entry,
      stars: entry?.stars ?? 0,
      imageUrl: entry?.image_comic_url ?? null,
    };
  });

  const discovered = dinos.filter((d) => d.discovered).length;
  const total = dinos.length;
  const percent = total > 0 ? Math.round((discovered / total) * 100) : 0;

  return (
    <div className="px-4 py-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-black uppercase tracking-tight">Dein Museum</h1>
        <span className="text-xs font-black text-on-surface-variant">{discovered}/{total}</span>
      </div>

      <ProgressBar value={percent} className="mb-4" />

      {/* Dino Grid */}
      <div className="grid grid-cols-3 gap-2">
        {dinos.map((dino) => (
          <button
            key={dino.slug}
            onClick={() => dino.discovered ? navigate(`/museum/${dino.slug}`) : undefined}
            disabled={!dino.discovered}
            className={`aspect-square rounded-xl border-[3px] overflow-hidden flex flex-col items-center justify-center p-1.5 transition-transform ${
              dino.discovered
                ? "border-on-surface sticker-shadow bg-surface-container-lowest active-press"
                : "border-outline-variant/50 bg-surface-container-high/50 opacity-50"
            }`}
          >
            {dino.discovered && dino.imageUrl ? (
              <img src={dino.imageUrl} alt={dino.display_name_de} className="w-full h-full object-contain" />
            ) : dino.discovered ? (
              <span className="text-3xl">🦕</span>
            ) : (
              <span className="text-2xl text-outline-variant">?</span>
            )}
            <p className="text-[8px] font-black uppercase text-on-surface-variant mt-0.5 truncate w-full text-center">
              {dino.discovered ? dino.display_name_de : "???"}
            </p>
            {dino.discovered && dino.stars > 0 && (
              <div className="flex gap-0.5 mt-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < dino.stars ? "bg-secondary-container" : "bg-outline-variant/30"}`} />
                ))}
              </div>
            )}
            {!dino.discovered && (
              <span className={`text-[6px] font-black uppercase px-1 py-0.5 rounded mt-0.5 ${RARITY_COLORS[dino.rarity] ?? RARITY_COLORS.common}`}>
                {dino.rarity}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
