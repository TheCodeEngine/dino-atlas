import type { DinoDetail } from "@/hooks/use-dinos";

interface AssembledStory {
  id: string;
  title: string;
  text: string;
  dinos: { name: string; imageUrl: string | null }[];
}

const OPENERS = [
  "Es war einmal in einer weit entfernten Zeit",
  "Vor langer, langer Zeit",
  "Stell dir vor, ganz früher",
  "An einem wunderschönen Urtag",
  "Tief im urzeitlichen Wald",
];

const BRIDGES = [
  "Aber das war noch nicht alles!",
  "Und wisst ihr, wen sie dort trafen?",
  "Nicht weit entfernt lebte noch jemand.",
  "Da kam plötzlich ein anderer Dino vorbei!",
];

const CLOSINGS = [
  "Und so legten sich alle Dinos unter die Sterne und schliefen ein. Gute Nacht!",
  "Am Abend waren alle müde aber glücklich. Schlaf gut, kleiner Forscher!",
  "Und dann wurde es Nacht. Die Dinos kuscheln sich zusammen. Gute Nacht!",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length]!;
}

/** Assemble a bedtime story from 1-3 discovered dinos */
export function assembleStory(dinos: DinoDetail[], seed: number = 0): AssembledStory {
  const selected = dinos.slice(0, 3);
  if (selected.length === 0) {
    return {
      id: "empty",
      title: "Noch keine Dinos entdeckt",
      text: "Geh auf Expedition und entdecke deinen ersten Dino! Dann kann ich dir eine Geschichte erzählen.",
      dinos: [],
    };
  }

  const parts: string[] = [];

  // Opening
  parts.push(`${pick(OPENERS, seed)}, da lebte ein besonderer Dinosaurier.`);

  // Each dino gets a paragraph from kid_summary
  selected.forEach((dino, i) => {
    if (i > 0) {
      parts.push(pick(BRIDGES, seed + i));
    }
    if (dino.kid_summary) {
      parts.push(dino.kid_summary);
    }
    if (dino.fun_fact && i === 0) {
      parts.push(dino.fun_fact);
    }
  });

  // Closing
  parts.push(pick(CLOSINGS, seed + selected.length));

  const names = selected.map((d) => d.display_name_de);
  const title = selected.length === 1
    ? `${names[0]} und die Sternennacht 🌙`
    : selected.length === 2
      ? `${names[0]} & ${names[1]} 🌙`
      : `${names[0]}, ${names[1]} & ${names[2]} 🌙`;

  return {
    id: `story-${seed}-${selected.map((d) => d.slug).join("-")}`,
    title,
    text: parts.join(" "),
    dinos: selected.map((d) => ({
      name: d.display_name_de,
      imageUrl: d.image_comic_url,
    })),
  };
}

/** Build multiple stories from a pool of dinos (groups of 1-3) */
export function buildStoryLibrary(dinos: DinoDetail[]): AssembledStory[] {
  if (dinos.length === 0) return [];

  const stories: AssembledStory[] = [];
  const shuffled = [...dinos].sort((a, b) => a.slug.localeCompare(b.slug));

  // Tonight's story: last 1-3 discovered (most recent)
  const tonight = shuffled.slice(0, Math.min(3, shuffled.length));
  stories.push(assembleStory(tonight, Date.now()));

  // Additional stories: groups of 2-3 from remaining dinos
  for (let i = 0; i < shuffled.length; i += 2) {
    const group = shuffled.slice(i, i + Math.min(2, shuffled.length - i));
    if (group.length > 0) {
      stories.push(assembleStory(group, i + 42));
    }
  }

  return stories;
}
