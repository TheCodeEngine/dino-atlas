import { Icon } from "../primitives/Icon";

export function SleepyDinosScreen() {
  return (
    <div
      className="text-white min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "#1c1c17", backgroundImage: "none" }}
      ref={(el) => { if (el) document.body.style.background = "#1c1c17"; }}
    >
      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ))}
        {/* Moon */}
        <div className="absolute top-8 right-8 w-16 h-16 bg-[#fef0c7] rounded-full shadow-[0_0_40px_10px_rgba(254,240,199,0.3)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-sm w-full text-center">
        {/* Sleeping Dino */}
        <div className="mb-6">
          <div className="inline-block relative">
            <span className="text-8xl">🦕</span>
            {/* Zzz bubbles */}
            <span className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDuration: "2s" }}>💤</span>
            <span className="absolute -top-6 right-4 text-lg animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}>💤</span>
            <span className="absolute -top-8 right-10 text-sm animate-bounce" style={{ animationDelay: "1s", animationDuration: "3s" }}>💤</span>
          </div>
        </div>

        {/* Message Card */}
        <div className="bg-inverse-surface rounded-xl border-[3px] border-outline p-5 mb-6 sticker-shadow">
          <h1 className="text-xl font-black uppercase tracking-tight text-inverse-on-surface mb-2">
            Die Dinos schlafen
          </h1>
          <p className="text-sm font-medium text-inverse-on-surface/70 leading-relaxed">
            Du hast heute toll geforscht! Unsere Dinos brauchen jetzt ihren Schlaf. Morgen sind sie wieder fit fuer neue Abenteuer!
          </p>
        </div>

        {/* Forscher */}
        <div className="flex items-start gap-2 mb-6">
          <div className="w-8 h-8 bg-primary-fixed border-[3px] border-outline rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="face" size="sm" filled className="text-primary" />
          </div>
          <div className="bg-inverse-surface border-[3px] border-outline rounded-lg rounded-tl-none p-2.5 flex-1 text-left">
            <p className="text-xs font-bold text-inverse-on-surface">
              Ruh dich auch mal aus! Morgen frueh wartet eine neue Expedition auf dich! 🌅
            </p>
          </div>
        </div>

        {/* Timer visual */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Icon name="dark_mode" size="lg" filled className="text-[#fef0c7]" />
          <div className="flex-1 max-w-[200px]">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[30%] bg-gradient-to-r from-[#fef0c7] to-secondary-container rounded-full" />
            </div>
            <p className="text-[9px] font-bold text-white/40 mt-1">Morgen um 14:00 geht's weiter</p>
          </div>
          <Icon name="light_mode" size="lg" filled className="text-secondary-container" />
        </div>

        {/* Bis morgen */}
        <p className="text-lg font-black uppercase tracking-wider text-[#fef0c7] mb-4">
          Bis morgen!
        </p>

        {/* Parent reset link - deliberately small/subtle */}
        <button className="text-[10px] font-semibold text-white/20 hover:text-white/50 transition-colors">
          Erwachsene: Nochmal spielen?
        </button>
      </div>
    </div>
  );
}
