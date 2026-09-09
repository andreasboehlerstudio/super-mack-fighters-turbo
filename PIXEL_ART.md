# Gemeinsame Pixel-Ausgabe

Die Spielgrafik wird ab Alpha 0.2.6 auf 960 × 540 Bildpunkten ausgegeben. Kämpfe, Hintergründe,
Besucher und Effekte teilen denselben Framebuffer. Figuren behalten ihre 256er
Quellzellen und ihre Körpergröße; die Kamera bildet sie auf 256 × 256 Bildpunkte ab.
Jans grüne Riesenform verwendet eigene 384er Zellen bei derselben Pixeldichte.
Parkwelt, Titel und Endings verwenden dasselbe Ausgaberaster. Der Browser skaliert
den fertigen Bildschirm mit Nearest-Neighbour auf ganze physische Pixel.

Menübilder und Portraits werden durch `PixelArt` passend zu ihrer sichtbaren Größe
in derselben Pixeldichte gezeichnet. Der Atlas wird beim Zoomen neu abgetastet.
Bedientexte bleiben zugängliche HTML-Elemente. Originaldateien bleiben erhalten.

`node scripts/build-runtime-art.mjs` erzeugt die kompakten WebP-Dateien unter
`public/assets/runtime`: Portraits in 384 × 512, Auswahlkacheln in 192 × 256,
Arenen in 960 × 540 und Ortskacheln in 160 × 90. Nearest-Neighbour und verlustfreie
Kompression vermeiden neue weiche Kanten. Große Dateien werden nur für die
gewählte Vorschau benötigt. Der Bildcache teilt bereits geladene Portraits zwischen
Auswahl, Versus und HUD; die Parkübersicht lädt nicht mehr die große Detailkarte.

Das vereinheitlicht das technische Raster. Bereits in einer Vorlage gemalte große
Farbflächen, unterschiedliche Schattierungen und anatomische Stile werden dadurch
nicht automatisch neu gezeichnet. Solche Abweichungen brauchen weiterhin eine
gezielte künstlerische Überarbeitung mit derselben Referenz. Ein 32-Bit-Etikett
allein legt weder eine Auflösung noch eine Pixelgröße fest.

## Reproduzierbarer Abgleich

`node --experimental-strip-types scripts/audit-pixel-grid.mjs` prüft alle
41 Figuren inklusive Endgegner und alle 17 Clips. Messwerte und vier Portrait-
Vergleichstafeln liegen anschließend in `../work/pixel-audit/`.
`scripts/audit-animation-assets.mjs` prüft die normalen Figuren auf fehlende Zeichnungen
und erzeugt Vergleichstafeln für Stand, Lauf und Tritt. Die Messwerte sind keine
automatische Bewertung des Zeichenstils.

Jans zusätzliche Form wird in den Asset-Tests gesondert mit 384er Zellen geprüft.
Ihre Stand- und Laufbilder sind separat gezeichnet. Spezial- und Reaktionsclips
verwenden vorerst Standposen; diese Alpha-Einschränkung steht beim Quellmaterial.
Valentinas sieben Bewegungsblätter wurden für Alpha 0.2.6 auch künstlerisch feiner
neu gestaltet. Ihr Portrait bleibt unverändert.
