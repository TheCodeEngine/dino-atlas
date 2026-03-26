import { useState } from "react";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { Icon } from "../../../../packages/ui/src/primitives/Icon";

/**
 * Eltern-Reset
 * - Rechenaufgabe als Kindersicherung
 * - Wechselnde Aufgaben (kleines 1x1)
 * - 1x pro Tag möglich
 * - Wird protokolliert
 */
export function ParentResetScreen() {
  const [answer, setAnswer] = useState("");
  const question = { a: 7, b: 8, result: 56 };

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
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Antwort"
            className="w-full py-3 px-4 bg-surface-container-low border-[3px] border-on-surface rounded-lg text-center text-2xl font-black focus:ring-0 focus:border-primary"
          />
        </div>

        <Button variant="primary" fullWidth icon="lock_open">Aufwecken!</Button>

        <p className="text-[9px] text-on-surface-variant mt-4">1x pro Tag möglich. Wird protokolliert.</p>
        <button className="mt-2 text-[11px] font-semibold text-on-surface-variant hover:text-on-surface">Abbrechen</button>
      </div>
    </div>
  );
}
