import type { Meta, StoryObj } from "@storybook/react-vite";
import { SizeSortScreen } from "./SizeSortScreen";

const meta = {
  title: "Screens/Mini-Spiele/Größen-Sortieren",
  component: SizeSortScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SizeSortScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
