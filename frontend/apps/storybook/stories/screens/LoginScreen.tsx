import { useState } from "react";
import { TextInput } from "../../../../packages/ui/src/primitives/TextInput";
import { Divider } from "../../../../packages/ui/src/primitives/Divider";

export function LoginScreen() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b-[3px] border-on-surface">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider border-r-[3px] border-on-surface transition-colors ${
                tab === "login" ? "bg-white text-on-surface" : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab("register")}
              className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider transition-colors ${
                tab === "register" ? "bg-white text-on-surface" : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              Registrieren
            </button>
          </div>

          {/* Form */}
          <div className="p-5">
            {/* Header */}
            <div className="mb-6 text-center">
              <img src="/logo.png" alt="Dino-Atlas" className="w-14 h-14 object-contain mx-auto mb-2" />
              <h2 className="text-xl font-black uppercase tracking-tight text-on-surface mb-0.5">
                {tab === "login" ? "Willkommen zurück!" : "Neue Familie"}
              </h2>
              <p className="text-xs text-on-surface-variant font-medium">
                {tab === "login"
                  ? "Bereit für deine nächste Entdeckung?"
                  : "Erstelle dein Forscher-Team!"}
              </p>
            </div>

            {tab === "login" ? <LoginForm /> : <RegisterForm />}
          </div>

          {/* Footer */}
          <div className="bg-surface-container-high p-3 text-center border-t-[3px] border-on-surface">
            <p className="text-[11px] font-semibold text-on-surface-variant">
              {tab === "login" ? (
                <>Neu hier?{" "}<button onClick={() => setTab("register")} className="text-primary font-black uppercase tracking-wider hover:underline">Familie registrieren</button></>
              ) : (
                <>Schon dabei?{" "}<button onClick={() => setTab("login")} className="text-primary font-black uppercase tracking-wider hover:underline">Einloggen</button></>
              )}
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-[9px] font-semibold text-outline uppercase tracking-wider">
          &copy; Dino-Atlas Expeditionen
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  return (
    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
      <TextInput label="Email" icon="person" type="text" placeholder="forscher@dino-atlas.de" />
      <TextInput label="Passwort" icon="lock" type="password" placeholder="••••••••" />

      <div className="flex justify-end">
        <a href="#" className="text-[11px] font-semibold text-secondary hover:underline">
          Passwort vergessen?
        </a>
      </div>

      <div className="pt-1 flex flex-col gap-2.5">
        <button
          type="submit"
          className="w-full py-2.5 bg-[#1B5E20] text-white border-[3px] border-on-primary-fixed-variant rounded-lg sticker-shadow-primary font-bold uppercase tracking-wider active-press-primary flex items-center justify-center gap-1.5 text-sm"
        >
          Expedition starten
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>

        <Divider text="Oder" />

        <button
          type="button"
          disabled
          className="w-full py-2.5 bg-white text-on-surface/40 border-[3px] border-outline-variant rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-sm cursor-not-allowed"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google Account (bald)
        </button>
      </div>
    </form>
  );
}

function RegisterForm() {
  return (
    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
      <TextInput label="Familien-Name" icon="family_restroom" type="text" placeholder="Familie Stoldt" />
      <TextInput label="Email" icon="mail" type="email" placeholder="eltern@beispiel.de" />
      <TextInput label="Passwort" icon="lock" type="password" placeholder="Mind. 8 Zeichen" />
      <TextInput label="Passwort bestätigen" icon="lock" type="password" placeholder="Nochmal eingeben" />

      <div className="pt-1">
        <button
          type="submit"
          className="w-full py-2.5 bg-[#1B5E20] text-white border-[3px] border-on-primary-fixed-variant rounded-lg sticker-shadow-primary font-bold uppercase tracking-wider active-press-primary flex items-center justify-center gap-1.5 text-sm"
        >
          Familie gründen
          <span className="material-symbols-outlined text-[18px]">group_add</span>
        </button>
      </div>
    </form>
  );
}
