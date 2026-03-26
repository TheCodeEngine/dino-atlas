import type { ReactNode } from "react";

export interface BiomConfig {
  id: string;
  name: string;
  emoji: string;
  color: string; // Tailwind bg class for the icon circle
  hint: string;
  hintSub: string;
  hintEmoji: string;
  forscher: string;
  forscherSub: string;
}

export type BiomSceneRenderer = () => ReactNode;
