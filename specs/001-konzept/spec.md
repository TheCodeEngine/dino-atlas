# Dino-Atlas - Konzept

> Eine interaktive Dino-Lern-App fuer Kinder, die Bildschirmzeit begrenzt, echtes Lernen foerdert und Offline-Aktivitaeten einbindet.

## 1. Zielgruppe & Spieler

### Die Familie
- **Oskar (6 Jahre):** Kann erste Woerter lesen, versteht komplexere Zusammenhaenge, mag Herausforderungen.
- **Karl (4 Jahre, Zwilling):** Kann noch nicht lesen, braucht vollstaendige Sprachausgabe. Ist aber sehr fit bei Puzzles und interaktiven Aufgaben - braucht nicht unbedingt weniger Schwierigkeit, nur andere Darstellung (Bilder statt Text).
- **Charlotte (4 Jahre, Zwilling):** Gleiche Voraussetzungen wie Karl.

### Familien-System
- Eine Familie wird angelegt mit festen Forscher-Profilen fuer jedes Kind
- Beim Start: "Wer ist heute dabei?" - Forscher-Avatare der Kinder auswaehlen
- Jedes ausgewaehlte Kind bekommt seine eigene Expedition pro Tag
- Vermeidet Streit: Jeder hat seinen eigenen Dino zum Ausbuddeln
- Eigenes Museum, eigener Fortschritt, eigene adaptive Schwierigkeit pro Kind

### Schwierigkeitsgrad
- **Adaptiv pro Kind**, nicht starr nach Alter
- Passt sich automatisch an: Wird ein Kind besser, steigt die Herausforderung
- Karl ist z.B. bei Puzzles auf Oskar-Niveau - das System erkennt das
- Grundregel: Alles wird vorgelesen (TTS), Bilder statt Text wo moeglich
- Quiz-Optionen, Puzzle-Teile, Hinweise skalieren pro Kind individuell

---

## 2. Tagesrhythmus - "Der Forscher-Tag"

Die App strukturiert sich bewusst in kurze Sessions mit Offline-Pausen dazwischen.

### Nachmittags-Expedition (nach dem Kindergarten, ca. 10-15 Min)
1. **Expedition starten:** Jedes angemeldete Kind bekommt einen eigenen Grabungsort
2. **Ausbuddeln:** Mit dem Finger ueber den Bildschirm wischen, Erde/Sand wird freigelegt
3. **Skelett-Puzzle:** Die freigelegten Knochen muessen zusammengesetzt werden
4. **Dino erraten:** Skelett wird gezeigt - welcher echte Dino steckt dahinter? (Bilder zur Auswahl)
5. **Entdeckung!** Der Dino wird mit echtem Bild + Comic-Version enthuellt
6. **Steckbrief:** Kurze Fakten (vorgelesen), Dino landet im Museum
7. **Offline-Auftrag:** "Male deinen T-Rex und fotografiere ihn!" - Das Bild kommt ins Museum neben den echten Dino

> Bildschirm aus, Malstifte raus! Die App ist bewusst "fertig" und draengt nicht zum Weiterspielen.

### Abend-Session (z.B. vor dem Schlafen, ca. 5-10 Min)
- **Dino-Geschichte:** KI-generierte Gute-Nacht-Geschichte mit dem Dino des Tages als Hauptfigur
- **Mini-Quiz:** 3-5 Fragen zum Dino des Tages (Was frisst er? Wo hat er gelebt? Wie gross war er?)
- **Museum besuchen:** Eigene Sammlung anschauen, Dinos vergleichen
- **Zusammen-Modus:** Eltern/Geschwister hoeren die Geschichte zusammen, Quiz wird zum Familien-Ratespiel

---

## 3. Kern-Features

### 3.1 Ausbuddeln (Excavation)
- Vollbild-Grabungsfeld mit Sand/Erde-Textur
- Kind wischt mit Finger, darunter erscheint nach und nach ein Skelett
- Haptisches Feedback (Vibration) wenn Knochen freigelegt werden
- Verschiedene "Boeden": Wueste, Eis, Dschungel, Unterwasser - je nach Fundort des echten Dinos
- Sound-Design: Kratzen, Klopfen, Jubel-Sounds

