import type { Meta, StoryObj } from "@storybook/react-vite";
import { DiscoveryScreen } from "./DiscoveryScreen";

const meta = {
  title: "Screens/Entdeckung",
  component: DiscoveryScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DiscoveryScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
