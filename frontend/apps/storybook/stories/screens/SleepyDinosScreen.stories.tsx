import type { Meta, StoryObj } from "@storybook/react-vite";
import { SleepyDinosScreen } from "@dino-atlas/ui";

const meta = {
  title: "Screens/Muede Dinos",
  component: SleepyDinosScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SleepyDinosScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
