import { TopBar } from "../../../../packages/ui/src/components/TopBar";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { ActionCard } from "../../../../packages/ui/src/components/ActionCard";
import { StatusBadge } from "../../../../packages/ui/src/components/StatusBadge";
import { BottomNav } from "../../../../packages/ui/src/components/BottomNav";
import { Button } from "../../../../packages/ui/src/primitives/Button";

const ACTIVE_PLAYER = { name: "Oskar", emoji: "🦖", level: 3, dinos: 4, totalDinos: 50 };
const BUDGET = { expeditions: 1, minigames: 2, eveningDone: false };
const LAST_DINO = { name: "Triceratops", image: "/dinos/triceratops/comic.png" };

const NAV_ITEMS = [
  { id: "camp", icon: "home", label: "Camp" },
  { id: "museum", icon: "museum", label: "Museum" },
  { id: "games", icon: "stadia_controller", label: "Spiele" },
  { id: "story", icon: "auto_stories", label: "Geschichte" },
];

export function HomeScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen pb-20">
      {/* TopBar with active player */}
      <TopBar
        right={
          <div className="flex items-center gap-2">
            <StatusBadge label={`Lv. ${ACTIVE_PLAYER.level}`} variant="primary" />
            <div className="w-9 h-9 rounded-full border-[3px] border-[#1B5E20] bg-primary-fixed flex items-center justify-center text-base">
              {ACTIVE_PLAYER.emoji}
            </div>
          </div>
        }
      />

      <main className="pt-18 px-4 max-w-lg mx-auto">
        {/* Active player greeting */}
        <div className="pt-16 mb-5">
          <ForscherSpeech
            text={`Hallo ${ACTIVE_PLAYER.name}! Bereit für ein neues Abenteuer?`}
            subtext="Heute wartet eine spannende Expedition auf dich!"
          />
        </div>

        {/* Main CTA: Expedition */}
        <div className="mb-5">
          <div className="bg-gradient-to-br from-primary-container to-[#2E7D32] rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden">
            <div className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontSize: "36px", fontVariationSettings: "'FILL' 1" }}
                >
                  explore
                </span>
              </div>
              <div className="flex-1 text-white">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/70">Nachmittags-Expedition</p>
                <p className="text-lg font-black uppercase tracking-tight">Neuer Dino wartet!</p>
                <p className="text-[11px] font-semibold text-white/80 mt-0.5">Grabe, puzzle, entdecke</p>
              </div>
            </div>
            <div className="px-4 pb-4">
              <Button variant="surface" fullWidth icon="arrow_forward">
                Expedition starten
              </Button>
            </div>
          </div>
        </div>

        {/* Budget Status */}
        <div className="flex gap-2 mb-5">
          <div className="flex-1 bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow p-2.5 text-center">
            <span className="material-symbols-outlined text-primary-container" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>explore</span>
            <p className="text-lg font-black text-on-surface">{BUDGET.expeditions}</p>
            <p className="text-[9px] font-bold text-on-surface-variant uppercase">Expedition</p>
          </div>
          <div className="flex-1 bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow p-2.5 text-center">
            <span className="material-symbols-outlined text-secondary-container" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>stadia_controller</span>
            <p className="text-lg font-black text-on-surface">{BUDGET.minigames}</p>
            <p className="text-[9px] font-bold text-on-surface-variant uppercase">Mini-Spiele</p>
          </div>
          <div className="flex-1 bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow p-2.5 text-center">
            <span className="material-symbols-outlined text-tertiary-container" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            <p className="text-lg font-black text-on-surface">{BUDGET.eveningDone ? "✓" : "1"}</p>
            <p className="text-[9px] font-bold text-on-surface-variant uppercase">Geschichte</p>
          </div>
        </div>

        {/* Last Discovery */}
        {LAST_DINO && (
          <div className="mb-5">
            <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>history</span>
              Letzte Entdeckung
            </p>
            <div className="flex items-center gap-3 bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow p-3 active-press">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-container to-tertiary-container rounded-lg border-2 border-on-surface flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={LAST_DINO.image} alt={LAST_DINO.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <p className="font-black uppercase tracking-wider text-xs">{LAST_DINO.name}</p>
                <p className="text-[10px] text-on-surface-variant font-semibold">Heute entdeckt</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>chevron_right</span>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-col gap-2.5 mb-5">
          <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>flash_on</span>
            Schnellzugriff
          </p>
          <ActionCard
            icon="museum"
            title="Museum"
            subtitle="Deine Dino-Sammlung"
            badge={`${ACTIVE_PLAYER.dinos}/${ACTIVE_PLAYER.totalDinos}`}
          />
          <ActionCard
            icon="stadia_controller"
            title="Mini-Spiele"
            subtitle={`Noch ${BUDGET.minigames} Spiele übrig`}
            variant="tertiary"
          />
          <ActionCard
            icon="auto_stories"
            title="Gute-Nacht-Geschichte"
            subtitle="Heute Abend mit allen Forschern"
            variant="secondary"
          />
          <ActionCard
            icon="photo_camera"
            title="Offline-Auftrag"
            subtitle="Male deinen Triceratops!"
          />
        </div>

        {/* Museum Progress */}
        <div className="bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow p-3">
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-[10px] font-black uppercase tracking-wider text-primary">
              Museum: {ACTIVE_PLAYER.dinos} von {ACTIVE_PLAYER.totalDinos}
            </p>
            <p className="text-[10px] font-bold text-on-surface-variant">
              {Math.round((ACTIVE_PLAYER.dinos / ACTIVE_PLAYER.totalDinos) * 100)}%
            </p>
          </div>
          <div className="h-2.5 bg-surface-container-high rounded-full border-2 border-on-surface overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-container to-[#2E7D32] rounded-full"
              style={{ width: `${(ACTIVE_PLAYER.dinos / ACTIVE_PLAYER.totalDinos) * 100}%` }}
            />
          </div>
        </div>
      </main>

      <BottomNav items={NAV_ITEMS} active="camp" />
    </div>
  );
}
