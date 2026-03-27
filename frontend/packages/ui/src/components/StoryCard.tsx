import { motion } from "motion/react";
import { Icon } from "../primitives/Icon";

export interface StoryCardProps {
  title: string;
  dinoImages: (string | null)[];
  dinoNames: string[];
  date?: string;
  variant?: "default" | "tonight";
  onClick?: () => void;
}

export function StoryCard({ title, dinoImages, dinoNames, date, variant = "default", onClick }: StoryCardProps) {
  const isTonight = variant === "tonight";

  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left rounded-xl border-[3px] p-3 transition-all ${
        isTonight
          ? "border-[#ffc850] bg-[#1a1530] text-white sticker-shadow"
          : "border-on-surface bg-surface-container-lowest text-on-surface sticker-shadow"
      }`}
      whileTap={{ scale: 0.97 }}
    >
      <div className="flex items-center gap-3">
        {/* Dino thumbnails (overlapping) */}
        <div className="flex -space-x-3 flex-shrink-0">
          {dinoImages.slice(0, 3).map((img, i) => (
            <div
              key={i}
              className={`w-11 h-11 rounded-full border-2 flex items-center justify-center overflow-hidden ${
                isTonight ? "bg-white/10 border-white/20" : "bg-surface-container-high border-outline-variant"
              }`}
              style={{ zIndex: 3 - i }}
            >
              {img ? (
                <img src={img} alt={dinoNames[i] ?? ""} className="w-9 h-9 object-contain" />
              ) : (
                <span className="text-lg">🦕</span>
              )}
            </div>
          ))}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-black uppercase truncate ${isTonight ? "text-[#ffc850]" : ""}`}>
            {title}
          </p>
          <p className={`text-[10px] ${isTonight ? "text-white/40" : "text-on-surface-variant"}`}>
            {dinoNames.slice(0, 3).join(", ")}
          </p>
          {date && (
            <p className={`text-[9px] mt-0.5 ${isTonight ? "text-white/30" : "text-on-surface-variant/60"}`}>
              {date}
            </p>
          )}
        </div>

        {/* Play icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isTonight ? "bg-[#ffc850] text-[#1a1530]" : "bg-primary-container text-white"
        }`}>
          <Icon name={isTonight ? "bedtime" : "auto_stories"} size="sm" filled />
        </div>
      </div>
    </motion.button>
  );
}
