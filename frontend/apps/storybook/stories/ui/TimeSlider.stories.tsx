import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimeSlider } from "../../../../packages/ui/src/components/TimeSlider";

const meta = {
  title: "UI/Components/TimeSlider",
  component: TimeSlider,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 340 }}><Story /></div>],
} satisfies Meta<typeof TimeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Triceratops: Story = {
  args: { period: "Kreide", startMya: 68, endMya: 66 },
};

export const Stegosaurus: Story = {
  args: { period: "Jura", startMya: 155, endMya: 150 },
};

export const Coelophysis: Story = {
  args: { period: "Trias", startMya: 228, endMya: 200 },
};
