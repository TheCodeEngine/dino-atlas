interface ProgressBarProps {
  /** Progress value 0-100 */
  value: number;
  /** Visual variant */
  variant?: "primary" | "gradient";
  /** Extra CSS classes for the outer container */
  className?: string;
}

export function ProgressBar({ value, variant = "primary", className = "" }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  const fillClass =
    variant === "gradient"
      ? "bg-gradient-to-r from-primary-container to-[#2E7D32]"
      : "bg-primary-container";

  return (
    <div
      className={`h-2.5 bg-surface-container-high rounded-full border-2 border-on-surface/20 overflow-hidden ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${fillClass}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