### 3.2 Skelett-Puzzle
- Nach dem Ausbuddeln: Knochen sind "durcheinander"
- Kind zieht Knochen an die richtige Stelle
- Schwierigkeit adaptiv: Teile-Anzahl und Hilfen passen sich an das Kind an
- Wenn fertig: Skelett "erwacht zum Leben" - Animation vom Skelett zum echten Dino

### 3.3 Dino-Erkennung / Zuordnung
- Skelett wird gezeigt, dazu mehrere echte Dino-Bilder
- Kind muss den richtigen Dino auswaehlen
- Bei falsch: Hinweise statt Bestrafung ("Schau mal, dieser Dino hat einen langen Hals...")
- Bei richtig: Konfetti, Jubel, Dino-Ruf

### 3.4 Dino-Museum (Sammlung)
- Persoenliches Museum pro Kind
- Jeder entdeckte Dino bekommt eine "Vitrine" mit:
  - Echtes Bild (generiert via Gemini)
  - Comic-Version fuer Kids
  - Skelett-Ansicht
  - Vom Kind gemaltes Bild (fotografiert)
  - Steckbrief (Name, Groesse, Gewicht, Nahrung, Zeitalter, Fundort)
  - Groessenvergleich (z.B. "So gross wie 2 Autos!")
- Museum als Galerie/Scroll-Ansicht (Umfang abhaengig davon was wir im Web gebaut bekommen)
- Sonder-Vitrinen fuer seltene Dinos

### 3.5 KI-Geschichten (Zusammen-Modus)
- Generiert mit Gemini, personalisiert auf:
  - Die Dinos des Tages (jedes Kind hat einen anderen entdeckt)
  - Interessen der Kinder (merkt sich die App: "Oskar mag Fleischfresser", "Karl liebt fliegende Dinos")
- **Kombinations-Geschichte:** Jeder Forscher hat einen Teil der Geschichte beigesteuert (basierend auf seinem Tages-Dino), die Teile werden zu einer gemeinsamen Geschichte verwoben
  - Z.B.: Oskars T-Rex trifft auf Karls Triceratops und Charlottes Pteranodon - was passiert?
- Vorgelesen durch Forscher-Stimme (TTS)
- Interaktive Elemente: "Was glaubt ihr, was passiert als naechstes?" - Pause, dann weiter
- Familienfreundlich: Eltern koennen zuhoeren oder mitlesen
- Laenge: ca. 3-5 Minuten

### 3.6 Mini-Spiele
- **Dino-Quiz:** Fragen mit Bildern + Vorlesefunktion (z.B. Knochen sehen, Dino benennen)
- **Groessen-Sortieren:** Dinos der Groesse nach anordnen
- **Zeitleiste:** Dinos ins richtige Erdzeitalter einordnen (visuell, nicht text-basiert)
- **Futter-Zuordnung:** Was frisst welcher Dino? (Pflanzen, Fleisch, Fisch)
- **Schatten-Raten:** Dino-Silhouette erkennen
- Mini-Spiele belohnen mit Sternen/Abzeichen fuers Museum

**Wann spielbar:**
- Mini-Spiele sind jederzeit ueber das Museum zugaenglich (nicht session-gebunden)
- **Aber begrenzt:** Pro Tag ein Budget an Spielen (z.B. 3 Mini-Spiele pro Kind)
- Alternativ: Mini-Spiele werden durch Expeditionen freigeschaltet (neuer Dino = neues Quiz ueber ihn)
- Kein Endlos-Modus - nach dem Budget: "Morgen kannst du wieder spielen!"

