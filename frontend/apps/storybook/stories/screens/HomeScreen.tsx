import { TopBar } from "../../../../packages/ui/src/components/TopBar";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { BottomNav } from "../../../../packages/ui/src/components/BottomNav";
import { StatusBadge } from "../../../../packages/ui/src/components/StatusBadge";

const PLAYER = { name: "Oskar", emoji: "🦖", level: 3 };
const BUDGET = { expeditions: 1, minigames: 2, stories: 1 };
const HAS_OFFLINE_TASK = true;
const LAST_DINO = { name: "Triceratops", image: "/dinos/triceratops/comic.png" };

const NAV = [
  { id: "camp", icon: "home", label: "Camp" },
  { id: "museum", icon: "museum", label: "Museum" },
  { id: "games", icon: "stadia_controller", label: "Spiele" },
  { id: "story", icon: "auto_stories", label: "Geschichte" },
];

export function HomeScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen pb-16">
      <TopBar
        right={
          <div className="flex items-center gap-2">
            <StatusBadge label={`Lv.${PLAYER.level}`} variant="primary" />
            <div className="w-9 h-9 rounded-full border-[3px] border-[#1B5E20] bg-primary-fixed flex items-center justify-center text-base">
              {PLAYER.emoji}
            </div>
          </div>
        }
      />

      <main className="pt-16 px-4 max-w-lg mx-auto">
        {/* Hero: Expedition CTA */}
        <div className="mt-3">
          <button className="w-full bg-gradient-to-br from-primary-container to-[#2E7D32] rounded-xl border-[3px] border-on-surface sticker-shadow active-press overflow-hidden text-left">
            <div className="flex items-center gap-3 p-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontSize: "32px", fontVariationSettings: "'FILL' 1" }}
                >
                  explore
                </span>
              </div>
              <div className="flex-1 text-white min-w-0">
                <p className="text-xs font-black uppercase tracking-wider text-white/70">Expedition</p>
                <p className="text-xl font-black uppercase tracking-tight leading-tight">Neuer Dino wartet!</p>
              </div>
              <span className="material-symbols-outlined text-white/80" style={{ fontSize: "24px" }}>arrow_forward</span>
            </div>
          </button>
        </div>

        {/* 3 Quick Tiles */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button className="bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow active-press p-3 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-primary-container" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>museum</span>
            <p className="text-[10px] font-black uppercase text-on-surface">Museum</p>
            <p className="text-[9px] font-bold text-on-surface-variant">4 Dinos</p>
          </button>
          <button className="bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow active-press p-3 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-tertiary-container" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>stadia_controller</span>
            <p className="text-[10px] font-black uppercase text-on-surface">Spiele</p>
            <p className="text-[9px] font-bold text-on-surface-variant">{BUDGET.minigames} übrig</p>
          </button>
          <button className="bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow active-press p-3 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-secondary-container" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            <p className="text-[10px] font-black uppercase text-on-surface">Geschichte</p>
            <p className="text-[9px] font-bold text-on-surface-variant">Heute Abend</p>
          </button>
        </div>

        {/* Last Discovery */}
        {LAST_DINO && (
          <button className="w-full mt-4 flex items-center gap-3 bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow active-press p-3 text-left">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-container to-tertiary-container rounded-lg border-2 border-on-surface flex items-center justify-center overflow-hidden flex-shrink-0">
              <img src={LAST_DINO.image} alt={LAST_DINO.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Letzte Entdeckung</p>
              <p className="font-black uppercase tracking-wider text-xs">{LAST_DINO.name}</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>chevron_right</span>
          </button>
        )}

        {/* Offline Task Reminder */}
        {HAS_OFFLINE_TASK && (
          <button className="w-full mt-4 flex items-center gap-3 bg-secondary-fixed/30 rounded-lg border-[3px] border-secondary/30 p-3 text-left active:scale-[0.98] transition-transform">
            <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>brush</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-secondary uppercase">Offline-Auftrag</p>
              <p className="text-xs font-bold text-on-surface">Male deinen Triceratops!</p>
            </div>
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>photo_camera</span>
          </button>
        )}
      </main>

      <BottomNav items={NAV} active="camp" />
    </div>
  );
}
