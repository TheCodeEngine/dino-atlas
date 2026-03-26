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
      default: "sand",
      values: [
        { name: "sand", value: "#fdf8f0" },
        { name: "dark", value: "#292524" },
        { name: "white", value: "#ffffff" },
      ],
    },
  },
};

export default preview;
