import { useNavigate } from "react-router";
import { PuzzleScreen, Skeleton } from "@dino-atlas/ui";
import { useExpeditionStore } from "@/stores/expedition-store";
import { useActiveExpedition } from "@/hooks/use-active-expedition";

export function PuzzlePage() {
  const navigate = useNavigate();
  const { dino, player, ready } = useActiveExpedition();
  const advance = useExpeditionStore((s) => s.advance);

  if (!ready) return <div className="min-h-screen bg-[#2C1A0E] flex items-center justify-center"><Skeleton className="w-64 h-64 rounded-xl" /></div>;

  return (
    <PuzzleScreen
      skeletonImageUrl={dino!.image_skeleton_url ?? undefined}
      comicImageUrl={dino!.image_comic_url ?? undefined}
      playerEmoji={player!.avatar_emoji}
      onComplete={async (timeMs) => {
        await advance({ playerId: player!.id, puzzleTimeMs: timeMs });
        navigate("/expedition/identify");
      }}
      onClose={() => navigate("/")}
    />
  );
}
