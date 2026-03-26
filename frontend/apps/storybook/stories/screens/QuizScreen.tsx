import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";

/**
 * Dino-Quiz
 * - Forscher stellt Fragen zum Dino des Tages
 * - Bild-Antworten (2-4 Optionen)
 * - TTS-Button pro Antwort zum Vorlesen
 * - Richtig: Stern fliegt in Sammlung
 * - Falsch: Forscher erklärt die richtige Antwort
 */
export function QuizScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col px-4 pt-16 pb-8 max-w-sm mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-black text-on-surface-variant">Frage 2 von 5</span>
        <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div className="h-full w-2/5 bg-primary-container rounded-full" />
        </div>
        <div className="flex gap-0.5">
          {[1, 0, 0].map((star, i) => (
            <span key={i} className={`material-symbols-outlined text-sm ${star ? "text-secondary-container" : "text-outline-variant"}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          ))}
        </div>
      </div>

      <ForscherSpeech text="Was hat der Triceratops gefressen?" />

      {/* Answer options */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {[
          { label: "Pflanzen", emoji: "🌿", correct: true },
          { label: "Fleisch", emoji: "🥩", correct: false },
          { label: "Fisch", emoji: "🐟", correct: false },
          { label: "Insekten", emoji: "🐛", correct: false },
        ].map((opt) => (
          <button
            key={opt.label}
            className="bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow active-press p-4 flex flex-col items-center gap-2"
          >
            <span className="text-4xl">{opt.emoji}</span>
            <span className="text-xs font-black uppercase">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
