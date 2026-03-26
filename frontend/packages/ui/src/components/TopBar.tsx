import type { ReactNode } from "react";

interface TopBarProps {
  title?: string;
  logoSrc?: string;
  right?: ReactNode;
}

export function TopBar({ title = "Dino Atlas", logoSrc = "/logo.png", right }: TopBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-[#FCF9F0] border-b-[3px] border-[#1B5E20] shadow-[3px_3px_0px_0px_rgba(28,28,23,1)]">
      <div className="flex items-center gap-2">
        {logoSrc && <img src={logoSrc} alt="Dino-Atlas" className="w-8 h-8 object-contain" />}
        <span className="text-lg font-black text-[#1B5E20] uppercase tracking-tight">{title}</span>
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </header>
  );
}
