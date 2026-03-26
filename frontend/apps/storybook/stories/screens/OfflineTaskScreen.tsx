import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { Button } from "../../../../packages/ui/src/primitives/Button";

/**
 * Offline-Auftrag
 * - Forscher gibt kreative Aufgabe ohne Bildschirm
 * - "Male deinen Triceratops!"
 * - Kleines Referenz-Bild des Dinos
 * - "Alles klar!" Button → App ist fertig für den Nachmittag
 * - Hinweis: "Wenn du fertig bist, mach ein Foto!"
 */
export function OfflineTaskScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <img src="/dinos/triceratops/comic.png" alt="Triceratops" className="w-28 h-28 object-contain mx-auto mb-4 drop-shadow-lg" />

        <ForscherSpeech
          text="Jetzt bist du dran! Male mir deinen Triceratops! Ich bin so gespannt wie er aussieht!"
          subtext="Nimm Stifte, Knete oder Lego — sei kreativ!"
        />

        <div className="mt-6 bg-secondary-fixed/30 rounded-xl border-[3px] border-secondary/30 p-4 text-left">
          <p className="text-xs font-black uppercase tracking-wider text-secondary mb-1">Dein Auftrag</p>
          <p className="text-sm font-bold text-on-surface">🎨 Male deinen Triceratops!</p>
          <p className="text-[11px] text-on-surface-variant mt-1">Wenn du fertig bist, mach ein Foto und zeig es mir!</p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Button variant="primary" fullWidth icon="check">Alles klar!</Button>
          <p className="text-[10px] text-on-surface-variant">Bildschirm aus, Malstifte raus! 🖍️</p>
        </div>
      </div>
    </div>
  );
}
