import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useHaptics } from "../hooks/useHaptics";
import { Avatar } from "../primitives/Avatar";
import { Icon } from "../primitives/Icon";

export interface Player {
  id: string;
  name: string;
  emoji: string;
}

interface PlayerSwitcherProps {
  players: Player[];
  active: string;
  onChange: (id: string) => void;
}

export function PlayerSwitcher({ players, active, onChange }: PlayerSwitcherProps) {
  const [open, setOpen] = useState(false);
  const current = players.find((p) => p.id === active);
  const haptics = useHaptics();

  function handleSelect(id: string) {
    if (id !== active) haptics.success();
    onChange(id);
    setOpen(false);
  }

  return (
    <>
      {/* Avatar button */}
      <motion.button
        onClick={() => { setOpen(true); haptics.tap(); }}
        className="flex"
        whileTap={{ scale: 0.85 }}
      >
        <Avatar size="md">
          {current?.emoji ?? "?"}
        </Avatar>
      </motion.button>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Scrim */}
            <motion.div
              className="absolute inset-0 bg-on-surface/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              className="relative w-full max-w-lg bg-surface-container-lowest border-t-[3px] border-x-[3px] border-on-surface rounded-t-2xl px-4 pt-3 pb-8"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-4" />

              <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant mb-3 px-1">
                Forscher wechseln
              </p>

              <div className="flex flex-col gap-2">
                {players.map((player, i) => (
                  <motion.button
                    key={player.id}
                    onClick={() => handleSelect(player.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, type: "spring", damping: 20, stiffness: 300 }}
                    whileTap={{ scale: 0.97 }}
                    className={[
                      "flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors",
                      player.id === active
                        ? "bg-primary-fixed border-[3px] border-[#1B5E20] shadow-[3px_3px_0px_0px_#1B5E20]"
                        : "bg-surface-container-low border-[3px] border-on-surface sticker-shadow",
                    ].join(" ")}
                  >
                    <Avatar
                      size="lg"
                      state={player.id === active ? "selected" : "default"}
                    >
                      {player.emoji}
                    </Avatar>
                    <p className="text-sm font-black uppercase tracking-wider flex-1">{player.name}</p>
                    {player.id === active && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 400 }}
                        className="w-7 h-7 bg-[#1B5E20] text-white rounded-full flex items-center justify-center"
                      >
                        <Icon name="check" size="sm" />
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
