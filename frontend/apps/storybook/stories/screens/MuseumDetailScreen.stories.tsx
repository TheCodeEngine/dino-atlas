import type { Meta, StoryObj } from "@storybook/react-vite";
import { MuseumDetailScreen } from "@dino-atlas/ui";

const meta = {
  title: "Screens/Museum Detail",
  component: MuseumDetailScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MuseumDetailScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
