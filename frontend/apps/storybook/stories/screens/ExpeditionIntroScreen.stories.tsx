import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExpeditionIntroScreen } from "./ExpeditionIntroScreen";

const meta = {
  title: "Screens/Expedition Intro",
  component: ExpeditionIntroScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ExpeditionIntroScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
