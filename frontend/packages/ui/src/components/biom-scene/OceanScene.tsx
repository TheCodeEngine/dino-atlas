import { motion } from "motion/react";

/** Ozean-Biom: Unterwasser, Blasen, Welleneffekt */
export function OceanScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a6b8a] via-[#0d4a6b] to-[#082a40]" />
      {/* Light rays from surface */}
      {[20, 40, 65].map((left, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-8 bg-gradient-to-b from-white/15 to-transparent"
          style={{ left: `${left}%`, height: "60%", transform: `rotate(${(i - 1) * 5}deg)` }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4 + i, repeat: Infinity }}
        />
      ))}
      {/* Bubbles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/30"
          style={{ width: `${6 + i * 2}px`, height: `${6 + i * 2}px`, left: `${10 + i * 11}%`, bottom: "10%" }}
          animate={{ y: [-0, -500], opacity: [0.5, 0] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
        />
      ))}
      {/* Seaweed */}
      {[10, 30, 70, 85].map((left, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 text-2xl"
          style={{ left: `${left}%` }}
          animate={{ rotate: [-5, 5, -5], y: [0, -3, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity }}
        >🌿</motion.span>
      ))}
    </>
  );
}

export const OCEAN_CONFIG = {
  id: "ocean",
  name: "Tiefsee des Pazifik",
  emoji: "🌊",
  hint: "Am Meeresboden liegt etwas Großes!",
  hintSub: "Ein Skelett aus der Urzeit?",
  hintEmoji: "🦴",
  forscher: "Unter Wasser habe ich etwas entdeckt! Am Meeresboden liegt ein riesiges Skelett!",
  forscherSub: "Lass uns tauchen und nachsehen!",
};
