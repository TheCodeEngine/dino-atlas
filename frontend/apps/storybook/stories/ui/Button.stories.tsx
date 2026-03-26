import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../../../packages/ui/src/primitives/Button";

const meta = {
  title: "UI/Primitives/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "surface", "ghost"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    icon: {
      control: "select",
      options: ["arrow_forward", "explore", "museum", "play_arrow", undefined],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: "Expedition starten", variant: "primary", icon: "arrow_forward" },
};

export const Secondary: Story = {
  args: { children: "Neue Entdeckung", variant: "secondary" },
};

export const Tertiary: Story = {
  args: { children: "Schnell-Grabung", variant: "tertiary", icon: "construction" },
};

export const Surface: Story = {
  args: { children: "Vollbild", variant: "surface" },
};

export const Ghost: Story = {
  args: { children: "Abbrechen", variant: "ghost" },
};

export const Small: Story = {
  args: { children: "Klein", variant: "primary", size: "sm" },
};

export const Large: Story = {
  args: { children: "Los geht's!", variant: "primary", size: "lg", icon: "explore" },
};

export const FullWidth: Story = {
  args: { children: "Familie gründen", variant: "primary", fullWidth: true, icon: "group_add" },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export const Disabled: Story = {
  args: { children: "Forscher auswählen", variant: "primary", disabled: true },
};
