import { AudioPlayer } from "../components/AudioPlayer";
import { ForscherSpeech } from "../components/ForscherSpeech";
import { ImageSwitcher } from "../components/ImageSwitcher";
import { DinoHeader } from "../components/DinoHeader";
import { FactCarousel, type Fact } from "../components/FactCarousel";
import { DinoMapCarousel, buildDefaultMapCards, type MapCard } from "../components/DinoMapCarousel";
import { InteractiveDino, type FoodOption } from "../components/InteractiveDino";
import { MuseumTransition, LandScene } from "../components/museum-transition";
import { IconButton } from "../primitives/IconButton";
import { Icon } from "../primitives/Icon";

export interface DinoData {
  name: string;
  latin: string;
  period: string;
  periodStartMya?: number;
  periodEndMya?: number;
  continent: string;
  story: string;
  comicImageUrl: string;
  images: { id: string; label: string; icon: string; url: string; bg?: string; contain?: boolean }[];
  facts: Fact[];
  foodOptions?: FoodOption[];
}

export interface DiscoveryScreenProps {
  dino?: DinoData;
  mapCards?: MapCard[];
  mode?: "discovery" | "museum";
  onClose?: () => void;
  onComplete?: () => void;
  onPlayName?: () => void;
}

const DEMO_DINO: DinoData = {
  name: "Triceratops",
  latin: "Dreihorn-Gesicht",
  period: "Kreide",
  periodStartMya: 68,
  periodEndMya: 66,
  continent: "Nordamerika",
  story:
    "Stell dir vor, vor 68 Millionen Jahren lief durch die dichten Wälder Nordamerikas ein riesiges Tier. " +
    "Es hatte drei große Hörner auf dem Kopf und einen gewaltigen Knochenschild im Nacken. " +
    "Das war der Triceratops — einer der bekanntesten Dinosaurier überhaupt! " +
    "Mit seinen Hörnern konnte er sich gegen gefährliche Raubtiere wie den T-Rex verteidigen. " +
    "Obwohl er so groß war wie zwei Autos, war er ein friedlicher Pflanzenfresser.",
  comicImageUrl: "/dinos/triceratops/comic.png",
  images: [
    { id: "real", label: "Echt", icon: "photo_camera", url: "/dinos/triceratops/real.png" },
    { id: "comic", label: "Comic", icon: "brush", url: "/dinos/triceratops/comic.png", bg: "bg-gradient-to-br from-primary-fixed/30 to-tertiary-fixed/20", contain: true },
    { id: "skeleton", label: "Skelett", icon: "skeleton", url: "/dinos/triceratops/skeleton.png", bg: "bg-[#2C1A0E]" },
  ],
  facts: [
    { icon: "calendar_month", label: "Zeitalter", value: "Kreidezeit", sub: "68–66 Mio. Jahre", story: "Der Triceratops lebte ganz am Ende der Kreidezeit. Das war die allerletzte Zeit der Dinosaurier!", color: "bg-primary-fixed/40 border-primary/20" },
    { icon: "restaurant", label: "Nahrung", value: "Pflanzenfresser", story: "Obwohl er so riesig war, fraß er nur Pflanzen! Farne, Palmblätter und Büsche.", color: "bg-primary-fixed/40 border-primary/20" },
    { icon: "straighten", label: "Länge", value: "9 Meter", story: "Neun Meter lang — so lang wie zwei große Autos hintereinander!", color: "bg-tertiary-fixed/40 border-tertiary/20" },
    { icon: "scale", label: "Gewicht", value: "6–12 Tonnen", story: "So schwer wie zwei Elefanten zusammen!", color: "bg-tertiary-fixed/40 border-tertiary/20" },
    { icon: "group", label: "Verhalten", value: "Herdentier", story: "Triceratops lebte in großen Herden. Die Großen beschützten die Babys in der Mitte!", color: "bg-secondary-fixed/40 border-secondary/20" },
    { icon: "lightbulb", label: "Wusstest du?", value: "800 Zähne!", story: "800 Zähne die ständig nachwuchsen — genau wie bei einem Hai!", color: "bg-secondary-fixed/40 border-secondary/20" },
  ],
  foodOptions: [
    { id: "fern", emoji: "🌿", label: "Farn", correct: true },
    { id: "meat", emoji: "🥩", label: "Fleisch", correct: false },
    { id: "leaf", emoji: "🍃", label: "Blätter", correct: true },
  ],
};

export function DiscoveryScreen({
  dino = DEMO_DINO,
  mapCards,
  mode = "discovery",
  onClose,
  onComplete,
  onPlayName,
}: DiscoveryScreenProps = {}) {
  const cards = mapCards ?? buildDefaultMapCards(dino);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 z-10">
        <IconButton icon="close" variant="surface" label="Schließen" onClick={onClose} />
        {mode === "discovery" && (
          <span className="bg-secondary-container text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap flex items-center gap-1">
            <Icon name="new_releases" size="xs" filled />
            Neu entdeckt!
          </span>
        )}
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto pb-6 max-w-md mx-auto w-full">
        {/* Hero Image */}
        <div className="mx-4 mb-2">
          <ImageSwitcher views={dino.images} alt={dino.name} square />
        </div>

        {/* Name */}
        <DinoHeader name={dino.name} latin={dino.latin} onPlayName={onPlayName} />

        {/* Main Story */}
        <div className="mb-4 px-4">
          <AudioPlayer text={dino.story} duration={35} />
        </div>

        {/* Fact Carousel */}
        <FactCarousel facts={dino.facts} />

        {/* Map Carousel */}
        <DinoMapCarousel cards={cards} />

        {/* Interactive Dino */}
        <InteractiveDino
          name={dino.name}
          image={dino.comicImageUrl}
          foodOptions={dino.foodOptions}
        />

        {/* Forscher Hint */}
        <div className="mx-4 mb-4">
          <ForscherSpeech text="Streichle deinen neuen Freund! Und füttere ihn mit dem richtigen Futter!" />
        </div>

        {/* Museum CTA (only in discovery mode) */}
        {mode === "discovery" && (
          <div onClick={onComplete}>
            <MuseumTransition
              dinoImage={dino.comicImageUrl}
              dinoName={dino.name}
              scene={LandScene}
            />
          </div>
        )}
      </main>
    </div>
  );
}