### 3.7 Offline-Auftraege
- Nach jeder Expedition: Eine kreative Aufgabe ohne Bildschirm
- Beispiele:
  - "Male deinen T-Rex!" (Foto kommt ins Museum)
  - "Baue einen Dino aus Lego/Knete!"
  - "Wie gross war ein Brachiosaurus? Miss mal im Garten nach!"
  - "Finde draussen einen Stein der aussieht wie ein Dino-Ei!"
- Verbindet digitales Lernen mit echtem Erleben

**Beweis-System:**
- Der Forscher-Charakter gibt den Auftrag: "Ich brauche einen Beweis! Fotografiere dein Ergebnis!"
- Kind oeffnet die App kurz zum Fotografieren (zaehlt nicht als Session, nur Kamera-Funktion)
- **KI bewertet das Foto:** Gemini analysiert das Bild und gibt kindgerechtes Feedback
  - "Wow, dein T-Rex hat riesige Zaehne! Genau wie der echte!"
  - "Oh, der hat ja blaue Schuppen - das waere ein ganz besonderer T-Rex!"
- Foto + KI-Bewertung landen in der Museum-Vitrine neben dem echten Dino
- Motivation: Nicht "richtig/falsch" sondern immer positiv + lehrreich

---

## 4. Der Forscher-Charakter

- Ein freundlicher Dino-Forscher/Forscherin als Guide durch die App
- Spricht alle Texte (TTS), erklaert, ermutigt, erzaehlt
- Reagiert auf Entdeckungen: "Wow, ein Triceratops! Den habe ich schon so lange gesucht!"
- Stellt Quiz-Fragen in Gespraechsform
- Gibt die Offline-Auftraege: "Koenntest du mir den mal aufmalen? Ich wuerde ihn so gerne sehen!"
- Einheitliche, warme Stimme die Vertrauen schafft

---

## 5. Lern-Inhalte

### Dino-Wissen
- Dino-Namen (deutsch + lateinisch, z.B. "Dreihorn-Gesicht - Triceratops")
- Erdzeitalter: Trias, Jura, Kreide (visuell dargestellt)
- Ernaehrung: Pflanzenfresser, Fleischfresser, Allesfresser
- Lebensraum: Wo auf der Welt sie gelebt haben (einfache Weltkarte)
- Groessenvergleiche: Immer relativ zu Dingen die Kinder kennen

### Spielerisches Lernen
- Kein "Unterricht"-Gefuehl, alles eingebettet in die Expedition
- Wiederholung durch Quiz und Museum-Besuche
- Schwierigkeit passt sich an: Wird ein Kind besser, kommen anspruchsvollere Fragen

---

## 6. Bildschirmzeit-Konzept

### Natuerliche Begrenzung
- **1 Expedition pro Kind pro Tag** (Nachmittags-Session, ca. 10-15 Min)
- **Mini-Spiele:** Jederzeit, aber begrenzt (z.B. 3 pro Kind pro Tag)
- **1 Abend-Session** (Geschichte + Quiz, ca. 5-10 Min)
- **Foto-Upload:** Kurzes Oeffnen zum Fotografieren zaehlt nicht als Session
- Gesamte Bildschirmzeit: ca. **20-30 Minuten pro Tag**
- Kein Endlos-Scroll, kein "Noch eine Runde?"
- Nach der Expedition: Bewusster Abschluss mit Offline-Auftrag

### Muede Dinos (kindgerechter Timer)
- Wenn das Tages-Budget aufgebraucht ist, werden die Dinos **muede**
- Animations-Uebergang: Dinos gaehnen, legen sich hin, schlafen ein
- Forscher-Charakter: "Unsere Dinos sind muede und brauchen Schlaf. Morgen sind sie wieder fit!"
- Kein hartes "Gesperrt"-Gefuehl, sondern eine Geschichte: Die Dinos brauchen Erholung
- Timer zeigt visuell: Dino schlaeft, Mond/Sterne, wird langsam heller bis morgen

