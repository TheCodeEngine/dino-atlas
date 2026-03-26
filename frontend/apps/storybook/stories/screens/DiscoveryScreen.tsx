export function DiscoveryScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Close */}
      <header className="flex items-center px-4 py-2 z-10">
        <button className="w-9 h-9 flex items-center justify-center bg-surface-container-lowest border-[3px] border-on-surface rounded-lg sticker-shadow active-press">
          <span className="material-symbols-outlined text-on-surface text-lg">close</span>
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 pb-4 flex flex-col items-center max-w-md mx-auto w-full">
        {/* Dino Image */}
        <div className="w-full bg-gradient-to-br from-primary-container to-tertiary-container rounded-xl border-[3px] border-on-surface sticker-shadow flex items-center justify-center py-4 mb-3">
          <img
            src="/dinos/triceratops/comic.png"
            alt="Triceratops"
            className="w-40 h-40 object-contain drop-shadow-lg"
          />
        </div>

        {/* Name + TTS */}
        <div className="text-center mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Entdeckt!</span>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black uppercase tracking-tight">Triceratops</h1>
            <button className="w-7 h-7 bg-surface-container-high border-2 border-outline-variant rounded-full flex items-center justify-center active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>volume_up</span>
            </button>
          </div>
          <p className="text-[11px] font-semibold text-on-surface-variant italic">Dreihorn-Gesicht</p>
        </div>

        {/* Fact Card */}
        <div className="w-full bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow p-3 mb-3">
          <div className="grid grid-cols-2 gap-2 mb-2">
            {[
              { icon: "calendar_month", label: "Zeitalter", value: "Kreide" },
              { icon: "restaurant", label: "Nahrung", value: "Pflanzen" },
              { icon: "straighten", label: "Laenge", value: "9 Meter" },
              { icon: "scale", label: "Gewicht", value: "6–12 t" },
            ].map((fact) => (
              <div key={fact.label} className="flex items-center gap-1.5">
                <div className="w-7 h-7 bg-primary-fixed rounded flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[14px]">{fact.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-bold text-on-surface-variant uppercase">{fact.label}</p>
                  <p className="text-[11px] font-black text-on-surface truncate">{fact.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-secondary-fixed/30 rounded-lg p-2 border-2 border-secondary/20">
            <p className="text-[9px] font-black uppercase tracking-wider text-secondary mb-0.5">Wusstest du?</p>
            <p className="text-[11px] font-semibold text-on-surface leading-snug">
              Der Triceratops hatte bis zu 800 Zaehne! Sie wuchsen staendig nach, wie bei einem Hai.
            </p>
          </div>
        </div>

        {/* Forscher */}
        <div className="w-full flex items-start gap-2 mb-3">
          <div className="w-7 h-7 bg-primary-fixed border-[3px] border-on-surface rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
          </div>
          <div className="bg-surface-container-lowest border-[3px] border-on-surface rounded-lg rounded-tl-none p-2 sticker-shadow flex-1">
            <p className="text-[11px] font-bold">Unglaublich! Ein Triceratops! Den suche ich schon seit Jahren!</p>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full py-3 bg-[#1B5E20] text-white border-[3px] border-on-primary-fixed-variant rounded-lg sticker-shadow-primary font-bold uppercase tracking-wider active-press-primary flex items-center justify-center gap-1.5 text-sm">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>museum</span>
          Ab ins Museum!
        </button>
      </main>
    </div>
  );
}
