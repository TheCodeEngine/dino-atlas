import type { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  /** Right slot for TopBar (avatar, settings, etc.) */
  topRight?: ReactNode;
  /** Active nav item id */
  activeNav?: string;
  /** Nav change handler */
  onNavChange?: (id: string) => void;
  /** Hide bottom nav (e.g. on sub-pages) */
  hideNav?: boolean;
  children: ReactNode;
}

const NAV_ITEMS = [
  { id: "camp", icon: "home", label: "Camp" },
  { id: "museum", icon: "museum", label: "Museum" },
  { id: "games", icon: "stadia_controller", label: "Spiele" },
  { id: "story", icon: "auto_stories", label: "Geschichte" },
];

export function AppShell({ topRight, activeNav = "camp", onNavChange, hideNav = false, children }: AppShellProps) {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <TopBar right={topRight} />
      <main className="flex-1 pt-14 pb-16">
        {children}
      </main>
      {!hideNav && (
        <BottomNav items={NAV_ITEMS} active={activeNav} onChange={onNavChange} />
      )}
    </div>
  );
}