### Eltern-Reset (Erwachsenen-Entsperrung)
- Ein Erwachsener kann das Tages-Budget **einmalig zuruecksetzen**
- Geschuetzt durch eine **Rechenaufgabe** (z.B. kleines Einmal-Eins: "Was ist 7 x 8?")
  - Kindersicher: Kein 4-Jaehriger loest das
  - Kein PIN den man sich merken muss
  - Wechselnde Aufgaben
- **Wird protokolliert:** Datum, Uhrzeit, welches Kind, wer hat entsperrt
- Forscher-Charakter: "Oh, Professor [Elternname] hat die Dinos geweckt! Noch eine Runde!"
- Nur 1x pro Tag moeglich (kein endloses Zuruecksetzen)
- Protokoll einsehbar fuer Eltern (damit man ehrlich bleibt / Ueberblick hat)

### Warum es trotzdem spannend bleibt
- **Vorfreude:** "Morgen wartet eine neue Expedition!" (Adventskalender-Prinzip)
- **Sammel-Motivation:** Museum waechst jeden Tag um einen Dino
- **Offline-Weiterspiel:** Malen, Basteln, Messen - die Beschaeftigung geht weiter
- **Abend-Ritual:** Geschichte wird zum festen Bestandteil der Routine
- **Muede Dinos:** Kinder akzeptieren das Limit leichter weil es eine Geschichte hat, nicht eine Sperre

---

## 7. Zusammen-Spielen

### Geschwister-Modus (Oskar + Karl + Charlotte)
- Alle drei starten ihre Expedition parallel oder nacheinander
- Jeder hat seinen eigenen Dino (kein Streit)
- Koennen danach vergleichen: "Guck mal was ich gefunden habe!"
- Museen gegenseitig besuchen

### Familien-Abend
- **Kombinations-Geschichte:** Die Dinos aller drei Kinder treffen aufeinander
- Quiz wird zum Ratespiel: Wer weiss es zuerst?
- Eltern koennen mitmachen oder zuhoeren
- Stimmung: Gemuetlich, kein Wettbewerb (oder optional doch)

---

## 8. Technische Architektur (Ueberblick)

> Detailliertes technisches Konzept folgt in `specs/002-technik/spec.md`.
> Hier nur die Richtungsentscheidungen.

### Plattform
- **iPhone + iPad** (iOS)
- React-Frontend (wie beim alten Prototyp bewaehrt, Wiederverwendung moeglich)
- Offline-faehig fuer Kern-Features (bereits generierte Inhalte)

### Architektur-Vorbild: Mathoria-Stack
- **Frontend:** React + Vite (oder Expo/React Native fuer native Haptik)
- **Backend:** Rust (Axum) als API-Gateway + Business-Logik
- **Datenbank:** PocketBase hinter dem Rust-Backend (nicht direkt vom Frontend)
- **Reverse Proxy:** Traefik (wie Mathoria) oder Caddy
- **Deployment:** Docker Compose Stack

### Modulare Mini-Game-Architektur
- Jedes Mini-Spiel als **eigenstaendiges Modul/Package** entwickelbar
- Eigene Sandbox pro Spiel fuer isoliertes Entwickeln & Testen (wie `catch-sandbox`, `dig-sandbox` im alten Prototyp, aber sauberer)
- **Storybook** fuer UI-Komponenten und Mini-Spiel-Previews
- Gemeinsame UI-Bibliothek (`@dino-atlas/ui`) fuer konsistentes Design
- Gemeinsame Types (`@dino-atlas/types`) fuer Dino-Datenmodelle
- Mini-Spiele koennen unabhaengig voneinander entwickelt und spaeter in die App integriert werden

### Content-Generierung (Gemini)
- **Dino-Bilder:** Realistische + Comic-Stil Varianten pro Dino
- **Skelett-Bilder:** Fuer Ausgrabung und Puzzle
- **Geschichten:** Personalisierte Gute-Nacht-Geschichten (on-demand, abgestimmt auf Kinder-Interessen)
- **Quiz-Fragen:** Altersgerechte Fragen mit Bild-Antworten
- **Steckbriefe:** Kindgerechte Fakten
- Content wird vorab generiert und gecached (nicht live, fuer Schnelligkeit)
- Geschichten als Ausnahme: on-demand generiert fuer Personalisierung

