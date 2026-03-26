import type { Meta, StoryObj } from "@storybook/react-vite";
import { ParentDashboardScreen } from "@dino-atlas/ui";

const meta = {
  title: "Screens/Eltern-Dashboard",
  component: ParentDashboardScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ParentDashboardScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
