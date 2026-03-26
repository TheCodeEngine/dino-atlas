import { useState } from "react";
import { TopBar } from "../components/TopBar";
import { ForscherSpeech } from "../components/ForscherSpeech";
import { PlayerCard } from "../components/PlayerCard";
import { IconButton } from "../primitives/IconButton";
import { Button } from "../primitives/Button";
import { Avatar } from "../primitives/Avatar";
import { Icon } from "../primitives/Icon";

export interface PlayerSelectScreenProps {
  players?: { id: string; name: string; age: number; emoji: string; hasPlayed?: boolean }[];
  onSelect?: (player: { id: string; name: string; emoji: string }) => void;
  onAddPlayer?: (data: { name: string; emoji: string; birthYear: number }) => Promise<void> | void;
  onLogout?: () => void;
}

const DEMO_PLAYERS = [
  { id: "oskar", name: "Oskar", age: 6, emoji: "🦖", hasPlayed: false },
  { id: "karl", name: "Karl", age: 4, emoji: "🦕", hasPlayed: false },
  { id: "charlotte", name: "Charlotte", age: 4, emoji: "🦎", hasPlayed: true },
];

const AVATARS = ["🦖", "🦕", "🦎", "🐊", "🐢", "🦅", "🦜", "🐸"];

export function PlayerSelectScreen({ players, onSelect, onAddPlayer, onLogout }: PlayerSelectScreenProps = {}) {
  const list = players ?? DEMO_PLAYERS;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBirthYear, setNewBirthYear] = useState("");
  const [newEmoji, setNewEmoji] = useState("🦖");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!onAddPlayer || !newName.trim()) return;
    setError("");
    setLoading(true);
    try {
      await onAddPlayer({
        name: newName.trim(),
        emoji: newEmoji,
        birthYear: parseInt(newBirthYear) || 2020,
      });
      setNewName("");
      setNewBirthYear("");
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message || "Fehler beim Anlegen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <TopBar
        right={
          onLogout ? (
            <IconButton icon="logout" variant="ghost" label="Abmelden" onClick={onLogout} />
          ) : (
            <IconButton icon="settings" variant="ghost" label="Einstellungen" />
          )
        }
      />

      <main className="pt-20 pb-8 px-4 max-w-sm mx-auto">
        <div className="mb-6">
          <ForscherSpeech
            text="Wer geht heute auf Expedition?"
            subtext="Wähle deinen Forscher!"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          {list.map((player) => (
            <PlayerCard
              key={player.id}
              name={player.name}
              age={player.age}
              emoji={player.emoji}
              state={player.hasPlayed ? "tired" : "default"}
              onClick={() => onSelect?.({ id: player.id, name: player.name, emoji: player.emoji })}
            />
          ))}
        </div>

        {/* Add Player Form */}
        {showAddForm ? (
          <div className="mt-4 p-4 bg-surface-container-lowest border-[3px] border-on-surface rounded-xl sticker-shadow">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant mb-3">
              Neuer Forscher
            </p>

            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => {
                  const idx = AVATARS.indexOf(newEmoji);
                  setNewEmoji(AVATARS[(idx + 1) % AVATARS.length]!);
                }}
                className="active:scale-90 transition-transform flex-shrink-0"
              >
                <Avatar size="lg">{newEmoji}</Avatar>
              </button>

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-3 py-2 bg-white border-2 border-on-surface rounded-lg text-sm font-bold placeholder:text-outline/40"
                  autoFocus
                />
                <input
                  type="number"
                  value={newBirthYear}
                  onChange={(e) => setNewBirthYear(e.target.value)}
                  placeholder="Geburtsjahr"
                  className="w-full px-3 py-2 bg-white border-2 border-on-surface rounded-lg text-sm font-bold placeholder:text-outline/40"
                  min="2015"
                  max="2025"
                />
              </div>
            </div>

            {error && <p className="text-xs font-bold text-error mt-2">{error}</p>}

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-surface-container-high text-on-surface border-[3px] border-on-surface rounded-lg font-bold uppercase tracking-wider text-xs sticker-shadow active-press"
              >
                Abbrechen
              </button>
              <div className="flex-1">
                <Button variant="primary" fullWidth icon="person_add" disabled={loading || !newName.trim()} onClick={handleAdd}>
                  {loading ? "Lade..." : "Anlegen"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onAddPlayer ? setShowAddForm(true) : undefined}
            className="w-full mt-4 py-3 border-[3px] border-dashed border-outline-variant rounded-xl text-xs font-bold text-on-surface-variant hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1.5"
          >
            <Icon name="add" size="sm" />
            Kind hinzufügen
          </button>
        )}
      </main>
    </div>
  );
}
