import { ExpeditionIntro } from "../components/ExpeditionIntro";
import {
  DesertScene, DESERT_CONFIG,
  JungleScene, JUNGLE_CONFIG,
  IceScene, ICE_CONFIG,
  OceanScene, OCEAN_CONFIG,
} from "../components/biom-scene";

const BIOMS = {
  desert: { config: DESERT_CONFIG, scene: <DesertScene /> },
  jungle: { config: JUNGLE_CONFIG, scene: <JungleScene /> },
  ice: { config: ICE_CONFIG, scene: <IceScene /> },
  ocean: { config: OCEAN_CONFIG, scene: <OceanScene /> },
};

export interface ExpeditionIntroScreenProps {
  playerName?: string;
  playerEmoji?: string;
  biom?: keyof typeof BIOMS;
  onStart?: () => void;
  onClose?: () => void;
}

export function ExpeditionIntroScreen({
  playerName = "Oskar",
  playerEmoji = "🦖",
  biom = "desert",
  onStart,
  onClose,
}: ExpeditionIntroScreenProps = {}) {
  const biomData = BIOMS[biom] ?? BIOMS.desert;

  return (
    <ExpeditionIntro
      playerName={playerName}
      playerEmoji={playerEmoji}
      biom={biomData.config}
      scene={biomData.scene}
      onStart={onStart}
      onClose={onClose}
    />
  );
}
