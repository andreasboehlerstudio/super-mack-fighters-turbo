# Alpha 0.2.0 – neue Figuren

Acht Figuren wurden mit Imagegen im vorhandenen Pixel-Art-Stil neu gezeichnet: `bobo`, `mross`, `freudenreich`, `robbemond`, `olli`, `boeckli`, `louis`, `tesla`.

Jeder Ordner enthält das Portrait, sieben Animationsvorlagen und die tatsächlich verwendeten Prompts samt Referenzzuordnung in `prompts.json`. Die dortigen absoluten Referenzpfade dokumentieren die ursprüngliche lokale Erzeugung; zum erneuten Packen werden nur die mitgelieferten PNG-Dateien benötigt.

## Referenzen

- DJ BoBo: https://www.djbobo.ch/
- Stefan Mross: https://mack.group/de/presse-medien/pressemitteilungen/2025-08-28/grosser-erfolg-fuer-immer-wieder-sonntags-im-europa-park-erlebnis-resort
- Madame Freudenreich: https://www.europapark.de/de/freizeitpark/attraktionen/madame-freudenreich-curiosites
- Van Robbemond: https://www.europapark.de/de/freizeitpark/attraktionen/piraten-batavia
- Maskottchen: https://mack.group/de/mack-gruppe/geschaeftsfelder/wir-erzaehlen-erlebnisse/ed-edda
- Nikola Tesla / Voltron: https://www.europapark.de/de/freizeitpark/die-entstehung-des-voltron-nevera-powered-rimac

## Aufbereitung

`node --experimental-strip-types scripts/pack-karsten-edda.mjs bobo mross freudenreich robbemond olli boeckli louis tesla`

Der Packer trennt die Figuren über zusammenhängende Pixelbereiche, entfernt den vereinbarten grünen Hintergrund, vereinheitlicht den Maßstab je Animation und richtet alle Frames am Boden aus. Nur Pixel des jeweiligen Frames werden übernommen, damit ausgestreckte Arme nicht in Nachbarframes auftauchen. Transparenz ist binär; Skalierung erfolgt ohne Weichzeichnung. Die Laufzeit verwendet getrennte verlustfreie WebP-Sheets für 17 Aktionen je Figur.

Die Angriffsrufe entstehen separat durch die PCM-Synthese in `game/fighter-voice.ts`. Es sind stilisierte Spielstimmen, keine Originalstimmen der dargestellten Personen.
