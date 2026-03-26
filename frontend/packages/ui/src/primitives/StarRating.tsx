import { Icon } from "./Icon";

interface StarRatingProps {
  /** Total number of stars */
  count?: number;
  /** Number of filled stars */
  filled: number;
  /** Size of each star */
  size?: "xs" | "sm" | "md";
  /** Extra CSS classes */
  className?: string;
}

const ICON_SIZE: Record<string, "xs" | "sm" | "md"> = {
  xs: "xs",
  sm: "sm",
  md: "md",
};

const GAP: Record<string, string> = {
  xs: "gap-px",
  sm: "gap-0.5",
  md: "gap-1",
};

export function StarRating({ count = 3, filled, size = "sm", className = "" }: StarRatingProps) {
  return (
    <div className={`flex ${GAP[size]} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          size={ICON_SIZE[size]}
          filled
          className={i < filled ? "text-secondary-container" : "text-outline-variant"}
        />
      ))}
    </div>
  );
}
