# Änderungsprotokoll

Das Spiel befindet sich in der **Alpha-Phase**. Die Versionsanzeige unten rechts nennt die Version und das Commit-Kürzel des tatsächlich gebauten Spielstands. `DEV` kennzeichnet lokale Änderungen.

## 0.2.9-alpha — 2026-09-09

- Sébastien Ganzer als 41. spielbare Figur vor dem Social-Media-Team einsortiert: gelbes Polo mit rotem S, Brille, kurzer Bart und kompakte Arcade-Proportionen. Portrait nach rechts gedreht und auf Kopf/Brust zugeschnitten.
- Sieben eigene Animationsblätter mit 56 Posen, 17 verlustfreie Spielclips, kompakte Portrait-Dateien, Kampfrufe und eigene Endsequenz integriert. Feste Standhöhe und gemeinsame Fußanker; keine Laufzeitvergrößerung einzelner Posen.
- Sébastiens Moves: Briefing-Impuls, Redaktionsplan, Team-Push und KAMPAGNEN-FINALE. Kurze Pixel-Effekte aus Freigabehaken, Beiträgen und Community-Symbolen begleiten die Angriffe.
- Valentinas Rolle als Casting-Direktorin für Models und Videodrehs in Beschreibung, Ende und Moves umgesetzt: Casting-Call, Screen-Test, Recall und DIE BESETZUNG STEHT!; Casting-Klappen ersetzen Blüteneffekte.
- Michael Vendels Spezialangriffe zum Drohnen-Thema umbenannt: Rotor-Impuls, Tiefflug, Orbit-Shot und ONE TAKE AUS DER LUFT!; Beschreibung und Ende angepasst.
- Lange Namen erhalten in den Auswahlkacheln eine kleinere Schrift, damit etwa Sébastien nicht mitten im Vornamen umbricht.
- Geprüft: 116 Tests, TypeScript, Pages-Build und 2.562 belegte Animationsposen. Sébastien gegen Roland im Browser auf Darstellung, Angriffe und Konsolenfehler geprüft.

## 0.2.8-alpha — 2026-09-09

- Jans Beschreibung, HUD, Trefferzähler und Move-Liste verraten keine Überraschungen mehr. Sichtbare Hinweise auf seine besonderen Mechaniken entfernt; Regie-Moves bleiben beschrieben.
- Jans besonderer Kampfschriftzug zeigt jetzt exakt **YOU MADE JAN ANGRY NOW!**. Ereignis, Anzeige und bestehender Test sind synchron geändert.
- Übergreifender Zeichenstil-Abgleich mit unvergrößertem Vergleich von Roland, Jan und Michael. Unterschiede, Grenzen der technischen Raster-Messung und Prioritäten für spätere Neuzeichnungen in `CHARACTER_STYLE_AUDIT.md` dokumentiert; Charakterbilder unverändert. Technische Spoiler stehen in eingeklappten Entwicklerabschnitten.
- Raster-Audit nennt die tatsächliche Figurenanzahl dynamisch und unterscheidet Portrait-Quelldateien von Menübildern.
- Geprüft: alle 697 normalen Spielclips mit 2.501 belegten Posen; visuelle Stichproben für 41 Figuren und deren Portraits; sechs Jan-Tests, TypeScript und Pages-Build. Auswahl, HUD und Pausenhilfe im Browser ohne Vorab-Hinweise geprüft; keine Konsolenfehler.

## 0.2.7-alpha — 2026-09-09

- Jans aufgezogenen Filmrahmen bei Spezialangriffen entfernt. Stattdessen laufen transparente Pixel-Sprites mit je acht Bildern: Schlagbogen, Bodensplitter und Trefferblitz.
- Effekte erscheinen zum aktiven Angriff, folgen Position und Blickrichtung und blenden kurz aus. Jans Projektile verwenden ebenfalls die neuen Sprites. Native Pixelgröße ohne Strecken; Animation folgt Kampfpause und K.-o.-Zeitlupe.
- Sprite-Blätter werden einmal beim Laden einer Arena mit Jan erzeugt und wiederverwendet; keine zusätzlichen Bilddownloads. Die bisherigen Körperanimationen bleiben unverändert.
- Geprüft: 115 Tests, TypeScript und Pages-Build; im Browser Jans Ultra und Bodenwelle gegen Snorri sowie Rücksetzen im Training, keine Konsolenfehler.

## 0.2.6-alpha — 2026-09-09

<details>
<summary>Jans technische Charakterdetails (Spoiler)</summary>

- Jan Reiff als 40. spielbare Figur: normales Regie-Moveset und Verwandlung nach zwei ungeblockten Treffern. Grüne Energiesäule, Bodenwelle und Partikel begleiten den Schriftzug „You made jan angry now“; reduzierte Bewegung wird berücksichtigt.
- Jans grüne Form ist rund 50 % größer und nutzt eigene 384er Sprite-Zellen. Drei Spezialangriffe ohne Energiekosten, Ein-Treffer-K.-o. und Rücken-Schwachstelle mit verzögertem Umdrehen. Form bleibt beim Teamwechsel erhalten und wird pro Runde zurückgesetzt.
- Alpha-Einschränkung: Die Riesenform hat eigene Stand-/Laufbilder; Spezial- und Reaktionsposen verwenden vorerst Standbilder mit Kampfeffekten, da zwei neue Bildblätter vom Bilddienst abgelehnt wurden.

