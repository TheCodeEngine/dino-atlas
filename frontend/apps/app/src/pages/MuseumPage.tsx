import { useNavigate } from "react-router";
import { MuseumScreen } from "@dino-atlas/ui";
import { useAuthStore } from "@/stores/auth-store";
import { useDinos } from "@/hooks/use-dinos";
import { useMuseum } from "@/hooks/use-museum";

export function MuseumPage() {
  const navigate = useNavigate();
  const player = useAuthStore((s) => s.activePlayer);
  const { data: allDinos, isLoading: dinosLoading } = useDinos();
  const { data: museum, isLoading: museumLoading } = useMuseum(player?.id);

  const loading = dinosLoading || museumLoading;

  const dinos = (allDinos ?? []).map((d) => {
    const entry = museum?.find((m) => m.dino_slug === d.slug);
    return {
      id: d.slug,
      name: d.display_name_de,
      image: entry?.image_comic_url ?? null,
      rarity: d.rarity,
      discovered: !!entry,
      stars: entry?.stars ?? 0,
    };
  });

  return (
    <MuseumScreen
      dinos={loading ? undefined : dinos}
      loading={loading}
      onSelectDino={(slug) => navigate(`/museum/${slug}`)}
    />
  );
}
