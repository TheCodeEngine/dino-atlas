import { ForscherSpeech } from "../components/ForscherSpeech";
import { StoryCard } from "../components/StoryCard";
import { Skeleton } from "../primitives/Skeleton";

export interface StoryPreview {
  id: string;
  title: string;
  dinoNames: string[];
  dinoImages: (string | null)[];
  date?: string;
}

export interface StoryLibraryScreenProps {
  stories?: StoryPreview[];
  tonightStory?: StoryPreview;
  loading?: boolean;
  playerName?: string;
  onSelectStory?: (id: string) => void;
}

export function StoryLibraryScreen({
  stories = [],
  tonightStory,
  loading = false,
  playerName,
  onSelectStory,
}: StoryLibraryScreenProps = {}) {
  const greeting = playerName
    ? `${playerName}, welche Geschichte soll ich dir heute vorlesen?`
    : "Welche Geschichte soll ich dir heute vorlesen?";

  if (loading) {
    return (
      <div className="px-4 py-4">
        <Skeleton className="w-full h-16 rounded-xl mb-3" />
        <Skeleton className="w-full h-20 rounded-xl mb-2" />
        <Skeleton className="w-full h-20 rounded-xl mb-2" />
        <Skeleton className="w-full h-20 rounded-xl" />
      </div>
    );
  }

  const hasStories = tonightStory || stories.length > 0;

  return (
    <div className="px-4 py-4">
      {/* Forscher greeting */}
      <div className="mb-4">
        <ForscherSpeech text={greeting} icon="auto_stories" playable={false} />
      </div>

      {!hasStories ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="text-5xl mb-3">📖</span>
          <p className="text-sm font-black uppercase mb-1">Noch keine Geschichten</p>
          <p className="text-xs text-on-surface-variant max-w-[240px]">
            Entdecke Dinos auf Expeditionen — dann kann ich dir Geschichten über sie erzählen!
          </p>
        </div>
      ) : (
        <>
          {/* Tonight's story */}
          {tonightStory && (
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2">
                🌙 Gute-Nacht-Geschichte
              </p>
              <StoryCard
                title={tonightStory.title}
                dinoImages={tonightStory.dinoImages}
                dinoNames={tonightStory.dinoNames}
                variant="tonight"
                onClick={() => onSelectStory?.(tonightStory.id)}
              />
            </div>
          )}

          {/* Story library */}
          {stories.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2">
                📚 Alle Geschichten
              </p>
              <div className="flex flex-col gap-2">
                {stories.map((story) => (
                  <StoryCard
                    key={story.id}
                    title={story.title}
                    dinoImages={story.dinoImages}
                    dinoNames={story.dinoNames}
                    date={story.date}
                    onClick={() => onSelectStory?.(story.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
