import type { Meta, StoryObj } from "@storybook/react-vite";
import { TopBar } from "../../../../packages/ui/src/components/TopBar";

const meta = {
  title: "UI/Components/TopBar",
  component: TopBar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithSettings: Story = {
  args: {
    right: (
      <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high">
        <span className="material-symbols-outlined text-on-surface-variant text-xl">settings</span>
      </button>
    ),
  },
};

export const WithAvatar: Story = {
  args: {
    right: (
      <div className="w-9 h-9 rounded-full border-[3px] border-[#1B5E20] bg-primary-fixed flex items-center justify-center text-base">🦖</div>
    ),
  },
};

export const CustomTitle: Story = {
  args: { title: "Museum" },
};
