import { ExpeditionIntro } from "../../../../packages/ui/src/components/ExpeditionIntro";
import { DesertScene, DESERT_CONFIG } from "../../../../packages/ui/src/components/biom-scene";

export function ExpeditionIntroScreen() {
  return (
    <ExpeditionIntro
      playerName="Oskar"
      biom={DESERT_CONFIG}
      scene={<DesertScene />}
    />
  );
}
