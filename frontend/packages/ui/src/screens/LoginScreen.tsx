import { useState } from "react";
import { TextInput } from "../primitives/TextInput";
import { Divider } from "../primitives/Divider";
import { Button } from "../primitives/Button";
import { FormCard } from "../components/FormCard";
import { PageHeader } from "../components/PageHeader";
import { Icon } from "../primitives/Icon";
import { Avatar } from "../primitives/Avatar";
import { ProgressBar } from "../primitives/ProgressBar";

export interface LoginScreenProps {
  onLogin?: (email: string, password: string) => Promise<void> | void;
  onRegister?: (data: {
    email: string;
    password: string;
    familyName: string;
    kids: { name: string; birthYear: string; avatar: string }[];
  }) => Promise<void> | void;
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps = {}) {
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
          {tab === "login" ? <LoginForm onLogin={onLogin} /> : <RegisterForm onRegister={onRegister} />}
        </FormCard>

        <p className="mt-4 text-center text-[9px] font-semibold text-outline uppercase tracking-wider">
          &copy; Dino-Atlas Expeditionen
        </p>
      </div>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin?: LoginScreenProps["onLogin"] }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin) return;
    setError("");
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || "Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <TextInput label="Email" icon="person" type="email" placeholder="forscher@dino-atlas.de" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextInput label="Passwort" icon="lock" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

      <div className="flex justify-end">
        <a href="#" className="text-[11px] font-semibold text-secondary hover:underline">Passwort vergessen?</a>
      </div>

      {error && <p className="text-xs font-bold text-error">{error}</p>}

      <div className="pt-1 flex flex-col gap-2.5">
        <Button variant="primary" fullWidth icon="arrow_forward" disabled={loading}>
          {loading ? "Lade..." : "Expedition starten"}
        </Button>
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
          Google (bald)
        </button>
      </div>
    </form>
  );
}

const AVATARS = ["🦖", "🦕", "🦎", "🐊", "🐢", "🦅"];

function RegisterForm({ onRegister }: { onRegister?: LoginScreenProps["onRegister"] }) {
  const [step, setStep] = useState(1);
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [kids, setKids] = useState([
    { name: "", birthYear: "", avatar: "🦖" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addKid = () => setKids([...kids, { name: "", birthYear: "", avatar: AVATARS[kids.length % AVATARS.length]! }]);
  const removeKid = (i: number) => setKids(kids.filter((_, idx) => idx !== i));
  const updateKid = (i: number, field: string, value: string) =>
    setKids(kids.map((k, idx) => (idx === i ? { ...k, [field]: value } : k)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onRegister) return;
    if (password !== passwordConfirm) {
      setError("Passwörter stimmen nicht überein");
      return;
    }
    if (password.length < 8) {
      setError("Passwort muss mind. 8 Zeichen haben");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onRegister({ email, password, familyName, kids });
    } catch (err: any) {
      setError(err.message || "Registrierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
        <div className="flex items-center gap-2 mb-4">
          <ProgressBar value={50} className="flex-1" />
        </div>

        <TextInput label="Familien-Name" icon="family_restroom" type="text" placeholder="z.B. Familie Stoldt" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
        <TextInput label="Email" icon="mail" type="email" placeholder="eltern@beispiel.de" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextInput label="Passwort" icon="lock" type="password" placeholder="Mind. 8 Zeichen" value={password} onChange={(e) => setPassword(e.target.value)} />
        <TextInput label="Passwort bestätigen" icon="lock" type="password" placeholder="Nochmal eingeben" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />

        <div className="pt-1">
          <Button variant="primary" fullWidth icon="arrow_forward">Weiter: Kinder anlegen</Button>
        </div>
      </form>
    );
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 mb-2">
        <ProgressBar value={100} className="flex-1" />
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
            className="active:scale-90 transition-transform flex"
            title="Avatar ändern"
          >
            <Avatar size="md">
              {kid.avatar}
            </Avatar>
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
              <Icon name="close" size="sm" />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addKid}
        className="w-full py-2 border-2 border-dashed border-outline-variant rounded-lg text-[11px] font-bold text-on-surface-variant hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
      >
        <Icon name="add" size="sm" />
        Weiteres Kind hinzufügen
      </button>

      {error && <p className="text-xs font-bold text-error">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-4 py-2.5 bg-surface-container-high text-on-surface border-[3px] border-on-surface rounded-lg font-bold uppercase tracking-wider text-xs sticker-shadow active-press"
        >
          Zurück
        </button>
        <div className="flex-1">
          <Button variant="primary" fullWidth icon="group_add" disabled={loading}>
            {loading ? "Lade..." : "Familie gründen"}
          </Button>
        </div>
      </div>
    </form>
  );
}
