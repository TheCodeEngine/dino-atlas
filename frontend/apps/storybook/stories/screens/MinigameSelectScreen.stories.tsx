import type { Meta, StoryObj } from "@storybook/react-vite";
import { MinigameSelectScreen, AppShell, StatusBadge } from "@dino-atlas/ui";

const meta = {
  title: "Screens/Mini-Spiel Auswahl",
  component: MinigameSelectScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <AppShell activeNav="games" onNavChange={(id) => alert(`Navigate: ${id}`)}
        topRight={<StatusBadge label="Lv.3" variant="primary" />}>
        <Story />
      </AppShell>
    ),
  ],
} satisfies Meta<typeof MinigameSelectScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const BudgetExhausted: Story = {
  args: { minigamesRemaining: 0 },
};
