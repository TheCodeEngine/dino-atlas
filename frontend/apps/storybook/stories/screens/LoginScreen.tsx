import { useState } from "react";
import { TextInput } from "../../../../packages/ui/src/primitives/TextInput";
import { Divider } from "../../../../packages/ui/src/primitives/Divider";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { FormCard } from "../../../../packages/ui/src/components/FormCard";
import { PageHeader } from "../../../../packages/ui/src/components/PageHeader";

export function LoginScreen() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <FormCard
          tabs={[
            { id: "login", label: "Login" },
            { id: "register", label: "Registrieren" },
          ]}
          activeTab={tab}
          onTabChange={(id) => setTab(id as "login" | "register")}
          footer={
            <p className="text-[11px] font-semibold text-on-surface-variant">
              {tab === "login" ? (
                <>Neu hier?{" "}<button onClick={() => setTab("register")} className="text-primary font-black uppercase tracking-wider hover:underline">Familie registrieren</button></>
              ) : (
                <>Schon dabei?{" "}<button onClick={() => setTab("login")} className="text-primary font-black uppercase tracking-wider hover:underline">Einloggen</button></>
              )}
            </p>
          }
        >
          <PageHeader
            logoSrc="/logo.png"
            title={tab === "login" ? "Willkommen zurück!" : "Neue Familie"}
            subtitle={tab === "login" ? "Bereit für deine nächste Entdeckung?" : "Erstelle dein Forscher-Team!"}
          />
          {tab === "login" ? <LoginForm /> : <RegisterForm />}
        </FormCard>

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
        <a href="#" className="text-[11px] font-semibold text-secondary hover:underline">Passwort vergessen?</a>
      </div>

      <div className="pt-1 flex flex-col gap-2.5">
        <Button variant="primary" fullWidth icon="arrow_forward">Expedition starten</Button>
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

const AVATARS = ["🦖", "🦕", "🦎", "🐊", "🐢", "🦅"];

function RegisterForm() {
  const [step, setStep] = useState(1);
  const [kids, setKids] = useState([
    { name: "Oskar", birthYear: "2020", avatar: "🦖" },
  ]);

  const addKid = () => setKids([...kids, { name: "", birthYear: "", avatar: AVATARS[kids.length % AVATARS.length]! }]);
  const removeKid = (i: number) => setKids(kids.filter((_, idx) => idx !== i));
  const updateKid = (i: number, field: string, value: string) =>
    setKids(kids.map((k, idx) => (idx === i ? { ...k, [field]: value } : k)));

  if (step === 1) {
    return (
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1.5 rounded-full bg-primary-container" />
          <div className="flex-1 h-1.5 rounded-full bg-surface-container-high" />
        </div>

        <TextInput label="Familien-Name" icon="family_restroom" type="text" placeholder="z.B. Familie Stoldt" />
        <TextInput label="Email" icon="mail" type="email" placeholder="eltern@beispiel.de" />
        <TextInput label="Passwort" icon="lock" type="password" placeholder="Mind. 8 Zeichen" />
        <TextInput label="Passwort bestätigen" icon="lock" type="password" placeholder="Nochmal eingeben" />

        <div className="pt-1">
          <Button variant="primary" fullWidth icon="arrow_forward">Weiter: Kinder anlegen</Button>
        </div>
      </form>
    );
  }

  return (
    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1.5 rounded-full bg-primary-container" />
        <div className="flex-1 h-1.5 rounded-full bg-primary-container" />
      </div>

      <p className="text-xs font-bold text-on-surface-variant mb-2">
        Wer sind deine Forscher? Du kannst später weitere hinzufügen.
      </p>

      {kids.map((kid, i) => (
        <div key={i} className="flex items-start gap-2 p-2.5 bg-surface-container-low rounded-lg border-2 border-outline-variant">
          <button
            type="button"
            onClick={() => {
              const next = AVATARS[(AVATARS.indexOf(kid.avatar) + 1) % AVATARS.length]!;
              updateKid(i, "avatar", next);
            }}
            className="w-10 h-10 rounded-full border-[3px] border-on-surface bg-primary-fixed flex items-center justify-center text-xl flex-shrink-0 active:scale-90 transition-transform"
            title="Avatar ändern"
          >
            {kid.avatar}
          </button>
          <div className="flex-1 min-w-0 space-y-1.5">
            <input
              type="text"
              value={kid.name}
              onChange={(e) => updateKid(i, "name", e.target.value)}
              placeholder="Name"
              className="w-full px-2 py-1.5 bg-white border-2 border-on-surface rounded text-sm font-bold placeholder:text-outline/40"
            />
            <input
              type="number"
              value={kid.birthYear}
              onChange={(e) => updateKid(i, "birthYear", e.target.value)}
              placeholder="Geburtsjahr"
              className="w-full px-2 py-1.5 bg-white border-2 border-on-surface rounded text-sm font-bold placeholder:text-outline/40"
              min="2015" max="2025"
            />
          </div>
          {kids.length > 1 && (
            <button
              type="button"
              onClick={() => removeKid(i)}
              className="w-7 h-7 rounded-full bg-error/10 text-error flex items-center justify-center flex-shrink-0 hover:bg-error/20"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addKid}
        className="w-full py-2 border-2 border-dashed border-outline-variant rounded-lg text-[11px] font-bold text-on-surface-variant hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
        Weiteres Kind hinzufügen
      </button>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-4 py-2.5 bg-surface-container-high text-on-surface border-[3px] border-on-surface rounded-lg font-bold uppercase tracking-wider text-xs sticker-shadow active-press"
        >
          Zurück
        </button>
        <div className="flex-1">
          <Button variant="primary" fullWidth icon="group_add">Familie gründen</Button>
        </div>
      </div>
    </form>
  );
}
