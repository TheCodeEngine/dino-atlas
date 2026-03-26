interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex border-b-[3px] border-on-surface">
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={[
            "flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider transition-colors",
            i < tabs.length - 1 ? "border-r-[3px] border-on-surface" : "",
            active === tab.id
              ? "bg-white text-on-surface"
              : "bg-surface-container-high text-on-surface-variant hover:text-on-surface",
          ].join(" ")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
