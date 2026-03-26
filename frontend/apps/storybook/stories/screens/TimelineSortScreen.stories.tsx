import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimelineSortScreen } from "@dino-atlas/ui";

const meta = {
  title: "Screens/Mini-Spiele/Zeitleiste",
  component: TimelineSortScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TimelineSortScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
