# Änderungsprotokoll

Das Spiel befindet sich in der **Alpha-Phase**. Die Versionsanzeige unten rechts nennt die Version und das Commit-Kürzel des tatsächlich gebauten Spielstands. `DEV` kennzeichnet lokale Änderungen.

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
