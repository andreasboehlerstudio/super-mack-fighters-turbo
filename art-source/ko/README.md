# Feuer-K.O. — Variante 1

Ausgewählt vom Nutzer am 10.09.2026. Isolierter Schriftzug mit dem eingebauten Imagegen-Werkzeug aus dem zuvor freigegebenen ersten K.O.-Konzept erzeugt. Laufzeitdatei: `public/assets/effects/ko-title.webp` (448×149, 35 KiB). Unveränderte Imagegen-Quelle: `art-source/ko/ko-title-imagegen.png`. Für das Laufzeitraster mit Nearest-Neighbor verkleinert und Alpha auf harte Pixelkanten normalisiert. Transparenter Hintergrund; keine Arenen oder Figuren im Overlay.

Verwendeter Prompt:

> Extract and refine ONLY the exact gold-orange-red italic chunky pixel-art K.O. lettering from this reference, preserving its typography, navy chunky outline and dark extrusion, both punctuation periods, and the warm cream highlights at top, gold middle and orange-red lower part. A single centered game overlay sprite on real transparent alpha background. NO FIRE, NO BURST, NO SPARKS, NO CHARACTERS, NO ARENA, NO HEALTHBARS, NO BACKDROP: the fire will be procedurally animated behind this title by the game engine. Keep the reference lettering design. Clean hard pixel clusters, no antialiasing, no blur or glow. Landscape canvas 3:1 aspect ratio with title filling 90% width and 80% height and narrow transparent margins. Exact text K.O. with both periods. Deliver only one isolated title graphic with actual transparent background, not a checkerboard drawing.

`game/ko-explosion.ts` ergänzt Flammen und Funken auf dem nativen 960×540-Raster. Die transparente Animation wird an die Simulation gebunden: sie pausiert mit Esc, folgt der K.O.-Zeitlupe und endet vor der Siegeransage. Reduzierte Bewegung unterdrückt den Zoom und bewegte Funken.


## Pixel-Feuer, Alpha 0.2.18

Die ursprünglichen geometrischen Strahlen sind entfernt. Neues, mit dem eingebauten Imagegen-Werkzeug erzeugtes Sprite-Sheet: `ko-fire-imagegen.png`; Laufzeit: `public/assets/effects/ko-fire.webp`. Neun Frames in 3×3-Zellen zu 592×296 Pixeln, ohne Skalierung. Die Quelle wurde rechts um zwei transparente Spalten und unten um eine Zeile ergänzt; Alpha auf harte Kanten normalisiert.

Prompt: Production game sprite sheet, genuine hand-authored-looking arcade PIXEL ART, transparent RGBA background. Nine frames of one orange-yellow fire explosion for behind a K.O. title, no lettering. Exact 3 columns by 3 rows, same centered anchor. Ignition, growing fireball, explosive peak, curling tongues, hot flame halo, separating flames, scattered embers, sparse embers, nearly gone. Flat warm palette, stepped deliberate pixel clusters, asymmetrical chunky flame curls. No long rays, radial starburst, vector art, smooth edges, blur, glow, photographic smoke, grid lines, labels or backdrop.
