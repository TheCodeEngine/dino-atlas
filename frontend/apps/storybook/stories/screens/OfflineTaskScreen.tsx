import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { useHaptics } from "../../../../packages/ui/src/hooks/useHaptics";

const TASK_TYPES = [
  {
    id: "draw",
    emoji: "🎨",
    title: "Male deinen Triceratops!",
    subtitle: "Nimm Stifte und Papier und mal ihn so bunt wie du willst!",
    forscher: "Jetzt bist du dran! Male mir deinen Triceratops! Ich bin so gespannt wie er aussieht!",
    tools: ["🖍️", "✏️", "🎨", "📄"],
  },
  {
    id: "build",
    emoji: "🧱",
    title: "Baue einen Triceratops!",
    subtitle: "Aus Knete, Lego oder was du findest — sei kreativ!",
    forscher: "Kannst du einen Triceratops bauen? Aus Knete, Lego, oder sogar aus Kissen! Zeig mir was du kannst!",
    tools: ["🧱", "🪨", "🎪", "✂️"],
  },
  {
    id: "measure",
    emoji: "📏",
    title: "Wie groß war er wirklich?",
    subtitle: "Der Triceratops war 9 Meter lang. Miss das mal draußen ab!",
    forscher: "Weißt du wie lang 9 Meter sind? Geh raus und miss es ab! Vom Hauseingang bis... ja wohin wohl?",
    tools: ["📏", "👣", "🏃", "🌳"],
  },
  {
    id: "find",
    emoji: "🔍",
    title: "Finde ein Dino-Ei!",
    subtitle: "Such draußen einen Stein der aussieht wie ein Dino-Ei!",
    forscher: "Ich brauche deine Hilfe! Such draußen einen Stein der wie ein Dino-Ei aussieht. Rund und glatt!",
    tools: ["🪨", "🥚", "🔍", "🌿"],
  },
];

// Pick a random task for the demo
const TASK = TASK_TYPES[0]!;

export function OfflineTaskScreen() {
  const [accepted, setAccepted] = useState(false);
  const haptics = useHaptics();

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundImage: "none" }}>
      {/* Playful background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fef0c7] via-[#fcf9f0] to-[#f5e6c8]" />
      {/* Floating creative tools */}
      {TASK.tools.map((tool, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl opacity-20"
          style={{ left: `${10 + i * 22}%`, top: `${5 + (i % 3) * 10}%` }}
          animate={{ y: [0, -10, 0], rotate: [0, (i % 2 ? 10 : -10), 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        >
          {tool}
        </motion.span>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center px-4 py-3">
          <button className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm border-[3px] border-on-surface rounded-lg sticker-shadow active-press">
            <span className="material-symbols-outlined text-on-surface text-lg">close</span>
          </button>
          <div className="w-9 h-9 rounded-full border-[3px] border-[#1B5E20] bg-primary-fixed flex items-center justify-center text-base shadow-md">
            🦖
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-sm mx-auto">
          <AnimatePresence mode="wait">
            {!accepted ? (
              <motion.div
                key="task"
                className="w-full flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Dino + Task emoji */}
                <div className="relative mb-4">
                  <img src="/dinos/triceratops/comic.png" alt="Triceratops" className="w-32 h-32 object-contain drop-shadow-lg" />
                  <motion.div
                    className="absolute -top-2 -right-4 w-14 h-14 bg-secondary-container border-[3px] border-on-surface rounded-full flex items-center justify-center sticker-shadow"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", damping: 10 }}
                  >
                    <span className="text-2xl">{TASK.emoji}</span>
                  </motion.div>
                </div>

                {/* Forscher */}
                <div className="w-full mb-4">
                  <ForscherSpeech text={TASK.forscher} />
                </div>

                {/* Task card */}
                <motion.div
                  className="w-full bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow p-4 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{TASK.emoji}</span>
                    <div>
                      <p className="text-sm font-black text-on-surface">{TASK.title}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{TASK.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {TASK.tools.map((tool, i) => (
                      <span key={i} className="text-xl bg-surface-container-high w-9 h-9 rounded-lg flex items-center justify-center">{tool}</span>
                    ))}
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    variant="primary"
                    fullWidth
                    icon="check"
                    size="lg"
                    onClick={() => { setAccepted(true); haptics.success(); }}
                  >
                    Alles klar, ich male los!
                  </Button>
                </motion.div>

                <p className="text-[10px] text-on-surface-variant mt-3 text-center">
                  Wenn du fertig bist, mach ein Foto und zeig es mir! 📸
                </p>
              </motion.div>
            ) : (
              /* Accepted state — goodbye animation */
              <motion.div
                key="bye"
                className="w-full flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-7xl">🎨</span>
                </motion.div>
                <h2 className="text-2xl font-black uppercase tracking-tight mt-4 mb-2">Viel Spaß!</h2>
                <p className="text-sm text-on-surface-variant font-semibold mb-6">
                  Bildschirm aus, Malstifte raus! Wenn du fertig bist, zeig mir dein Kunstwerk!
                </p>
                <div className="flex gap-2">
                  {["🖍️", "✏️", "🎨", "📄", "✂️"].map((e, i) => (
                    <motion.span
                      key={i}
                      className="text-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      {e}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
