interface NavItem {
  icon: string;
  label: string;
  id: string;
}

interface BottomNavProps {
  items: NavItem[];
  active: string;
  onChange?: (id: string) => void;
}

export function BottomNav({ items, active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-14 bg-[#FCF9F0] border-t-[3px] border-[#1B5E20]">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange?.(item.id)}
          className={[
            "flex flex-col items-center justify-center px-2 py-1 rounded-lg active:scale-90 transition-transform",
            active === item.id
              ? "bg-[#1B5E20] text-white shadow-[2px_2px_0px_0px_rgba(255,107,0,1)]"
              : "text-[#1C1C17]",
          ].join(" ")}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{item.icon}</span>
          <span className="font-bold text-[8px] uppercase">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
