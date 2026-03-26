import { motion } from "motion/react";
import { TopBar } from "../../../../packages/ui/src/components/TopBar";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { StatusBadge } from "../../../../packages/ui/src/components/StatusBadge";

/**
 * Expedition Intro
 * - Biom-Hintergrund mit Atmosphaere
 * - Forscher erklaert aufgeregt wo gegraben wird
 * - Spannung: angedeuteter Dino-Schatten im Boden
 * - "Graben!" CTA
 */
export function ExpeditionIntroScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col relative overflow-hidden">
      {/* Biom background — Desert */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8c170] via-[#d4a050] to-[#a67830]" />
        {/* Sand texture */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(#c49040 1px, transparent 1px), radial-gradient(#b88030 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px, 30px 30px",
          backgroundPosition: "0 0, 15px 15px",
        }} />
        {/* Heat shimmer gradient */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#87CEEB]/40 to-transparent" />
      </div>

      {/* Sun */}
      <motion.div
        className="absolute top-12 right-8 w-14 h-14 rounded-full bg-[#FFD93D]"
        style={{ boxShadow: "0 0 50px 20px rgba(255,217,61,0.3)" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Floating dust particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#d4a050]/40"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 15}%` }}
          animate={{ y: [0, -15, 0], x: [0, 5, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopBar
          right={<StatusBadge label="Oskar" variant="primary" icon="person" />}
        />

        <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-sm mx-auto pt-14">
          {/* Biom icon with glow */}
          <motion.div
            className="w-20 h-20 bg-secondary-container border-[3px] border-on-surface rounded-full flex items-center justify-center sticker-shadow mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, delay: 0.2 }}
          >
            <span className="text-4xl">🏜️</span>
          </motion.div>

          <motion.p
            className="text-[10px] font-black uppercase tracking-wider text-on-surface/60 mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Oskar's Expedition
          </motion.p>

          <motion.h1
            className="text-2xl font-black uppercase tracking-tight text-center text-on-surface mb-5"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Wüste von Nordamerika
          </motion.h1>

          {/* Mystery hint — bone sticking out of sand */}
          <motion.div
            className="w-full bg-[#c49040]/30 rounded-xl border-2 border-[#a67830]/30 p-3 mb-5 flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <span className="text-3xl">🦴</span>
            <div>
              <p className="text-xs font-black text-on-surface">Etwas ragt aus dem Sand!</p>
              <p className="text-[10px] text-on-surface-variant">Ob das ein Dino-Knochen ist?</p>
            </div>
          </motion.div>

          {/* Forscher Speech with play button */}
          <motion.div
            className="w-full mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <ForscherSpeech
              text="Oskar! Ich habe Spuren in der Wüste gefunden! Da liegt etwas Großes im Sand!"
              subtext="Hilf mir beim Ausbuddeln!"
            />
          </motion.div>

          {/* CTA */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Button variant="primary" fullWidth icon="construction" size="lg">
              Graben!
            </Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
