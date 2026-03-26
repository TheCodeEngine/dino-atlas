interface ActionCardProps {
  icon: string;
  iconFilled?: boolean;
  title: string;
  subtitle?: string;
  variant?: "default" | "primary" | "secondary" | "tertiary";
  badge?: string;
  onClick?: () => void;
}

const VARIANT_STYLES: Record<string, { card: string; iconBg: string; iconColor: string }> = {
  default: {
    card: "bg-surface-container-lowest text-on-surface border-on-surface",
    iconBg: "bg-surface-container-low border-2 border-on-surface",
    iconColor: "text-on-surface",
  },
  primary: {
    card: "bg-primary-container text-white border-on-surface",
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
  },
  secondary: {
    card: "bg-secondary-container text-white border-on-surface",
    iconBg: "bg-secondary-fixed",
    iconColor: "text-secondary",
  },
  tertiary: {
    card: "bg-tertiary text-white border-on-surface",
    iconBg: "bg-tertiary-fixed",
    iconColor: "text-tertiary",
  },
};

export function ActionCard({
  icon,
  iconFilled = true,
  title,
  subtitle,
  variant = "default",
  badge,
  onClick,
}: ActionCardProps) {
  const styles = VARIANT_STYLES[variant]!;

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-lg border-[3px] sticker-shadow active-press w-full ${styles.card}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
          <span
            className={`material-symbols-outlined ${styles.iconColor}`}
            style={{ fontSize: "18px", fontVariationSettings: iconFilled ? "'FILL' 1" : undefined }}
          >
            {icon}
          </span>
        </div>
        <div className="text-left">
          <p className="font-black uppercase tracking-wider text-[11px]">{title}</p>
          {subtitle && <p className="text-[9px] opacity-80 font-semibold">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px] font-black">{badge}</span>
        )}
        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>chevron_right</span>
      </div>
    </button>
  );
}
