import { AudioPlayer } from "../../../../packages/ui/src/components/AudioPlayer";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { StatusBadge } from "../../../../packages/ui/src/components/StatusBadge";
import { Button } from "../../../../packages/ui/src/primitives/Button";

const DINO = {
  name: "Triceratops",
  latin: "Dreihorn-Gesicht",
  images: {
    real: "/dinos/triceratops/real.png",
    comic: "/dinos/triceratops/comic.png",
    skeleton: "/dinos/triceratops/skeleton.png",
  },
  mainStory:
    "Stell dir vor, vor 68 Millionen Jahren lief durch die dichten Wälder Nordamerikas ein riesiges Tier. " +
    "Es hatte drei große Hörner auf dem Kopf und einen gewaltigen Knochenschild im Nacken. " +
    "Das war der Triceratops — einer der bekanntesten Dinosaurier überhaupt! " +
    "Mit seinen Hörnern konnte er sich gegen gefährliche Raubtiere wie den T-Rex verteidigen. " +
    "Obwohl er so groß war wie zwei Autos, war er ein friedlicher Pflanzenfresser.",
  facts: [
    {
      icon: "calendar_month",
      label: "Zeitalter",
      value: "Kreidezeit",
      sub: "68–66 Mio. Jahre",
      story:
        "Der Triceratops lebte ganz am Ende der Kreidezeit. Das war die allerletzte Zeit der Dinosaurier! " +
        "Kurz nachdem der Triceratops ausgestorben ist, schlug ein riesiger Asteroid auf der Erde ein. " +
        "Damit endete die Zeit aller großen Dinosaurier. Der Triceratops war also einer der allerletzten!",
    },
    {
      icon: "restaurant",
      label: "Nahrung",
      value: "Pflanzenfresser",
      story:
        "Obwohl der Triceratops so riesig und stark aussah, fraß er nur Pflanzen! " +
        "Am liebsten mochte er Farne, Palmblätter und kleine Büsche. " +
        "Mit seinem scharfen Schnabel konnte er sogar harte Äste abknipsen wie mit einer Schere.",
    },
    {
      icon: "straighten",
      label: "Länge",
      value: "9 Meter",
      story:
        "Neun Meter lang — das ist so lang wie zwei große Autos hintereinander! " +
        "Allein sein Kopf mit dem Knochenschild war über zwei Meter lang. " +
        "Das ist größer als ein erwachsener Mensch!",
    },
    {
      icon: "scale",
      label: "Gewicht",
      value: "6–12 Tonnen",
      story:
        "Der Triceratops wog so viel wie zwei große Elefanten zusammen! " +
        "Trotzdem konnte er überraschend schnell rennen wenn er musste. " +
        "Forscher glauben, dass er bis zu 30 Kilometer pro Stunde schnell werden konnte.",
    },
    {
      icon: "public",
      label: "Lebensraum",
      value: "Nordamerika",
      story:
        "Alle Triceratops-Knochen wurden in Nordamerika gefunden — vor allem in den USA und Kanada. " +
        "Damals sah Nordamerika ganz anders aus als heute. Es war warm und feucht mit riesigen Wäldern.",
    },
    {
      icon: "group",
      label: "Verhalten",
      value: "Herdentier",
      story:
        "Der Triceratops lebte wahrscheinlich in großen Herden zusammen. " +
        "Die großen starken Tiere stellten sich in einen Kreis und beschützten die kleinen Babys in der Mitte. " +
        "Genau wie es heute Elefanten machen!",
    },
  ],
  funFact:
    "Der Triceratops hatte bis zu 800 Zähne! Wenn ein Zahn abbrach, wuchs einfach ein neuer nach — genau wie bei einem Hai. " +
    "Insgesamt hatte er in seinem Leben tausende von Zähnen!",
  sizeComparison: "So groß wie 2 Autos hintereinander!",
};

function MiniPlayer({ text, label }: { text: string; label: string }) {
  return (
    <div className="mt-1.5">
      <AudioPlayer text={text} duration={15} />
    </div>
  );
}

export function DiscoveryScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 z-10">
        <button className="w-9 h-9 flex items-center justify-center bg-surface-container-lowest border-[3px] border-on-surface rounded-lg sticker-shadow active-press">
          <span className="material-symbols-outlined text-on-surface text-lg">close</span>
        </button>
        <StatusBadge label="Neu entdeckt!" variant="warning" icon="new_releases" />
      </header>

      {/* Scrollable */}
      <main className="flex-1 overflow-y-auto px-4 pb-6 max-w-md mx-auto w-full">
        {/* Hero: Echtes Bild */}
        <div className="rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden mb-3">
          <img
            src={DINO.images.real}
            alt={`${DINO.name} — realistisch`}
            className="w-full h-48 object-cover"
          />
        </div>

        {/* Name */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black uppercase tracking-tight">{DINO.name}</h1>
            <button className="w-7 h-7 bg-surface-container-high border-2 border-outline-variant rounded-full flex items-center justify-center active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>volume_up</span>
            </button>
          </div>
          <p className="text-xs font-semibold text-on-surface-variant italic">{DINO.latin}</p>
        </div>

        {/* Main Story */}
        <div className="mb-4">
          <AudioPlayer text={DINO.mainStory} duration={35} />
        </div>

        {/* Fact Cards — each with own audio */}
        <div className="flex flex-col gap-2.5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>school</span>
            Steckbrief — tippe zum Anhören
          </p>

          {DINO.facts.map((fact) => (
            <div
              key={fact.label}
              className="bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow p-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-primary-fixed rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>{fact.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase">{fact.label}</p>
                  <p className="text-sm font-black text-on-surface">{fact.value}</p>
                  {fact.sub && <p className="text-[10px] text-on-surface-variant">{fact.sub}</p>}
                </div>
              </div>
              <MiniPlayer text={fact.story} label={fact.label} />
            </div>
          ))}
        </div>

        {/* Size Comparison */}
        <div className="bg-primary-fixed/30 rounded-lg border-[3px] border-primary/30 p-3 mb-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>directions_car</span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-primary">Größenvergleich</p>
            <p className="text-sm font-black text-on-surface">{DINO.sizeComparison}</p>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-secondary-fixed/30 rounded-lg border-[3px] border-secondary/30 p-3 mb-4">
          <p className="text-[9px] font-black uppercase tracking-wider text-secondary mb-1">Wusstest du?</p>
          <p className="text-xs font-semibold text-on-surface leading-snug mb-1.5">{DINO.funFact}</p>
          <AudioPlayer text={DINO.funFact} duration={12} />
        </div>

        {/* Forscher */}
        <div className="mb-4">
          <ForscherSpeech text="Was für ein Fund! Diesen Triceratops nehmen wir sofort mit ins Museum!" />
        </div>

        {/* Museum CTA — with Comic Dino */}
        <div className="bg-gradient-to-br from-primary-container to-[#2E7D32] rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <img
              src={DINO.images.comic}
              alt={`${DINO.name} Comic`}
              className="w-20 h-20 object-contain flex-shrink-0 drop-shadow-lg"
            />
            <div className="flex-1 text-white min-w-0">
              <p className="text-xs font-black uppercase tracking-wider text-white/70">Dein neuer Freund</p>
              <p className="text-lg font-black uppercase tracking-tight leading-tight">Ich komme ins Museum!</p>
            </div>
          </div>
          <div className="px-4 pb-4">
            <Button variant="surface" fullWidth icon="museum">
              Ab ins Museum!
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
