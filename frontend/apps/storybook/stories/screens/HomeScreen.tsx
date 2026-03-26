import { useState } from "react";
import { TopBar } from "../../../../packages/ui/src/components/TopBar";
import { BottomNav } from "../../../../packages/ui/src/components/BottomNav";
import { StatusBadge } from "../../../../packages/ui/src/components/StatusBadge";
import { PlayerSwitcher } from "../../../../packages/ui/src/components/PlayerSwitcher";
import { Icon } from "../../../../packages/ui/src/primitives/Icon";
import { Card } from "../../../../packages/ui/src/primitives/Card";

const PLAYERS = [
  { id: "oskar", name: "Oskar", emoji: "🦖" },
  { id: "karl", name: "Karl", emoji: "🦕" },
  { id: "charlotte", name: "Charlotte", emoji: "🦎" },
];

const PLAYER_DATA: Record<string, { level: number; dinos: number; minigames: number }> = {
  oskar: { level: 3, dinos: 4, minigames: 2 },
  karl: { level: 2, dinos: 2, minigames: 3 },
  charlotte: { level: 1, dinos: 1, minigames: 0 },
};

const HAS_OFFLINE_TASK = true;
const LAST_DINO = { name: "Triceratops", image: "/dinos/triceratops/comic.png" };

const NAV = [
  { id: "camp", icon: "home", label: "Camp" },
  { id: "museum", icon: "museum", label: "Museum" },
  { id: "games", icon: "stadia_controller", label: "Spiele" },
  { id: "story", icon: "auto_stories", label: "Geschichte" },
];

export function HomeScreen() {
  const [activePlayer, setActivePlayer] = useState("oskar");
  const data = PLAYER_DATA[activePlayer]!;
  const player = PLAYERS.find((p) => p.id === activePlayer)!;

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-16">
      <TopBar
        right={
          <div className="flex items-center gap-2">
            <StatusBadge label={`Lv.${data.level}`} variant="primary" />
            <PlayerSwitcher
              players={PLAYERS}
              active={activePlayer}
              onChange={setActivePlayer}
            />
          </div>
        }
      />

      <main className="pt-16 px-4 max-w-lg mx-auto">
        {/* Hero: Expedition CTA */}
        <div className="mt-3">
          <button className="w-full bg-gradient-to-br from-primary-container to-[#2E7D32] rounded-xl border-[3px] border-on-surface sticker-shadow active-press overflow-hidden text-left">
            <div className="flex items-center gap-3 p-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="explore" size="xl" filled className="text-white" />
              </div>
              <div className="flex-1 text-white min-w-0">
                <p className="text-xs font-black uppercase tracking-wider text-white/70">
                  {player.name}'s Expedition
                </p>
                <p className="text-xl font-black uppercase tracking-tight leading-tight">Neuer Dino wartet!</p>
              </div>
              <Icon name="arrow_forward" size="lg" className="text-white/80" />
            </div>
          </button>
        </div>

        {/* 3 Quick Tiles */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Card interactive className="p-3 flex flex-col items-center gap-1">
            <Icon name="museum" size="lg" filled className="text-primary-container" />
            <p className="text-[10px] font-black uppercase text-on-surface">Museum</p>
            <p className="text-[9px] font-bold text-on-surface-variant">{data.dinos} Dinos</p>
          </Card>
          <Card interactive className="p-3 flex flex-col items-center gap-1">
            <Icon name="stadia_controller" size="lg" filled className="text-tertiary-container" />
            <p className="text-[10px] font-black uppercase text-on-surface">Spiele</p>
            <p className="text-[9px] font-bold text-on-surface-variant">{data.minigames} übrig</p>
          </Card>
          <Card interactive className="p-3 flex flex-col items-center gap-1">
            <Icon name="auto_stories" size="lg" filled className="text-secondary-container" />
            <p className="text-[10px] font-black uppercase text-on-surface">Geschichte</p>
            <p className="text-[9px] font-bold text-on-surface-variant">Heute Abend</p>
          </Card>
        </div>

        {/* Last Discovery */}
        {LAST_DINO && (
          <Card interactive className="w-full mt-4 flex items-center gap-3 p-3 text-left">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-container to-tertiary-container rounded-lg border-2 border-on-surface flex items-center justify-center overflow-hidden flex-shrink-0">
              <img src={LAST_DINO.image} alt={LAST_DINO.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Letzte Entdeckung</p>
              <p className="font-black uppercase tracking-wider text-xs">{LAST_DINO.name}</p>
            </div>
            <Icon name="chevron_right" size="md" className="text-on-surface-variant" />
          </Card>
        )}

        {/* Offline Task Reminder */}
        {HAS_OFFLINE_TASK && (
          <button className="w-full mt-4 flex items-center gap-3 bg-secondary-fixed/30 rounded-lg border-[3px] border-secondary/30 p-3 text-left active:scale-[0.98] transition-transform">
            <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="brush" size="md" filled className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-secondary uppercase">Offline-Auftrag</p>
              <p className="text-xs font-bold text-on-surface">Male deinen Triceratops!</p>
            </div>
            <Icon name="photo_camera" size="sm" className="text-secondary" />
          </button>
        )}
      </main>

      <BottomNav items={NAV} active="camp" />
    </div>
  );
}
