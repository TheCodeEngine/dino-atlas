import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "../../../../packages/ui/src/primitives/IconButton";

const meta = {
  title: "UI/Primitives/IconButton",
  component: IconButton,
  parameters: { layout: "centered" },
  argTypes: {
    icon: {
      control: "select",
      options: ["close", "settings", "arrow_forward", "check", "add", "volume_up"],
    },
    size: { control: "select", options: ["sm", "md"] },
    variant: { control: "select", options: ["surface", "ghost", "dark"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Surface: Story = {
  args: { icon: "close", variant: "surface" },
};

export const Ghost: Story = {
  args: { icon: "settings", variant: "ghost" },
};

export const Dark: Story = {
  args: { icon: "close", variant: "dark" },
  decorators: [(Story) => <div className="bg-on-surface p-4 rounded-lg"><Story /></div>],
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton icon="close" variant="surface" />
      <IconButton icon="settings" variant="ghost" />
      <div className="bg-on-surface p-2 rounded-lg">
        <IconButton icon="close" variant="dark" />
      </div>
    </div>
  ),
};
