import { useState } from "react";
import { TopBar } from "../../../../packages/ui/src/components/TopBar";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { PlayerCard } from "../../../../packages/ui/src/components/PlayerCard";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { IconButton } from "../../../../packages/ui/src/primitives/IconButton";

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
      <TopBar
        right={
          <IconButton icon="settings" variant="ghost" label="Einstellungen" />
        }
      />

      <main className="pt-20 pb-8 px-4 max-w-sm mx-auto">
        <div className="mb-6">
          <ForscherSpeech
            text="Wer geht heute auf Expedition?"
            subtext="Wählt eure Forscher aus!"
          />
        </div>

        <div className="flex flex-col gap-2.5 mb-6">
          {PLAYERS.map((player) => (
            <PlayerCard
              key={player.id}
              name={player.name}
              age={player.age}
              emoji={player.emoji}
              state={player.hasPlayed ? "tired" : selected.includes(player.id) ? "selected" : "default"}
              onClick={() => toggle(player.id)}
            />
          ))}
        </div>

        <Button
          variant="primary"
          fullWidth
          icon="explore"
          disabled={selected.length === 0}
        >
          {selected.length > 0 ? `Los geht's! (${selected.length})` : "Forscher auswählen"}
        </Button>
      </main>
    </div>
  );
}
