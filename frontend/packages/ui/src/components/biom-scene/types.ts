import type { ReactNode } from "react";

export interface BiomConfig {
  id: string;
  name: string;
  emoji: string;
  hint: string;
  hintSub: string;
  hintEmoji: string;
  forscher: string;
  forscherSub: string;
}

export type BiomSceneRenderer = () => ReactNode;
