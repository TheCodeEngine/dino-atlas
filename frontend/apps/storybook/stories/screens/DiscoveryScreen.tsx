export function DiscoveryScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Confetti / celebration bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["🌟", "⭐", "✨", "🦕", "🎉"].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-2xl animate-bounce"
            style={{
              left: `${15 + i * 18}%`,
              top: `${10 + (i % 3) * 15}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${1.5 + i * 0.3}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Close */}
      <header className="flex items-center px-4 py-3 z-10">
        <button className="w-9 h-9 flex items-center justify-center bg-surface-container-lowest border-[3px] border-on-surface rounded-lg sticker-shadow active-press">
          <span className="material-symbols-outlined text-on-surface text-lg">close</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Dino Image */}
        <div className="w-full bg-gradient-to-br from-primary-container to-tertiary-container rounded-xl border-[3px] border-on-surface sticker-shadow p-4 mb-5 flex items-center justify-center">
          <img
            src="/dinos/triceratops/comic.png"
            alt="Triceratops"
            className="w-48 h-48 object-contain drop-shadow-lg"
          />
        </div>

        {/* Name */}
        <div className="text-center mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Entdeckt!</span>
          <h1 className="text-3xl font-black uppercase tracking-tight">Triceratops</h1>
          <p className="text-xs font-semibold text-on-surface-variant italic">Dreihorn-Gesicht</p>
        </div>

        {/* Fact Card */}
        <div className="w-full bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { icon: "calendar_month", label: "Zeitalter", value: "Kreide" },
              { icon: "restaurant", label: "Nahrung", value: "Pflanzen" },
              { icon: "straighten", label: "Laenge", value: "9 Meter" },
              { icon: "scale", label: "Gewicht", value: "6-12 Tonnen" },
            ].map((fact) => (
              <div key={fact.label} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-fixed rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[16px]">{fact.icon}</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase">{fact.label}</p>
                  <p className="text-xs font-black text-on-surface">{fact.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-secondary-fixed/30 rounded-lg p-2.5 border-2 border-secondary/20">
            <p className="text-[10px] font-black uppercase tracking-wider text-secondary mb-0.5">Wusstest du?</p>
            <p className="text-xs font-semibold text-on-surface leading-relaxed">
              Der Triceratops hatte bis zu 800 Zaehne! Sie wuchsen staendig nach, wie bei einem Hai.
            </p>
          </div>
        </div>

        {/* TTS Button */}
        <button className="flex items-center gap-1.5 mb-4 px-4 py-2 bg-surface-container-high border-2 border-outline-variant rounded-full text-xs font-bold text-on-surface-variant active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>volume_up</span>
          Vorlesen
        </button>

        {/* Forscher Reaction */}
        <div className="w-full flex items-start gap-2 mb-4">
          <div className="w-8 h-8 bg-primary-fixed border-[3px] border-on-surface rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
          </div>
          <div className="bg-surface-container-lowest border-[3px] border-on-surface rounded-lg rounded-tl-none p-2.5 sticker-shadow flex-1">
            <p className="text-xs font-bold">Unglaublich! Ein Triceratops! Den suche ich schon seit Jahren!</p>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full py-3 bg-[#1B5E20] text-white border-[3px] border-on-primary-fixed-variant rounded-lg sticker-shadow-primary font-bold uppercase tracking-wider active-press-primary flex items-center justify-center gap-1.5 text-sm mb-4">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>museum</span>
          Ab ins Museum!
        </button>
      </main>
    </div>
  );
}
