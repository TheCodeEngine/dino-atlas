import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../../../../packages/ui/src/primitives/Card";
import { Icon } from "../../../../packages/ui/src/primitives/Icon";

const meta = {
  title: "UI/Primitives/Card",
  component: Card,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["default", "primary", "secondary", "tertiary"] },
    interactive: { control: "boolean" },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="p-3 text-sm font-bold">Default Card</div>,
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    children: <div className="p-3 text-sm font-bold">Click me!</div>,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      {(["default", "primary", "secondary", "tertiary"] as const).map((v) => (
        <Card key={v} variant={v} interactive className="p-3 flex items-center gap-2">
          <Icon name="museum" size="lg" filled />
          <span className="text-sm font-black uppercase">{v}</span>
        </Card>
      ))}
    </div>
  ),
};

export const QuickTile: Story = {
  render: () => (
    <Card interactive className="p-3 flex flex-col items-center gap-1 w-24">
      <Icon name="museum" size="lg" filled className="text-primary-container" />
      <p className="text-[10px] font-black uppercase">Museum</p>
      <p className="text-[9px] font-bold text-on-surface-variant">4 Dinos</p>
    </Card>
  ),
};
