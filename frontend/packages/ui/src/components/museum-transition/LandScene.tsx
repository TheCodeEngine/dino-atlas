import { motion } from "motion/react";
import type { CSSProperties } from "react";
import type { TransitionPhase } from "./MuseumTransition";

const RUN_DURATION = 2.8;
const LAND_PATH_CLIP = "polygon(0 100%, 100% 100%, 100% 0, 84% 0, 76% 15%, 62% 34%, 48% 48%, 31% 70%, 12% 88%, 0 100%)";

const CLOUDS = [
  { left: "6%", top: "10%", width: 120, height: 34, opacity: 0.42, drift: 36 },
  { left: "42%", top: "16%", width: 98, height: 30, opacity: 0.28, drift: 30 },
  { left: "74%", top: "12%", width: 132, height: 38, opacity: 0.34, drift: 42 },
];

const FAR_RIDGES = [
  {
    left: "-4%",
    width: "38%",
    height: "72%",
    color: "#244660",
    clipPath: "polygon(0 100%, 16% 74%, 28% 80%, 45% 38%, 64% 70%, 78% 54%, 100% 100%)",
  },
  {
    left: "24%",
    width: "38%",
    height: "88%",
    color: "#2d5674",
    clipPath: "polygon(0 100%, 20% 62%, 39% 76%, 56% 24%, 76% 68%, 100% 100%)",
  },
  {
    left: "54%",
    width: "42%",
    height: "78%",
    color: "#365f7a",
    clipPath: "polygon(0 100%, 18% 66%, 34% 78%, 52% 34%, 72% 70%, 100% 100%)",
  },
];

const MID_HILLS = [
  { left: "-8%", width: "44%", height: "62%", color: "#31582f", radius: "56% 44% 0 0 / 100% 100% 0 0" },
  { left: "18%", width: "36%", height: "48%", color: "#3a6a36", radius: "60% 40% 0 0 / 100% 100% 0 0" },
  { left: "46%", width: "42%", height: "64%", color: "#44773b", radius: "54% 46% 0 0 / 100% 100% 0 0" },
  { left: "72%", width: "32%", height: "54%", color: "#3a6c32", radius: "48% 52% 0 0 / 100% 100% 0 0" },
];

const TREE_GROUPS = [
  { left: "0%", width: "28%", height: "74%" },
  { left: "22%", width: "24%", height: "84%" },
  { left: "44%", width: "26%", height: "78%" },
  { left: "66%", width: "24%", height: "88%" },
  { left: "84%", width: "18%", height: "72%" },
];

const FOREGROUND_BLADES = [
  { left: "0%", width: 42, height: 120, rotate: -8 },
  { left: "9%", width: 54, height: 138, rotate: 8 },
  { left: "18%", width: 40, height: 110, rotate: -12 },
  { left: "30%", width: 56, height: 146, rotate: 10 },
  { left: "42%", width: 46, height: 124, rotate: -6 },
  { left: "56%", width: 60, height: 150, rotate: 11 },
  { left: "68%", width: 44, height: 118, rotate: -10 },
  { left: "78%", width: 58, height: 142, rotate: 9 },
  { left: "90%", width: 48, height: 126, rotate: -7 },
  { left: "100%", width: 40, height: 112, rotate: 12 },
];

const DUST_PUFFS = [
  { delay: 0.04, size: 24, bottom: "29%" },
  { delay: 0.2, size: 20, bottom: "30.5%" },
  { delay: 0.36, size: 16, bottom: "28.5%" },
  { delay: 0.54, size: 22, bottom: "31%" },
  { delay: 0.74, size: 18, bottom: "29.5%" },
  { delay: 0.94, size: 14, bottom: "28.75%" },
];

function layerAnimation(phase: TransitionPhase, xOffset: number) {
  if (phase === "run") return { x: [0, xOffset] };
  if (phase === "enter" || phase === "done") return { x: xOffset };
  return { x: 0 };
}

function layerTransition(phase: TransitionPhase, duration: number, delay = 0) {
  if (phase === "run") return { duration, delay, ease: "linear" as const };
  return { duration: 0.35, ease: "easeOut" as const };
}

function glowStyle(opacity: number): CSSProperties {
  return {
    backgroundImage: `radial-gradient(circle, rgba(255,244,210,${opacity}) 0%, rgba(255,244,210,0) 70%)`,
  };
}

