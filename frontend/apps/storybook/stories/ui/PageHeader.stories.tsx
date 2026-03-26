import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader } from "../../../../packages/ui/src/components/PageHeader";

const meta = {
  title: "UI/Components/PageHeader",
  component: PageHeader,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLogo: Story = {
  args: {
    logoSrc: "/logo.png",
    title: "Willkommen zurück!",
    subtitle: "Bereit für deine nächste Entdeckung?",
  },
};

export const WithoutLogo: Story = {
  args: {
    title: "Neue Familie",
    subtitle: "Erstelle dein Forscher-Team!",
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Expedition starten",
  },
};
