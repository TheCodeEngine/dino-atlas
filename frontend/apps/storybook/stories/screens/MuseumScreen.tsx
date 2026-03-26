const DINOS = [
  { id: "trex", name: "T-Rex", emoji: "🦖", rarity: "legendary", discovered: true, stars: 3 },
  { id: "triceratops", name: "Triceratops", emoji: "🦕", rarity: "rare", discovered: true, stars: 2 },
  { id: "stegosaurus", name: "Stegosaurus", emoji: "🦕", rarity: "uncommon", discovered: true, stars: 1 },
  { id: "velociraptor", name: "Velociraptor", emoji: "🦖", rarity: "rare", discovered: true, stars: 0 },
  { id: "brachiosaurus", name: "Brachiosaurus", emoji: "🦕", rarity: "epic", discovered: false, stars: 0 },
  { id: "ankylosaurus", name: "Ankylosaurus", emoji: "🦕", rarity: "uncommon", discovered: false, stars: 0 },
  { id: "pteranodon", name: "Pteranodon", emoji: "🦅", rarity: "rare", discovered: false, stars: 0 },
  { id: "spinosaurus", name: "Spinosaurus", emoji: "🦖", rarity: "epic", discovered: false, stars: 0 },
  { id: "parasaurolophus", name: "Parasaurolophus", emoji: "🦕", rarity: "common", discovered: false, stars: 0 },
];

const RARITY_COLORS: Record<string, string> = {
  common: "bg-surface-container-high text-on-surface-variant",
  uncommon: "bg-primary-fixed text-on-primary-fixed",
  rare: "bg-tertiary-fixed text-on-tertiary-fixed",
  epic: "bg-secondary-fixed text-on-secondary-fixed",
  legendary: "bg-secondary-container text-white",
};

export function MuseumScreen() {
  const discovered = DINOS.filter((d) => d.discovered).length;

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-[#FCF9F0] border-b-[3px] border-[#1B5E20] shadow-[3px_3px_0px_0px_rgba(28,28,23,1)]">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Dino-Atlas" className="w-8 h-8 object-contain" />
          <span className="text-lg font-black text-[#1B5E20] uppercase tracking-tight">Museum</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-on-surface-variant">{discovered}/{DINOS.length}</span>
          <div className="w-9 h-9 rounded-full border-[3px] border-[#1B5E20] bg-primary-fixed flex items-center justify-center text-base">🦖</div>
        </div>
      </header>

      <main className="pt-18 pb-20 px-3">
        {/* Header */}
        <div className="pt-16 pb-3 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-fixed border-[3px] border-on-surface rounded-lg sticker-shadow flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
          </div>
          <div className="bg-surface-container-lowest border-[3px] border-on-surface rounded-lg rounded-tl-none p-2.5 sticker-shadow flex-1">
            <p className="text-xs font-bold">Dein Museum waechst! Morgen finden wir bestimmt noch einen!</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4 px-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">{discovered} von {DINOS.length} entdeckt</span>
            <span className="text-[10px] font-bold text-on-surface-variant">{Math.round(discovered / DINOS.length * 100)}%</span>
          </div>
          <div className="h-2.5 bg-surface-container-high rounded-full border-2 border-on-surface overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-container to-[#2E7D32] rounded-full"
              style={{ width: `${(discovered / DINOS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Dino Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {DINOS.map((dino) => (
            <button
              key={dino.id}
              className={[
                "flex flex-col items-center p-3 rounded-lg border-[3px] transition-all",
                dino.discovered
                  ? "bg-surface-container-lowest border-on-surface sticker-shadow active-press"
                  : "bg-surface-container-high border-outline-variant opacity-60",
              ].join(" ")}
            >
              {/* Emoji or silhouette */}
              <div className={[
                "w-14 h-14 rounded-full border-[3px] flex items-center justify-center text-2xl mb-1.5",
                dino.discovered ? "border-on-surface bg-primary-fixed" : "border-outline-variant bg-surface-container-highest",
              ].join(" ")}>
                {dino.discovered ? dino.emoji : "?"}
              </div>

              {/* Name */}
              <span className={[
                "text-[10px] font-black uppercase tracking-wider text-center leading-tight",
                dino.discovered ? "text-on-surface" : "text-on-surface-variant",
              ].join(" ")}>
                {dino.discovered ? dino.name : "???"}
              </span>

              {/* Rarity Badge */}
              <span className={[
                "mt-1 px-1.5 py-px rounded text-[8px] font-black uppercase",
                RARITY_COLORS[dino.rarity],
              ].join(" ")}>
                {dino.rarity}
              </span>

              {/* Stars */}
              {dino.discovered && dino.stars > 0 && (
                <div className="flex gap-px mt-1">
                  {[1, 2, 3].map((s) => (
                    <span
                      key={s}
                      className={`material-symbols-outlined text-[12px] ${s <= dino.stars ? "text-secondary-container" : "text-outline-variant"}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </main>

      {/* BottomNav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-14 bg-[#FCF9F0] border-t-[3px] border-[#1B5E20]">
        {[
          { icon: "home", label: "Camp", active: false },
          { icon: "museum", label: "Museum", active: true },
          { icon: "landscape", label: "Grabung", active: false },
          { icon: "military_tech", label: "Badges", active: false },
        ].map((item) => (
          <a
            key={item.label}
            className={[
              "flex flex-col items-center justify-center px-2 py-1 rounded-lg cursor-pointer active:scale-90 transition-transform",
              item.active ? "bg-[#1B5E20] text-white shadow-[2px_2px_0px_0px_rgba(255,107,0,1)]" : "text-[#1C1C17]",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
            <span className="font-bold text-[8px] uppercase">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
