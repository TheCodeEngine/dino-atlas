import type { Meta, StoryObj } from "@storybook/react-vite";
import { MinigameSelectScreen } from "./MinigameSelectScreen";

const meta = {
  title: "Screens/Mini-Spiel Auswahl",
  component: MinigameSelectScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MinigameSelectScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
