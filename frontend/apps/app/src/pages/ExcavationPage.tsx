import { useNavigate } from "react-router";
import { ExcavationScreen, Skeleton } from "@dino-atlas/ui";
import { useExpeditionStore } from "@/stores/expedition-store";
import { useActiveExpedition } from "@/hooks/use-active-expedition";

export function ExcavationPage() {
  const navigate = useNavigate();
  const { dino, expedition, player, ready } = useActiveExpedition();
  const advance = useExpeditionStore((s) => s.advance);

  if (!ready) return <div className="min-h-screen bg-[#2C1A0E] flex items-center justify-center"><Skeleton className="w-64 h-64 rounded-xl" /></div>;

  return (
    <ExcavationScreen
      dinoName={dino!.display_name_de}
      skeletonImageUrl={dino!.image_skeleton_url ?? undefined}
      biome={expedition!.biom}
      onComplete={async (timeMs) => {
        await advance({ playerId: player!.id, excavationTimeMs: timeMs });
        navigate("/expedition/puzzle");
      }}
      onClose={() => navigate("/")}
    />
  );
}
