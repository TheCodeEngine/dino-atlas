import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonBreakTransition } from "../../../../packages/ui/src/components/skeleton-break-transition/SkeletonBreakTransition";

const meta = {
  title: "UI/Components/SkeletonBreakTransition",
  component: SkeletonBreakTransition,
  parameters: { layout: "fullscreen" },
  args: {
    skeletonImageUrl: "/dinos/triceratops/skeleton.png",
    dinoName: "Triceratops",
    onComplete: () => alert("→ Weiter zum Puzzle!"),
  },
} satisfies Meta<typeof SkeletonBreakTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Volle Animation von Anfang bis Ende */
export const Default: Story = {};

/** Phase 1: Skelett zentriert mit Glow */
export const Skeleton: Story = {
  args: { initialPhase: "skeleton" },
};

/** Phase 2: Skelett fällt runter */
export const Falling: Story = {
  args: { initialPhase: "falling" },
};

/** Phase 3: Staubwolke + Screen-Shake + Teile fliegen */
export const Crash: Story = {
  args: { initialPhase: "crash" },
};

/** Phase 4: Staub lichtet sich, "Ohhhh neinnn!!" */
export const Reveal: Story = {
  args: { initialPhase: "reveal" },
};

/** Phase 5: CTA Button */
export const Prompt: Story = {
  args: { initialPhase: "prompt" },
};
