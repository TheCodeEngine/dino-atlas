import type { Meta, StoryObj } from "@storybook/react-vite";
import { PhotoUploadScreen } from "./PhotoUploadScreen";

const meta = {
  title: "Screens/Foto-Upload",
  component: PhotoUploadScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PhotoUploadScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
