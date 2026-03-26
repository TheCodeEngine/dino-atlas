import type { ReactNode } from "react";

interface FormCardProps {
  tabs?: { id: string; label: string }[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  footer?: ReactNode;
  children: ReactNode;
}

export function FormCard({ tabs, activeTab, onTabChange, footer, children }: FormCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden">
      {tabs && activeTab && onTabChange && (
        <div className="flex border-b-[3px] border-on-surface">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={[
                "flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider transition-colors",
                i < tabs.length - 1 ? "border-r-[3px] border-on-surface" : "",
                activeTab === tab.id
                  ? "bg-white text-on-surface"
                  : "bg-surface-container-high text-on-surface-variant hover:text-on-surface",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="p-5">{children}</div>

      {footer && (
        <div className="bg-surface-container-high p-3 text-center border-t-[3px] border-on-surface">
          {footer}
        </div>
      )}
    </div>
  );
}
