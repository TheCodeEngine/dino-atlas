import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlayerCard } from "../../../../packages/ui/src/components/PlayerCard";

const meta = {
  title: "UI/Components/PlayerCard",
  component: PlayerCard,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 340 }}><Story /></div>],
  argTypes: {
    state: { control: "select", options: ["default", "selected", "tired"] },
  },
} satisfies Meta<typeof PlayerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "Oskar", age: 6, emoji: "🦖" },
};

export const Selected: Story = {
  args: { name: "Karl", age: 4, emoji: "🦕", state: "selected" },
};

export const Tired: Story = {
  args: { name: "Charlotte", age: 4, emoji: "🦎", state: "tired" },
};
