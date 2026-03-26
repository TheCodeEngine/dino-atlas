import { useNavigate } from "react-router";
import { DiscoveryScreen, Skeleton } from "@dino-atlas/ui";
import { useExpeditionStore } from "@/stores/expedition-store";
import { useActiveExpedition } from "@/hooks/use-active-expedition";
import { useQueryClient } from "@tanstack/react-query";

export function DiscoveryPage() {
  const navigate = useNavigate();
  const { dino, player, ready } = useActiveExpedition();
  const advance = useExpeditionStore((s) => s.advance);
  const clear = useExpeditionStore((s) => s.clear);
  const queryClient = useQueryClient();

  if (!ready) return <div className="min-h-screen bg-surface flex items-center justify-center"><Skeleton className="w-64 h-64 rounded-xl" /></div>;

  const dinoData = {
    name: dino!.display_name_de,
    latin: dino!.scientific_name ?? "",
    period: dino!.period ?? "Kreide",
    periodStartMya: dino!.period_start_mya ?? undefined,
    periodEndMya: dino!.period_end_mya ?? undefined,
    continent: dino!.continent ?? "",
    story: dino!.kid_summary ?? "",
    comicImageUrl: dino!.image_comic_url ?? "",
    images: [
      dino!.image_real_url && { id: "real", label: "Echt", icon: "photo_camera", url: dino!.image_real_url },
      dino!.image_comic_url && { id: "comic", label: "Comic", icon: "brush", url: dino!.image_comic_url, bg: "bg-gradient-to-br from-primary-fixed/30 to-tertiary-fixed/20", contain: true },
      dino!.image_skeleton_url && { id: "skeleton", label: "Skelett", icon: "skeleton", url: dino!.image_skeleton_url, bg: "bg-[#2C1A0E]" },
    ].filter(Boolean) as any[],
    facts: Array.isArray(dino!.facts) ? dino!.facts.map((f: any) => ({
      icon: f.icon ?? "info",
      label: f.label ?? "",
      value: f.value ?? "",
      sub: f.sub,
      story: f.story ?? "",
    })) : [],
    foodOptions: Array.isArray(dino!.food_options) ? dino!.food_options : undefined,
  };

  const handleComplete = async () => {
    await advance({ playerId: player!.id });
    queryClient.invalidateQueries({ queryKey: ["museum"] });
    queryClient.invalidateQueries({ queryKey: ["budget"] });
    clear();
    navigate("/museum");
  };

  const handlePlayName = () => {
    if (dino!.audio_name_url) {
      const audio = new Audio(dino!.audio_name_url);
      audio.play().catch(() => {});
    }
  };

  return (
    <DiscoveryScreen
      dino={dinoData}
      mode="discovery"
      onComplete={handleComplete}
      onClose={() => navigate("/")}
      onPlayName={dino!.audio_name_url ? handlePlayName : undefined}
    />
  );
}
