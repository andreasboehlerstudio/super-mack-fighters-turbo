# Änderungsprotokoll

Das Spiel befindet sich in der **Alpha-Phase**. Die Versionsanzeige unten rechts nennt die Version und das Commit-Kürzel des tatsächlich gebauten Spielstands. `DEV` kennzeichnet lokale Änderungen.

## 0.2.4-alpha — 2026-09-08

### Valentina Sachs
- Als 39. Figur spielbar: korallrotes Sommerkleid und Sandalen, Gesicht anhand des bereitgestellten Character Sheets. Das Portrait blickt wie die anderen nach rechts.
- Sieben neue Animationsblätter mit je acht Posen, 17 separate verlustfreie Spielclips und feste Pixelblöcke. Boden- und Luftangriffe im Maßstab abgeglichen; Portrait auf einem einheitlichen 192 × 256 Raster exportiert.
- Sonnenbogen, Sommerbrise, Blütenwirbel und Ultra „Sommerleuchten“, mit Blüteneffekten, synthetischer Stimme und eigenem Arcade-Abschluss.

### Auswahl und Regeln
- Fünf Portraitreihen mit Platz für 45 Figuren; alle aktuellen Charaktere stehen auf einer Seite. Seitenwechsel bleibt für weitere Figuren erhalten.
- Großen „1V1 · Regeln & Kostüme“-Button entfernt. Tempo, Parry und Tag-Team sind direkt in der Kopfzeile einstellbar; Partner bleiben an den seitlichen Portraits wählbar.
- Kostümauswahl und Vorschauen vorerst entfernt. Gespeicherte Kostüme und Festival-Touren verwenden die normalen Charaktergrafiken.
- Versus gegen den Computer lost beim Einstieg und nach abgeschlossenen Kämpfen einen Gegner aus. „Gegner auslosen“ zieht erneut; die manuelle Auswahl über das Computerportrait bleibt erhalten.

### Kampfmusik
- Alle 21 Themenbereiche neu arrangiert: Melodien eine Oktave tiefer, weniger kurze Verzierungen und hohe Begleitnoten, kräftigerer Bass und deutlich stärkere Kick/Snare.
- Eigener dunklerer Kampfmix mit reduzierten Höhen und weniger Echo. Die individuellen Themen und Taktarten bleiben erhalten.
- Alle 21 MIDI-Dateien, OGG-Hörproben und der gemeinsame MIDI-Download aktualisiert. Titelthema „Feel Free“ bleibt erhalten.
- Geprüft: 100 automatisierte Tests, TypeScript und Pages-Build; fünf Auswahlreihen, Zufallsgegner und manuelle Wahl, Tag-Team-Regler, Training, Luftangriffe, Ultra und Pause im Browser. Alle 21 Musikfassungen offline gerendert und auf endliche Pegel ohne Übersteuerung geprüft.

## 0.2.3-alpha — 2026-09-08

### Social-Media-Team S
- Nathalie Schär, Glen Homburg und Steffen Weber sind als drei eigenständige Kämpfer spielbar: gelbe Poloshirts mit großem roten S, ohne dauerhaftes Requisit.
- Freigegebene Pixelportraits: Nathalies Gesicht nach den zusätzlichen Fotovorlagen, Glen mit schmalerer Gesichtsform und vereinfachten Pixelclustern passend zu den bestehenden Portraits.
- Je sieben neue Animationsblätter mit acht Zeichnungen und separate verlustfreie Dateien für die Spielaktionen. Größen und Bodenanker zwischen Stand, Lauf und Angriffen abgeglichen; Glens Luftschlag verkleinert die Figur nicht mehr.
- Nathalie: Reel-Rush, Story-Bogen, Hashtag-Wirbel und Trend-Takeover. Glen: Kommentar-Stopp, Share-Welle, Community-Boost und Community-Power. Steffen: Like-Impuls, Feed-Sprint, Reichweiten-Welle und Viral!
- Eigene Herz-, Sprechblasen- und Hashtag-Effekte, synthetische Angriffsrufe und Arcade-Abschlüsse.

### Charakterauswahl
- 38 Figuren auf zwei Seiten mit jeweils maximal 27 unverändert großen Portraitkacheln.
- Seitenwechsel per Bildschirm-Pfeilen, Bild-Auf/Bild-Ab oder LB/RB; Tag-Partner bleiben an den seitlichen Portraits wählbar.
- Geprüft: 96 automatisierte Tests, TypeScript und Pages-Build sowie Auswahl, Probekämpfe, Luftangriffe, Ultras, Tag-Wechsel und Pause-Menü im Browser ohne protokollierte Laufzeitfehler.

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
