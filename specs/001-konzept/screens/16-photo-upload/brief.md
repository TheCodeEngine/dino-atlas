# Foto-Upload

## Zweck
Kind fotografiert sein Kunstwerk (Zeichnung, Knete, Lego) und bekommt KI-Feedback.

## Kontext
- Wird geoeffnet nachdem Kind offline gemalt/gebastelt hat
- Zaehlt nicht als Bildschirmzeit-Session (nur kurz oeffnen)
- Ergebnis landet in der Museum-Vitrine

## Elemente
- [ ] Forscher: "Zeig mir was du gemalt hast! Ich bin so gespannt!"
- [ ] Kamera-Vorschau (gross, Vollbild)
- [ ] Ausloese-Button (gross, kindgerecht)
- [ ] Nach Foto:
  - Vorschau des Fotos
  - "Nochmal?" Button (neues Foto)
  - "Zeig dem Forscher!" Button (Upload)
- [ ] Ladebalken waehrend KI analysiert
- [ ] KI-Feedback (Forscher-Sprechblase):
  - "Wow, dein T-Rex hat riesige Zaehne! Genau wie der echte!"
  - "Oh, der hat ja blaue Schuppen - das waere ein ganz besonderer Triceratops!"
  - "Die Fluegel sind toll geworden! Fast so gross wie beim echten Pteranodon!"
- [ ] TTS: Feedback wird vorgelesen
- [ ] "Ab ins Museum!" Button (speichert Foto in der Vitrine)
- [ ] Referenz-Bild des echten Dinos klein in der Ecke

## Verhalten
- Kamera oeffnet direkt (keine Galerie-Auswahl - soll ja das gerade Gemalte sein)
- Upload + KI-Analyse dauert 3-10 Sek (Ladebalken)
- Feedback ist IMMER positiv und ermutigend, nie kritisch
- Foto wird in Museum-Vitrine neben dem echten Dino gespeichert
- Kurzer Flow: Foto → Feedback → Museum → Fertig

## Stimmung
- Aufgeregt! "Ich will dem Forscher zeigen was ich gemalt habe!"
- Stolz auf das eigene Kunstwerk
- Forscher ist beeindruckt und begeistert (immer!)
