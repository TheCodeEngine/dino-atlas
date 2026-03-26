import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryTimeScreen } from "@dino-atlas/ui";

const meta = {
  title: "Screens/Gute-Nacht-Geschichte",
  component: StoryTimeScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StoryTimeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
