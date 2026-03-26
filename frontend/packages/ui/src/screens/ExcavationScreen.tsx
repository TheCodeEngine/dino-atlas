import { useState } from "react";
import { ExcavationGame } from "../minigames-excavation/ExcavationGame";

export interface ExcavationScreenProps {
  dinoName?: string;
  skeletonImageUrl?: string;
  biome?: string;
  onComplete?: (timeMs: number) => void;
  onClose?: () => void;
}

export function ExcavationScreen({
  dinoName = "Triceratops",
  skeletonImageUrl = "/dinos/triceratops/skeleton.png",
  biome = "Wueste",
  onComplete,
  onClose,
}: ExcavationScreenProps = {}) {
  const [key, setKey] = useState(0);

  return (
    <ExcavationGame
      key={key}
      dinoName={dinoName}
      skeletonImageUrl={skeletonImageUrl}
      biome={biome}
      onComplete={() => onComplete?.(0)}
      onClose={() => onClose ? onClose() : setKey((k) => k + 1)}
    />
  );
}
