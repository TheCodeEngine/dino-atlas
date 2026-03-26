interface ForscherSpeechProps {
  text: string;
  subtext?: string;
  icon?: string;
}

export function ForscherSpeech({ text, subtext, icon = "face" }: ForscherSpeechProps) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex-shrink-0 w-10 h-10 bg-primary-fixed border-[3px] border-on-surface rounded-lg sticker-shadow flex items-center justify-center">
        <span
          className="material-symbols-outlined text-lg text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div className="bg-surface-container-lowest border-[3px] border-on-surface rounded-lg rounded-tl-none p-3 sticker-shadow flex-1">
        <p className="text-sm font-black text-on-surface">{text}</p>
        {subtext && <p className="text-[11px] text-on-surface-variant mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}
