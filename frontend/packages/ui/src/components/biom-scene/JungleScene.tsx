import { motion } from "motion/react";

/** Regenwald-Biom: Grün, feucht, Blätter, Nebel */
export function JungleScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#2d5a1e] via-[#3d7a2e] to-[#1a3a10]" />
      <div className="absolute inset-0 opacity-15" style={{
        backgroundImage: "radial-gradient(#4a8c3f 2px, transparent 2px)",
        backgroundSize: "25px 25px",
      }} />
      {/* Fog */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent" />
      {/* Hanging vines */}
      {[15, 35, 60, 82].map((left, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-1 bg-[#2d5a1e]/60 rounded-b-full"
          style={{ left: `${left}%`, height: `${15 + i * 5}%` }}
          animate={{ scaleY: [1, 1.05, 1], x: [0, 2, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity }}
        />
      ))}
      {/* Floating leaves */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-xl opacity-40"
          style={{ left: `${5 + i * 16}%`, top: `${10 + (i % 3) * 20}%` }}
          animate={{ y: [0, 20, 0], x: [0, 10, 0], rotate: [0, 30, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.8 }}
        >🍃</motion.span>
      ))}
    </>
  );
}

export const JUNGLE_CONFIG = {
  id: "jungle",
  name: "Regenwald von Südamerika",
  emoji: "🌴",
  hint: "Zwischen den Wurzeln schimmert etwas!",
  hintSub: "Ein uralter Knochen im Dschungelboden?",
  hintEmoji: "🦴",
  forscher: "Tief im Regenwald habe ich eine Spur entdeckt! Zwischen den Farnen liegt etwas Uraltes!",
  forscherSub: "Lass uns vorsichtig graben!",
};
