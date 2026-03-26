import type { Meta, StoryObj } from "@storybook/react-vite";
import { HomeScreen, AppShell, StatusBadge, PlayerSwitcher } from "@dino-atlas/ui";
import { useState } from "react";

const PLAYERS = [
  { id: "oskar", name: "Oskar", emoji: "🦖" },
  { id: "karl", name: "Karl", emoji: "🦕" },
  { id: "charlotte", name: "Charlotte", emoji: "🦎" },
];

const meta = {
  title: "Screens/Home (Forscher-Camp)",
  component: HomeScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => {
      const [activePlayer, setActivePlayer] = useState("oskar");
      return (
        <AppShell
          activeNav="camp"
          onNavChange={(id) => alert(`Navigate: ${id}`)}
          topRight={
            <div className="flex items-center gap-2">
              <StatusBadge label="Lv.3" variant="primary" />
              <PlayerSwitcher players={PLAYERS} active={activePlayer} onChange={setActivePlayer} />
            </div>
          }
        >
          <Story />
        </AppShell>
      );
    },
  ],
} satisfies Meta<typeof HomeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const Tired: Story = {
  args: {
    budget: { expeditionsUsed: 3, expeditionsMax: 3, minigamesRemaining: 0, isTired: true },
  },
};

export const Empty: Story = {
  args: {
    player: { name: "Neuer Forscher", emoji: "🦕", level: 1, dinosDiscovered: 0 },
    lastDiscovery: undefined,
    hasOfflineTask: false,
  },
};
