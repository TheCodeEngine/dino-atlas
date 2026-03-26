import { type ReactNode } from "react";
import { motion } from "motion/react";
import { TopBar } from "./TopBar";
import { ForscherSpeech } from "./ForscherSpeech";
import { StatusBadge } from "./StatusBadge";
import { Button } from "../primitives/Button";
import type { BiomConfig } from "./biom-scene/types";

interface ExpeditionIntroProps {
  playerName: string;
  biom: BiomConfig;
  /** The biom background scene component */
  scene: ReactNode;
  onStart?: () => void;
}

export function ExpeditionIntro({ playerName, biom, scene, onStart }: ExpeditionIntroProps) {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col relative overflow-hidden">
      {/* Biom background */}
      <div className="absolute inset-0">{scene}</div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopBar
          right={<StatusBadge label={playerName} variant="primary" icon="person" />}
        />

        <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-sm mx-auto pt-14">
          <motion.div
            className={`w-20 h-20 ${biom.color} border-[3px] border-on-surface rounded-full flex items-center justify-center sticker-shadow mb-2`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, delay: 0.2 }}
          >
            <span className="text-4xl">{biom.emoji}</span>
          </motion.div>

          <motion.p
            className="text-[10px] font-black uppercase tracking-wider text-on-surface/60 mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {playerName}'s Expedition
          </motion.p>

          <motion.h1
            className="text-2xl font-black uppercase tracking-tight text-center text-on-surface mb-5"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {biom.name}
          </motion.h1>

          <motion.div
            className="w-full bg-white/20 rounded-xl border-2 border-white/10 p-3 mb-5 flex items-center gap-3 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <span className="text-3xl">{biom.hintEmoji}</span>
            <div>
              <p className="text-xs font-black text-on-surface">{biom.hint}</p>
              <p className="text-[10px] text-on-surface-variant">{biom.hintSub}</p>
            </div>
          </motion.div>

          <motion.div
            className="w-full mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <ForscherSpeech
              text={`${playerName}! ${biom.forscher}`}
              subtext={biom.forscherSub}
            />
          </motion.div>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Button variant="primary" fullWidth icon="construction" size="lg" onClick={onStart}>
              Graben!
            </Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
