# Mini-Spiel Auswahl

## Zweck
Kind waehlt ein Mini-Spiel aus. Zeigt verfuegbare Spiele und verbleibendes Tages-Budget.

## Kontext
- Erreichbar ueber Museum oder Haupt-Navigation
- Budget-begrenzt (z.B. 3 Spiele pro Tag)
- Spiele nutzen die bereits entdeckten Dinos

## Elemente
- [ ] Ueberschrift: "Was moechtest du spielen?" (vorgelesen)
- [ ] Budget-Anzeige: "Noch 2 Spiele uebrig" (mit visuellem Indikator)
- [ ] Spiel-Karten (gross, antippbar):
  - **Dino-Quiz:** Icon + "Teste dein Wissen!"
  - **Groessen-Sortieren:** Icon + "Wer ist der Groesste?"
  - **Zeitleiste:** Icon + "Wann hat er gelebt?"
  - **Futter-Zuordnung:** Icon + "Was frisst er?"
  - **Schatten-Raten:** Icon + "Erkennst du den Schatten?"
- [ ] Jede Karte zeigt:
  - Spiel-Illustration
  - Name (vorlesbar)
  - Schwierigkeits-Indikator (optional)
  - Gesperrte Spiele: Ausgegraut mit Schloss ("Entdecke mehr Dinos!")
- [ ] Forscher-Empfehlung: "Heute koenntest du mal das Schatten-Raten probieren!"

## Verhalten
- Tap auf Spiel → Spiel startet (Lazy-Load)
- Budget = 0: Alle Karten ausgegraut, SleepyDino Hinweis
- Spiele die noch nicht genug Dinos haben: Gesperrt mit Erklaerung
- Nach Spiel-Ende: Zurueck zur Auswahl (oder Museum)

## Stimmung
- Spielerisch, bunte Auswahl
- Wie ein Spielzimmer im Museum
- Nicht ueberwaeltigend - klare, grosse Optionen
