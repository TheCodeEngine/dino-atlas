import type { ReactNode } from "react";

interface AvatarProps {
  /** Emoji or image content */
  children: ReactNode;
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Visual state */
  state?: "default" | "selected" | "disabled";
  /** Extra CSS classes */
  className?: string;
}

const SIZE_STYLES: Record<string, string> = {
  sm: "w-9 h-9 text-base",
  md: "w-10 h-10 text-lg",
  lg: "w-11 h-11 text-xl",
};

const STATE_STYLES: Record<string, string> = {
  default: "border-[#1B5E20] bg-primary-fixed",
  selected: "border-[#1B5E20] bg-white",
  disabled: "border-outline-variant bg-surface-container-high",
};

export function Avatar({
  children,
  size = "md",
  state = "default",
  className = "",
}: AvatarProps) {
  return (
    <div
      className={[
        "rounded-full border-[3px] flex items-center justify-center flex-shrink-0",
        SIZE_STYLES[size],
        STATE_STYLES[state],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
