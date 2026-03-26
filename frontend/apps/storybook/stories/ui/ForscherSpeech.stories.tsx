import type { Meta, StoryObj } from "@storybook/react-vite";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";

const meta = {
  title: "UI/Components/ForscherSpeech",
  component: ForscherSpeech,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 340 }}><Story /></div>],
} satisfies Meta<typeof ForscherSpeech>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Wer geht heute auf Expedition?",
    subtext: "Wählt eure Forscher aus!",
  },
};

export const Excited: Story = {
  args: {
    text: "Unglaublich! Ein Triceratops! Den suche ich schon seit Jahren!",
  },
};

export const WithCustomIcon: Story = {
  args: {
    text: "Dein Museum wächst!",
    subtext: "Morgen finden wir bestimmt noch einen!",
    icon: "museum",
  },
};

export const LongText: Story = {
  args: {
    text: "Der Triceratops war einer der bekanntesten Dinosaurier. Er lebte in der Kreidezeit und hatte drei markante Hörner.",
    subtext: "Tippe auf Vorlesen um mehr zu erfahren.",
  },
};
