import { useNavigate, useParams } from "react-router";
import { DiscoveryScreen, Skeleton } from "@dino-atlas/ui";
import { useDino } from "@/hooks/use-dinos";

export function MuseumDetailPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { data: dino, isLoading } = useDino(slug ?? "");

  if (isLoading || !dino) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Skeleton className="w-64 h-64 rounded-xl" />
      </div>
    );
  }

  const dinoData = {
    name: dino.display_name_de,
    latin: dino.scientific_name ?? "",
    period: dino.period ?? "Kreide",
    periodStartMya: dino.period_start_mya ?? undefined,
    periodEndMya: dino.period_end_mya ?? undefined,
    continent: dino.continent ?? "",
    story: dino.kid_summary ?? "",
    storyTts: dino.kid_summary_tts || undefined,
    comicImageUrl: dino.image_comic_url ?? "",
    images: [
      dino.image_real_url && { id: "real", label: "Echt", icon: "photo_camera", url: dino.image_real_url },
      dino.image_comic_url && { id: "comic", label: "Comic", icon: "brush", url: dino.image_comic_url, bg: "bg-gradient-to-br from-primary-fixed/30 to-tertiary-fixed/20", contain: true },
      dino.image_skeleton_url && { id: "skeleton", label: "Skelett", icon: "skeleton", url: dino.image_skeleton_url, bg: "bg-[#2C1A0E]" },
    ].filter(Boolean) as any[],
    facts: Array.isArray(dino.facts) ? dino.facts.map((f: any) => ({
      icon: f.icon ?? "info",
      label: f.label ?? "",
      value: f.value ?? "",
      sub: f.sub,
      story: f.story ?? "",
      storyTts: f.story_tts || undefined,
    })) : [],
    foodOptions: Array.isArray(dino.food_options) ? dino.food_options : undefined,
  };

  const handlePlayName = () => {
    if (dino.audio_name_url) {
      const audio = new Audio(dino.audio_name_url);
      audio.play().catch(() => {});
    }
  };

  return (
    <DiscoveryScreen
      dino={dinoData}
      mode="museum"
      onClose={() => navigate("/museum")}
      onPlayName={dino.audio_name_url ? handlePlayName : undefined}
    />
  );
}
