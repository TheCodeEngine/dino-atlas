import { AudioPlayer } from "../components/AudioPlayer";
import { FullscreenHeader } from "../components/FullscreenHeader";

/**
 * Gute-Nacht-Geschichte
 * - Fullscreen Nacht-Atmosphaere
 * - 3 Kinder-Avatare mit ihren Tages-Dinos
 * - Bebildert: Dino-Illustrationen zwischen Text-Abschnitten
 * - AudioPlayer mit Karaoke-Text
 * - Gemuetlich, ruhig, Schlafengehen-Stimmung
 */

const KIDS = [
  { name: "Oskar", emoji: "🦖", dino: "Triceratops", dinoImage: "/dinos/triceratops/comic.png" },
  { name: "Karl", emoji: "🦕", dino: "Stegosaurus", dinoImage: "/dinos/stegosaurus/comic.png" },
  { name: "Charlotte", emoji: "🦎", dino: "Brachiosaurus", dinoImage: "/dinos/brachiosaurus/comic.png" },
];

const STORY =
  "Es war einmal in einem großen Wald, da trafen sich drei Dinosaurier. " +
  "Oskars Triceratops war gerade beim Frühstück — er kaute genüsslich an einem Farnbusch. " +
  "Da kam Karls Stegosaurus um die Ecke und rief: Hallo Freund! Was machst du da? " +
  "Der Triceratops antwortete: Ich frühstücke! Willst du auch etwas? " +
  "Zusammen machten sie sich auf den Weg zum großen See. " +
  "Dort wartete schon Charlottes Brachiosaurus, der mit seinem langen Hals die höchsten Blätter pflückte. " +
  "Von hier oben kann ich das ganze Tal sehen! rief sie herunter. " +
  "Die drei Freunde beschlossen, zusammen auf Abenteuer zu gehen. " +
  "Sie wanderten durch dichte Farnwälder und über moosige Hügel. " +
  "Am Abend fanden sie eine gemütliche Lichtung und legten sich unter die Sterne. " +
  "Gute Nacht, flüsterte der Triceratops. Morgen erleben wir ein neues Abenteuer!";

export function StoryTimeScreen() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundImage: "none", background: "#1a1530" }}>
      {/* Stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 40}%`,
            opacity: 0.2 + Math.random() * 0.5,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
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
        <FullscreenHeader title="Gute-Nacht-Geschichte" variant="dark" />

        <main className="flex-1 px-4 pb-8 max-w-md mx-auto w-full">
          {/* Kid avatars with their dinos */}
          <div className="flex justify-center gap-4 mb-4">
            {KIDS.map((kid) => (
              <div key={kid.name} className="flex flex-col items-center gap-1">
                <div className="relative">
                  <div className="w-14 h-14 bg-white/10 border-2 border-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    <img src={kid.dinoImage} alt={kid.dino} className="w-12 h-12 object-contain" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/15 border border-white/25 rounded-full flex items-center justify-center text-sm">
                    {kid.emoji}
                  </div>
                </div>
                <span className="text-[9px] font-bold text-white/50">{kid.name}</span>
              </div>
            ))}
          </div>

          {/* Story title */}
          <h1 className="text-lg font-black uppercase text-center text-[#ffc850] mb-4">
            Die drei Freunde am See 🌙
          </h1>

          {/* Illustration */}
          <div className="flex justify-center gap-2 mb-4">
            {KIDS.map((kid) => (
              <img key={kid.name} src={kid.dinoImage} alt={kid.dino} className="w-16 h-16 object-contain opacity-60 drop-shadow-lg" />
            ))}
          </div>

          {/* Story AudioPlayer */}
          <div className="bg-white/5 border border-white/10 rounded-xl">
            <AudioPlayer text={STORY} duration={120} />
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
