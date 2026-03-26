import { useNavigate } from "react-router";
import { IdentifyScreen, Skeleton } from "@dino-atlas/ui";
import { useExpeditionStore } from "@/stores/expedition-store";
import { useActiveExpedition } from "@/hooks/use-active-expedition";
import { useDinos } from "@/hooks/use-dinos";

export function IdentifyPage() {
  const navigate = useNavigate();
  const { dino, player, ready } = useActiveExpedition();
  const advance = useExpeditionStore((s) => s.advance);
  const { data: allDinos } = useDinos();

  if (!ready) return <div className="min-h-screen bg-surface flex items-center justify-center"><Skeleton className="w-64 h-64 rounded-xl" /></div>;

  // Build options: correct dino + 3 random decoys
  const decoys = (allDinos ?? [])
    .filter((d) => d.slug !== dino!.slug && d.has_content)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const options = [
    {
      id: dino!.slug,
      name: dino!.display_name_de,
      image: dino!.image_comic_url ?? "",
      correct: true,
      hint: "",
    },
    ...decoys.map((d) => ({
      id: d.slug,
      name: d.display_name_de,
      image: `/api/v1/dinos/${d.slug}/file/image_comic`,
      correct: false,
      hint: `Das ist ein ${d.display_name_de}, nicht der gesuchte Dino!`,
    })),
  ].sort(() => Math.random() - 0.5);

  return (
    <IdentifyScreen
      skeletonImageUrl={dino!.image_skeleton_url ?? undefined}
      options={options}
      onComplete={async (attempts) => {
        await advance({ playerId: player!.id, identifyAttempts: attempts });
        navigate("/expedition/discovery");
      }}
      onClose={() => navigate("/")}
    />
  );
}
