# Pixel-Parkatlas

Vier eigens mit Imagegen illustrierte Europa-Park-Ansichten, erreichbar unter `/park-atlas` und in der Arcade-Tour über die Karte.

- Mausrad oder Plus/Minus: 100–400 % Zoom; der Punkt unter dem Mauszeiger bleibt beim Zoomen an seiner Position.
- Ziehen, zwei Finger oder Pfeiltasten: Kartenausschnitt verschieben.
- Übersicht oder Taste 0: ganze Karte einpassen.
- Markierungen und Themenbereich-Auswahl: den ausgewählten Bereich bei 240 % fokussieren.
- Vier Kartenvarianten: klassische Oberwelt, kompakte Spielkarte, grüne Parklandschaft und Abendzauber.
- Im Arcade-Atlas kennzeichnen Tourziel und besuchte Bereiche den Fortschritt. „Laufwege“ öffnet die Übersicht derselben begehbaren Spielwelt mit dem aktuellen Weg.

Die erste Illustration ist jetzt die begehbare Spielwelt: Ihr Wegenetz wurde an den sichtbaren Pflasterwegen nachgezeichnet. Alle 21 Arena-Eingänge sind verbunden; die echte Spielerposition erscheint auch in der ersten Atlasansicht. Die anderen drei Ansichten bleiben alternative Illustrationen. Die Anordnung ist künstlerisch vereinfacht und nicht geografisch maßstabsgetreu. Vergrößert werden die vorhandenen Pixel; beim Zoomen wird keine zusätzliche Geometrie generiert.

Alle 21 Themenbereiche folgen der [offiziellen Europa-Park-Übersicht](https://www.europapark.de/de/freizeitpark/attraktionen/themenbereiche), einschließlich Monaco und der drei Fantasiebereiche. Kleine Flaggen in Variante 2 wurden bereinigt; Variante 3 erhielt das fehlende Schild „Königreich der Minimoys“.

Technik: `ParkAtlas.tsx` für Bedienung und Markierungen; `atlas-camera.ts` für Zoomanker und Begrenzungen. Die Bilder liegen unter `public/assets/atlas/`. Die Kamera hat Tests für Übersicht, Zoomanker und Randbegrenzungen. Der Player-Select nutzt eine eigene Anordnung mit 21 senkrechten 3:4-Kacheln.
