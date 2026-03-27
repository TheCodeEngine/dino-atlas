import { useNavigate, useParams } from "react-router";
import { QuizScreen, SizeSortScreen, TimelineSortScreen, FoodMatchScreen, ShadowGuessScreen } from "@dino-atlas/ui";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";

interface MinigameDino {
  id: string;
  slug: string;
  name: string;
  period: string;
  diet: string;
  length_m: number | null;
  image_comic_url: string | null;
  image_shadow_url: string | null;
  quiz_questions: { question: string; options: { label: string; emoji: string; correct: boolean }[]; explanation: string }[] | null;
}

interface AvailableResponse {
  games: { id: string; name: string; icon: string; description: string; available: boolean; min_dinos: number }[];
  minigames_remaining: number;
  is_tired: boolean;
  discovered_count: number;
  dinos: MinigameDino[];
}

export function MinigamePage() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const player = useAuthStore((s) => s.activePlayer);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["minigames", "available", player?.id],
    queryFn: () => get<AvailableResponse>(`/minigames/available?player_id=${player?.id}`),
    enabled: !!player,
    staleTime: 30_000,
  });

  const dinos = data?.dinos ?? [];

  const handleComplete = async (score?: number) => {
    if (!player) return;
    try {
      await post("/minigames/complete", {
        player_id: player.id,
        game_type: type,
        score: score ?? 0,
        stars_earned: 0,
        time_ms: 0,
      });
      queryClient.invalidateQueries({ queryKey: ["minigames"] });
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    } catch {
      // non-critical
    }
    navigate("/minigames");
  };

  const handleClose = () => navigate("/minigames");

  switch (type) {
    case "quiz":
      return <QuizScreen dinos={dinos} onClose={handleClose} onComplete={(score) => handleComplete(score)} />;
    case "size_sort":
      return <SizeSortScreen dinos={dinos} onClose={handleClose} onComplete={handleComplete} />;
    case "timeline":
      return <TimelineSortScreen dinos={dinos} onClose={handleClose} onComplete={handleComplete} />;
    case "food_match":
      return <FoodMatchScreen dinos={dinos} onClose={handleClose} onComplete={handleComplete} />;
    case "shadow_guess":
      return <ShadowGuessScreen dinos={dinos} onClose={handleClose} onComplete={handleComplete} />;
    default:
      navigate("/minigames");
      return null;
  }
}
