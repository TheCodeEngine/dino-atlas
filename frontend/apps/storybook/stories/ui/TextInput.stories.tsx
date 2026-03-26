import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "../../../../packages/ui/src/primitives/TextInput";

const meta = {
  title: "UI/Primitives/TextInput",
  component: TextInput,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
  argTypes: {
    icon: {
      control: "select",
      options: ["person", "lock", "mail", "family_restroom", "search", "edit", undefined],
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
    },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Email", icon: "person", placeholder: "forscher@dino-atlas.de" },
};

export const Password: Story = {
  args: { label: "Passwort", icon: "lock", type: "password", placeholder: "••••••••" },
};

export const WithoutIcon: Story = {
  args: { label: "Familien-Name", placeholder: "z.B. Familie Stoldt" },
};

export const Disabled: Story = {
  args: { label: "Gesperrt", icon: "lock", placeholder: "Nicht editierbar", disabled: true },
};
