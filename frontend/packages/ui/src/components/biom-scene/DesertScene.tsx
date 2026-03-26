import { motion } from "motion/react";

/** Wüsten-Biom: Sand, Sonne, Staubpartikel */
export function DesertScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#e8c170] via-[#d4a050] to-[#a67830]" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(#c49040 1px, transparent 1px), radial-gradient(#b88030 1.5px, transparent 1.5px)",
        backgroundSize: "20px 20px, 30px 30px",
        backgroundPosition: "0 0, 15px 15px",
      }} />
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#87CEEB]/40 to-transparent" />
      <motion.div
        className="absolute top-12 right-8 w-14 h-14 rounded-full bg-[#FFD93D]"
        style={{ boxShadow: "0 0 50px 20px rgba(255,217,61,0.3)" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#d4a050]/40"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 15}%` }}
          animate={{ y: [0, -15, 0], x: [0, 5, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </>
  );
}

export const DESERT_CONFIG = {
  id: "desert",
  name: "Wüste von Nordamerika",
  emoji: "🏜️",
  hint: "Etwas ragt aus dem Sand!",
  hintSub: "Ob das ein Dino-Knochen ist?",
  hintEmoji: "🦴",
  forscher: "Ich habe Spuren in der Wüste gefunden! Da liegt etwas Großes im Sand!",
  forscherSub: "Hilf mir beim Ausbuddeln!",
};
