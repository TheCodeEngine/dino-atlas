import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ForscherSpeech } from "../components/ForscherSpeech";
import { Button } from "../primitives/Button";
import { IconButton } from "../primitives/IconButton";
import { Avatar } from "../primitives/Avatar";
import { Icon } from "../primitives/Icon";
import { useHaptics } from "../hooks/useHaptics";

type Phase = "camera" | "preview" | "analyzing" | "feedback";

const AI_FEEDBACK = [
  "Wow, dein Triceratops hat riesige Hörner! Genau wie der echte!",
  "Die Farben sind toll — ein grüner Triceratops, ganz besonders!",
  "Der Knochenschild sieht mega aus! Du bist ein echter Dino-Künstler!",
];

export function PhotoUploadScreen() {
  const [phase, setPhase] = useState<Phase>("camera");
  const haptics = useHaptics();

  function handleCapture() {
    haptics.tap();
    setPhase("preview");
  }

  function handleConfirm() {
    haptics.tap();
    setPhase("analyzing");
    setTimeout(() => { setPhase("feedback"); haptics.success(); }, 2000);
  }

  function handleRetake() {
    setPhase("camera");
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col" style={{ backgroundImage: "none" }}>
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3">
        <IconButton icon="close" variant="surface" label="Schließen" />
        <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Offline-Auftrag</p>
        <Avatar size="sm">🦖</Avatar>
      </header>

      <main className="flex-1 flex flex-col px-4 pb-6 max-w-sm mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* Phase 1: Camera */}
          {phase === "camera" && (
            <motion.div key="camera" className="flex-1 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-3">
                <ForscherSpeech text="Zeig mir was du gemacht hast! Halt das Handy drüber und mach ein Foto!" />
              </div>

              {/* Camera viewfinder */}
              <div className="flex-1 min-h-[300px] bg-on-surface rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden relative flex items-center justify-center mb-3">
                <div className="absolute inset-4 border-2 border-white/30 rounded-lg" />
                <div className="text-center">
                  <Icon name="photo_camera" size="xl" className="text-white/40" />
                  <p className="text-xs font-bold text-white/30 mt-2">Kamera-Vorschau</p>
                </div>
                {/* Corner guides */}
                {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-6 h-6 border-white/60 ${
                    i < 2 ? "border-t-2" : "border-b-2"
                  } ${i % 2 === 0 ? "border-l-2" : "border-r-2"}`} />
                ))}
              </div>

              <Button variant="primary" fullWidth icon="photo_camera" size="lg" onClick={handleCapture}>
                Foto machen!
              </Button>
            </motion.div>
          )}

          {/* Phase 2: Preview */}
          {phase === "preview" && (
            <motion.div key="preview" className="flex-1 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-3">
                <ForscherSpeech text="Sieht das gut aus? Dann zeig es mir!" />
              </div>

              {/* Photo preview (mock) */}
              <div className="flex-1 min-h-[300px] bg-surface-container-high rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden relative flex items-center justify-center mb-3">
                <div className="text-center">
                  <span className="text-6xl">🎨</span>
                  <p className="text-xs font-bold text-on-surface-variant mt-2">Dein Foto</p>
                </div>
                <div className="absolute top-2 right-2 bg-primary-container text-white px-2 py-0.5 rounded text-[9px] font-black uppercase">Vorschau</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRetake}
                  className="flex-1 py-3 bg-surface-container-high text-on-surface border-[3px] border-on-surface rounded-lg sticker-shadow font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-1.5 active-press"
                >
                  <Icon name="refresh" size="md" />
                  Nochmal
                </button>
                <div className="flex-[2]">
                  <Button variant="primary" fullWidth icon="check" onClick={handleConfirm}>
                    Zeig dem Forscher!
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Analyzing */}
          {phase === "analyzing" && (
            <motion.div key="analyzing" className="flex-1 flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                className="w-20 h-20 bg-primary-fixed border-[3px] border-on-surface rounded-full flex items-center justify-center sticker-shadow mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Icon name="search" size="xl" className="text-primary" />
              </motion.div>
              <p className="text-sm font-black uppercase text-on-surface">Der Forscher schaut sich</p>
              <p className="text-sm font-black uppercase text-on-surface">dein Bild an...</p>
              <motion.div className="flex gap-1 mt-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary-container rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Phase 4: Feedback */}
          {phase === "feedback" && (
            <motion.div key="feedback" className="flex-1 flex flex-col items-center justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              {/* Stars burst */}
              {["⭐", "✨", "🌟", "✨", "⭐"].map((e, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl"
                  style={{ left: `${15 + i * 18}%`, top: `${15 + (i % 3) * 10}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 0] }}
                  transition={{ delay: i * 0.1, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >{e}</motion.span>
              ))}

              <motion.div
                className="w-24 h-24 bg-secondary-container border-[3px] border-on-surface rounded-full flex items-center justify-center sticker-shadow mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 8 }}
              >
                <span className="text-5xl">🤩</span>
              </motion.div>

              <motion.p
                className="text-lg font-black uppercase text-center text-on-surface mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Der Forscher ist begeistert!
              </motion.p>

              <motion.div
                className="w-full mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ForscherSpeech text={AI_FEEDBACK[0]!} />
              </motion.div>

              <motion.div
                className="w-full bg-primary-fixed/30 rounded-xl border-[3px] border-primary/30 p-3 mb-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-[10px] font-black uppercase tracking-wider text-primary mb-1">Dein Foto kommt ins Museum!</p>
                <p className="text-xs font-semibold text-on-surface">Neben deinem echten Triceratops 🏛️</p>
              </motion.div>

              <motion.div
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button variant="primary" fullWidth icon="check">Fertig!</Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
