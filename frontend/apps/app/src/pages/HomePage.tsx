import { useNavigate } from "react-router";
import { HomeScreen } from "@dino-atlas/ui";
import { useAuthStore } from "@/stores/auth-store";
import { useBudget } from "@/hooks/use-budget";
import { useMuseum } from "@/hooks/use-museum";

export function HomePage() {
  const navigate = useNavigate();
  const player = useAuthStore((s) => s.activePlayer);
  const { data: budget, isLoading: budgetLoading } = useBudget(player?.id);
  const { data: museum, isLoading: museumLoading } = useMuseum(player?.id);

  const loading = budgetLoading || museumLoading;
  const lastEntry = museum?.[0];

  return (
    <HomeScreen
      player={
        player
          ? {
              name: player.name,
              emoji: player.avatar_emoji,
              level: player.level,
              dinosDiscovered: player.dinos_discovered,
            }
          : undefined
      }
      budget={
        budget
          ? {
              expeditionsUsed: budget.expeditions_used,
              expeditionsMax: budget.expeditions_max,
              minigamesRemaining: budget.minigames_max - budget.minigames_used,
              isTired: budget.is_tired,
            }
          : undefined
      }
      lastDiscovery={
        lastEntry
          ? {
              name: lastEntry.display_name_de,
              slug: lastEntry.dino_slug,
              imageUrl: lastEntry.image_comic_url,
            }
          : undefined
      }
      loading={loading}
      onStartExpedition={() => navigate("/expedition/intro")}
      onNavigate={(target) => navigate(`/${target}`)}
    />
  );
}
