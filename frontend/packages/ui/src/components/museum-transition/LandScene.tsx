import { motion } from "motion/react";
import type { TransitionPhase } from "./MuseumTransition";

const RUN_DURATION = 2.5;

export function LandScene(phase: TransitionPhase, dinoImage: string) {
  const isRunning = phase === "run";

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a90d9] via-[#7ec8e3] to-[#b5dfef]" />

      {/* Sun */}
      <motion.div
        className="absolute top-[8%] right-[12%] w-16 h-16 rounded-full bg-[#FFD93D]"
        style={{ boxShadow: "0 0 40px 12px rgba(255,217,61,0.35)" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Clouds — simple, parallax slow */}
      {[
        { left: "8%", top: "12%", size: "text-5xl", speed: 20 },
        { left: "45%", top: "8%", size: "text-4xl", speed: 25 },
        { left: "75%", top: "16%", size: "text-5xl", speed: 18 },
      ].map((c, i) => (
        <motion.span
          key={i}
          className={`absolute ${c.size} opacity-50`}
          style={{ left: c.left, top: c.top }}
          animate={isRunning ? { x: [0, -c.speed] } : {}}
          transition={{ duration: RUN_DURATION, ease: "linear" }}
        >☁️</motion.span>
      ))}

      {/* Background hills — parallax slow */}
      <motion.div
        className="absolute bottom-[28%] left-0 right-0 h-[20%]"
        animate={isRunning ? { x: [0, -40] } : {}}
        transition={{ duration: RUN_DURATION, ease: "linear" }}
      >
        <div className="absolute bottom-0 left-0 w-[40%] h-full bg-[#4a8c3f] rounded-t-[50%]" />
        <div className="absolute bottom-0 left-[30%] w-[35%] h-[80%] bg-[#5a9e4b] rounded-t-[50%]" />
        <div className="absolute bottom-0 left-[55%] w-[45%] h-[90%] bg-[#4a8c3f] rounded-t-[50%]" />
        <div className="absolute bottom-0 left-[80%] w-[30%] h-[70%] bg-[#5a9e4b] rounded-t-[50%]" />
      </motion.div>

      {/* Trees — parallax medium */}
      <motion.div
        className="absolute bottom-[26%] left-0 flex gap-10"
        animate={isRunning ? { x: [80, -160] } : {}}
        transition={{ duration: RUN_DURATION, ease: "linear" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="text-3xl">{i % 2 === 0 ? "🌲" : "🌳"}</span>
        ))}
      </motion.div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-gradient-to-t from-[#2d5a1e] via-[#3d7a2e] to-[#5aad3e]" />

      {/* Foreground grass — parallax fast */}
      <motion.div
        className="absolute bottom-[25%] left-0 flex gap-3 z-20"
        animate={isRunning ? { x: [150, -300] } : {}}
        transition={{ duration: RUN_DURATION, ease: "linear" }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="text-2xl" style={{ transform: `rotate(${(i % 3 - 1) * 15}deg)` }}>
            {i % 3 === 0 ? "🌿" : i % 3 === 1 ? "🌱" : "🍃"}
          </span>
        ))}
      </motion.div>

      {/* Museum building — emoji based, cleaner */}
      <motion.div
        className="absolute bottom-[28%] right-6 z-10 flex flex-col items-center"
        initial={{ x: 150 }}
        animate={isRunning ? { x: [150, 0] } : { x: 0 }}
        transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
      >
        <span className="text-6xl drop-shadow-lg">🏛️</span>
        <p className="text-[8px] font-black uppercase text-white bg-on-surface/60 px-1.5 py-0.5 rounded mt-0.5">Museum</p>
      </motion.div>

      {/* Dust behind dino */}
      {isRunning && Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-[#c8a96a]/50 z-10 blur-[1px]"
          style={{ bottom: "27%" }}
          initial={{ opacity: 0 }}
          animate={{ left: ["30%", "20%", "10%"], y: [0, -10, -20], opacity: [0, 0.6, 0], scale: [0.5, 1, 1.5] }}
          transition={{ duration: 0.5, delay: i * 0.3, repeat: 4, ease: "easeOut" }}
        />
      ))}

      {/* Running dino */}
      <motion.div
        className="absolute z-30"
        style={{ bottom: "28%" }}
        initial={{ left: "-12%" }}
        animate={
          isRunning ? { left: "62%" }
          : phase === "enter" ? { left: "72%", scale: 0.3, opacity: 0 }
          : {}
        }
        transition={
          isRunning ? { duration: RUN_DURATION, ease: [0.2, 0.1, 0.25, 1] }
          : { duration: 0.4, ease: "easeIn" }
        }
      >
        <motion.img
          src={dinoImage}
          alt=""
          className="w-20 h-20 object-contain drop-shadow-lg -translate-y-full"
          style={{ scaleX: -1 }}
          animate={isRunning ? { y: [0, -14, 0] } : {}}
          transition={{ duration: 0.35, repeat: 7, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
