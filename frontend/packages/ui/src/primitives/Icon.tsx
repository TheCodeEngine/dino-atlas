interface IconProps {
  /** Material Symbols icon name */
  name: string;
  /** Size preset */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Use filled variant */
  filled?: boolean;
  /** Extra CSS classes */
  className?: string;
}

const SIZE_PX: Record<string, string> = {
  xs: "12px",
  sm: "16px",
  md: "18px",
  lg: "22px",
  xl: "32px",
};

export function Icon({ name, size = "md", filled = false, className = "" }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: SIZE_PX[size],
        lineHeight: 1,
        fontVariationSettings: filled ? "'FILL' 1" : undefined,
      }}
    >
      {name}
    </span>
  );
}
