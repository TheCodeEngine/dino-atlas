import type { Meta, StoryObj } from "@storybook/react-vite";
import { AudioPlayer } from "../../../../packages/ui/src/components/AudioPlayer";

const TRICERATOPS_TEXT =
  "Der Triceratops war einer der bekanntesten Dinosaurier der Kreidezeit. " +
  "Mit seinen drei markanten Hoernern und dem riesigen Knochenschild konnte er sich gegen Raubtiere verteidigen. " +
  "Er war ein Pflanzenfresser und wog zwischen 6 und 12 Tonnen. " +
  "Sein Name bedeutet Dreihorn-Gesicht. " +
  "Triceratops lebte vor etwa 68 bis 66 Millionen Jahren in Nordamerika. " +
  "Er hatte bis zu 800 Zaehne die staendig nachwuchsen!";

const meta = {
  title: "UI/AudioPlayer",
  component: AudioPlayer,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 360, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AudioPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  args: {
    text: TRICERATOPS_TEXT,
    duration: 45,
  },
};

export const ShortText: Story = {
  args: {
    text: "Der Triceratops war ein Pflanzenfresser. Er wog bis zu 12 Tonnen!",
    duration: 10,
  },
};
