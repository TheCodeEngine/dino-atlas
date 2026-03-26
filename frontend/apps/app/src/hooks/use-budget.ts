import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";

interface BudgetResponse {
  expeditions_used: number;
  expeditions_max: number;
  minigames_used: number;
  minigames_max: number;
  is_tired: boolean;
}

export function useBudget(playerId: string | undefined) {
  return useQuery({
    queryKey: ["budget", playerId],
    queryFn: () => get<BudgetResponse>(`/budget?player_id=${playerId}`),
    enabled: !!playerId,
    staleTime: 30 * 1000,
  });
}

export type { BudgetResponse };
