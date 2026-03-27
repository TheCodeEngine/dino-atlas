import { IconButton } from "../primitives/IconButton";
import { Avatar } from "../primitives/Avatar";
import { Icon } from "../primitives/Icon";

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
      {onClose ? (
        <IconButton
          icon="close"
          variant={isDark ? "dark" : "surface"}
          onClick={onClose}
          label="Schließen"
        />
      ) : (
        <div className="w-9" />
      )}

      {title && (
        <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-white/60" : "text-on-surface-variant"}`}>
          {title}
        </p>
      )}

      {playerEmoji ? (
        <Avatar size="sm" className="shadow-md">
          {playerEmoji}
        </Avatar>
      ) : (
        <div className="w-9" />
      )}
    </header>
  );
}
