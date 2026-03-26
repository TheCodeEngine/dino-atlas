import { TopBar } from "../../../../packages/ui/src/components/TopBar";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { Button } from "../../../../packages/ui/src/primitives/Button";

/**
 * Expedition Intro
 * - Forscher erklärt wo heute gegraben wird
 * - Biom-Hintergrund (Wüste/Eis/Dschungel/Unterwasser)
 * - Name des Kindes prominent
 * - Spannung aufbauen: "Ich habe Spuren entdeckt!"
 * - "Graben!" CTA Button
 */
export function ExpeditionIntroScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col" style={{ backgroundImage: "none" }}>
      {/* Biom Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#d4a56a] via-[#c49a5a] to-[#a67c30] opacity-30" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-sm mx-auto">
          {/* Biom Icon */}
          <div className="w-20 h-20 bg-secondary-container border-[3px] border-on-surface rounded-full flex items-center justify-center sticker-shadow mb-4">
            <span className="text-4xl">🏜️</span>
          </div>

          <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-1">Oskar's Expedition</p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-center mb-6">Wüste von Nordamerika</h1>

          <ForscherSpeech
            text="Oskar! Ich habe Spuren in der Wüste gefunden! Da liegt etwas Großes im Sand vergraben!"
            subtext="Hilf mir beim Ausbuddeln!"
          />

          <div className="w-full mt-8">
            <Button variant="primary" fullWidth icon="construction" size="lg">
              Graben!
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
