import type { Preview } from "@storybook/react-vite";
import "@dino-atlas/ui/styles";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "surface",
      values: [
        { name: "surface", value: "#fcf9f0" },
        { name: "dark", value: "#31312b" },
        { name: "white", value: "#ffffff" },
      ],
    },
  },
};

export default preview;
