import { create } from "zustand";
import { get, post } from "@/lib/api";

interface Expedition {
  id: string;
  player_id: string;
  dino_species_id: string;
  date: string;
  biom: string;
  status: string;
}

interface DinoDetail {
  id: string;
  slug: string;
  display_name_de: string;
  scientific_name: string;
  period: string;
  diet: string;
  length_m: number | null;
  weight_kg: number | null;
  rarity: string;
  kid_summary: string;
  fun_fact: string;
  size_comparison: string;
  name_ipa: string;
  facts: any;
  quiz_questions: any;
  food_options: any;
  identify_hints: any;
  image_comic_url: string | null;
  image_real_url: string | null;
  image_skeleton_url: string | null;
  image_shadow_url: string | null;
  audio_name_url: string | null;
  audio_steckbrief_url: string | null;
}

interface ExpeditionResponse {
  expedition: Expedition;
  dino: DinoDetail;
}

interface ExpeditionStore {
  expedition: Expedition | null;
  dino: DinoDetail | null;
  isLoading: boolean;

  checkActive: (playerId: string) => Promise<boolean>;
  start: (playerId: string, biom: string) => Promise<void>;
  advance: (data: {
    playerId: string;
    excavationTimeMs?: number;
    puzzleTimeMs?: number;
    identifyAttempts?: number;
  }) => Promise<string>; // returns new status
  clear: () => void;
}

export const useExpeditionStore = create<ExpeditionStore>((set, getState) => ({
  expedition: null,
  dino: null,
  isLoading: false,

  checkActive: async (playerId) => {
    set({ isLoading: true });
    try {
      const res = await get<ExpeditionResponse | null>(
        `/expedition/active?player_id=${playerId}`
      );
      if (res) {
        set({ expedition: res.expedition, dino: res.dino });
        return true;
      }
      set({ expedition: null, dino: null });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  start: async (playerId, biom) => {
    set({ isLoading: true });
    try {
      const res = await post<ExpeditionResponse>("/expedition/start", {
        player_id: playerId,
        biom,
      });
      set({ expedition: res.expedition, dino: res.dino });
    } finally {
      set({ isLoading: false });
    }
  },

  advance: async ({ playerId, excavationTimeMs, puzzleTimeMs, identifyAttempts }) => {
    const exp = getState().expedition;
    if (!exp) throw new Error("No active expedition");

    const res = await post<ExpeditionResponse>("/expedition/advance", {
      player_id: playerId,
      expedition_id: exp.id,
      excavation_time_ms: excavationTimeMs,
      puzzle_time_ms: puzzleTimeMs,
      identify_attempts: identifyAttempts,
    });

    set({ expedition: res.expedition, dino: res.dino });
    return res.expedition.status;
  },

  clear: () => set({ expedition: null, dino: null }),
}));
