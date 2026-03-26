import type { Meta, StoryObj } from "@storybook/react-vite";
import { FoodMatchScreen } from "./FoodMatchScreen";

const meta = {
  title: "Screens/Mini-Spiele/Futter-Zuordnung",
  component: FoodMatchScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FoodMatchScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
