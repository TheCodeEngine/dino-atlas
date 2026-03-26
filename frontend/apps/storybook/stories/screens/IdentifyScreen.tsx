import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";

/**
 * Dino Erkennen
 * - Skelett wird oben angezeigt
 * - 2-4 Comic-Dino-Bilder zur Auswahl
 * - Kind tippt auf den richtigen Dino
 * - Falsch: Hinweis ("Schau mal, langer Hals..."), kein Fehler-Sound
 * - Richtig: Konfetti + Dino-Ruf → weiter zu Entdeckung
 */
export function IdentifyScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col px-4 pt-16 pb-8 max-w-sm mx-auto">
      {/* Skeleton image */}
      <div className="rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden bg-[#2C1A0E] mb-4">
        <img src="/dinos/triceratops/skeleton.png" alt="Skelett" className="w-full h-40 object-cover" />
      </div>

      <ForscherSpeech text="Welcher Dino ist das? Was meinst du?" />

      {/* Dino options */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {[
          { name: "T-Rex", emoji: "🦖", correct: false },
          { name: "Triceratops", emoji: "🦕", correct: true },
          { name: "Stegosaurus", emoji: "🦕", correct: false },
          { name: "Brachiosaurus", emoji: "🦕", correct: false },
        ].map((dino) => (
          <button
            key={dino.name}
            className="bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow active-press p-3 flex flex-col items-center gap-1"
          >
            <span className="text-4xl">{dino.emoji}</span>
            <span className="text-xs font-black uppercase">{dino.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
