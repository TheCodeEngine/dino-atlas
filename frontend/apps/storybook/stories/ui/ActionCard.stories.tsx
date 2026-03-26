import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionCard } from "../../../../packages/ui/src/components/ActionCard";

const meta = {
  title: "UI/Components/ActionCard",
  component: ActionCard,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 340 }}><Story /></div>],
  argTypes: {
    variant: { control: "select", options: ["default", "primary", "secondary", "tertiary"] },
  },
} satisfies Meta<typeof ActionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { icon: "backpack", title: "Meine Ausrüstung", subtitle: "12 Teile" },
};

export const Primary: Story = {
  args: { icon: "explore", title: "Expedition starten", subtitle: "Neues Abenteuer!", variant: "primary" },
};

export const Secondary: Story = {
  args: { icon: "auto_stories", title: "Gute-Nacht-Geschichte", subtitle: "Heute Abend", variant: "secondary" },
};

export const Tertiary: Story = {
  args: { icon: "construction", title: "Schnell-Grabung", subtitle: "20 Bolts", variant: "tertiary" },
};

export const WithBadge: Story = {
  args: { icon: "museum", title: "Museum", subtitle: "Deine Sammlung", badge: "4/50" },
};
