import { useState, useRef } from "react";
import { AudioPlayer } from "../../../../packages/ui/src/components/AudioPlayer";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { StatusBadge } from "../../../../packages/ui/src/components/StatusBadge";
import { Button } from "../../../../packages/ui/src/primitives/Button";

const DINO = {
  name: "Triceratops",
  latin: "Dreihorn-Gesicht",
  region: "Nordamerika",
  regionCoords: { top: "35%", left: "20%" },
  images: {
    real: "/dinos/triceratops/real.png",
    comic: "/dinos/triceratops/comic.png",
  },
  mainStory:
    "Stell dir vor, vor 68 Millionen Jahren lief durch die dichten Wälder Nordamerikas ein riesiges Tier. " +
    "Es hatte drei große Hörner auf dem Kopf und einen gewaltigen Knochenschild im Nacken. " +
    "Das war der Triceratops — einer der bekanntesten Dinosaurier überhaupt! " +
    "Mit seinen Hörnern konnte er sich gegen gefährliche Raubtiere wie den T-Rex verteidigen. " +
    "Obwohl er so groß war wie zwei Autos, war er ein friedlicher Pflanzenfresser.",
  facts: [
    {
      icon: "calendar_month", label: "Zeitalter", value: "Kreidezeit", sub: "68–66 Mio. Jahre",
      color: "bg-primary-fixed border-primary/30",
      story: "Der Triceratops lebte ganz am Ende der Kreidezeit. Das war die allerletzte Zeit der Dinosaurier! Kurz nachdem der Triceratops ausgestorben ist, schlug ein riesiger Asteroid auf der Erde ein. Damit endete die Zeit aller großen Dinosaurier.",
    },
    {
      icon: "restaurant", label: "Nahrung", value: "Pflanzenfresser",
      color: "bg-primary-fixed border-primary/30",
      story: "Obwohl der Triceratops so riesig und stark aussah, fraß er nur Pflanzen! Am liebsten mochte er Farne, Palmblätter und kleine Büsche. Mit seinem scharfen Schnabel konnte er sogar harte Äste abknipsen.",
    },
    {
      icon: "straighten", label: "Länge", value: "9 Meter",
      color: "bg-tertiary-fixed border-tertiary/30",
      story: "Neun Meter lang — das ist so lang wie zwei große Autos hintereinander! Allein sein Kopf mit dem Knochenschild war über zwei Meter lang. Das ist größer als ein erwachsener Mensch!",
    },
    {
      icon: "scale", label: "Gewicht", value: "6–12 Tonnen",
      color: "bg-tertiary-fixed border-tertiary/30",
      story: "Der Triceratops wog so viel wie zwei große Elefanten zusammen! Trotzdem konnte er überraschend schnell rennen. Forscher glauben bis zu 30 Kilometer pro Stunde!",
    },
    {
      icon: "group", label: "Verhalten", value: "Herdentier",
      color: "bg-secondary-fixed border-secondary/30",
      story: "Der Triceratops lebte in großen Herden zusammen. Die großen starken Tiere beschützten die kleinen Babys in der Mitte. Genau wie es heute Elefanten machen!",
    },
    {
      icon: "lightbulb", label: "Wusstest du?", value: "800 Zähne!",
      color: "bg-secondary-fixed border-secondary/30",
      story: "Der Triceratops hatte bis zu 800 Zähne! Wenn ein Zahn abbrach, wuchs einfach ein neuer nach — genau wie bei einem Hai. Insgesamt hatte er in seinem Leben tausende von Zähnen!",
    },
  ],
  sizeComparison: "So groß wie 2 Autos hintereinander!",
};

