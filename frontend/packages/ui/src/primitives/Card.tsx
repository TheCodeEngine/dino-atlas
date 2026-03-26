import type { HTMLAttributes, ReactNode } from "react";
import { useHaptics } from "../hooks/useHaptics";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary" | "tertiary";
  interactive?: boolean;
  children: ReactNode;
}

const VARIANT_STYLES: Record<string, string> = {
  default: "bg-surface-container-lowest text-on-surface border-on-surface",
  primary: "bg-primary-container text-white border-on-surface",
  secondary: "bg-secondary-container text-white border-on-surface",
  tertiary: "bg-tertiary text-white border-on-surface",
};

export function Card({
  variant = "default",
  interactive = false,
  children,
  className = "",
  onClick,
  ...props
}: CardProps) {
  const haptics = useHaptics();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive) haptics.tap();
    onClick?.(e);
  };

  return (
    <div
      className={[
        "rounded-lg border-[3px] sticker-shadow",
        VARIANT_STYLES[variant],
        interactive ? "active-press cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}
