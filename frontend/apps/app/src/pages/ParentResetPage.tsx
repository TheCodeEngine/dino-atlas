import { useState } from "react";
import { useNavigate } from "react-router";
import { ParentResetScreen } from "@dino-atlas/ui";
import { useAuthStore } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { post } from "@/lib/api";

export function ParentResetPage() {
  const navigate = useNavigate();
  const player = useAuthStore((s) => s.activePlayer);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (mathAnswer: number, mathExpected: number): Promise<boolean> => {
    if (!player) return false;
    setLoading(true);
    setError("");
    try {
      await post("/budget/reset", {
        player_id: player.id,
        math_answer: mathAnswer,
        math_expected: mathExpected,
      });
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      queryClient.invalidateQueries({ queryKey: ["minigames"] });
      return true;
    } catch (e: any) {
      setError(e?.message ?? "Fehler beim Zurücksetzen");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParentResetScreen
      onReset={handleReset}
      onCancel={() => navigate("/")}
      loading={loading}
      error={error}
    />
  );
}
