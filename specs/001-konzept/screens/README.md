# Dino-Atlas - Screen Designs

## Was ist Dino-Atlas?

Eine Lern-App fuer Kinder (4-7 Jahre) rund um Dinosaurier. Die Kinder sind **Dino-Forscher** die taeglich eine Expedition machen: Skelette ausbuddeln, Puzzles loesen, Dinos erkennen und ihre Sammlung im eigenen Museum aufbauen. Abends gibt es eine KI-generierte Gute-Nacht-Geschichte mit den entdeckten Dinos.

## Zielgruppe

- **Oskar (6):** Kann erste Woerter lesen, mag Herausforderungen.
- **Karl & Charlotte (4, Zwillinge):** Koennen noch nicht lesen, sehr fit bei Puzzles. Alles muss vorgelesen werden (TTS).
- **Eltern:** Begleiten, spielen mit, kontrollieren Bildschirmzeit.

## Design-Prinzipien

- **Kindgerecht:** Grosse Touch-Targets (min 48px), klare Farben, wenig Text, viele Bilder
- **Warm & einladend:** Erdtoene, Gruen, Sand - wie eine echte Ausgrabungsstaette
- **Kein Stress:** Nie "falsch!", immer ermutigend. Keine Timer die Druck machen.
- **Vorlese-freundlich:** Jeder Text hat einen TTS-Button (Lautsprecher-Icon)
- **iPad + iPhone:** Responsive, aber primaer fuer iPad (Kinder teilen sich eins)

## Der Forscher-Charakter

Ein freundlicher Dino-Forscher begleitet die Kinder durch die App. Er spricht ueber Sprechblasen, ermutigt, erklaert und gibt Auftraege. Warme, vertrauensvolle Ausstrahlung - wie ein netter Onkel/Tante der Abenteuer liebt.

## Farbwelt (Vorschlag)

- **Primaer:** Warmes Braun/Sand (Ausgrabung)
- **Sekundaer:** Satte Gruentoene (Urzeit-Dschungel)
- **Akzent:** Gold/Orange (Entdeckung!, Sterne, Abzeichen)
- **Hintergruende:** Sanfte Texturen (Sand, Erde, Stein, Blaetter)
- **Gefahr/Aufmerksamkeit:** Warmes Rot (sparsam)

## Tages-Flow (Reihenfolge der Screens)

```
Login → Spieler-Auswahl → Expedition-Intro → Ausbuddeln → Puzzle
→ Dino erkennen → Entdeckung! → Offline-Auftrag → (Pause)
→ Foto-Upload → Museum → Mini-Spiele → (Pause)
→ Gute-Nacht-Geschichte → Quiz → Muede Dinos (Schluss)
```

## Screens

Jeder Ordner enthaelt eine `brief.md` mit den Anforderungen fuer diesen Screen.

| # | Screen | Zweck | Prioritaet |
|---|--------|-------|------------|
| 01 | Spieler-Auswahl | Wer ist heute dabei? | MVP |
| 02 | Expedition Intro | Forscher erklaert den Grabungsort | MVP |
| 03 | Ausbuddeln | Wischen zum Freilegen | MVP |
| 04 | Puzzle | Skelett zusammensetzen | MVP |
| 05 | Dino erkennen | Skelett → echtes Bild raten | MVP |
| 06 | Entdeckung! | Jubel-Moment, Steckbrief | MVP |
| 07 | Offline-Auftrag | Forscher gibt Mal-/Bastelaufgabe | MVP |
| 08 | Museum | Sammlung aller Dinos | MVP |
| 09 | Museum Detail | Vitrine eines Dinos | MVP |
| 10 | Gute-Nacht-Geschichte | KI-Story mit Karaoke-Text | Phase 2 |
| 11 | Quiz | Fragen zum Dino des Tages | Phase 2 |
| 12 | Mini-Spiel Auswahl | Welches Spiel spielen? | Phase 2 |
| 13 | Muede Dinos | Budget aufgebraucht | MVP |
| 14 | Eltern-Reset | Rechenaufgabe zum Entsperren | MVP |
| 15 | Eltern-Dashboard | Kosten, Protokoll, Profile | Phase 3 |
| 16 | Foto-Upload | Offline-Auftrag Beweis | Phase 2 |
| 17 | Login | Familien-Login | MVP |
