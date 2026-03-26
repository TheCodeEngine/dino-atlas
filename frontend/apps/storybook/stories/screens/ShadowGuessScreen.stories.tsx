import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShadowGuessScreen } from "./ShadowGuessScreen";

const meta = {
  title: "Screens/Mini-Spiele/Schatten-Raten",
  component: ShadowGuessScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ShadowGuessScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
