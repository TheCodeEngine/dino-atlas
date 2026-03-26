import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TabBar } from "../../../../packages/ui/src/primitives/TabBar";

const meta = {
  title: "UI/Primitives/TabBar",
  component: TabBar,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 320 }} className="border-[3px] border-on-surface rounded-xl overflow-hidden"><Story /></div>],
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoTabs: Story = {
  args: {
    tabs: [
      { id: "login", label: "Login" },
      { id: "register", label: "Registrieren" },
    ],
    active: "login",
  },
};

export const ThreeTabs: Story = {
  args: {
    tabs: [
      { id: "real", label: "Echt" },
      { id: "comic", label: "Comic" },
      { id: "skeleton", label: "Skelett" },
    ],
    active: "comic",
  },
};

function InteractiveDemo() {
  const [active, setActive] = useState("login");
  return (
    <div>
      <TabBar
        tabs={[
          { id: "login", label: "Login" },
          { id: "register", label: "Registrieren" },
        ]}
        active={active}
        onChange={setActive}
      />
      <div className="p-4 text-sm font-bold text-center">
        Aktiv: {active}
      </div>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
