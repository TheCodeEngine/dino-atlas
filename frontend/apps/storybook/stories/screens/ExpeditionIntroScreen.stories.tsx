import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExpeditionIntro } from "../../../../packages/ui/src/components/ExpeditionIntro";
import { DesertScene, DESERT_CONFIG, JungleScene, JUNGLE_CONFIG, IceScene, ICE_CONFIG, OceanScene, OCEAN_CONFIG } from "../../../../packages/ui/src/components/biom-scene";

const meta = {
  title: "Screens/Expedition Intro",
  component: ExpeditionIntro,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ExpeditionIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Wueste: Story = {
  args: { playerName: "Oskar", biom: DESERT_CONFIG, scene: <DesertScene /> },
};

export const Regenwald: Story = {
  args: { playerName: "Karl", biom: JUNGLE_CONFIG, scene: <JungleScene /> },
};

export const Eis: Story = {
  args: { playerName: "Charlotte", biom: ICE_CONFIG, scene: <IceScene /> },
};

export const Ozean: Story = {
  args: { playerName: "Oskar", biom: OCEAN_CONFIG, scene: <OceanScene /> },
};
