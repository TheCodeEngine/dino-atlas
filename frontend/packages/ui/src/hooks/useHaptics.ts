import { useWebHaptics } from "web-haptics/react";

export function useHaptics() {
  const { trigger, isSupported } = useWebHaptics();

  return {
    isSupported,
    /** Light tap — button press, selection */
    tap: () => trigger("selection"),
    /** Correct answer, discovery, success */
    success: () => trigger("success"),
    /** Wrong answer, error */
    error: () => trigger("error"),
    /** Attention, warning, budget low */
    warning: () => trigger("warning"),
  };
}
