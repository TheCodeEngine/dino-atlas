import type { Meta, StoryObj } from "@storybook/react-vite";
import { PuzzleScreen } from "@dino-atlas/ui";

const meta = {
  title: "Screens/Puzzle",
  component: PuzzleScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PuzzleScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
