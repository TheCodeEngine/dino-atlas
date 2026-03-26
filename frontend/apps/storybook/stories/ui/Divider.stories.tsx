import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "../../../../packages/ui/src/primitives/Divider";

const meta = {
  title: "UI/Primitives/Divider",
  component: Divider,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithText: Story = {
  args: { text: "Oder" },
};

export const Plain: Story = {
  args: {},
};
