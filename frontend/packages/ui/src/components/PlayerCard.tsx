import { Avatar } from "../primitives/Avatar";
import { Icon } from "../primitives/Icon";

interface PlayerCardProps {
  name: string;
  age: number;
  emoji: string;
  state?: "default" | "selected" | "tired";
  onClick?: () => void;
}

export function PlayerCard({ name, age, emoji, state = "default", onClick }: PlayerCardProps) {
  const isTired = state === "tired";
  const isSelected = state === "selected";

  return (
    <button
      onClick={!isTired ? onClick : undefined}
      className={[
        "flex items-center gap-3 p-3 rounded-lg border-[3px] transition-all w-full",
        isTired
          ? "bg-surface-container-high border-outline-variant opacity-50 cursor-not-allowed"
          : isSelected
            ? "bg-primary-fixed border-[#1B5E20] shadow-[3px_3px_0px_0px_#1B5E20]"
            : "bg-surface-container-lowest border-on-surface sticker-shadow active-press",
      ].join(" ")}
    >
      {/* Avatar */}
      <Avatar
        size="lg"
        state={isTired ? "disabled" : isSelected ? "selected" : "default"}
      >
        {emoji}
      </Avatar>

      {/* Info */}
      <div className="flex-1 text-left min-w-0">
        <p className="font-black uppercase tracking-wider text-xs">{name}</p>
        <p className="text-[10px] font-semibold text-on-surface-variant">{age} Jahre</p>
      </div>

      {/* Status */}
      {isTired ? (
        <span className="flex items-center gap-1 bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full text-[10px] font-bold">
          <Icon name="bedtime" size="sm" />
          Müde
        </span>
      ) : isSelected ? (
        <span className="w-7 h-7 bg-[#1B5E20] text-white rounded-full flex items-center justify-center">
          <Icon name="check" size="sm" />
        </span>
      ) : (
        <span className="w-7 h-7 border-2 border-outline-variant rounded-full flex items-center justify-center">
          <Icon name="add" size="sm" className="text-outline-variant" />
        </span>
      )}
    </button>
  );
}
