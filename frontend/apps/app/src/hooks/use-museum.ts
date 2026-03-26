import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";

interface MuseumItem {
  dino_slug: string;
  display_name_de: string;
  rarity: string;
  discovered_at: string;
  stars: number | null;
  favorite: boolean;
  image_comic_url: string | null;
}

export function useMuseum(playerId: string | undefined) {
  return useQuery({
    queryKey: ["museum", playerId],
    queryFn: () => get<MuseumItem[]>(`/museum?player_id=${playerId}`),
    enabled: !!playerId,
    staleTime: 30 * 1000,
  });
}

export type { MuseumItem };
