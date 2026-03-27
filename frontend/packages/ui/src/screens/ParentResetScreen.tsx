import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../primitives/Button";
import { Icon } from "../primitives/Icon";

export interface ParentResetScreenProps {
  onReset?: (mathAnswer: number, mathExpected: number) => Promise<boolean>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
}

function generateQuestion(): { a: number; b: number; result: number } {
  const a = 3 + Math.floor(Math.random() * 7); // 3-9
  const b = 3 + Math.floor(Math.random() * 7); // 3-9
  return { a, b, result: a * b };
}

export function ParentResetScreen({ onReset, onCancel, loading = false, error }: ParentResetScreenProps = {}) {
  const [question] = useState(generateQuestion);
  const [answer, setAnswer] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const displayError = error || localError;

  async function handleSubmit() {
    setLocalError("");
    const num = parseInt(answer, 10);
    if (isNaN(num)) {
      setLocalError("Bitte eine Zahl eingeben");
      return;
    }
    if (num !== question.result) {
      setLocalError("Falsche Antwort! Versuch es nochmal.");
      setAnswer("");
      return;
    }
    if (onReset) {
      const ok = await onReset(num, question.result);
      if (ok) setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-sm text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.span
            className="text-6xl block mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
          >
            ☀️
          </motion.span>
          <h1 className="text-xl font-black uppercase mb-2">Dinos sind wach!</h1>
          <p className="text-sm text-on-surface-variant mb-6">Das Budget wurde zurückgesetzt. Viel Spaß beim Weiterspielen!</p>
          <Button variant="primary" fullWidth icon="play_arrow" onClick={onCancel}>Weiterspielen</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <Icon name="lock_open" size="xl" className="text-on-surface-variant mb-4" />
        <h1 className="text-xl font-black uppercase tracking-tight mb-1">Erwachsenen-Bereich</h1>
        <p className="text-xs text-on-surface-variant mb-6">Löse die Aufgabe um die Dinos aufzuwecken</p>

        <div className="bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow p-6 mb-4">
          <p className="text-3xl font-black text-on-surface mb-4">
            {question.a} × {question.b} = ?
          </p>
          <input
            type="number"
            inputMode="numeric"
            value={answer}
            onChange={(e) => { setAnswer(e.target.value); setLocalError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Antwort"
            className="w-full py-3 px-4 bg-surface-container-low border-[3px] border-on-surface rounded-lg text-center text-2xl font-black focus:ring-0 focus:border-primary"
            autoFocus
          />
        </div>

        <AnimatePresence>
          {displayError && (
            <motion.p
              className="text-sm font-bold text-error mb-3"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {displayError}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          variant="primary"
          fullWidth
          icon="lock_open"
          onClick={handleSubmit}
          disabled={loading || !answer}
        >
          {loading ? "Wird zurückgesetzt..." : "Aufwecken!"}
        </Button>

        <p className="text-[9px] text-on-surface-variant mt-4">1x pro Tag möglich. Wird protokolliert.</p>
        <button
          onClick={onCancel}
          className="mt-2 text-[11px] font-semibold text-on-surface-variant hover:text-on-surface"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}
