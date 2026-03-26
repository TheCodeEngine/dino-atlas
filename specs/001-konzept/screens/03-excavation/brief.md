# Ausbuddeln (Excavation)

## Zweck
Kern-Interaktion: Kind wischt mit dem Finger ueber den Bildschirm und legt ein Dino-Skelett frei.

## Kontext
- Zentrales Gameplay-Element
- Soll sich "echt" anfuehlen wie graben
- Aus altem Prototyp bewaehrt (Canvas-basiert)

## Elemente
- [ ] Vollbild-Grabungsfeld mit Boden-Textur:
  - Wueste: Sandige Oberflaeche mit kleinen Steinen
  - Eis: Gefrorene, blaeuliche Schicht
  - Dschungel: Erde mit Blaettern und Wurzeln
  - Unterwasser: Schlammige, blaue Schicht
- [ ] Darunter verborgen: Dino-Skelett (wird Stueck fuer Stueck sichtbar)
- [ ] Fortschrittsbalken oben (wie viel % freigelegt)
- [ ] Forscher-Mini-Avatar in der Ecke mit Kommentaren:
  - "Weiter so!"
  - "Ich sehe etwas!"
  - "Das ist ein Knochen!"
- [ ] Dezenter Exit-Button (oben links)
- [ ] Haptisches Feedback bei Knochen-Freilegung (staerker als bei Erde)

## Verhalten
- Finger-Wisch entfernt Erde (runder Pinsel, ~40-50px Radius)
- Haptik: Leichte Vibration bei Erde, staerkere bei Knochen
- Sounds: Kratz-Geraeusche, Klopf-Sound bei Knochen
- Bei ~90% freigelegt: Automatischer Abschluss
- Jubel-Animation + Uebergang zum Puzzle

## Stimmung
- Konzentriert, spannend, taktil befriedigend
- "Was kommt da zum Vorschein?"
- Forscher feuert an, wird aufgeregter je mehr sichtbar wird
