export interface MinigameDino {
  id: string;
  slug: string;
  name: string;
  period: string;
  diet: string;
  length_m: number | null;
  image_comic_url: string | null;
  image_shadow_url: string | null;
  quiz_questions: { question: string; options: { label: string; emoji: string; correct: boolean }[]; explanation: string }[] | null;
}
