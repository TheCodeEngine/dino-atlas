import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PlayerSwitcher } from "../../../../packages/ui/src/components/PlayerSwitcher";

const PLAYERS = [
  { id: "oskar", name: "Oskar", emoji: "🦖" },
  { id: "karl", name: "Karl", emoji: "🦕" },
  { id: "charlotte", name: "Charlotte", emoji: "🦎" },
];

const meta = {
  title: "UI/Components/PlayerSwitcher",
  component: PlayerSwitcher,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 200, display: "flex", justifyContent: "flex-end" }}><Story /></div>],
} satisfies Meta<typeof PlayerSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { players: PLAYERS, active: "oskar" },
};

function InteractiveDemo() {
  const [active, setActive] = useState("oskar");
  return (
    <div>
      <PlayerSwitcher players={PLAYERS} active={active} onChange={setActive} />
      <p className="text-xs text-center mt-4 font-bold">Aktiv: {active}</p>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
