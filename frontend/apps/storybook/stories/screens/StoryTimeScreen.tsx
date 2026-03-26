import { AudioPlayer } from "../../../../packages/ui/src/components/AudioPlayer";
import { BottomNav } from "../../../../packages/ui/src/components/BottomNav";

/**
 * Gute-Nacht-Geschichte
 * - KI-generierte Story mit den Dinos aller Kinder
 * - Bebildert mit Dino-Illustrationen
 * - AudioPlayer mit Karaoke-Text
 * - Interaktive Pausen: "Was glaubt ihr passiert als nächstes?"
 * - Gemütliche Nacht-Stimmung
 */

const STORY = "Es war einmal in einem großen Wald, da trafen sich drei Dinosaurier. " +
  "Oskars Triceratops war gerade beim Frühstück — er kaute genüsslich an einem Farnbusch. " +
  "Da kam Karls Stegosaurus um die Ecke und rief: Hallo Freund! Was machst du da? " +
  "Der Triceratops antwortete: Ich frühstücke! Willst du auch etwas? " +
  "Zusammen machten sie sich auf den Weg zum großen See. " +
  "Dort wartete schon Charlottes Pteranodon, der hoch oben auf einem Felsen saß. " +
  "Von hier oben kann ich das ganze Tal sehen! rief er herunter. " +
  "Die drei Freunde beschlossen, zusammen auf Abenteuer zu gehen.";

export function StoryTimeScreen() {
  return (
    <div className="bg-[#1a1530] text-white min-h-screen flex flex-col pb-16" style={{ backgroundImage: "none" }}>
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 40}%`, opacity: 0.3 + Math.random() * 0.5, animationDelay: `${Math.random() * 3}s` }}
          />
        ))}
      </div>

      <header className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between">
        <button className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-lg">
          <span className="material-symbols-outlined text-white text-lg">close</span>
        </button>
        <p className="text-xs font-black uppercase tracking-wider text-white/50">Gute-Nacht-Geschichte</p>
        <div className="w-9" />
      </header>

      <main className="relative z-10 flex-1 px-4 max-w-md mx-auto w-full">
        {/* Dino characters */}
        <div className="flex justify-center gap-3 mb-4">
          {[
            { name: "Oskar", emoji: "🦖" },
            { name: "Karl", emoji: "🦕" },
            { name: "Charlotte", emoji: "🦅" },
          ].map((kid) => (
            <div key={kid.name} className="flex flex-col items-center gap-0.5">
              <div className="w-12 h-12 bg-white/10 border-2 border-white/20 rounded-full flex items-center justify-center text-xl">
                {kid.emoji}
              </div>
              <span className="text-[9px] font-bold text-white/50">{kid.name}</span>
            </div>
          ))}
        </div>

        <h1 className="text-lg font-black uppercase text-center text-[#ffc850] mb-4">Die drei Freunde am See</h1>

        {/* Story AudioPlayer */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <AudioPlayer text={STORY} duration={90} />
        </div>
      </main>

      <BottomNav
        items={[
          { id: "camp", icon: "home", label: "Camp" },
          { id: "museum", icon: "museum", label: "Museum" },
          { id: "games", icon: "stadia_controller", label: "Spiele" },
          { id: "story", icon: "auto_stories", label: "Geschichte" },
        ]}
        active="story"
      />
    </div>
  );
}
