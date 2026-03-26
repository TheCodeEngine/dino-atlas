import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";
import { useHaptics } from "../hooks/useHaptics";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "surface" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-primary-container text-white border-on-surface sticker-shadow active-press",
  secondary:
    "bg-secondary-container text-white border-on-surface sticker-shadow active-press",
  tertiary:
    "bg-tertiary text-white border-on-surface sticker-shadow active-press",
  surface:
    "bg-surface-container-lowest text-on-surface border-on-surface sticker-shadow active-press",
  ghost:
    "bg-transparent text-on-surface border-transparent shadow-none hover:bg-surface-container-high",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg border-2",
  md: "px-5 py-2.5 text-sm gap-1.5 rounded-lg border-[3px]",
  lg: "px-6 py-3 text-base gap-2 rounded-xl border-[3px]",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "right",
  children,
  className = "",
  onClick,
  ...props
}: ButtonProps) {
  const haptics = useHaptics();
  const iconEl = icon && <Icon name={icon} size="md" />;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!props.disabled) haptics.tap();
    onClick?.(e);
  };

  return (
    <button
      className={[
        "inline-flex items-center justify-center",
        "font-bold uppercase tracking-wider",
        "transition-all",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        props.disabled ? "opacity-50 cursor-not-allowed shadow-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      {...props}
    >
      {iconPosition === "left" && iconEl}
      {children}
      {iconPosition === "right" && iconEl}
    </button>
  );
}