### Content-Pipeline
- Dino-Datenbank mit ~50-100 Dinos als Startset
- Fuer jeden Dino: Bilder, Fakten, Quiz-Fragen vorab generieren
- Geschichten werden taeglich/on-demand generiert (personalisiert)
- Neuer Content kann regelmaessig nachgeneriert werden
- **Wiederverwendbar aus altem Prototyp:** Gemini-Image-Pipeline, Piper-TTS-Setup, Species-Seed-Daten

### TTS (Text-to-Speech)
- Forscher-Stimme fuer alle gesprochenen Inhalte
- Lokal oder Cloud-basiert (z.B. Piper TTS wie im alten Prototyp, Apple TTS, oder Gemini TTS)
- Deutsch mit korrekter Aussprache der lateinischen Dino-Namen
- Alles wird vorgelesen - auch Quiz-Antworten (wichtig fuer Karl)

### Daten-Speicherung
- Spieler-Profile in PocketBase (via Rust-Backend)
- Museum-Sammlung + Fotos
- Kinder-Interessen fuer Geschichten-Personalisierung
- Optional: Offline-Cache fuer Kern-Features

---

## 9. MVP - Was bauen wir zuerst?

### Phase 1: Kern-Loop
1. Spieler-Auswahl (Wer ist dabei?)
2. Ausbuddeln (Wisch-Mechanik)
3. Skelett-Puzzle (einfache Version)
4. Dino-Erkennung (Skelett -> echtes Bild)
5. Steckbrief + Museum (einfache Sammlung)
6. 10 vorgenerierte Dinos als Startset

### Phase 2: Geschichten & Abend-Modus
7. KI-generierte Geschichten (Gemini)
8. Forscher-Stimme (TTS)
9. Abend-Session mit Geschichte + Quiz

### Phase 3: Erweiterungen
10. Offline-Auftraege mit Foto-Upload
11. Weitere Mini-Spiele
12. Mehr Dinos (50+)
13. Weltkarte mit Fundorten
14. Erdzeitalter-Zeitleiste

---

## 10. Was wir vom alten Prototyp mitnehmen

### Bewaehrt (wiederverwenden/adaptieren)
- **Dig-Mechanik:** Canvas-basiertes Wischen zum Freilegen (FossilDigView) - Kernmechanik bleibt
- **Gemini-Image-Pipeline:** Generierung von realistischen + Comic-Dino-Bildern + Skeletten
- **Piper TTS Setup:** Lokale deutsche Sprachausgabe mit Caching
- **Species-Daten:** 10 Basis-Dinos mit Steckbriefen als Startpunkt
- **Haptik-Feedback:** Vibration bei Interaktionen (aus Catch-Sandbox)

### Nicht uebernehmen
- **Pokemon-Go-Ansatz:** Kein GPS/Map-basiertes Gameplay mehr
- **PocketBase direkt vom Frontend:** Rust-Backend dazwischen (wie Mathoria)
- **Catch-Mechanik (Werfen):** Passt nicht zum neuen Konzept (Ausbuddeln + Puzzle stattdessen)
- **PWA:** Nativ oder React Native fuer bessere Haptik und Offline-Faehigkeit

---

## 11. Offene Fragen

- [ ] React Native / Expo oder Swift/SwiftUI nativ?
- [ ] Welches TTS-System? (Piper lokal, Apple nativ, Gemini TTS?)
- [ ] Wie viele Dinos zum Start? (10 aus altem Prototyp als Basis?)
- [ ] Soll die App im App Store oder nur fuer die Familie sein?
- [ ] Monetarisierung relevant oder reines Familienprojekt?
- [ ] Animations-Stil: 2D illustriert oder 3D?
- [ ] Monorepo-Struktur: pnpm Workspaces (wie alter Prototyp) oder Turborepo?
