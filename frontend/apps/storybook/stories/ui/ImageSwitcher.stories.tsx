import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageSwitcher } from "../../../../packages/ui/src/components/ImageSwitcher";

const meta = {
  title: "UI/Components/ImageSwitcher",
  component: ImageSwitcher,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 340 }}><Story /></div>],
} satisfies Meta<typeof ImageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeViews: Story = {
  args: {
    alt: "Triceratops",
    square: true,
    views: [
      { id: "real", label: "Echt", icon: "photo_camera", url: "/dinos/triceratops/real.png" },
      { id: "comic", label: "Comic", icon: "brush", url: "/dinos/triceratops/comic.png", bg: "bg-gradient-to-br from-primary-fixed/30 to-tertiary-fixed/20", contain: true },
      { id: "skeleton", label: "Skelett", icon: "skeleton", url: "/dinos/triceratops/skeleton.png", bg: "bg-[#2C1A0E]" },
    ],
  },
};

export const SingleImage: Story = {
  args: {
    alt: "Triceratops",
    views: [
      { id: "real", label: "Echt", icon: "photo_camera", url: "/dinos/triceratops/real.png" },
    ],
  },
};
