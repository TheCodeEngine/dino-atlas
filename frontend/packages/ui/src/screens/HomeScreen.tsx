import { StatusBadge } from "../components/StatusBadge";
import { Icon } from "../primitives/Icon";
import { Card } from "../primitives/Card";
import { Skeleton } from "../primitives/Skeleton";

export interface HomeScreenProps {
  player?: { name: string; emoji: string; level: number; dinosDiscovered: number };
  budget?: { expeditionsUsed: number; expeditionsMax: number; minigamesRemaining: number; isTired: boolean };
  lastDiscovery?: { name: string; slug: string; imageUrl: string | null };
  hasOfflineTask?: boolean;
  loading?: boolean;
  onStartExpedition?: () => void;
  onNavigate?: (target: string) => void;
}

// Demo data for Storybook (used when no props provided)
const DEMO = {
  player: { name: "Oskar", emoji: "🦖", level: 3, dinosDiscovered: 4 },
  budget: { expeditionsUsed: 1, expeditionsMax: 3, minigamesRemaining: 2, isTired: false },
  lastDiscovery: { name: "Triceratops", slug: "triceratops", imageUrl: "/dinos/triceratops/comic.png" },
  hasOfflineTask: true,
};

export function HomeScreen({
  player = DEMO.player,
  budget = DEMO.budget,
  lastDiscovery = DEMO.lastDiscovery,
  hasOfflineTask = DEMO.hasOfflineTask,
  loading = false,
  onStartExpedition,
  onNavigate,
}: HomeScreenProps = {}) {
  if (loading) return <HomeScreenSkeleton />;

  const canExpedition = budget && !budget.isTired && budget.expeditionsUsed < budget.expeditionsMax;

  return (
    <main className="px-4 pt-3 pb-4 max-w-lg mx-auto">
      {/* Hero: Expedition CTA */}
      <button
        onClick={onStartExpedition}
        disabled={!canExpedition}
        className="w-full bg-gradient-to-br from-primary-container to-[#2E7D32] rounded-xl border-[3px] border-on-surface sticker-shadow active-press overflow-hidden text-left disabled:opacity-60 disabled:active-press-none"
      >
        <div className="flex items-center gap-3 p-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon name={canExpedition ? "explore" : "bedtime"} size="xl" filled className="text-white" />
          </div>
          <div className="flex-1 text-white min-w-0">
            <p className="text-xs font-black uppercase tracking-wider text-white/70">
              {player.name}'s Expedition
            </p>
            <p className="text-xl font-black uppercase tracking-tight leading-tight">
              {canExpedition
                ? "Neuer Dino wartet!"
                : budget?.isTired
                  ? "Die Dinos schlafen"
                  : "Alle Expeditionen fertig"}
            </p>
            {budget && (
              <p className="text-[10px] font-bold text-white/60 mt-0.5">
                {budget.expeditionsUsed}/{budget.expeditionsMax} heute
              </p>
            )}
          </div>
          {canExpedition && <Icon name="arrow_forward" size="lg" className="text-white/80" />}
        </div>
      </button>

      {/* 3 Quick Tiles */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <Card interactive className="p-3 flex flex-col items-center gap-1" onClick={() => onNavigate?.("museum")}>
          <Icon name="museum" size="lg" filled className="text-primary-container" />
          <p className="text-[10px] font-black uppercase text-on-surface">Museum</p>
          <p className="text-[9px] font-bold text-on-surface-variant">{player.dinosDiscovered} Dinos</p>
        </Card>
        <Card interactive className="p-3 flex flex-col items-center gap-1" onClick={() => onNavigate?.("minigames")}>
          <Icon name="stadia_controller" size="lg" filled className="text-tertiary-container" />
          <p className="text-[10px] font-black uppercase text-on-surface">Spiele</p>
          <p className="text-[9px] font-bold text-on-surface-variant">{budget?.minigamesRemaining ?? 0} übrig</p>
        </Card>
        <Card interactive className="p-3 flex flex-col items-center gap-1" onClick={() => onNavigate?.("story")}>
          <Icon name="auto_stories" size="lg" filled className="text-secondary-container" />
          <p className="text-[10px] font-black uppercase text-on-surface">Geschichte</p>
          <p className="text-[9px] font-bold text-on-surface-variant">Heute Abend</p>
        </Card>
      </div>

      {/* Last Discovery */}
      {lastDiscovery && (
        <Card interactive className="w-full mt-4 flex items-center gap-3 p-3 text-left" onClick={() => onNavigate?.(`museum/${lastDiscovery.slug}`)}>
          <div className="w-12 h-12 bg-gradient-to-br from-primary-container to-tertiary-container rounded-lg border-2 border-on-surface flex items-center justify-center overflow-hidden flex-shrink-0">
            {lastDiscovery.imageUrl ? (
              <img src={lastDiscovery.imageUrl} alt={lastDiscovery.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-xl">🦕</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">Letzte Entdeckung</p>
            <p className="font-black uppercase tracking-wider text-xs">{lastDiscovery.name}</p>
          </div>
          <Icon name="chevron_right" size="md" className="text-on-surface-variant" />
        </Card>
      )}

      {/* Offline Task Reminder */}
      {hasOfflineTask && (
        <button
          onClick={() => onNavigate?.("offline-task")}
          className="w-full mt-4 flex items-center gap-3 bg-secondary-fixed/30 rounded-lg border-[3px] border-secondary/30 p-3 text-left active:scale-[0.98] transition-transform"
        >
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
  );
}

function HomeScreenSkeleton() {
  return (
    <main className="px-4 pt-3 pb-4 max-w-lg mx-auto">
      <Skeleton className="h-[88px] w-full rounded-xl" />
      <div className="grid grid-cols-3 gap-2 mt-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <Skeleton className="h-16 w-full mt-4" />
      <Skeleton className="h-14 w-full mt-4" />
    </main>
  );
}
