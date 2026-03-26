import { ForscherSpeech } from "../components/ForscherSpeech";
import { Icon } from "../primitives/Icon";
import { Skeleton } from "../primitives/Skeleton";

export interface MinigameItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  available: boolean;
  minDinos?: number;
}

export interface MinigameSelectScreenProps {
  games?: MinigameItem[];
  minigamesRemaining?: number;
  loading?: boolean;
  onSelectGame?: (gameId: string) => void;
}

const DEMO_GAMES: MinigameItem[] = [
  { id: "quiz", name: "Dino-Quiz", icon: "quiz", description: "Teste dein Wissen!", available: true },
  { id: "size_sort", name: "Größen-Sortieren", icon: "straighten", description: "Wer ist der Größte?", available: true },
  { id: "timeline", name: "Zeitleiste", icon: "schedule", description: "Wann hat er gelebt?", available: true },
  { id: "food_match", name: "Futter-Zuordnung", icon: "restaurant", description: "Was frisst er?", available: false, minDinos: 2 },
  { id: "shadow_guess", name: "Schatten-Raten", icon: "visibility", description: "Erkennst du ihn?", available: false, minDinos: 2 },
];

export function MinigameSelectScreen({
  games = DEMO_GAMES,
  minigamesRemaining = 2,
  loading = false,
  onSelectGame,
}: MinigameSelectScreenProps = {}) {
  if (loading) return <MinigamesSkeleton />;

  return (
    <div className="px-4 pt-3 pb-4 max-w-sm mx-auto">
      <div className="mb-4">
        <ForscherSpeech
          text={minigamesRemaining > 0
            ? `Was möchtest du spielen? Du hast noch ${minigamesRemaining} Spiel${minigamesRemaining === 1 ? "" : "e"} übrig!`
            : "Für heute sind alle Spiele gespielt! Morgen geht's weiter!"
          }
        />
      </div>

      <div className="flex flex-col gap-2.5">
        {games.map((game) => (
          <button
            key={game.id}
            disabled={!game.available || minigamesRemaining <= 0}
            onClick={() => game.available && minigamesRemaining > 0 ? onSelectGame?.(game.id) : undefined}
            className={`flex items-center gap-3 p-3 rounded-lg border-[3px] text-left ${
              game.available && minigamesRemaining > 0
                ? "bg-surface-container-lowest border-on-surface sticker-shadow active-press"
                : "bg-surface-container-high border-outline-variant opacity-40"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              game.available ? "bg-primary-fixed" : "bg-surface-container-highest"
            }`}>
              <Icon name={game.icon} size="lg" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase">{game.name}</p>
              <p className="text-[10px] text-on-surface-variant">
                {game.available ? game.description : `Entdecke mind. ${game.minDinos ?? "?"} Dinos!`}
              </p>
            </div>
            {!game.available && <Icon name="lock" size="md" className="text-outline-variant" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function MinigamesSkeleton() {
  return (
    <div className="px-4 pt-3 pb-4 max-w-sm mx-auto">
      <Skeleton className="h-14 w-full mb-4" />
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}
