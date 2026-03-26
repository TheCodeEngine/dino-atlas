import { type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FullscreenHeader } from "./FullscreenHeader";
import { ForscherSpeech } from "./ForscherSpeech";
import { Button } from "../primitives/Button";

interface MinigameShellProps {
  title: string;
  playerEmoji?: string;
  instruction: string;
  done: boolean;
  doneEmoji?: string;
  doneTitle?: string;
  donePraise?: string;
  onClose?: () => void;
  onFinish?: () => void;
  children: ReactNode;
}

export function MinigameShell({
  title,
  playerEmoji = "🦖",
  instruction,
  done,
  doneEmoji = "🎉",
  doneTitle = "Geschafft!",
  donePraise = "Super gemacht!",
  onClose,
  onFinish,
  children,
}: MinigameShellProps) {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <FullscreenHeader title={title} playerEmoji={playerEmoji} onClose={onClose} />

      <main className="flex-1 flex flex-col px-4 pb-6 max-w-sm mx-auto w-full">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key="game"
              className="flex-1 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Instruction: top */}
              <div className="mb-3">
                <ForscherSpeech text={instruction} />
              </div>
              {/* Game content: centered in remaining space */}
              <div className="flex-1 flex flex-col justify-center">
                {children}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              className="flex-1 flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.span
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                {doneEmoji}
              </motion.span>
              <h2 className="text-2xl font-black uppercase mb-3">{doneTitle}</h2>
              <ForscherSpeech text={donePraise} />
              <div className="w-full mt-4">
                <Button variant="primary" fullWidth icon="check" onClick={onFinish}>
                  Fertig!
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
