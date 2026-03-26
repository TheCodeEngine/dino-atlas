import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary" | "tertiary";
  /** Render as interactive button-like card */
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
  ...props
}: CardProps) {
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
      {...props}
    >
      {children}
    </div>
  );
}
