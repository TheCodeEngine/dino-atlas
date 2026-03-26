import type { Meta, StoryObj } from "@storybook/react-vite";
import { OfflineTaskScreen } from "@dino-atlas/ui";

const meta = {
  title: "Screens/Offline-Auftrag",
  component: OfflineTaskScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof OfflineTaskScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
