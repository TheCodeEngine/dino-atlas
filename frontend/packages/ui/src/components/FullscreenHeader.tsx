interface FullscreenHeaderProps {
  title?: string;
  playerEmoji?: string;
  onClose?: () => void;
  /** Light theme (dark icons on light bg) or dark theme (light icons on dark bg) */
  variant?: "light" | "dark";
}

export function FullscreenHeader({ title, playerEmoji, onClose, variant = "light" }: FullscreenHeaderProps) {
  const isDark = variant === "dark";

  return (
    <header className="flex justify-between items-center px-4 py-3">
      <button
        onClick={onClose}
        className={`w-9 h-9 flex items-center justify-center rounded-lg active-press ${
          isDark
            ? "bg-white/10 text-white"
            : "bg-surface-container-lowest border-[3px] border-on-surface sticker-shadow text-on-surface"
        }`}
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>

      {title && (
        <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-white/60" : "text-on-surface-variant"}`}>
          {title}
        </p>
      )}

      {playerEmoji ? (
        <div className="w-9 h-9 rounded-full border-[3px] border-[#1B5E20] bg-primary-fixed flex items-center justify-center text-base shadow-md">
          {playerEmoji}
        </div>
      ) : (
        <div className="w-9" />
      )}
    </header>
  );
}
