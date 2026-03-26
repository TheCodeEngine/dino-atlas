import { useState } from "react";

export interface Player {
  id: string;
  name: string;
  emoji: string;
}

interface PlayerSwitcherProps {
  players: Player[];
  active: string;
  onChange: (id: string) => void;
}

export function PlayerSwitcher({ players, active, onChange }: PlayerSwitcherProps) {
  const [open, setOpen] = useState(false);
  const current = players.find((p) => p.id === active);

  return (
    <div className="relative">
      {/* Active Avatar - tap to toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full border-[3px] border-[#1B5E20] bg-primary-fixed flex items-center justify-center text-lg active:scale-90 transition-transform"
      >
        {current?.emoji ?? "?"}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Menu */}
          <div className="absolute right-0 top-12 z-50 bg-surface-container-lowest border-[3px] border-on-surface rounded-lg sticker-shadow p-1.5 min-w-[160px]">
            <p className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant px-2 py-1">
              Forscher wechseln
            </p>
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => {
                  onChange(player.id);
                  setOpen(false);
                }}
                className={[
                  "flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-left transition-all",
                  player.id === active
                    ? "bg-primary-fixed border-2 border-[#1B5E20]"
                    : "hover:bg-surface-container-high",
                ].join(" ")}
              >
                <div
                  className={[
                    "w-8 h-8 rounded-full border-[3px] flex items-center justify-center text-base flex-shrink-0",
                    player.id === active
                      ? "border-[#1B5E20] bg-white"
                      : "border-on-surface bg-primary-fixed",
                  ].join(" ")}
                >
                  {player.emoji}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wider">{player.name}</p>
                </div>
                {player.id === active && (
                  <span className="material-symbols-outlined text-[#1B5E20] ml-auto" style={{ fontSize: "16px" }}>check</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
