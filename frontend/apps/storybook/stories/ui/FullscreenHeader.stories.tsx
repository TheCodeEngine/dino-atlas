import type { Meta, StoryObj } from "@storybook/react-vite";
import { FullscreenHeader } from "../../../../packages/ui/src/components/FullscreenHeader";

const meta = {
  title: "UI/Components/FullscreenHeader",
  component: FullscreenHeader,
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "select", options: ["light", "dark"] },
  },
} satisfies Meta<typeof FullscreenHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: { title: "Oskar's Expedition", playerEmoji: "🦖" },
};

export const Dark: Story = {
  args: { title: "Skelett-Puzzle", playerEmoji: "🦖", variant: "dark" },
  decorators: [(Story) => <div className="bg-[#2C1A0E] min-h-[80px]"><Story /></div>],
};

export const NoTitle: Story = {
  args: { playerEmoji: "🦕" },
};

export const NoAvatar: Story = {
  args: { title: "Foto-Upload" },
};
