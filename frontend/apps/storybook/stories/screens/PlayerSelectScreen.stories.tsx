import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlayerSelectScreen } from "@dino-atlas/ui";

const meta = {
  title: "Screens/Spieler Auswahl",
  component: PlayerSelectScreen,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PlayerSelectScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
