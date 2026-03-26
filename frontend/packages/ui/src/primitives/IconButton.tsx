import type { ButtonHTMLAttributes } from "react";
import { Icon } from "./Icon";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Material Symbols icon name */
  icon: string;
  /** Size preset */
  size?: "sm" | "md";
  /** Visual variant */
  variant?: "surface" | "ghost" | "dark";
  /** Label for accessibility */
  label?: string;
}

const SIZE_STYLES: Record<string, string> = {
  sm: "w-8 h-8",
  md: "w-9 h-9",
};

const VARIANT_STYLES: Record<string, string> = {
  surface:
    "bg-surface-container-lowest border-[3px] border-on-surface sticker-shadow text-on-surface",
  ghost:
    "bg-transparent text-on-surface-variant hover:bg-surface-container-high",
  dark:
    "bg-white/10 text-white",
};

export function IconButton({
  icon,
  size = "md",
  variant = "surface",
  label,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={[
        "flex items-center justify-center rounded-lg active-press",
        SIZE_STYLES[size],
        VARIANT_STYLES[variant],
        props.disabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <Icon name={icon} size="md" />
    </button>
  );
}
