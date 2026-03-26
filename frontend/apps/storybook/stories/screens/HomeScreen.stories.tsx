import type { Meta, StoryObj } from "@storybook/react-vite";
import { HomeScreen } from "./HomeScreen";

const meta = {
  title: "Screens/Home (Forscher-Camp)",
  component: HomeScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HomeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
