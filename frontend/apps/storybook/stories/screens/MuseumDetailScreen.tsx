import { Icon } from "../../../../packages/ui/src/primitives/Icon";

/**
 * Museum Detail (Dino-Vitrine)
 * - Nutzt die gleichen Elemente wie Discovery Screen
 * - Bild-Switcher (Echt/Comic/Skelett)
 * - Steckbrief + AudioPlayer
 * - Kinder-Foto (falls hochgeladen)
 * - Entdeckungsdatum
 * - Zurück-Button zur Galerie
 *
 * NOTE: Wird wahrscheinlich der Discovery Screen mit einem
 * "museum" Mode-Flag, statt ein komplett eigener Screen.
 */
export function MuseumDetailScreen() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <Icon name="museum" size="xl" filled className="text-primary-container mb-3" />
        <h1 className="text-xl font-black uppercase tracking-tight mb-2">Museum Detail</h1>
        <p className="text-xs text-on-surface-variant mb-4">
          Nutzt die gleichen Elemente wie der Discovery Screen — Bild-Switcher, Fakten-Karussell, AudioPlayer, Karten.
        </p>
        <p className="text-[10px] text-on-surface-variant">
          Zusätzlich: Kinder-Foto, Entdeckungsdatum, Sterne/Abzeichen.
        </p>
      </div>
    </div>
  );
}
