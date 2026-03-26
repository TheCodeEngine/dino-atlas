import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShell } from "../../../../packages/ui/src/components/AppShell";
import { PlayerSwitcher } from "../../../../packages/ui/src/components/PlayerSwitcher";
import { StatusBadge } from "../../../../packages/ui/src/components/StatusBadge";
import { useState } from "react";

const PLAYERS = [
  { id: "oskar", name: "Oskar", emoji: "🦖" },
  { id: "karl", name: "Karl", emoji: "🦕" },
  { id: "charlotte", name: "Charlotte", emoji: "🦎" },
];

const meta = {
  title: "UI/Components/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [active, setActive] = useState("oskar");
  const [nav, setNav] = useState("camp");
  return (
    <AppShell
      topRight={
        <div className="flex items-center gap-2">
          <StatusBadge label="Lv.3" variant="primary" />
          <PlayerSwitcher players={PLAYERS} active={active} onChange={setActive} />
        </div>
      }
      activeNav={nav}
      onNavChange={setNav}
    >
      <div className="px-4 py-8 text-center">
        <p className="text-sm font-bold text-on-surface-variant">Aktiver Tab: {nav}</p>
        <p className="text-sm font-bold text-on-surface-variant mt-2">Spieler: {active}</p>
      </div>
    </AppShell>
  );
}

export const Default: Story = {
  render: () => <Demo />,
};

export const WithoutNav: Story = {
  args: {
    hideNav: true,
    children: <div className="px-4 py-8 text-center text-sm font-bold text-on-surface-variant">Sub-Page ohne BottomNav</div>,
  },
};
