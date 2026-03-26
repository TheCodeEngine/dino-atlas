import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { BottomNav } from "../../../../packages/ui/src/components/BottomNav";

const NAV_ITEMS = [
  { id: "camp", icon: "home", label: "Camp" },
  { id: "museum", icon: "museum", label: "Museum" },
  { id: "games", icon: "stadia_controller", label: "Spiele" },
  { id: "story", icon: "auto_stories", label: "Geschichte" },
];

const meta = {
  title: "UI/Components/BottomNav",
  component: BottomNav,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { items: NAV_ITEMS, active: "camp" },
};

function InteractiveDemo() {
  const [active, setActive] = useState("camp");
  return (
    <div className="h-screen bg-surface flex items-center justify-center text-on-surface">
      <p className="text-sm font-bold">Aktiv: {active}</p>
      <BottomNav items={NAV_ITEMS} active={active} onChange={setActive} />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
