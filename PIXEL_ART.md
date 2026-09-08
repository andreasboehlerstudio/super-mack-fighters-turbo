# Gemeinsame Pixel-Ausgabe

Die Spielgrafik wird auf 480 × 270 Bildpunkten ausgegeben. Kämpfe, Hintergründe,
Besucher und Effekte teilen denselben Framebuffer. Figuren behalten ihre 256er
Quellzellen und ihre Körpergröße; die Kamera bildet sie auf 128 × 128 Bildpunkte ab.
Parkwelt, Titel und Endings verwenden dasselbe Ausgaberaster. Der Browser skaliert
den fertigen Bildschirm mit Nearest-Neighbour auf ganze physische Pixel.

Menübilder und Portraits werden durch `PixelArt` passend zu ihrer sichtbaren Größe
in derselben Pixeldichte gezeichnet. Der Atlas wird beim Zoomen neu abgetastet.
Bedientexte bleiben zugängliche HTML-Elemente. Originaldateien bleiben erhalten.

Das vereinheitlicht das technische Raster. Bereits in einer Vorlage gemalte große
Farbflächen, unterschiedliche Schattierungen und anatomische Stile werden dadurch
nicht automatisch neu gezeichnet. Solche Abweichungen brauchen weiterhin eine
gezielte künstlerische Überarbeitung mit derselben Referenz. Ein 32-Bit-Etikett
allein legt weder eine Auflösung noch eine Pixelgröße fest.

## Reproduzierbarer Abgleich

`node --experimental-strip-types scripts/audit-pixel-grid.mjs` prüft alle
40 Figuren inklusive Endgegner und alle 17 Clips. Messwerte und vier Portrait-
Vergleichstafeln liegen anschließend in `../work/pixel-audit/`.
`scripts/audit-animation-assets.mjs` prüft alle 2.440 Posen auf fehlende Zeichnungen
und erzeugt Vergleichstafeln für Stand, Lauf und Tritt. Die Messwerte sind keine
automatische Bewertung des Zeichenstils.
