import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.@(ts|tsx)",
    "../../../packages/ui/src/**/*.stories.@(ts|tsx)",
    "../../../packages/minigames/src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
  ],
  staticDirs: ["../../../public"],
  framework: "@storybook/react-vite",
  viteFinal: async (config) => {
    const tailwindcss = await import("@tailwindcss/vite");
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss.default());
    return config;
  },
};

export default config;
