import { useNavigate, useParams } from "react-router";
import { QuizScreen, SizeSortScreen, TimelineSortScreen, FoodMatchScreen, ShadowGuessScreen } from "@dino-atlas/ui";
import { useAuthStore } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { post } from "@/lib/api";

export function MinigamePage() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const player = useAuthStore((s) => s.activePlayer);
  const queryClient = useQueryClient();

  const handleComplete = async (score?: number, starsEarned?: number) => {
    if (!player) return;
    try {
      await post("/minigames/complete", {
        player_id: player.id,
        game_type: type,
        score: score ?? 0,
        stars_earned: starsEarned ?? 0,
        time_ms: 0,
      });
      queryClient.invalidateQueries({ queryKey: ["minigames"] });
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    } catch {
      // ignore — game result is nice-to-have
    }
    navigate("/minigames");
  };

  const handleClose = () => navigate("/minigames");

  // Render the correct minigame based on route param
  switch (type) {
    case "quiz":
      return <QuizScreen />;
    case "size_sort":
      return <SizeSortScreen />;
    case "timeline":
      return <TimelineSortScreen />;
    case "food_match":
      return <FoodMatchScreen />;
    case "shadow_guess":
      return <ShadowGuessScreen />;
    default:
      navigate("/minigames");
      return null;
  }
}
