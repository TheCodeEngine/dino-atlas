import type { Meta, StoryObj } from "@storybook/react-vite";
import { IdentifyScreen } from "./IdentifyScreen";

const meta = {
  title: "Screens/Dino Erkennen",
  component: IdentifyScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof IdentifyScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