</details>

- Arcade: Frederik Mack zuerst, Michael Mack in der Mitte, Roland Mack zuletzt; alle übrigen Gegner einschließlich Jan werden pro Durchlauf gemischt. Fortsetzen und Wiederholen behalten dieselbe Reihenfolge.

- Feinere gemeinsame Pixel-Ausgabe mit 960 × 540 statt 480 × 270 Bildpunkten. Figuren, Arenen, Parkwelt, Titel und Endings teilen weiterhin ein Raster; keine bilineare Glättung.
- Separate verlustfreie WebP-Spielbilder: kleine Portrait- und Ortskacheln, größere Dateien nur für Vorschauen und Kämpfe. Die Portrait-Kacheln benötigen zusammen weniger als 4 MB. Geladene Menübilder werden gemeinsam wiederverwendet.
- Parkübersicht verkleinert; die Laufkarte lädt nicht mehr die rund 10 MB große Detailkarte und erzeugt keine unnötige Zwischenkopie.
- Spezialmove-Namen bleiben 2,4 Sekunden, Ultra-Namen 3 Sekunden stehen und blenden anschließend sanft nach oben aus. Pro Spieler ersetzt ein neuer Hinweis den vorherigen.
- Nach einem Rundenende laufen die aktuelle Angriffsbewegung und die Schwerkraft weiter. Sieger gehen erst nach Erholung und Landung in ihre Siegerpose; neue Angriffe verursachen dabei keinen Schaden.
- Valentinas sieben Bewegungsblätter in feinerem Pixel-Art-Stil neu gezeichnet und als 17 Spielclips exportiert. Feinere Konturen, Gesichtsschattierung und Kleidfalten; zusätzliche 2 × 2-Vergröberung entfernt. Kampf, Parklauf und Ending laden denselben aktuellen Stand.
- Beim entscheidenden K.O.-Treffer setzt kurze Zeitlupe ein, die allmählich auf Normaltempo zurückkehrt. Ein Zeitablauf löst keine K.O.-Zeitlupe aus.
- Geprüft: 115 automatisierte Tests einschließlich Jans Charaktermechaniken, Arcade-Reihenfolge, Luft-K.O., Landung, Teamwechsel, Bildcache und Dateigrößen; TypeScript und Pages-Build. Im Browser: Auswahl und Arenastart, Jans Charaktermechaniken, Pausenmenü sowie Valentinas Luftangriff gegen Snorri; keine Konsolenfehler.

## 0.2.5-alpha — 2026-09-08

### Bewegung und Parkwege
- Valentinas Laufgeschwindigkeit von 255 auf 290 erhöht (rund 14 %), einschließlich der davon abhängigen Luftsteuerung.
- Bei schrägem Laufen gegen einen Wegrand führt eine vorausschauende Wegassistenz entlang der nahen Weglinie weiter. Kein Teleportieren durch Hecken; Bewegung bleibt auf passierbaren Verbindungen.
- Fußabstand zur Weggrenze reduziert, damit enge Kurven besser passierbar sind. Beide oberen Seiten am zentralen Schloss mit wiederholtem diagonalem Input geprüft.
- Routen mit kleinen, kollisionsgeprüften Rundungen versehen. Anzeige und automatischer Lauf verwenden dieselbe geglättete Strecke; Endpunkte bleiben exakt erhalten.
- Zielmarker in Parkwelt, Minikarte und Atlas von Pink auf Türkis umgestellt, mit kontrastreicher Einfassung.

### Gemeinsames Pixelraster
- Kämpfe, Parkwelt, Titel und Endings auf ein gemeinsames 480 × 270 Ausgaberaster vereinheitlicht. Figuren, Hintergründe, Zuschauer und Effekte werden gemeinsam scharf auf ganze Bildschirm-Pixel skaliert.
- Portraits und Menübilder verwenden dieselbe sichtbare Pixeldichte; Atlasbilder werden beim Zoomen neu abgetastet. Originaldateien bleiben erhalten.
- Alle 40 Figuren inklusive Endgegner, 680 Animationsclips und 2.440 Posen geprüft. Reproduzierbares Audit und Rastervorgaben in `PIXEL_ART.md`. Das technische Raster ist vereinheitlicht; Unterschiede in den gezeichneten Farbflächen und Schattierungen sind damit nicht automatisch neu gestaltet.
- Geprüft: 103 automatisierte Tests, Bewegung an den Schlosskurven, keine Hecken-Durchquerung, Routen aller Themenbereiche, Pixel-Skalierung bei verschiedenen Bildschirmgrößen, TypeScript und Pages-Build. Auswahl, Arena-Vorschau, Training, Parklauf und Zielankunft im Browser geprüft.

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
