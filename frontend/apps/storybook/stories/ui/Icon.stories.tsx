import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../../../../packages/ui/src/primitives/Icon";

const meta = {
  title: "UI/Primitives/Icon",
  component: Icon,
  parameters: { layout: "centered" },
  argTypes: {
    name: {
      control: "select",
      options: ["explore", "museum", "star", "close", "check", "arrow_forward", "face", "volume_up", "drag_indicator"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    filled: { control: "boolean" },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "explore", size: "md" },
};

export const Filled: Story = {
  args: { name: "star", size: "md", filled: true },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-1">
          <Icon name="museum" size={size} filled />
          <span className="text-[9px] font-bold text-on-surface-variant">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const IconGallery: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-3">
      {["explore", "museum", "star", "close", "check", "arrow_forward", "face", "volume_up", "drag_indicator", "home", "settings", "lock", "photo_camera", "brush", "favorite"].map((name) => (
        <div key={name} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface-container-low">
          <Icon name={name} size="lg" filled />
          <span className="text-[8px] font-bold text-on-surface-variant">{name}</span>
        </div>
      ))}
    </div>
  ),
};
