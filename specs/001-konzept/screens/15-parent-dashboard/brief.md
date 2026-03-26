# Eltern-Dashboard

## Zweck
Ueberblick fuer Eltern: Nutzung, Kosten, Profile verwalten, Reset-Protokoll.

## Kontext
- Erreichbar ueber Zahnrad-Icon in der Spieler-Auswahl
- Geschuetzt durch gleiche Rechenaufgabe wie Reset
- Reiner Erwachsenen-Bereich

## Elemente
- [ ] **Kinder-Profile:**
  - Alle Forscher-Profile der Familie
  - Neues Kind hinzufuegen
  - Avatar, Name, Geburtsjahr bearbeiten
  - Fortschritt pro Kind (X Dinos entdeckt, Y Sterne)
- [ ] **Nutzungs-Protokoll:**
  - Wann hat welches Kind gespielt? (Kalender-Ansicht)
  - Wie lange pro Session?
  - Budget-Resets: Datum, Uhrzeit, wer hat zurueckgesetzt?
- [ ] **KI-Kosten:**
  - Kosten pro Tag / Monat
  - Aufschluesselung nach Operation (Bilder, Stories, Foto-Bewertung)
  - Aufschluesselung nach Model
  - Aktuelles Monats-Budget (falls gesetzt)
- [ ] **Einstellungen:**
  - Budget pro Kind anpassen (Expeditionen/Tag, Mini-Spiele/Tag)
  - TTS Stimme / Lautstaerke
  - Benachrichtigungen
- [ ] Zurueck-Button zur Spieler-Auswahl

## Verhalten
- Geschuetzt durch Rechenaufgabe (wie Reset)
- Tabbed Layout: Profile | Nutzung | Kosten | Einstellungen
- Daten aus Backend laden (PocketBase via Rust API)

## Stimmung
- Clean, sachlich, Erwachsenen-Design
- Dashboard-Stil (Zahlen, Charts, Listen)
- Kein Dino-Theme noetig, aber nicht haesslich
