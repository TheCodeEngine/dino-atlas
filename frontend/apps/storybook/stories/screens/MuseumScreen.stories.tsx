import type { Meta, StoryObj } from "@storybook/react-vite";
import { MuseumScreen, AppShell, StatusBadge, PlayerSwitcher } from "@dino-atlas/ui";

const meta = {
  title: "Screens/Museum",
  component: MuseumScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <AppShell
        activeNav="museum"
        onNavChange={(id) => alert(`Navigate: ${id}`)}
        topRight={
          <div className="flex items-center gap-2">
            <StatusBadge label="Lv.3" variant="primary" />
            <span className="text-xs font-black text-on-surface-variant">4/9</span>
          </div>
        }
      >
        <Story />
      </AppShell>
    ),
  ],
} satisfies Meta<typeof MuseumScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const Empty: Story = {
  args: {
    dinos: [
      { id: "trex", name: "T-Rex", image: null, rarity: "legendary", discovered: false, stars: 0 },
      { id: "triceratops", name: "Triceratops", image: null, rarity: "rare", discovered: false, stars: 0 },
      { id: "stegosaurus", name: "Stegosaurus", image: null, rarity: "uncommon", discovered: false, stars: 0 },
    ],
  },
};

export const AllDiscovered: Story = {
  args: {
    dinos: [
      { id: "trex", name: "T-Rex", image: "/dinos/trex/comic.png", rarity: "legendary", discovered: true, stars: 3 },
      { id: "triceratops", name: "Triceratops", image: "/dinos/triceratops/comic.png", rarity: "rare", discovered: true, stars: 3 },
      { id: "stegosaurus", name: "Stegosaurus", image: "/dinos/stegosaurus/comic.png", rarity: "uncommon", discovered: true, stars: 2 },
    ],
  },
};
