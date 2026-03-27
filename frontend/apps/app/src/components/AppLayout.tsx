import { Outlet, useLocation, useNavigate } from "react-router";
import { AppShell, StatusBadge, PlayerSwitcher } from "@dino-atlas/ui";
import { useAuthStore } from "@/stores/auth-store";

const NAV_MAP: Record<string, string> = {
  camp: "/",
  museum: "/museum",
  games: "/minigames",
  story: "/story",
};

const PATH_TO_NAV: Record<string, string> = {
  "/": "camp",
  "/museum": "museum",
  "/minigames": "games",
  "/story": "story",
};

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePlayer = useAuthStore((s) => s.activePlayer);
  const players = useAuthStore((s) => s.players);
  const setActivePlayer = useAuthStore((s) => s.setActivePlayer);
  const logout = useAuthStore((s) => s.logout);

  const activeNav = PATH_TO_NAV[location.pathname] || "camp";

  const handleNavChange = (id: string) => {
    const path = NAV_MAP[id];
    if (path) navigate(path);
  };

  const handlePlayerChange = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    if (player) setActivePlayer(player);
  };

  const playerList = players.map((p) => ({
    id: p.id,
    name: p.name,
    emoji: p.avatar_emoji,
  }));

  return (
    <AppShell
      activeNav={activeNav}
      onNavChange={handleNavChange}
      topRight={
        activePlayer ? (
          <div className="flex items-center gap-2">
            <StatusBadge label={`Lv.${activePlayer.level}`} variant="primary" />
            <PlayerSwitcher
              players={playerList}
              active={activePlayer.id}
              onChange={handlePlayerChange}
              onAddPlayer={() => navigate("/players")}
              onLogout={() => { logout(); navigate("/login"); }}
            />
          </div>
        ) : undefined
      }
    >
      <Outlet />
    </AppShell>
  );
}
