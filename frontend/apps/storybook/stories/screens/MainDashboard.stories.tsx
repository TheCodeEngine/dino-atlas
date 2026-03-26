import type { Meta, StoryObj } from "@storybook/react-vite";
import { MainDashboard } from "./MainDashboard";

const meta = {
  title: "Screens/Dashboard",
  component: MainDashboard,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MainDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
