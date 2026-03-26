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
      return <QuizScreen onClose={handleClose} onComplete={(score, total) => handleComplete(score)} />;
    case "size_sort":
      return <SizeSortScreen onClose={handleClose} onComplete={handleComplete} />;
    case "timeline":
      return <TimelineSortScreen onClose={handleClose} onComplete={handleComplete} />;
    case "food_match":
      return <FoodMatchScreen onClose={handleClose} onComplete={handleComplete} />;
    case "shadow_guess":
      return <ShadowGuessScreen onClose={handleClose} onComplete={handleComplete} />;
    default:
      navigate("/minigames");
      return null;
  }
}