export function LandScene(phase: TransitionPhase, dinoImage: string) {
  const isRunning = phase === "run";
  const isArriving = phase === "enter" || phase === "done";

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #12233d 0%, #254d77 26%, #4b88bf 56%, #f3b86f 88%, #ffd69f 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 22% 16%, rgba(255,255,255,0.16), transparent 26%), radial-gradient(circle at 68% 72%, rgba(255,196,102,0.22), transparent 38%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#08111b]/20 via-transparent to-[#170f07]/40" />

      <motion.div
        className="absolute top-[8%] right-[10%] h-28 w-28 rounded-full bg-[#ffd36a]"
        style={{ boxShadow: "0 0 0 24px rgba(255,214,116,0.16), 0 0 80px 24px rgba(255,174,54,0.34)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.92, 1, 0.92] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[13%] right-[7%] h-44 w-44 rounded-full blur-3xl"
        style={glowStyle(0.32)}
        animate={{ scale: [0.96, 1.06, 0.96], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {CLOUDS.map((cloud, index) => (
        <motion.div
          key={cloud.left}
          className="absolute rounded-full bg-white blur-[1px]"
          style={{
            left: cloud.left,
            top: cloud.top,
            width: cloud.width,
            height: cloud.height,
            opacity: cloud.opacity,
          }}
          animate={isRunning ? { x: [0, -cloud.drift], y: [0, -4, 0] } : isArriving ? { x: -cloud.drift, y: 0 } : { x: 0, y: 0 }}
          transition={isRunning ? { duration: RUN_DURATION + index * 0.18, ease: "linear" } : { duration: 0.35, ease: "easeOut" }}
        />
      ))}

      <div className="absolute inset-x-0 bottom-[45%] h-[18%] bg-gradient-to-b from-white/18 to-transparent opacity-35" />

      <motion.div
        className="absolute inset-x-[-12%] bottom-[36%] h-[24%]"
        animate={layerAnimation(phase, -36)}
        transition={layerTransition(phase, RUN_DURATION)}
      >
        {FAR_RIDGES.map((ridge) => (
          <div
            key={ridge.left}
            className="absolute bottom-0"
            style={{
              left: ridge.left,
              width: ridge.width,
              height: ridge.height,
              background: `linear-gradient(180deg, ${ridge.color} 0%, #162f40 100%)`,
              clipPath: ridge.clipPath,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-x-[-8%] bottom-[28%] h-[28%]"
        animate={layerAnimation(phase, -84)}
        transition={layerTransition(phase, RUN_DURATION - 0.2)}
      >
        {MID_HILLS.map((hill) => (
          <div
            key={hill.left}
            className="absolute bottom-0"
            style={{
              left: hill.left,
              width: hill.width,
              height: hill.height,
              background: `linear-gradient(180deg, ${hill.color} 0%, #1c3e1e 100%)`,
              borderRadius: hill.radius,
              boxShadow: "inset 0 10px 18px rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-x-[-10%] bottom-[27%] z-10 h-[17%]"
        animate={layerAnimation(phase, -118)}
        transition={layerTransition(phase, RUN_DURATION - 0.3)}
      >
        {TREE_GROUPS.map((group, index) => (
          <div key={group.left} className="absolute bottom-0" style={{ left: group.left, width: group.width, height: group.height }}>
            {Array.from({ length: 5 }).map((_, treeIndex) => (
              <div
                key={`${group.left}-${treeIndex}`}
                className="absolute bottom-0"
                style={{
                  left: `${treeIndex * 19 + index * 2}%`,
                  width: `${16 + (treeIndex % 3) * 5}px`,
                  height: `${58 + ((treeIndex + index) % 4) * 9}px`,
                  background: "linear-gradient(180deg, #0f2b11 0%, #102415 100%)",
                  clipPath: "polygon(50% 0, 100% 82%, 0 82%)",
                }}
              />
            ))}
          </div>
        ))}
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 h-[42%] bg-gradient-to-t from-[#163117] via-[#2f632d] to-[#5f9653]" />
      <div
        className="absolute bottom-[22%] right-[-4%] h-[24%] w-[48%]"
        style={{
          background: "linear-gradient(180deg, #4a7e44 0%, #264d24 100%)",
          clipPath: "polygon(14% 100%, 100% 100%, 100% 18%, 84% 0, 56% 26%, 20% 58%, 0 78%)",
        }}
      />
      <div
        className="absolute bottom-0 left-[-8%] h-[39%] w-[116%]"
        style={{
          background: "linear-gradient(180deg, #5a8d4e 0%, #315d2e 36%, #19351b 100%)",
          clipPath: "polygon(0 100%, 100% 100%, 100% 36%, 78% 32%, 62% 38%, 48% 48%, 32% 68%, 14% 88%, 0 93%)",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-[4%] z-20 h-[37%] w-[88%]"
        style={{
          clipPath: LAND_PATH_CLIP,
          background: "linear-gradient(180deg, #c3a376 0%, #b08758 42%, #8f6840 100%)",
          boxShadow: "inset 0 10px 24px rgba(255,255,255,0.16)",
        }}
        animate={isRunning ? { filter: ["brightness(1)", "brightness(1.08)", "brightness(1)"] } : { filter: "brightness(1)" }}
        transition={{ duration: 1.2, repeat: isRunning ? Infinity : 0, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-white/8 to-black/0" />
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute left-[-10%] h-[3px] rounded-full bg-white/50 blur-[0.5px]"
            style={{
              top: `${16 + index * 12}%`,
              width: `${22 + index * 8}%`,
            }}
            animate={isRunning ? { x: ["0%", "125%"], opacity: [0, 0.9, 0] } : { opacity: 0 }}
            transition={isRunning ? { duration: 1.15, delay: index * 0.18, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-x-[-12%] bottom-[-3%] z-30 h-[30%]"
        animate={layerAnimation(phase, -176)}
        transition={layerTransition(phase, RUN_DURATION - 0.45)}
      >
        {FOREGROUND_BLADES.map((blade, index) => (
          <div
            key={`${blade.left}-${blade.rotate}`}
            className="absolute bottom-0 rounded-t-[999px]"
            style={{
              left: blade.left,
              width: blade.width,
              height: blade.height,
              transform: `rotate(${blade.rotate}deg)`,
              transformOrigin: "bottom center",
              background: `linear-gradient(180deg, ${index % 2 === 0 ? "#43703f" : "#254723"} 0%, #102214 100%)`,
              opacity: index % 3 === 0 ? 0.9 : 0.76,
              filter: index % 4 === 0 ? "blur(1px)" : "none",
            }}
          />
        ))}
      </motion.div>

      {DUST_PUFFS.map((puff, index) => (
        <motion.div
          key={puff.delay}
          className="absolute z-20 rounded-full bg-[#f2d4a3]/70 blur-[2px]"
          style={{ width: puff.size, height: puff.size * 0.75, bottom: puff.bottom }}
          animate={
            isRunning
              ? {
                  left: ["8%", "26%", "58%"],
                  y: [0, -14 - index * 2, -20 - index * 3],
                  scale: [0.25, 1, 1.5],
                  opacity: [0, 0.9, 0],
                }
              : { opacity: 0 }
          }
          transition={
            isRunning
              ? { duration: 0.92, delay: puff.delay, repeat: 2, repeatDelay: 0.06, ease: "easeOut" }
              : { duration: 0.2 }
          }
        />
      ))}

      <motion.div
        className="absolute z-40"
        initial={{ left: "-14%", bottom: "29%", scale: 1.14, opacity: 1 }}
        animate={
          isRunning
            ? {
                left: ["-14%", "14%", "46%", "74%"],
                bottom: ["29%", "32%", "35%", "41%"],
                scale: [1.14, 0.96, 0.72, 0.5],
                rotate: [0, -2, 2, 0],
              }
            : phase === "enter"
              ? { left: "81%", bottom: "45%", scale: 0.16, opacity: 0 }
              : phase === "done"
                ? { left: "81%", bottom: "45%", scale: 0.16, opacity: 0 }
                : { left: "-14%", bottom: "29%", scale: 1.14, opacity: 1, rotate: 0 }
        }
        transition={
          isRunning
            ? { duration: RUN_DURATION, times: [0, 0.26, 0.68, 1], ease: [0.2, 0.8, 0.2, 1] }
            : { duration: 0.38, ease: "easeIn" }
        }
      >
        <motion.div
          className="absolute left-1/2 top-[10px] h-4 w-16 -translate-x-1/2 rounded-full bg-[#08120b]/35 blur-[6px]"
          animate={
            isRunning
              ? { width: [72, 60, 44, 30], opacity: [0.28, 0.24, 0.18, 0.12], x: [0, 0, 4, 8] }
              : { width: 18, opacity: 0 }
          }
          transition={isRunning ? { duration: RUN_DURATION, times: [0, 0.26, 0.68, 1], ease: "easeOut" } : { duration: 0.2 }}
        />

        <motion.div
          className="absolute right-[18px] top-[-26px] h-[2px] w-20 bg-gradient-to-r from-transparent via-white/55 to-transparent blur-[1px]"
          animate={isRunning ? { x: [-8, -48], opacity: [0, 0.85, 0] } : { opacity: 0 }}
          transition={isRunning ? { duration: 0.34, repeat: 8, ease: "linear" } : { duration: 0.2 }}
        />

        <motion.img
          src={dinoImage}
          alt=""
          className="relative h-24 w-24 -translate-y-[86%] object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.42)]"
          style={{ scaleX: -1 }}
          animate={
            isRunning
              ? {
                  y: [0, -17, 0, -13, 0],
                  rotate: [0, -5, 0, 4, 0],
                  scaleY: [1, 0.94, 1.04, 0.96, 1],
                }
              : { y: 0, rotate: 0, scaleY: 1 }
          }
          transition={isRunning ? { duration: 0.42, repeat: 6, ease: "easeInOut" } : { duration: 0.2 }}
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at center, transparent 48%, rgba(5,10,16,0.3) 100%)" }}
      />
    </div>
  );
}
