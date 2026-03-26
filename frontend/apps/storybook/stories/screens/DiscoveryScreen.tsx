import { useState } from "react";
import { AudioPlayer } from "../../../../packages/ui/src/components/AudioPlayer";
import { ForscherSpeech } from "../../../../packages/ui/src/components/ForscherSpeech";
import { StatusBadge } from "../../../../packages/ui/src/components/StatusBadge";
import { Button } from "../../../../packages/ui/src/primitives/Button";
import { TabBar } from "../../../../packages/ui/src/primitives/TabBar";

const DINO = {
  name: "Triceratops",
  latin: "Dreihorn-Gesicht",
  period: "Kreidezeit",
  periodYears: "68–66 Mio. Jahre",
  diet: "Pflanzenfresser",
  length: "9 Meter",
  weight: "6–12 Tonnen",
  region: "Nordamerika",
  sizeComparison: "So groß wie 2 Autos!",
  funFact: "Der Triceratops hatte bis zu 800 Zähne! Sie wuchsen ständig nach, wie bei einem Hai.",
  images: {
    comic: "/dinos/triceratops/comic.png",
    real: "/dinos/triceratops/real.png",
    skeleton: "/dinos/triceratops/skeleton.png",
  },
  story:
    "Stell dir vor, vor 68 Millionen Jahren lief durch die dichten Wälder Nordamerikas ein riesiges Tier. " +
    "Es hatte drei große Hörner auf dem Kopf und einen gewaltigen Knochenschild im Nacken. " +
    "Das war der Triceratops — einer der bekanntesten Dinosaurier überhaupt! " +
    "Mit seinen Hörnern konnte er sich gegen gefährliche Raubtiere wie den T-Rex verteidigen. " +
    "Obwohl er so groß war wie zwei Autos, war er ein friedlicher Pflanzenfresser. " +
    "Er kaute den ganzen Tag Farne und Palmenblätter mit seinen 800 Zähnen. " +
    "Wenn ein Zahn abbrach, wuchs einfach ein neuer nach — wie bei einem Hai! " +
    "Forscher haben herausgefunden, dass Triceratops in Herden zusammenlebte. " +
    "Die großen Tiere beschützten die kleinen Babys in der Mitte der Gruppe. " +
    "Ist das nicht toll?",
};

const IMAGE_TABS = [
  { id: "comic", label: "Comic" },
  { id: "real", label: "Echt" },
  { id: "skeleton", label: "Skelett" },
];

export function DiscoveryScreen() {
  const [imageTab, setImageTab] = useState("comic");

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Close button */}
      <header className="flex items-center justify-between px-4 py-2 z-10">
        <button className="w-9 h-9 flex items-center justify-center bg-surface-container-lowest border-[3px] border-on-surface rounded-lg sticker-shadow active-press">
          <span className="material-symbols-outlined text-on-surface text-lg">close</span>
        </button>
        <StatusBadge label="Neu entdeckt!" variant="warning" icon="new_releases" />
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-4 pb-4 max-w-md mx-auto w-full">
        {/* Image Carousel */}
        <div className="rounded-xl border-[3px] border-on-surface sticker-shadow overflow-hidden mb-3">
          {/* Tab bar for image type */}
          <TabBar tabs={IMAGE_TABS} active={imageTab} onChange={setImageTab} />

          {/* Image */}
          <div className={`h-44 flex items-center justify-center overflow-hidden ${
            imageTab === "skeleton" ? "bg-[#2C1A0E]" : "bg-gradient-to-br from-primary-container/20 to-tertiary-container/20"
          }`}>
            <img
              src={DINO.images[imageTab as keyof typeof DINO.images]}
              alt={`${DINO.name} — ${imageTab}`}
              className={`${imageTab === "comic" ? "h-36 object-contain" : "w-full h-full object-cover"}`}
            />
          </div>
        </div>

        {/* Name + Pronunciation */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black uppercase tracking-tight">{DINO.name}</h1>
            <button className="w-7 h-7 bg-surface-container-high border-2 border-outline-variant rounded-full flex items-center justify-center active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>volume_up</span>
            </button>
          </div>
          <p className="text-xs font-semibold text-on-surface-variant italic">{DINO.latin}</p>
        </div>

        {/* Forscher Story (AudioPlayer with Karaoke) */}
        <div className="mb-3">
          <AudioPlayer
            text={DINO.story}
            duration={60}
          />
        </div>

        {/* Fact Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { icon: "calendar_month", label: "Zeitalter", value: DINO.period, sub: DINO.periodYears },
            { icon: "restaurant", label: "Nahrung", value: DINO.diet },
            { icon: "straighten", label: "Länge", value: DINO.length },
            { icon: "scale", label: "Gewicht", value: DINO.weight },
          ].map((fact) => (
            <div key={fact.label} className="bg-surface-container-lowest rounded-lg border-2 border-outline-variant p-2.5 flex items-start gap-2">
              <div className="w-7 h-7 bg-primary-fixed rounded flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "14px" }}>{fact.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-bold text-on-surface-variant uppercase">{fact.label}</p>
                <p className="text-xs font-black text-on-surface">{fact.value}</p>
                {fact.sub && <p className="text-[9px] text-on-surface-variant">{fact.sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Size Comparison */}
        <div className="bg-primary-fixed/30 rounded-lg border-2 border-primary/20 p-3 mb-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>
            directions_car
          </span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-primary">Größenvergleich</p>
            <p className="text-sm font-black text-on-surface">{DINO.sizeComparison}</p>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-secondary-fixed/30 rounded-lg border-2 border-secondary/20 p-3 mb-3">
          <p className="text-[9px] font-black uppercase tracking-wider text-secondary mb-0.5">Wusstest du?</p>
          <p className="text-xs font-semibold text-on-surface leading-snug">{DINO.funFact}</p>
        </div>

        {/* Forscher Reaction */}
        <div className="mb-4">
          <ForscherSpeech text="Unglaublich! Ein Triceratops! Den suche ich schon seit Jahren!" />
        </div>

        {/* CTA */}
        <Button variant="primary" fullWidth icon="museum">
          Ab ins Museum!
        </Button>
      </main>
    </div>
  );
}
