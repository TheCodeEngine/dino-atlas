import { useNavigate } from "react-router";
import { MinigameSelectScreen } from "@dino-atlas/ui";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";

interface AvailableResponse {
  games: { id: string; name: string; icon: string; description: string; available: boolean; min_dinos: number }[];
  minigames_remaining: number;
  is_tired: boolean;
}

export function MinigameSelectPage() {
  const navigate = useNavigate();
  const player = useAuthStore((s) => s.activePlayer);

  const { data, isLoading } = useQuery({
    queryKey: ["minigames", "available", player?.id],
    queryFn: () => get<AvailableResponse>(`/minigames/available?player_id=${player?.id}`),
    enabled: !!player,
    staleTime: 30_000,
  });

  // Redirect to sleepy if tired
  if (data?.is_tired) {
    navigate("/sleepy", { replace: true });
    return null;
  }

  const games = data?.games.map((g) => ({
    id: g.id,
    name: g.name,
    icon: g.icon,
    description: g.description,
    available: g.available,
    minDinos: g.min_dinos,
  }));

  return (
    <MinigameSelectScreen
      games={isLoading ? undefined : games}
      minigamesRemaining={data?.minigames_remaining}
      loading={isLoading}
      onSelectGame={(gameId) => navigate(`/minigames/${gameId}`)}
    />
  );
}
