import { create } from "zustand";
import { get, post } from "@/lib/api";

interface Player {
  id: string;
  family_id: string;
  name: string;
  avatar_emoji: string;
  birth_year: number;
  level: number;
  dinos_discovered: number;
}

interface Family {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  family_id: string;
}

interface MeResponse {
  user: User;
  family: Family;
  players: Player[];
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthStore {
  user: User | null;
  family: Family | null;
  players: Player[];
  activePlayer: Player | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    family_name: string;
    player_name: string;
    player_emoji: string;
    player_birth_year: number;
  }) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  setActivePlayer: (player: Player) => void;
  isAuthenticated: () => boolean;
  hasActivePlayer: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, getState) => ({
  user: JSON.parse(localStorage.getItem("dino_user") || "null"),
  family: JSON.parse(localStorage.getItem("dino_family") || "null"),
  players: JSON.parse(localStorage.getItem("dino_players") || "[]"),
  activePlayer: JSON.parse(localStorage.getItem("dino_active_player") || "null"),
  isLoading: false,

  login: async (email, password) => {
    const res = await post<AuthResponse>("/auth/login", { email, password });
    localStorage.setItem("dino_user", JSON.stringify(res.user));
    set({ user: res.user });
    // Fetch full profile (family + players)
    await getState().fetchMe();
  },

  register: async (data) => {
    const res = await post<AuthResponse>("/auth/register", data);
    localStorage.setItem("dino_user", JSON.stringify(res.user));
    set({ user: res.user });
    await getState().fetchMe();
  },

  logout: () => {
    localStorage.removeItem("dino_user");
    localStorage.removeItem("dino_family");
    localStorage.removeItem("dino_players");
    localStorage.removeItem("dino_active_player");
    set({ user: null, family: null, players: [], activePlayer: null });
    post("/auth/logout").catch(() => {});
  },

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const me = await get<MeResponse>("/auth/me");
      localStorage.setItem("dino_user", JSON.stringify(me.user));
      localStorage.setItem("dino_family", JSON.stringify(me.family));
      localStorage.setItem("dino_players", JSON.stringify(me.players));
      set({ user: me.user, family: me.family, players: me.players });

      // Auto-select player if only one
      const current = getState().activePlayer;
      if (!current && me.players.length === 1) {
        getState().setActivePlayer(me.players[0]);
      }
    } finally {
      set({ isLoading: false });
    }
  },

  setActivePlayer: (player) => {
    localStorage.setItem("dino_active_player", JSON.stringify(player));
    set({ activePlayer: player });
  },

  isAuthenticated: () => !!getState().user,
  hasActivePlayer: () => !!getState().activePlayer,
}));
