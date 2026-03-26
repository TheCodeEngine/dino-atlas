import { useState } from "react";

export function ExcavationScreen() {
  const [progress, setProgress] = useState(42);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col" style={{ backgroundImage: "none" }}>
      {/* Minimal TopBar */}
      <header className="flex justify-between items-center px-4 py-3 bg-[#FCF9F0]/90 backdrop-blur-sm z-10">
        <button className="w-9 h-9 flex items-center justify-center bg-surface-container-lowest border-[3px] border-on-surface rounded-lg sticker-shadow active-press">
          <span className="material-symbols-outlined text-on-surface text-lg">close</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Oskar's Expedition</span>
        </div>
        <div className="w-9" /> {/* spacer */}
      </header>

      {/* Progress Bar */}
      <div className="px-4 pb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-primary">{progress}% freigelegt</span>
          <span className="text-[10px] font-bold text-on-surface-variant">Wueste</span>
        </div>
        <div className="h-3 bg-surface-container-high rounded-full border-2 border-on-surface overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-container to-[#2E7D32] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Dig Area */}
      <div className="flex-1 relative mx-4 mb-4 rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden">
        {/* Skeleton image underneath (revealed by digging) */}
        <img
          src="/dinos/triceratops/skeleton.png"
          alt="Triceratops Skelett"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Sand/dirt overlay — this is what gets "wiped away" */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, #3a2510 0%, #2C1A0E 100%)`,
            opacity: 1 - progress / 100,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Finger swipe indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            swipe
          </span>
          <span className="text-white text-[10px] font-black uppercase tracking-wider drop-shadow-lg bg-on-surface/50 px-2 py-0.5 rounded-full">
            Wisch den Sand weg!
          </span>
        </div>
      </div>

      {/* Forscher Comment */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-surface-container-lowest border-[3px] border-primary rounded-lg p-2.5 sticker-shadow">
          <div className="w-8 h-8 bg-primary-fixed rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
          </div>
          <p className="text-xs font-bold text-on-surface">Ich sehe etwas! Weiter so!</p>
        </div>
      </div>

      {/* Interactive buttons for demo */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={() => setProgress(Math.min(100, progress + 15))}
          className="flex-1 py-2 bg-primary-container text-white border-[3px] border-on-primary-fixed-variant rounded-lg font-bold uppercase tracking-wider text-[11px] sticker-shadow-primary active-press-primary"
        >
          +15% graben
        </button>
        <button
          onClick={() => setProgress(0)}
          className="py-2 px-3 bg-surface-container-highest text-on-surface border-[3px] border-on-surface rounded-lg font-bold uppercase tracking-wider text-[11px] sticker-shadow active-press"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
