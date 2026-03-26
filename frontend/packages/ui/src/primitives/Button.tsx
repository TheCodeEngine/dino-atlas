import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "surface" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: string;
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-primary-container text-white border-on-primary-fixed-variant sticker-shadow-primary",
  secondary:
    "bg-secondary-container text-white border-on-secondary-container sticker-shadow-secondary",
  tertiary:
    "bg-tertiary text-white border-on-tertiary-fixed-variant sticker-shadow",
  surface:
    "bg-surface-container-lowest text-on-surface border-on-surface sticker-shadow",
  ghost:
    "bg-transparent text-on-surface border-transparent shadow-none hover:bg-surface-container-high",
};

const sizeStyles: Record<string, string> = {
  sm: "px-4 py-2 text-xs gap-1.5 rounded-lg border-2",
  md: "px-6 py-3 text-sm gap-2 rounded-xl border-4",
  lg: "px-8 py-4 text-lg gap-2 rounded-xl border-4",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center",
        "font-extrabold uppercase tracking-widest",
        "active-press transition-all",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-sm">{icon}</span>
      )}
      {children}
    </button>
  );
}
