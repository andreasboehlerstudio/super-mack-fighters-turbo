# Sebastian Kübler

Gesicht nach den zwei Benutzerfotos; Roland als Referenz für Portraitstil,
Bildauschnitt, rechte Dreiviertelansicht und kompakte Arcade-Proportionen.
Dunkelblaues Sakko und Hemd, graue Hose, schwarze Schuhe. Kein dauerhaftes Requisit.

Mit dem eingebauten Imagegen-Tool erzeugt. Ausgewählte Originale und Prompts
bleiben hier erhalten. Das Portrait wurde nach Gesichtskorrektur mit klareren
Pixel-Farbflächen und weniger Haut- und Stofftextur überarbeitet.

Sieben Animationsblätter mit je acht Posen, daraus 17 Spielclips.
Reaktionen: Sprung, Landung/Hocke, Block, Treffer, Spezialvorbereitung,
Spezialauslösung, Niederlage und Sieg.

Export: `node --experimental-strip-types scripts/pack-karsten-edda.mjs kuebler`
und `node scripts/build-runtime-art.mjs`. 256er Zellen, 196 Pixel Standhöhe,
feste Skalierung pro Bewegungsclip und verlustfreie WebP-Dateien.
Portrait: 192 × 256 native Pixel, Nearest-Neighbour-Export ohne Weichzeichnung.
