interface StatusBadgeProps {
  label: string;
  variant?: "default" | "primary" | "secondary" | "tertiary" | "success" | "warning";
  icon?: string;
}

const VARIANT_STYLES: Record<string, string> = {
  default: "bg-surface-container-highest text-on-surface-variant",
  primary: "bg-primary-fixed text-on-primary-fixed",
  secondary: "bg-secondary-fixed text-on-secondary-fixed",
  tertiary: "bg-tertiary-fixed text-on-tertiary-fixed",
  success: "bg-primary-container text-white",
  warning: "bg-secondary-container text-white",
};

export function StatusBadge({ label, variant = "default", icon }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
        VARIANT_STYLES[variant],
      ].join(" ")}
    >
      {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
      {label}
    </span>
  );
}
