export function LoginScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex items-center px-5 h-14 bg-[#FCF9F0] border-b-[3px] border-[#1B5E20] shadow-[3px_3px_0px_0px_rgba(28,28,23,1)]">
        <span className="text-lg font-black text-[#1B5E20] uppercase tracking-tight">
          Dino Explorer
        </span>
      </header>

      {/* Main */}
      <main className="pt-20 pb-8 px-4 flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b-[3px] border-on-surface">
              <button className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider bg-white text-on-surface border-r-[3px] border-on-surface">
                Login
              </button>
              <button className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors">
                Registrieren
              </button>
            </div>

            {/* Form */}
            <div className="p-5">
              {/* Header */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-fixed border-[3px] border-on-surface rounded-lg sticker-shadow mb-3">
                  <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    explore
                  </span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-on-surface mb-0.5">
                  Willkommen zurueck!
                </h2>
                <p className="text-xs text-on-surface-variant font-medium">
                  Bereit fuer deine naechste Entdeckung?
                </p>
              </div>

              {/* Fields */}
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-1">Email</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
                    <input
                      type="text"
                      placeholder="forscher@dino-atlas.de"
                      className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border-[3px] border-on-surface rounded-lg focus:ring-0 focus:border-primary text-sm font-semibold placeholder:text-outline/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-1">Passwort</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">lock</span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border-[3px] border-on-surface rounded-lg focus:ring-0 focus:border-primary text-sm font-semibold placeholder:text-outline/40"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 border-2 border-on-surface rounded text-primary focus:ring-0" />
                    <span className="text-[11px] font-semibold text-on-surface-variant">Eingeloggt bleiben</span>
                  </label>
                  <a href="#" className="text-[11px] font-semibold text-secondary hover:underline">Passwort vergessen?</a>
                </div>

                <div className="pt-1 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1B5E20] text-white border-[3px] border-on-primary-fixed-variant rounded-lg sticker-shadow-primary font-bold uppercase tracking-wider active-press-primary flex items-center justify-center gap-1.5 text-sm"
                  >
                    Expedition starten
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>

                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-grow border-t-2 border-outline-variant" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-outline">Oder</span>
                    <div className="flex-grow border-t-2 border-outline-variant" />
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 bg-white text-on-surface border-[3px] border-on-surface rounded-lg sticker-shadow font-bold uppercase tracking-wider active-press flex items-center justify-center gap-1.5 text-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                    Google Account
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-surface-container-high p-3 text-center border-t-[3px] border-on-surface">
              <p className="text-[11px] font-semibold text-on-surface-variant">
                Neu hier?{" "}
                <a href="#" className="text-primary hover:underline font-black uppercase tracking-wider">Familie registrieren</a>
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-[9px] font-semibold text-outline uppercase tracking-wider">
            &copy; Dino-Atlas Expeditionen
          </p>
        </div>
      </main>
    </div>
  );
}
