import { motion } from "motion/react";
import type { TransitionPhase } from "./MuseumTransition";

export function LandScene(phase: TransitionPhase, dinoImage: string) {
  return (
    <>
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3d7cc9] via-[#7ec8e3] to-[#b5dfef]" />

      {/* Sun */}
      <motion.div
        className="absolute top-[8%] right-[15%] w-16 h-16 rounded-full bg-[#FFD93D]"
        style={{ boxShadow: "0 0 40px 15px rgba(255,217,61,0.4)" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Background mountains (parallax slow) */}
      <motion.div
        className="absolute bottom-[30%] left-0 right-0 h-[20%]"
        animate={phase === "run" ? { x: [0, -60] } : {}}
        transition={{ duration: 2.5, ease: "linear" }}
      >
        {[0, 80, 170, 260, 350, 440].map((x, i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{ left: `${x}px`, width: 0, height: 0, borderLeft: `${40 + i * 5}px solid transparent`, borderRight: `${40 + i * 5}px solid transparent`, borderBottom: `${50 + i * 8}px solid ${i % 2 === 0 ? "#5a9e4b" : "#4a8c3f"}` }}
          />
        ))}
      </motion.div>

      {/* Mid-ground trees (parallax medium) */}
      <motion.div
        className="absolute bottom-[28%] left-0 flex gap-12"
        animate={phase === "run" ? { x: [100, -200] } : {}}
        transition={{ duration: 2.5, ease: "linear" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="text-3xl">{i % 2 === 0 ? "🌲" : "🌳"}</span>
        ))}
      </motion.div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[#2d5a1e] via-[#3d7a2e] to-[#5aad3e]" />

      {/* Foreground grass (parallax fast — 3D depth) */}
      <motion.div
        className="absolute bottom-[27%] left-0 flex gap-4 z-20"
        animate={phase === "run" ? { x: [200, -400] } : {}}
        transition={{ duration: 2.5, ease: "linear" }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="text-2xl" style={{ transform: `rotate(${(i % 3 - 1) * 20}deg)` }}>
            {i % 4 === 0 ? "🌿" : i % 4 === 1 ? "🌾" : i % 4 === 2 ? "🍃" : "🌱"}
          </span>
        ))}
      </motion.div>

      {/* Dust particles */}
      {phase === "run" && Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#c8a96a]/60 z-10"
          style={{ bottom: `${28 + Math.random() * 4}%`, left: "35%" }}
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: [0, 0.8, 0], x: -(30 + Math.random() * 40), y: -(10 + Math.random() * 20) }}
          transition={{ duration: 0.6, delay: i * 0.3, repeat: 4, ease: "easeOut" }}
        />
      ))}

      {/* Running dino on ground */}
      <motion.div
        className="absolute bottom-[30%] z-10"
        style={{ marginBottom: "-4px" }}
        initial={{ left: "-15%" }}
        animate={
          phase === "run" ? { left: "60%" }
          : phase === "enter" ? { left: "72%", scale: 0.3, opacity: 0 }
          : {}
        }
        transition={
          phase === "run" ? { duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }
          : { duration: 0.4, ease: "easeIn" }
        }
      >
        <motion.img
          src={dinoImage}
          alt=""
          className="w-16 h-16 object-contain drop-shadow-lg -translate-y-full"
          style={{ scaleX: -1 }}
          animate={phase === "run" ? { y: [0, -12, 0] } : {}}
          transition={{ duration: 0.35, repeat: 7, ease: "easeInOut" }}
        />
      </motion.div>
    </>
  );
}
