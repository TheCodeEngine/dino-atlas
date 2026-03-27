import { useNavigate } from "react-router";
import { SkeletonBreakTransition, Skeleton } from "@dino-atlas/ui";
import { useActiveExpedition } from "@/hooks/use-active-expedition";

export function SkeletonBreakPage() {
  const navigate = useNavigate();
  const { dino, ready } = useActiveExpedition();

  if (!ready) return <div className="min-h-screen bg-[#2C1A0E] flex items-center justify-center"><Skeleton className="w-64 h-64 rounded-xl" /></div>;

  return (
    <SkeletonBreakTransition
      skeletonImageUrl={dino!.image_skeleton_url ?? "/dinos/triceratops/skeleton.png"}
      dinoName={dino!.display_name_de}
      onComplete={() => navigate("/expedition/puzzle")}
    />
  );
}
