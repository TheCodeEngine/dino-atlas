# Eltern-Reset

## Zweck
Erwachsene koennen das Tages-Budget einmalig zuruecksetzen durch Loesen einer Rechenaufgabe.

## Kontext
- Erreichbar ueber "Muede Dinos" Screen (dezenter Link)
- Kindersicher: 4-Jaehriger kann das nicht loesen
- Wird protokolliert

## Elemente
- [ ] Ueberschrift: "Erwachsenen-Bereich"
- [ ] Erklaerung: "Loese die Aufgabe um die Dinos aufzuwecken"
- [ ] Rechenaufgabe (wechselnd):
  - "Was ist 7 x 8?"
  - "Was ist 12 x 9?"
  - "Was ist 156 - 89?"
  - Immer kleines Einmaleins oder aehnlich
- [ ] Nummern-Eingabefeld (gross)
- [ ] "Aufwecken!" Button
- [ ] Hinweis: "1x pro Tag moeglich. Wird protokolliert."
- [ ] "Abbrechen" Link (zurueck zu Muede Dinos)

## Verhalten
- Falsche Antwort: "Das stimmt leider nicht. Versuch es nochmal." (neue Aufgabe)
- Richtige Antwort:
  - Dinos wachen auf (Animation: Gaehnen, Strecken, Aufstehen)
  - Forscher: "Professor hat die Dinos geweckt! Noch eine Runde!"
  - Budget wird zurueckgesetzt
  - Log-Eintrag: Datum, Uhrzeit, welches Kind, welcher User
- Nur 1x pro Tag moeglich. Danach: "Heute schon zurueckgesetzt."

## Stimmung
- Sachlich, Erwachsenen-Design (weniger verspielt als Rest)
- Schnell und unkompliziert
- Klar: "Das ist fuer Eltern, nicht fuer Kinder"
