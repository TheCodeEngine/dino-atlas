import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExcavationScreen } from "./ExcavationScreen";

const meta = {
  title: "Screens/Ausbuddeln",
  component: ExcavationScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ExcavationScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
