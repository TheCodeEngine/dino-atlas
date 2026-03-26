import { TopBar } from "../components/TopBar";
import { ForscherSpeech } from "../components/ForscherSpeech";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../primitives/Icon";
import { Card } from "../primitives/Card";

/**
 * Mini-Spiel Auswahl
 * - Budget-Anzeige: "Noch 2 Spiele übrig"
 * - Spiel-Karten mit Icons
 * - Gesperrte Spiele: "Entdecke mehr Dinos!"
 */
export function MinigameSelectScreen() {
  const games = [
    { icon: "quiz", name: "Dino-Quiz", desc: "Teste dein Wissen!", available: true },
    { icon: "sort", name: "Größen-Sortieren", desc: "Wer ist der Größte?", available: true },
    { icon: "timeline", name: "Zeitleiste", desc: "Wann hat er gelebt?", available: true },
    { icon: "restaurant", name: "Futter-Zuordnung", desc: "Was frisst er?", available: false },
    { icon: "mystery", name: "Schatten-Raten", desc: "Erkennst du ihn?", available: false },
  ];

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-16">
      <TopBar />
      <main className="pt-18 px-4 max-w-sm mx-auto">
        <div className="pt-16 mb-4">
          <ForscherSpeech text="Was möchtest du spielen? Du hast noch 2 Spiele übrig!" />
        </div>

        <div className="flex flex-col gap-2.5">
          {games.map((game) => (
            <button
              key={game.name}
              disabled={!game.available}
              className={`flex items-center gap-3 p-3 rounded-lg border-[3px] text-left ${
                game.available
                  ? "bg-surface-container-lowest border-on-surface sticker-shadow active-press"
                  : "bg-surface-container-high border-outline-variant opacity-40"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${game.available ? "bg-primary-fixed" : "bg-surface-container-highest"}`}>
                <Icon name={game.icon} size="lg" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black uppercase">{game.name}</p>
                <p className="text-[10px] text-on-surface-variant">{game.desc}</p>
              </div>
              {!game.available && <Icon name="lock" size="md" className="text-outline-variant" />}
            </button>
          ))}
        </div>
      </main>
      <BottomNav
        items={[
          { id: "camp", icon: "home", label: "Camp" },
          { id: "museum", icon: "museum", label: "Museum" },
          { id: "games", icon: "stadia_controller", label: "Spiele" },
          { id: "story", icon: "auto_stories", label: "Geschichte" },
        ]}
        active="games"
      />
    </div>
  );
}
