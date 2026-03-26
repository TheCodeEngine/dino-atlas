import type { Meta, StoryObj } from "@storybook/react-vite";
import { MuseumTransition } from "../../../../packages/ui/src/components/museum-transition/MuseumTransition";
import { LandScene } from "../../../../packages/ui/src/components/museum-transition/LandScene";

const meta = {
  title: "UI/Components/MuseumTransition",
  component: MuseumTransition,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MuseumTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Land: Story = {
  args: {
    dinoImage: "/dinos/triceratops/comic.png",
    dinoName: "Triceratops",
    scene: LandScene,
  },
};
