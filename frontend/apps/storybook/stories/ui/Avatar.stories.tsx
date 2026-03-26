import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../../../packages/ui/src/primitives/Avatar";

const meta = {
  title: "UI/Primitives/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    state: { control: "select", options: ["default", "selected", "disabled"] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "🦖", size: "md" },
};

export const Selected: Story = {
  args: { children: "🦕", size: "md", state: "selected" },
};

export const Disabled: Story = {
  args: { children: "🦎", size: "md", state: "disabled" },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar size="sm">🦖</Avatar>
      <Avatar size="md">🦕</Avatar>
      <Avatar size="lg">🦎</Avatar>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar state="default">🦖</Avatar>
      <Avatar state="selected">🦕</Avatar>
      <Avatar state="disabled">🦎</Avatar>
    </div>
  ),
};
