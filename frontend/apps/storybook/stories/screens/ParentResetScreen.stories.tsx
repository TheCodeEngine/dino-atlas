import type { Meta, StoryObj } from "@storybook/react-vite";
import { ParentResetScreen } from "@dino-atlas/ui";

const meta = {
  title: "Screens/Eltern-Reset",
  component: ParentResetScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ParentResetScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
