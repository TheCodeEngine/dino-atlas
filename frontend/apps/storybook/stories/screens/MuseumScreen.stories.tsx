import type { Meta, StoryObj } from "@storybook/react-vite";
import { MuseumScreen } from "./MuseumScreen";

const meta = {
  title: "Screens/Museum",
  component: MuseumScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MuseumScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
