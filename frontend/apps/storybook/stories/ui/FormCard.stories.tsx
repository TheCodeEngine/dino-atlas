import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FormCard } from "../../../../packages/ui/src/components/FormCard";

const meta = {
  title: "UI/Components/FormCard",
  component: FormCard,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof FormCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    children: <p className="text-sm text-center text-on-surface-variant">Formular-Inhalt hier</p>,
  },
};

export const WithFooter: Story = {
  args: {
    children: <p className="text-sm text-center text-on-surface-variant">Formular-Inhalt hier</p>,
    footer: <p className="text-[11px] font-semibold text-on-surface-variant">Schon dabei? <span className="text-primary font-black">Einloggen</span></p>,
  },
};

function WithTabsDemo() {
  const [tab, setTab] = useState("login");
  return (
    <FormCard
      tabs={[
        { id: "login", label: "Login" },
        { id: "register", label: "Registrieren" },
      ]}
      activeTab={tab}
      onTabChange={setTab}
      footer={<p className="text-[11px] text-on-surface-variant">Footer</p>}
    >
      <div className="text-center py-4">
        <p className="text-sm font-bold">Aktiver Tab: {tab}</p>
      </div>
    </FormCard>
  );
}

export const WithTabs: Story = {
  render: () => <WithTabsDemo />,
};
