import { useNavigate, useParams } from "react-router";
import { StoryTimeScreen } from "@dino-atlas/ui";
import { useMemo } from "react";

interface StoredStory {
  id: string;
  title: string;
  text: string;
  dinos: { name: string; imageUrl: string | null }[];
}

export function StoryPlayerPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const story = useMemo<StoredStory | null>(() => {
    try {
      const raw = sessionStorage.getItem("dino-stories");
      if (!raw) return null;
      const map = JSON.parse(raw) as Record<string, StoredStory>;
      return map[id ?? ""] ?? null;
    } catch {
      return null;
    }
  }, [id]);

  if (!story) {
    navigate("/story", { replace: true });
    return null;
  }

  return (
    <StoryTimeScreen
      title={story.title}
      storyText={story.text}
      dinos={story.dinos.map((d) => ({ name: d.name, imageUrl: d.imageUrl }))}
      onClose={() => navigate("/story")}
    />
  );
}
