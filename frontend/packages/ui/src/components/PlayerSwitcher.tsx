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
    <>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(true)}
        className="w-10 h-10 rounded-full border-[3px] border-[#1B5E20] bg-primary-fixed flex items-center justify-center text-lg active:scale-90 transition-transform"
      >
        {current?.emoji ?? "?"}
      </button>

      {/* Bottom Sheet Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Scrim */}
          <div
            className="absolute inset-0 bg-on-surface/40"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div
            className="relative w-full max-w-lg bg-surface-container-lowest border-t-[3px] border-x-[3px] border-on-surface rounded-t-2xl px-4 pt-3 pb-8"
            style={{ animation: "slide-up 0.2s ease-out" }}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-4" />

            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant mb-3 px-1">
              Forscher wechseln
            </p>

            <div className="flex flex-col gap-2">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => {
                    onChange(player.id);
                    setOpen(false);
                  }}
                  className={[
                    "flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all",
                    player.id === active
                      ? "bg-primary-fixed border-[3px] border-[#1B5E20] shadow-[3px_3px_0px_0px_#1B5E20]"
                      : "bg-surface-container-low border-[3px] border-on-surface sticker-shadow active-press",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "w-11 h-11 rounded-full border-[3px] flex items-center justify-center text-xl flex-shrink-0",
                      player.id === active
                        ? "border-[#1B5E20] bg-white"
                        : "border-on-surface bg-primary-fixed",
                    ].join(" ")}
                  >
                    {player.emoji}
                  </div>
                  <p className="text-sm font-black uppercase tracking-wider flex-1">{player.name}</p>
                  {player.id === active && (
                    <span className="w-7 h-7 bg-[#1B5E20] text-white rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>check</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <style>{`
            @keyframes slide-up {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
