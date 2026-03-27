import { useNavigate } from "react-router";
import { StoryLibraryScreen, type StoryPreview } from "@dino-atlas/ui";
import { useAuthStore } from "@/stores/auth-store";
import { useMuseum } from "@/hooks/use-museum";
import { useQueries } from "@tanstack/react-query";
import { get } from "@/lib/api";
import type { DinoDetail } from "@/hooks/use-dinos";
import { buildStoryLibrary } from "@/lib/assemble-story";
import { useMemo } from "react";

export function StoryPage() {
  const navigate = useNavigate();
  const player = useAuthStore((s) => s.activePlayer);
  const { data: museum, isLoading: museumLoading } = useMuseum(player?.id);

  // Load full details for up to 6 discovered dinos (enough for stories)
  const slugs = useMemo(() => (museum ?? []).slice(0, 6).map((m) => m.dino_slug), [museum]);

  const dinoQueries = useQueries({
    queries: slugs.map((slug) => ({
      queryKey: ["dinos", slug],
      queryFn: () => get<DinoDetail>(`/dinos/${slug}`),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = museumLoading || dinoQueries.some((q) => q.isLoading);
  const dinos = dinoQueries.filter((q) => q.data).map((q) => q.data!);

  // Build stories from dino data
  const allStories = useMemo(() => buildStoryLibrary(dinos), [dinos]);
  const tonightStory = allStories[0];
  const otherStories = allStories.slice(1);

  // Store stories in session for the player page to retrieve
  const storyMap = useMemo(() => {
    const map: Record<string, typeof allStories[0]> = {};
    for (const s of allStories) map[s.id] = s;
    return map;
  }, [allStories]);

  // Save to sessionStorage so StoryPlayerPage can access it
  useMemo(() => {
    if (allStories.length > 0) {
      sessionStorage.setItem("dino-stories", JSON.stringify(storyMap));
    }
  }, [storyMap]);

  const toPreview = (s: typeof allStories[0]): StoryPreview => ({
    id: s.id,
    title: s.title,
    dinoNames: s.dinos.map((d) => d.name),
    dinoImages: s.dinos.map((d) => d.imageUrl),
  });

  return (
    <StoryLibraryScreen
      loading={isLoading}
      playerName={player?.name}
      tonightStory={tonightStory ? toPreview(tonightStory) : undefined}
      stories={otherStories.map(toPreview)}
      onSelectStory={(id) => navigate(`/story/${id}`)}
    />
  );
}
