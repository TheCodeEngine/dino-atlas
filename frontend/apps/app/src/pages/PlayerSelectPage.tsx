import { useNavigate } from "react-router";
import { PlayerSelectScreen } from "@dino-atlas/ui";
import { useAuthStore } from "@/stores/auth-store";
import { post } from "@/lib/api";

export function PlayerSelectPage() {
  const navigate = useNavigate();
  const players = useAuthStore((s) => s.players);
  const setActivePlayer = useAuthStore((s) => s.setActivePlayer);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const logout = useAuthStore((s) => s.logout);

  const currentYear = new Date().getFullYear();

  const playerList = players.map((p) => ({
    id: p.id,
    name: p.name,
    age: currentYear - p.birth_year,
    emoji: p.avatar_emoji,
  }));

  const handleSelect = (player: { id: string; name: string; emoji: string }) => {
    const full = players.find((p) => p.id === player.id);
    if (full) {
      setActivePlayer(full);
      navigate("/");
    }
  };

  const handleAddPlayer = async (data: { name: string; emoji: string; birthYear: number }) => {
    await post("/players", {
      name: data.name,
      emoji: data.emoji,
      birth_year: data.birthYear,
    });
    await fetchMe(); // refresh player list
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <PlayerSelectScreen
      players={playerList}
      onSelect={handleSelect}
      onAddPlayer={handleAddPlayer}
      onLogout={handleLogout}
    />
  );
}
