import { Icon } from "../primitives/Icon";
import { Avatar } from "../primitives/Avatar";
import { ProgressBar } from "../primitives/ProgressBar";
import { StarRating } from "../primitives/StarRating";

const DINOS = [
  { id: "trex", name: "T-Rex", image: null, rarity: "legendary", discovered: true, stars: 3 },
  { id: "triceratops", name: "Triceratops", image: "/dinos/triceratops/comic.png", rarity: "rare", discovered: true, stars: 2 },
  { id: "stegosaurus", name: "Stegosaurus", image: null, rarity: "uncommon", discovered: true, stars: 1 },
  { id: "velociraptor", name: "Velociraptor", image: null, rarity: "rare", discovered: true, stars: 0 },
  { id: "brachiosaurus", name: "Brachiosaurus", image: null, rarity: "epic", discovered: false, stars: 0 },
  { id: "ankylosaurus", name: "Ankylosaurus", image: null, rarity: "uncommon", discovered: false, stars: 0 },
  { id: "pteranodon", name: "Pteranodon", image: null, rarity: "rare", discovered: false, stars: 0 },
  { id: "spinosaurus", name: "Spinosaurus", image: null, rarity: "epic", discovered: false, stars: 0 },
  { id: "parasaurolophus", name: "Parasauro.", image: null, rarity: "common", discovered: false, stars: 0 },
];

const EMOJIS: Record<string, string> = {
  trex: "🦖", triceratops: "🦕", stegosaurus: "🦕", velociraptor: "🦖",
  brachiosaurus: "🦕", ankylosaurus: "🦕", pteranodon: "🦅", spinosaurus: "🦖", parasaurolophus: "🦕",
};

const RARITY_COLORS: Record<string, string> = {
  common: "bg-surface-container-high text-on-surface-variant",
  uncommon: "bg-primary-fixed text-on-primary-fixed",
  rare: "bg-tertiary-fixed text-on-tertiary-fixed",
  epic: "bg-secondary-fixed text-on-secondary-fixed",
  legendary: "bg-secondary-container text-white",
};

export function MuseumScreen() {
  const discovered = DINOS.filter((d) => d.discovered).length;
  const percent = Math.round(discovered / DINOS.length * 100);

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
          <Avatar size="sm">🦖</Avatar>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-14 h-[calc(100vh-3.5rem)] z-40 bg-[#FCF9F0] border-r-[3px] border-[#1B5E20] w-48 p-2.5">
        <nav className="flex-1 space-y-1">
          {[
            { icon: "home", label: "Camp", active: false },
            { icon: "museum", label: "Museum", active: true },
            { icon: "landscape", label: "Grabung", active: false },
            { icon: "military_tech", label: "Abzeichen", active: false },
          ].map((item) => (
            <a
              key={item.label}
              className={`flex items-center gap-2 p-2 rounded-lg font-bold uppercase tracking-wider text-[11px] cursor-pointer ${
                item.active
                  ? "bg-[#1B5E20] text-white shadow-[3px_3px_0px_0px_rgba(255,107,0,1)]"
                  : "text-[#1C1C17] hover:bg-[#F6F3EA] transition-all hover:translate-x-0.5"
              }`}
            >
              <Icon name={item.icon} size="md" />{item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="lg:ml-48 pt-16 pb-20 lg:pb-4 px-3 lg:px-6">
        {/* Forscher */}
        <div className="flex items-center gap-2 py-3 max-w-3xl mx-auto">
          <div className="w-8 h-8 bg-primary-fixed border-[3px] border-on-surface rounded-lg sticker-shadow flex items-center justify-center flex-shrink-0">
            <Icon name="face" size="sm" filled className="text-primary" />
          </div>
          <div className="bg-surface-container-lowest border-[3px] border-on-surface rounded-lg rounded-tl-none p-2 sticker-shadow flex-1">
            <p className="text-[11px] font-bold">Dein Museum waechst! Morgen finden wir bestimmt noch einen!</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4 max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">{discovered} von {DINOS.length} entdeckt</span>
            <span className="text-[10px] font-bold text-on-surface-variant">{percent}%</span>
          </div>
          <ProgressBar value={percent} variant="gradient" />
        </div>

        {/* Dino Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 max-w-3xl mx-auto">
          {DINOS.map((dino) => (
            <button
              key={dino.id}
              className={[
                "flex flex-col items-center p-2 lg:p-3 rounded-lg border-[3px] transition-all",
                dino.discovered
                  ? "bg-surface-container-lowest border-on-surface sticker-shadow active-press"
                  : "bg-surface-container-high border-outline-variant opacity-50",
              ].join(" ")}
            >
              {/* Avatar */}
              <div className={[
                "w-12 h-12 lg:w-16 lg:h-16 rounded-full border-[3px] flex items-center justify-center text-xl lg:text-2xl mb-1",
                dino.discovered ? "border-on-surface bg-primary-fixed" : "border-outline-variant bg-surface-container-highest",
              ].join(" ")}>
                {dino.discovered
                  ? dino.image
                    ? <img src={dino.image} alt={dino.name} className="w-full h-full object-contain rounded-full" />
                    : EMOJIS[dino.id] ?? "🦕"
                  : "?"
                }
              </div>

              {/* Name */}
              <span className={[
                "text-[9px] lg:text-[10px] font-black uppercase tracking-wider text-center leading-tight",
                dino.discovered ? "text-on-surface" : "text-on-surface-variant",
              ].join(" ")}>
                {dino.discovered ? dino.name : "???"}
              </span>

              {/* Rarity */}
              <span className={[
                "mt-0.5 px-1.5 py-px rounded text-[7px] lg:text-[8px] font-black uppercase",
                RARITY_COLORS[dino.rarity],
              ].join(" ")}>
                {dino.rarity}
              </span>

              {/* Stars */}
              {dino.discovered && dino.stars > 0 && (
                <StarRating count={3} filled={dino.stars} size="xs" className="mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </main>

      {/* BottomNav Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-14 bg-[#FCF9F0] border-t-[3px] border-[#1B5E20]">
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
            <Icon name={item.icon} size="md" />
            <span className="font-bold text-[8px] uppercase">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
