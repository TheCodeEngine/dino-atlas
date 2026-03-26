import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuizScreen } from "@dino-atlas/ui";

const meta = {
  title: "Screens/Quiz",
  component: QuizScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof QuizScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
