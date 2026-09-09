# Valentina Sachs

Spielbare Figur nach dem vom Benutzer bereitgestellten Character Sheet. Sommerliches korallrotes Wickelkleid, flache Sandalen, dunkles gewelltes Haar. Gesicht und Kleid wurden vom Benutzer freigegeben; das abschließende Portrait blickt wie Roland nach rechts.

Mit dem eingebauten Imagegen-Werkzeug erzeugt. Die acht finalen Quellen und die Prompts liegen in diesem Ordner (`prompts.json`). Die dortigen Referenzpfade dokumentieren die lokalen Eingaben der Sitzung; Originalfotos werden nicht mit veröffentlicht.

- `portrait.png`: Portraitquelle. Export auf ein 192 × 256 Raster, danach vierfach per Nearest Neighbor auf 768 × 1024.
- `idle`, `walk`, `punch`, `kick`, `airpunch`, `airkick`, `reactions`: jeweils acht gezeichnete Posen, vier Spalten und zwei Reihen, grüner Freistellhintergrund.
- Alle sieben Animationsquellen wurden für Alpha 0.2.6 in feinerem Arcade-Stil neu gezeichnet, orientiert an Michael Mack und Snorri: kleinere Farbflächen, feinere Gesichtskonturen und mehr Kleidfalten. Das Portrait bleibt erhalten.
- Spieltexturen: 256 × 256 je Pose, ohne zusätzliche Reduktion auf 2 × 2 Blöcke. Nearest-Neighbour-Sampling, feste Standhöhe und Bodenanker. Jedes Animationsblatt wird gemeinsam kalibriert; einzelne Spielposen werden zur Laufzeit nicht skaliert.
- 17 separate verlustfreie WebP-Dateien in `public/assets/animations/valentina/`; kompatible Atlanten in `public/assets`, `walk` und `motion`.

Neu exportieren (im Repository): `node --experimental-strip-types scripts/pack-karsten-edda.mjs valentina`.

Validierung: native Details in allen Spielclips, Portraitraster, transparente Ränder, Bodenanker, acht unterschiedliche Posen pro Blatt und Spezialangriffe werden automatisiert geprüft.
