export function MainDashboard() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-[#FCF9F0] border-b-[3px] border-[#1B5E20] shadow-[3px_3px_0px_0px_rgba(28,28,23,1)]">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Dino-Atlas" className="w-8 h-8 object-contain" />
          <span className="text-lg font-black text-[#1B5E20] uppercase tracking-tight">Dino Atlas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex gap-1.5">
            <div className="flex items-center gap-1 px-2 py-1 bg-surface-container-lowest border-2 border-on-surface rounded text-[11px] sticker-shadow">
              <span className="material-symbols-outlined text-[#1B5E20] text-[16px]">monetization_on</span>
              <span className="font-bold">2,450</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-surface-container-lowest border-2 border-on-surface rounded text-[11px] sticker-shadow">
              <span className="material-symbols-outlined text-secondary text-[16px]">bolt</span>
              <span className="font-bold">85%</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full border-[3px] border-[#1B5E20] bg-primary-fixed flex items-center justify-center text-base">🦖</div>
        </div>
      </header>

      {/* SideNav Desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-14 h-[calc(100vh-3.5rem)] z-40 bg-[#FCF9F0] border-r-[3px] border-[#1B5E20] w-48 p-2.5">
        <div className="mb-4 p-2.5 bg-surface-container-high rounded-lg border-2 border-outline-variant">
          <p className="font-black text-[10px] uppercase tracking-wider text-[#1B5E20]">Junior Ranger</p>
          <p className="text-[10px] text-on-surface-variant">Level 12</p>
        </div>
        <nav className="flex-1 space-y-1">
          <a className="flex items-center gap-2 p-2 bg-[#1B5E20] text-white rounded-lg shadow-[3px_3px_0px_0px_rgba(255,107,0,1)] font-bold uppercase tracking-wider text-[11px] cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">home</span>Camp
          </a>
          {[
            { icon: "menu_book", label: "Lexikon" },
            { icon: "landscape", label: "Grabung" },
            { icon: "military_tech", label: "Abzeichen" },
          ].map((item) => (
            <a key={item.label} className="flex items-center gap-2 p-2 text-[#1C1C17] hover:bg-[#F6F3EA] rounded-lg font-bold uppercase tracking-wider text-[11px] transition-all hover:translate-x-0.5 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>{item.label}
            </a>
          ))}
        </nav>
        <button className="w-full py-2.5 bg-secondary-container text-white border-[3px] border-on-secondary-container rounded-lg sticker-shadow font-bold uppercase tracking-wider text-[11px] active-press">
          Neue Entdeckung
        </button>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-48 pt-16 pb-20 lg:pb-4 px-3 md:px-5 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left */}
          <section className="lg:col-span-8 flex flex-col gap-4">
            {/* Map */}
            <div className="relative bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow h-56 md:h-72 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/40 via-surface-container to-secondary-fixed/20" />
              <div className="relative z-10 p-3 md:p-4 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h1 className="text-lg md:text-xl font-black tracking-tight bg-surface/90 px-2.5 py-1 rounded border-2 border-on-surface shadow-[2px_2px_0px_0px_#1c1c17]">
                    Expeditions-Karte
                  </h1>
                  <span className="bg-primary text-white px-2 py-0.5 rounded-full text-[9px] font-black border-2 border-on-surface">
                    3 AKTIV
                  </span>
                </div>
                {/* Markers */}
                {[
                  { top: "28%", left: "25%", icon: "volcano", label: "Vulkan", bg: "bg-secondary-container" },
                  { top: "55%", left: "60%", icon: "forest", label: "Dschungel", bg: "bg-primary-container" },
                  { top: "42%", left: "45%", icon: "skeleton", label: "Knochen", bg: "bg-tertiary-container" },
                ].map((m) => (
                  <div key={m.label} className="absolute" style={{ top: m.top, left: m.left }}>
                    <div className="flex flex-col items-center gap-0.5">
                      <div className={`w-8 h-8 ${m.bg} border-[3px] border-on-surface rounded-full flex items-center justify-center sticker-shadow`}>
                        <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                      </div>
                      <span className="bg-on-surface text-white px-1 py-px text-[7px] font-black uppercase rounded">{m.label}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button className="bg-surface-container-lowest text-on-surface px-3 py-1.5 border-[3px] border-on-surface rounded-lg font-black uppercase tracking-tight text-[11px] sticker-shadow active-press">
                    Vollbild
                  </button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">edit_note</span>Forscher-Notizen
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-surface-container-lowest p-2.5 rounded-lg border-[3px] border-primary sticker-shadow flex items-start gap-2">
                  <div className="bg-primary-fixed p-1 rounded flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[16px]">person</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold">Oskar hat ein T-Rex Horn gefunden!</p>
                    <p className="text-[9px] text-on-surface-variant">Vor 2 Min &middot; Knochenfeld</p>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-2.5 rounded-lg border-[3px] border-secondary sticker-shadow flex items-start gap-2">
                  <div className="bg-secondary-fixed p-1 rounded flex-shrink-0">
                    <span className="material-symbols-outlined text-secondary text-[16px]">military_tech</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold">Neues Abzeichen: Meister-Schaufel!</p>
                    <p className="text-[9px] text-on-surface-variant">Vor 1 Std &middot; Camp</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right */}
          <section className="lg:col-span-4 flex flex-col gap-4">
            {/* Dino */}
            <div className="bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary-container to-tertiary-container border-b-[3px] border-on-surface flex items-center justify-center">
                <span className="text-6xl">🦕</span>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-secondary">Tages-Dino</span>
                  <span className="bg-primary-fixed text-on-primary-fixed px-1.5 py-px rounded text-[9px] font-black uppercase">Pflanzenfresser</span>
                </div>
                <h3 className="text-lg font-black uppercase mb-1">Triceratops</h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mb-3">
                  Drei Hoerner und ein riesiger Knochenschild — einer der bekanntesten Riesen der Kreidezeit.
                </p>
                <button className="w-full py-2 bg-[#1B5E20] text-white border-[3px] border-on-primary-fixed-variant rounded-lg sticker-shadow font-bold uppercase tracking-wider text-[11px] active-press-primary flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">menu_book</span>Lexikon
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px]">flash_on</span>Schnellstart
              </h2>
              <button className="flex items-center justify-between p-2.5 bg-tertiary text-white rounded-lg border-[3px] border-on-tertiary-fixed-variant sticker-shadow active-press">
                <div className="flex items-center gap-2.5">
                  <div className="bg-tertiary-fixed p-1 rounded">
                    <span className="material-symbols-outlined text-tertiary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>construction</span>
                  </div>
                  <div className="text-left">
                    <p className="font-black uppercase tracking-wider text-[11px]">Schnell-Grabung</p>
                    <p className="text-[9px] opacity-80 font-semibold">20 Bolts</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
              <button className="flex items-center justify-between p-2.5 bg-surface-container-highest text-on-surface rounded-lg border-[3px] border-on-surface sticker-shadow active-press">
                <div className="flex items-center gap-2.5">
                  <div className="bg-surface-container-low p-1 rounded border-2 border-on-surface">
                    <span className="material-symbols-outlined text-on-surface text-[16px]">backpack</span>
                  </div>
                  <div className="text-left">
                    <p className="font-black uppercase tracking-wider text-[11px]">Ausruestung</p>
                    <p className="text-[9px] text-on-surface-variant font-semibold">12 Teile</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* BottomNav Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-14 bg-[#FCF9F0] border-t-[3px] border-[#1B5E20]">
        {[
          { icon: "home", label: "Camp", active: true },
          { icon: "menu_book", label: "Lexikon", active: false },
          { icon: "landscape", label: "Grabung", active: false },
          { icon: "military_tech", label: "Badges", active: false },
        ].map((item) => (
          <a
            key={item.label}
            className={[
              "flex flex-col items-center justify-center px-2 py-1 rounded-lg cursor-pointer active:scale-90 transition-transform",
              item.active ? "bg-[#1B5E20] text-white shadow-[2px_2px_0px_0px_rgba(255,107,0,1)]" : "text-[#1C1C17]",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
            <span className="font-bold text-[8px] uppercase">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
