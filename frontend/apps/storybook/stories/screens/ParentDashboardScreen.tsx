import { useState } from "react";
import { TopBar } from "../../../../packages/ui/src/components/TopBar";
import { TabBar } from "../../../../packages/ui/src/primitives/TabBar";
import { Icon } from "../../../../packages/ui/src/primitives/Icon";

/**
 * Eltern-Dashboard
 * - Kinder-Profile verwalten
 * - Nutzungs-Protokoll (wann, wie lange)
 * - KI-Kosten Übersicht
 * - Budget-Einstellungen
 */
export function ParentDashboardScreen() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <TopBar title="Eltern" />
      <main className="pt-14 max-w-lg mx-auto">
        <TabBar
          tabs={[
            { id: "profile", label: "Profile" },
            { id: "usage", label: "Nutzung" },
            { id: "costs", label: "KI-Kosten" },
            { id: "settings", label: "Optionen" },
          ]}
          active={tab}
          onChange={setTab}
        />

        <div className="p-4">
          {tab === "profile" && (
            <div className="space-y-3">
              {["Oskar (6)", "Karl (4)", "Charlotte (4)"].map((name) => (
                <div key={name} className="bg-surface-container-lowest rounded-lg border-[3px] border-on-surface sticker-shadow p-3 flex items-center justify-between">
                  <span className="text-sm font-black">{name}</span>
                  <span className="text-[10px] text-on-surface-variant">4 Dinos entdeckt</span>
                </div>
              ))}
            </div>
          )}
          {tab === "usage" && (
            <div className="text-center text-sm text-on-surface-variant py-8">
              <Icon name="analytics" size="xl" className="mb-2" />
              <p className="font-bold">Nutzungs-Protokoll</p>
              <p className="text-xs mt-1">Kalender + Session-Zeiten</p>
            </div>
          )}
          {tab === "costs" && (
            <div className="text-center text-sm text-on-surface-variant py-8">
              <Icon name="payments" size="xl" className="mb-2" />
              <p className="font-bold">KI-Kosten: $0.42 / Monat</p>
              <p className="text-xs mt-1">Bilder, Stories, Foto-Bewertung</p>
            </div>
          )}
          {tab === "settings" && (
            <div className="text-center text-sm text-on-surface-variant py-8">
              <Icon name="settings" size="xl" className="mb-2" />
              <p className="font-bold">Budget & Einstellungen</p>
              <p className="text-xs mt-1">Expeditionen/Tag, TTS-Stimme</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
