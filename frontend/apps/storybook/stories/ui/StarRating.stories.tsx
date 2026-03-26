import type { Meta, StoryObj } from "@storybook/react-vite";
import { StarRating } from "../../../../packages/ui/src/primitives/StarRating";

const meta = {
  title: "UI/Primitives/StarRating",
  component: StarRating,
  parameters: { layout: "centered" },
  argTypes: {
    count: { control: { type: "range", min: 1, max: 5 } },
    filled: { control: { type: "range", min: 0, max: 5 } },
    size: { control: "select", options: ["xs", "sm", "md"] },
  },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { count: 3, filled: 2 },
};

export const AllFilled: Story = {
  args: { count: 3, filled: 3 },
};

export const NoneFilled: Story = {
  args: { count: 3, filled: 0 },
};

export const FiveStars: Story = {
  args: { count: 5, filled: 3, size: "md" },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <StarRating count={3} filled={2} size="xs" />
      <StarRating count={3} filled={2} size="sm" />
      <StarRating count={3} filled={2} size="md" />
    </div>
  ),
};
