import { useState } from "react";
import { ExcavationGame } from "../../../../packages/minigames/src/excavation/ExcavationGame";

export function ExcavationScreen() {
  const [key, setKey] = useState(0);

  return (
    <ExcavationGame
      key={key}
      dinoName="Triceratops"
      skeletonImageUrl="/dinos/triceratops/skeleton.png"
      biome="Wueste"
      onComplete={() => {}}
      onClose={() => setKey((k) => k + 1)}
    />
  );
}
