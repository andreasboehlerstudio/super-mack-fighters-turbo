# Deutschland: Bodenperspektive

Das eingebaute Imagegen-Tool überarbeitet die bestehende Deutschland-Arena.
Originalausgabe: `original.png`; vollständiger Prompt: `prompt.json`.

Flacher Vorplatz mit ruhigerem Pflaster, mehr Tiefe vor den Fassaden und einer
durchgängigen horizontalen Kampflinie. Keine Personen im Hintergrundbild.
Die separaten Zuschauer stehen bei y=418 hinter der Kampflinie y=445.

Verlustfreier WebP-Export: `public/assets/arenas/park-1-perspective-v2.webp`.
`node scripts/build-runtime-art.mjs` erzeugt 960 × 540 für das Spiel und
160 × 90 für Vorschaubilder mit Nearest-Neighbour. Die zentrale Arenazuordnung
verwendet den neuen Dateinamen auch für Auswahl, Versus, Endsequenzen und Sound-Test.
Das alte Bild bleibt als Referenz erhalten.
