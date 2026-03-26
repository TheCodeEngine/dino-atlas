import { motion } from "motion/react";

/** Eis-Biom: Gletscher, Schnee, kaltes Licht */
export function IceScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#a8d4e6] via-[#c8e6f0] to-[#e0f0f8]" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
        backgroundSize: "15px 15px",
      }} />
      {/* Ice shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      {/* Snowflakes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-sm opacity-50"
          style={{ left: `${i * 10}%`, top: "-5%" }}
          animate={{ y: [0, 800], x: [0, (i % 2 ? 20 : -20)], rotate: [0, 360] }}
          transition={{ duration: 6 + i * 0.5, repeat: Infinity, delay: i * 0.6, ease: "linear" }}
        >❄️</motion.span>
      ))}
    </>
  );
}

export const ICE_CONFIG = {
  id: "ice",
  name: "Gletscher der Arktis",
  emoji: "🧊",
  hint: "Im Eis schimmert etwas Dunkles!",
  hintSub: "Ein eingefrorener Knochen?",
  hintEmoji: "🦴",
  forscher: "Schau mal! Im Eis ist etwas eingefroren! Das könnte Millionen Jahre alt sein!",
  forscherSub: "Hilf mir das Eis wegzukratzen!",
};