export function DiscoveryScreen() {
  const [activeFact, setActiveFact] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      <main className="flex-1 overflow-y-auto pb-6 max-w-md mx-auto w-full">
        {/* Hero: Echtes Bild */}
        <div className="mx-4 rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden mb-3">
          <img src={DINO.images.real} alt={DINO.name} className="w-full h-48 object-cover" />
        </div>

        {/* Name */}
        <div className="text-center mb-3 px-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black uppercase tracking-tight">{DINO.name}</h1>
            <button className="w-7 h-7 bg-surface-container-high border-2 border-outline-variant rounded-full flex items-center justify-center active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>volume_up</span>
            </button>
          </div>
          <p className="text-xs font-semibold text-on-surface-variant italic">{DINO.latin}</p>
        </div>

        {/* Main Story */}
        <div className="mb-4 px-4">
          <AudioPlayer text={DINO.mainStory} duration={35} />
        </div>

        {/* Fact Carousel */}
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1 px-4 mb-2">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>school</span>
            Steckbrief — wische durch
          </p>

          {/* Horizontal scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none" }}
            onScroll={() => {
              if (!scrollRef.current) return;
              const idx = Math.round(scrollRef.current.scrollLeft / (scrollRef.current.scrollWidth / DINO.facts.length));
              setActiveFact(Math.min(idx, DINO.facts.length - 1));
            }}
          >
            {DINO.facts.map((fact) => (
              <div
                key={fact.label}
                className={`flex-shrink-0 w-[280px] snap-center rounded-xl border-[3px] ${fact.color} p-3`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-on-surface/10">
                    <span className="material-symbols-outlined text-on-surface" style={{ fontSize: "20px" }}>{fact.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold text-on-surface-variant uppercase">{fact.label}</p>
                    <p className="text-base font-black text-on-surface">{fact.value}</p>
                    {fact.sub && <p className="text-[10px] text-on-surface-variant">{fact.sub}</p>}
                  </div>
                </div>
                <AudioPlayer text={fact.story} duration={15} />
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-1.5 mt-2">
            {DINO.facts.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeFact ? "w-4 bg-primary-container" : "w-1.5 bg-outline-variant"
                }`}
              />
            ))}
          </div>
        </div>

        {/* World Map — where did it live? */}
        <div className="mx-4 mb-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>public</span>
            Wo hat er gelebt?
          </p>
          <div className="relative bg-surface-container-lowest rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden h-36">
            {/* Simplified world map SVG */}
            <svg viewBox="0 0 400 200" className="w-full h-full" style={{ fill: "#e5e2da", stroke: "#c0c9bb", strokeWidth: 0.5 }}>
              {/* Simplified continents */}
              <ellipse cx="100" cy="80" rx="55" ry="50" /> {/* Americas */}
              <ellipse cx="100" cy="140" rx="30" ry="35" /> {/* South America */}
              <ellipse cx="210" cy="75" rx="30" ry="40" /> {/* Europe */}
              <ellipse cx="250" cy="100" rx="45" ry="50" /> {/* Africa */}
              <ellipse cx="300" cy="70" rx="50" ry="45" /> {/* Asia */}
              <ellipse cx="340" cy="155" rx="30" ry="25" /> {/* Australia */}
            </svg>
            {/* Pin */}
            <div
              className="absolute flex flex-col items-center"
              style={{ top: DINO.regionCoords.top, left: DINO.regionCoords.left, transform: "translate(-50%, -100%)" }}
            >
              <div className="w-7 h-7 bg-secondary-container border-[3px] border-on-surface rounded-full flex items-center justify-center sticker-shadow">
                <span className="material-symbols-outlined text-white" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>location_on</span>
              </div>
              <span className="bg-on-surface text-white px-1.5 py-0.5 text-[8px] font-black uppercase rounded mt-0.5">{DINO.region}</span>
            </div>
          </div>
        </div>

        {/* Size Comparison */}
        <div className="mx-4 bg-primary-fixed/30 rounded-lg border-[3px] border-primary/30 p-3 mb-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>directions_car</span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-primary">Größenvergleich</p>
            <p className="text-sm font-black text-on-surface">{DINO.sizeComparison}</p>
          </div>
        </div>

        {/* Forscher */}
        <div className="mx-4 mb-4">
          <ForscherSpeech text="Was für ein Fund! Diesen Triceratops nehmen wir sofort mit ins Museum!" />
        </div>

        {/* Museum CTA with Comic Dino */}
        <div className="mx-4 bg-gradient-to-br from-primary-container to-[#2E7D32] rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <img src={DINO.images.comic} alt={`${DINO.name} Comic`} className="w-20 h-20 object-contain flex-shrink-0 drop-shadow-lg" />
            <div className="flex-1 text-white min-w-0">
              <p className="text-xs font-black uppercase tracking-wider text-white/70">Dein neuer Freund</p>
              <p className="text-lg font-black uppercase tracking-tight leading-tight">Ich komme ins Museum!</p>
            </div>
          </div>
          <div className="px-4 pb-4">
            <Button variant="surface" fullWidth icon="museum">Ab ins Museum!</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
