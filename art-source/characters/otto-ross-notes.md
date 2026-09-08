# Otto Waalkes und Ross Antony

Erstellt am 2026-09-08 mit dem eingebauten Imagegen. Keine fremden Kämpfer-Sprites übernommen.

## Referenzen

- Otto: https://mack.group/de/presse-medien/pressemitteilungen/2024-06-27/ottos-ottifanten-meet-ed-edda-ein-unvergesslicher-tag-im-europa-park
- Ross: https://mack.group/de/presse-medien/pressemitteilungen/2025-11-20/erfolgreicher-start-von-crazy-christmas-unsere-liebsten-weihnachtslieder-mit-ross-antony-und-paul-reeves-im-europa-park
- Stil: vorhandenes Roland-Portrait und DJ-BoBo-Idle-Sheet. Rechts gerichtete Portraits, navy/türkiser Hintergrund, goldene Lichtkante.

Offizielle Pressefotos dienen nur als Zeichenreferenzen und werden nicht mit dem Spiel ausgeliefert. Ross trägt eine blaue Showjacke statt seines Weihnachtskostüms. Beide haben leere Hände; thematische Motive erscheinen bei Spezialangriffen.

## Quellen und Verarbeitung

Die acht finalen Quellbilder und vollständigen Prompts liegen jeweils unter `otto/` und `ross/`. Die ersten Idle-Bilder enthielten eine gemalte Schachbrettfläche statt echter Transparenz; Imagegen ersetzte diese durch eine einheitliche Chroma-Fläche. Die weiteren Animationen verwenden ebenfalls Chroma-Grün. Der vorhandene Packer entfernt es und exportiert binäres Alpha.

Reproduktion aus dem Repository: `node --experimental-strip-types scripts/pack-karsten-edda.mjs otto ross`.

256 × 256 Pixel pro Frame, überwiegend 196 Pixel stehende Körperhöhe, feste Fußanker und Nearest-Neighbor-Skalierung beim Packen. Ross' gebeugte Reaktionsposen verwenden einen einmaligen Faktor 0,91, damit die Kopfgröße der Idle-Animation entspricht. Keine Skalierung einzelner Posen zur Laufzeit. Die sieben Quellblätter enthalten je acht verschiedene Zeichnungen; 17 separate Laufzeit-Animationsdateien je Figur werden verlustfrei als WebP gespeichert. Technische Messungen liegen auch im versionierten `public/assets/animations/combat-v5.json`.
