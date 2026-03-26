import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "../../../../packages/ui/src/primitives/ProgressBar";

const meta = {
  title: "UI/Primitives/ProgressBar",
  component: ProgressBar,
  parameters: { layout: "centered" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    variant: { control: "select", options: ["primary", "gradient"] },
  },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 45 },
};

export const Gradient: Story = {
  args: { value: 65, variant: "gradient" },
};

export const Empty: Story = {
  args: { value: 0 },
};

export const Full: Story = {
  args: { value: 100, variant: "gradient" },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <ProgressBar value={0} />
      <ProgressBar value={25} />
      <ProgressBar value={50} variant="gradient" />
      <ProgressBar value={75} variant="gradient" />
      <ProgressBar value={100} variant="gradient" />
    </div>
  ),
};
