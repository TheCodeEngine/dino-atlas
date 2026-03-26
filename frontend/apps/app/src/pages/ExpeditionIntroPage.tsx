import { useNavigate } from "react-router";
import { ExpeditionIntroScreen } from "@dino-atlas/ui";
import { useAuthStore } from "@/stores/auth-store";
import { useExpeditionStore } from "@/stores/expedition-store";

const BIOMS = ["desert", "jungle", "ice", "ocean"] as const;

export function ExpeditionIntroPage() {
  const navigate = useNavigate();
  const player = useAuthStore((s) => s.activePlayer);
  const start = useExpeditionStore((s) => s.start);

  // Pick random biom
  const biom = BIOMS[Math.floor(Math.random() * BIOMS.length)]!;

  const handleStart = async () => {
    if (!player) return;
    try {
      await start(player.id, biom);
      navigate("/expedition/excavation");
    } catch (err: any) {
      alert(err.message || "Expedition konnte nicht gestartet werden");
      navigate("/");
    }
  };

  return (
    <ExpeditionIntroScreen
      playerName={player?.name ?? "Forscher"}
      playerEmoji={player?.avatar_emoji ?? "🦖"}
      biom={biom}
      onStart={handleStart}
      onClose={() => navigate("/")}
    />
  );
}
