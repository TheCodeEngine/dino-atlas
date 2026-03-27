import { AudioPlayer } from "../components/AudioPlayer";
import { FullscreenHeader } from "../components/FullscreenHeader";

export interface StoryDino {
  name: string;
  imageUrl: string | null;
}

export interface StoryTimeScreenProps {
  title?: string;
  storyText?: string;
  dinos?: StoryDino[];
  onClose?: () => void;
}

const FALLBACK_TITLE = "Die drei Freunde am See 🌙";
const FALLBACK_STORY =
  "Es war einmal in einem großen Wald, da trafen sich drei Dinosaurier. " +
  "Sie machten sich auf den Weg zum großen See. " +
  "Zusammen wanderten sie durch dichte Farnwälder und über moosige Hügel. " +
  "Am Abend fanden sie eine gemütliche Lichtung und legten sich unter die Sterne. " +
  "Gute Nacht, flüsterte der kleinste Dino. Morgen erleben wir ein neues Abenteuer!";

export function StoryTimeScreen({
  title = FALLBACK_TITLE,
  storyText = FALLBACK_STORY,
  dinos = [],
  onClose,
}: StoryTimeScreenProps = {}) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#1a1530" }}>
      {/* Stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            left: `${(i * 37 + 13) % 100}%`,
            top: `${(i * 23 + 7) % 40}%`,
            opacity: 0.2 + ((i * 17) % 50) / 100,
            animationDelay: `${(i * 0.7) % 3}s`,
            animationDuration: `${2 + (i % 3)}s`,
          }}
        />
      ))}

      {/* Moon */}
      <div
        className="absolute top-10 right-6 w-12 h-12 rounded-full bg-[#fef0c7]"
        style={{ boxShadow: "0 0 30px 8px rgba(254,240,199,0.25)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        <FullscreenHeader title="Gute-Nacht-Geschichte" variant="dark" onClose={onClose} />

        <main className="flex-1 px-4 pb-8 max-w-md mx-auto w-full">
          {/* Dino avatars */}
          {dinos.length > 0 && (
            <div className="flex justify-center gap-4 mb-4">
              {dinos.map((dino) => (
                <div key={dino.name} className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 bg-white/10 border-2 border-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    {dino.imageUrl ? (
                      <img src={dino.imageUrl} alt={dino.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <span className="text-2xl">🦕</span>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-white/50">{dino.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Story title */}
          <h1 className="text-lg font-black uppercase text-center text-[#ffc850] mb-4">
            {title}
          </h1>

          {/* Dino illustrations */}
          {dinos.length > 0 && (
            <div className="flex justify-center gap-2 mb-4">
              {dinos.filter((d) => d.imageUrl).map((dino) => (
                <img key={dino.name} src={dino.imageUrl!} alt={dino.name} className="w-16 h-16 object-contain opacity-60 drop-shadow-lg" />
              ))}
            </div>
          )}

          {/* Story AudioPlayer */}
          <div className="bg-white/5 border border-white/10 rounded-xl">
            <AudioPlayer text={storyText} duration={Math.max(60, storyText.length / 10)} />
          </div>

          {/* "Gute Nacht" footer */}
          <div className="mt-6 text-center">
            <p className="text-2xl mb-1">🌙</p>
            <p className="text-xs font-bold text-white/30">Gute Nacht, kleine Forscher!</p>
          </div>
        </main>
      </div>
    </div>
  );
}
