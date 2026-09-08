# Änderungsprotokoll

Das Spiel befindet sich in der **Alpha-Phase**. Die Versionsanzeige unten rechts nennt die Version und das Commit-Kürzel des tatsächlich gebauten Spielstands. `DEV` kennzeichnet lokale Änderungen.

## 0.2.2-alpha — 2026-09-08

### Charaktere
- Michael Vendel ist als 35. Kämpfer auswählbar, direkt nach Karsten Mosner.
- Eigenes Imagegen-Pixelportrait und sieben Animationsblätter mit je acht Zeichnungen anhand seines Character Sheets: graugrünes Shirt, Jeansshorts, schwarze Socken und weiße Sneaker.
- Separate verlustfreie Animationsdateien mit festen Ankerpunkten für Lauf-, Boden- und Luftangriffe sowie Reaktionen.
- Drei Spezialangriffe: Impulswelle, Kraft-Sprint und Druckwirbel. Ultra: Voller Einsatz.
- Eigener Arcade-Abschluss „Mit vollem Einsatz“ und synthetischer Angriffsruf.
- Geprüft: 95 automatisierte Tests inklusive Spezialangriffen, Ultra, Stimmen und Sprite-Geometrie; TypeScript und Pages-Build; Charakterwahl, Probekampf, Sprungtritt, Ultra und Move-Liste im Browser ohne Laufzeitfehler.

## 0.2.1-alpha — 2026-09-08

### Charaktere
- Otto Waalkes und Ross Antony sind als neue Kämpfer in der Promi-Gruppe auswählbar.
- Beide erhalten eigene Imagegen-Pixelportraits und je acht Zeichnungen für Idle, Laufen, Schlag, Tritt, Luftschlag, Lufttritt und Reaktionsposen, exportiert als separate verlustfreie Animationsblätter.
- Otto: Friesen-Sprung, Ottifanten-Ansturm, Ostfriesen-Wirbel und die Ultra Ottifanten-Parade, mit kleinen Ottifanten-Effekten.
- Ross: Glitzerwirbel, Weihnachts-Welle, Show-Sprint und die Ultra Crazy Christmas Finale, mit funkelnden Sternen-Effekten.
- Eigene Arcade-Endings und synthetische Angriffsrufe für beide Figuren.
- Die Auswahl zeigt 34 Kämpfer auf vier Reihen mit neun Spalten. Tastatur und Gamepad verwenden dieselbe Anordnung.
- Geprüft: 95 automatisierte Tests, TypeScript, Pages-Build sowie Auswahl, Probekampf, Ultras und Pause-Menü im Browser.

## 0.2.0-alpha — 2026-09-07

### Parkwelt
- Kollisionen verwenden jetzt den aus der sichtbaren Karte gemessenen Sand- und Brückenuntergrund.
- Figuren stoppen an Weggrenzen ohne Rücksprünge zur Wegmitte oder Hin-und-her-Wackeln.
- Automatisches Laufen verarbeitet auch kurze Wegsegmente ohne Zwischenstopps.
- Routen sind cyan mit dunkler Kontur; das nächste Arenenziel ist magenta mit heller Kontur. Dieselben Farben gelten in der Übersicht.

### Charaktere
- Acht neue spielbare Figuren: DJ BoBo, Stefan Mross, Madame Freudenreich, Van Robbemond, Olli Eurofant, Böckli, Louis und Nikola Tesla in einer Voltron-inspirierten Spielinterpretation.
- Eigene Pixelportraits, Animationszeichnungen, Spezialangriffe und Arcade-Endings.
- Die Charakterauswahl bietet Platz für 32 Kämpfer.
- Die doppelte 1P-/CPU-Leiste unter dem Raster entfällt. Tag-Team wird oben umgeschaltet; Partner werden direkt an den seitlichen Portraits gewählt.
- Reihenfolge in der Auswahl: Maskottchen und Parkfiguren, Mack-Familie, Michael Scholz, Prominente und weitere Mitarbeiter. Tastatur- und Gamepad-Navigation folgen derselben Reihenfolge.

### Kampfgeräusche
- Alle Figuren erhalten kurze synthetische Angriffsrufe bei Schlägen, Tritten, Specials und Ultras; auch bei Luftangriffen.
- Individuelle Stimmlagen und passende Tier-/Fantasielaute, drei Varianten je Angriff sowie eine Sperrzeit pro Spieler. Die Effektlautstärke regelt auch die Rufe.

### Versionierung
- Dauerhafte Alpha-Version mit Commit-Kürzel unten rechts und Link zu diesem Changelog.
- Versionsdaten werden beim Build aus Paketversion und Git-Stand erzeugt.

## Bisheriger Alpha-Stand — bis 2026-09-07

- Arcade, Versus, Online und Training; begehbare Parkwelt und frei wählbare Arenen.
- 24 auswählbare Charaktere einschließlich Michael Scholz.
- Pixelportraits, getrennte Animationsdateien, Spezialangriffe, Ultras und Arcade-Endings.
- Veröffentlichung über GitHub Pages.
