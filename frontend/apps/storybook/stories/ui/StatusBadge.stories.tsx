import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "../../../../packages/ui/src/components/StatusBadge";

const meta = {
  title: "UI/Components/StatusBadge",
  component: StatusBadge,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["default", "primary", "secondary", "tertiary", "success", "warning"] },
    icon: { control: "select", options: ["bedtime", "star", "new_releases", "military_tech", undefined] },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "Common" } };
export const Primary: Story = { args: { label: "Uncommon", variant: "primary" } };
export const Secondary: Story = { args: { label: "Rare", variant: "secondary" } };
export const Tertiary: Story = { args: { label: "Epic", variant: "tertiary" } };
export const Success: Story = { args: { label: "Legendary", variant: "success" } };
export const Warning: Story = { args: { label: "Neu!", variant: "warning", icon: "new_releases" } };
export const WithIcon: Story = { args: { label: "Müde", variant: "default", icon: "bedtime" } };
