import { useState } from "react";

const PLAYERS = [
  { id: "oskar", name: "Oskar", age: 6, emoji: "🦖", hasPlayed: false },
  { id: "karl", name: "Karl", age: 4, emoji: "🦕", hasPlayed: false },
  { id: "charlotte", name: "Charlotte", age: 4, emoji: "🦎", hasPlayed: true },
];

export function PlayerSelectScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-5 h-14 bg-[#FCF9F0] border-b-[3px] border-[#1B5E20] shadow-[3px_3px_0px_0px_rgba(28,28,23,1)]">
        <span className="text-lg font-black text-[#1B5E20] uppercase tracking-tight">Dino Explorer</span>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-on-surface-variant text-xl">settings</span>
        </button>
      </header>

      {/* Main */}
      <main className="pt-20 pb-8 px-4 max-w-sm mx-auto">
        {/* Forscher Speech */}
        <div className="flex items-start gap-2.5 mb-6">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-fixed border-[3px] border-on-surface rounded-lg sticker-shadow flex items-center justify-center">
            <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
          </div>
          <div className="bg-surface-container-lowest border-[3px] border-on-surface rounded-lg rounded-tl-none p-3 sticker-shadow flex-1">
            <p className="text-sm font-black text-on-surface">Wer geht heute auf Expedition?</p>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Waehlt eure Forscher aus!</p>
          </div>
        </div>

        {/* Player Cards */}
        <div className="flex flex-col gap-2.5 mb-6">
          {PLAYERS.map((player) => {
            const isSelected = selected.includes(player.id);
            const isTired = player.hasPlayed;
            return (
              <button
                key={player.id}
                onClick={() => !isTired && toggle(player.id)}
                className={[
                  "flex items-center gap-3 p-3 rounded-lg border-[3px] transition-all",
                  isTired
                    ? "bg-surface-container-high border-outline-variant opacity-50 cursor-not-allowed"
                    : isSelected
                      ? "bg-primary-fixed border-[#1B5E20] shadow-[3px_3px_0px_0px_#1B5E20]"
                      : "bg-surface-container-lowest border-on-surface sticker-shadow active-press",
                ].join(" ")}
              >
                <div className={[
                  "w-11 h-11 rounded-full border-[3px] flex items-center justify-center text-xl flex-shrink-0",
                  isTired ? "border-outline-variant bg-surface-container-high"
                    : isSelected ? "border-[#1B5E20] bg-white"
                    : "border-on-surface bg-primary-fixed",
                ].join(" ")}>
                  {player.emoji}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-black uppercase tracking-wider text-xs">{player.name}</p>
                  <p className="text-[10px] font-semibold text-on-surface-variant">{player.age} Jahre</p>
                </div>
                {isTired ? (
                  <span className="flex items-center gap-1 bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full text-[10px] font-bold">
                    <span className="material-symbols-outlined text-sm">bedtime</span>
                    Muede
                  </span>
                ) : isSelected ? (
                  <span className="w-7 h-7 bg-[#1B5E20] text-white rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">check</span>
                  </span>
                ) : (
                  <span className="w-7 h-7 border-2 border-outline-variant rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-base text-outline-variant">add</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Start Button */}
        <button
          disabled={selected.length === 0}
          className={[
            "w-full py-3 border-[3px] rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 text-sm transition-all",
            selected.length > 0
              ? "bg-[#1B5E20] text-white border-on-primary-fixed-variant sticker-shadow-primary active-press-primary"
              : "bg-surface-container-high text-outline border-outline-variant cursor-not-allowed",
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          {selected.length > 0 ? `Los geht's! (${selected.length})` : "Forscher auswaehlen"}
        </button>
      </main>
    </div>
  );
}
