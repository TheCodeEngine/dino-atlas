/** Dino-Atlas Design System — Tailwind Theme
 *  Colors extracted from designer prototypes (Material Design 3 based)
 */
export default {
  theme: {
    extend: {
      colors: {
        // Primary: Deep Green
        "primary": "#00450d",
        "primary-container": "#1b5e20",
        "primary-fixed": "#acf4a4",
        "primary-fixed-dim": "#91d78a",
        "on-primary": "#ffffff",
        "on-primary-container": "#90d689",
        "on-primary-fixed": "#002203",
        "on-primary-fixed-variant": "#0c5216",

        // Secondary: Orange
        "secondary": "#a04100",
        "secondary-container": "#fe6b00",
        "secondary-fixed": "#ffdbcc",
        "secondary-fixed-dim": "#ffb693",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#572000",
        "on-secondary-fixed": "#351000",
        "on-secondary-fixed-variant": "#7a3000",

        // Tertiary: Deep Blue
        "tertiary": "#003e63",
        "tertiary-container": "#005687",
        "tertiary-fixed": "#cee5ff",
        "tertiary-fixed-dim": "#96ccff",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#93cbff",
        "on-tertiary-fixed": "#001d32",
        "on-tertiary-fixed-variant": "#004a75",

        // Surface
        "surface": "#fcf9f0",
        "surface-dim": "#dddad1",
        "surface-bright": "#fcf9f0",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3ea",
        "surface-container": "#f1eee5",
        "surface-container-high": "#ebe8df",
        "surface-container-highest": "#e5e2da",
        "surface-variant": "#e5e2da",
        "surface-tint": "#2a6b2c",
        "background": "#fcf9f0",

        // On-Surface
        "on-surface": "#1c1c17",
        "on-surface-variant": "#41493e",
        "on-background": "#1c1c17",

        // Inverse
        "inverse-surface": "#31312b",
        "inverse-on-surface": "#f4f1e8",
        "inverse-primary": "#91d78a",

        // Outline
        "outline": "#717a6d",
        "outline-variant": "#c0c9bb",

        // Error
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        "body": ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        "label": ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
    },
  },
};
