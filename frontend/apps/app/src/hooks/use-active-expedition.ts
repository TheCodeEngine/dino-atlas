import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth-store";
import { useExpeditionStore } from "@/stores/expedition-store";

/**
 * Ensures expedition data is loaded. If no active expedition,
 * redirects to home. Returns expedition + dino when ready.
 */
export function useActiveExpedition() {
  const navigate = useNavigate();
  const player = useAuthStore((s) => s.activePlayer);
  const expedition = useExpeditionStore((s) => s.expedition);
  const dino = useExpeditionStore((s) => s.dino);
  const isLoading = useExpeditionStore((s) => s.isLoading);
  const checkActive = useExpeditionStore((s) => s.checkActive);
  const checked = useRef(false);

  useEffect(() => {
    if (!player || checked.current) return;
    if (!expedition && !isLoading) {
      checked.current = true;
      checkActive(player.id).then((hasActive) => {
        if (!hasActive) navigate("/", { replace: true });
      }).catch(() => {
        navigate("/", { replace: true });
      });
    }
  }, [player?.id]);

  return { expedition, dino, player, isLoading, ready: !!expedition && !!dino && !!player };
}
