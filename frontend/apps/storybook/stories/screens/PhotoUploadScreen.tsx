import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { Button } from "../../../../packages/ui/src/primitives/Button";

/**
 * Foto-Upload
 * - Kind fotografiert sein Kunstwerk
 * - Kamera-Vorschau
 * - KI bewertet positiv: "Wow, riesige Zähne!"
 * - Foto landet in der Museum-Vitrine
 */
export function PhotoUploadScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col px-4 pt-16 pb-8 max-w-sm mx-auto">
      <ForscherSpeech text="Zeig mir was du gemalt hast! Ich bin so gespannt!" />

      {/* Camera placeholder */}
      <div className="mt-4 aspect-square bg-on-surface/10 rounded-xl border-[3px] border-on-surface sticker-shadow flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-on-surface-variant mb-2" style={{ fontSize: "48px" }}>photo_camera</span>
        <p className="text-sm font-bold text-on-surface-variant">Kamera-Vorschau</p>
      </div>

      <div className="mt-4">
        <Button variant="primary" fullWidth icon="photo_camera" size="lg">Foto machen!</Button>
      </div>

      {/* After photo: AI feedback */}
      <div className="mt-4 bg-primary-fixed/30 rounded-xl border-[3px] border-primary/30 p-3">
        <p className="text-xs font-black uppercase tracking-wider text-primary mb-1">Forscher sagt:</p>
        <p className="text-sm font-bold text-on-surface">"Wow, dein Triceratops hat riesige Hörner! Genau wie der echte!" 🤩</p>
      </div>

      <div className="mt-4">
        <Button variant="surface" fullWidth icon="museum">Ab ins Museum!</Button>
      </div>
    </div>
  );
}
