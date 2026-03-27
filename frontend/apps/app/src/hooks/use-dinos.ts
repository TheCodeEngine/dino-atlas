import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";

interface DinoListItem {
  id: string;
  slug: string;
  display_name_de: string;
  scientific_name: string;
  period: string;
  diet: string;
  length_m: number | null;
  weight_kg: number | null;
  rarity: string;
  has_content: boolean;
}

interface DinoDetail {
  id: string;
  slug: string;
  display_name_de: string;
  scientific_name: string;
  period: string;
  period_start_mya: number | null;
  period_end_mya: number | null;
  diet: string;
  length_m: number | null;
  weight_kg: number | null;
  continent: string;
  rarity: string;
  kid_summary: string;
  kid_summary_tts: string;
  fun_fact: string;
  fun_fact_tts: string;
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

export function useDinos() {
  return useQuery({
    queryKey: ["dinos"],
    queryFn: () => get<DinoListItem[]>("/dinos"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDino(slug: string) {
  return useQuery({
    queryKey: ["dinos", slug],
    queryFn: () => get<DinoDetail>(`/dinos/${slug}`),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export type { DinoListItem, DinoDetail };
