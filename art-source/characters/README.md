# Charaktergrafiken: Karsten, Edda und Michael Scholz

Erstellt mit dem eingebauten Imagegen-Tool. Die jeweilige `prompts.json` dokumentiert die ausgewählten Dateien und Freistellungsanweisungen; `generation-history.json` enthält die ursprünglichen Generierungsprompts. Die Originalfotos werden nicht mit dem Spiel ausgeliefert.

- **Karsten Mosner:** graue Cap, schwarze Brille, olivfarbenes Shirt und Jeans nach dem bereitgestellten Character Sheet. Keine Kamera, kein Gurt, kein sonstiges Requisit in Porträt oder Animationen. Das Cinema-Thema erscheint ausschließlich als Licht und Bewegung in Objektivblitz, Dolly-Fahrt, Kran-Schwenk und ONE TAKE.
- **Edda Euromausi:** nach der [offiziellen Ed-&-Edda-Referenz](https://mack.group/de/mack-gruppe/geschaeftsfelder/wir-erzaehlen-erlebnisse/ed-edda), im Stil der vorhandenen Ed-Sprites. Magenta Schleife, violette Jacke, florales Kleid und pinke Schuhe.
- **Michael Scholz:** Parkpionier und erster Mitarbeiter seit 1973, nach dem offiziellen [Pressebericht zur Jubilarfeier 2023](https://mack.group/de/presse-medien/pressemitteilungen/2023-10-27/ueber-2300-jahre-engagement-fuer-den-europa-park) und dem dortigen Foto „Michael Scholz und Olaf der Flipper“. Brille, weißer Haarkranz, dunkles Sakko, leere Hände. Porträt im Stil von Roland, eigene Animationsblätter im bestehenden Figurenraster. Pionier-Impuls, Allee-Sprint, Qualitätskontrolle und PIONIERGEIST 73 sind erfundene Spezialkräfte. Die offizielle Fotografie wird nicht mitgeliefert.

Pro Figur: ein Porträt sowie sieben Quellblätter für Idle, Walk, Punch, Kick, Air Punch, Air Kick und Reaktionen. Jedes Animationsblatt enthält acht eigenständige Posen. Daraus werden die separaten Laufzeit-Clips unter `public/assets/animations/<id>/` und die kompatiblen Atlanten für Parkwelt und Endings exportiert.

Die Laufzeit-Clips verwenden 256 × 256 Pixel pro Frame, harte Alphakanten und verlustfreies WebP. Der Export verwendet Nearest-Neighbour, feste Fußanker und eine einheitliche Skalierung innerhalb jeder Kampfanimation. Minimale Höhenabweichungen der Idle-Quelle werden auf einen Bereich von vier Pixeln begrenzt. Im Spiel findet keine Skalierung einzelner Posen statt.

Bei Quellblättern mit grünem Hintergrund wird nur die reine Chroma-Farbe entfernt. Weiße Kleidung und helle Konturen bleiben erhalten. Visuelle Kontrolle: alle 56 Posen je Figur auf dunklem Untergrund; zusätzlich Asset- und Kampfmechaniktests.

Reproduzierbarer Export mit Node 24 und installiertem `sharp`: `node scripts/pack-karsten-edda.mjs` für Karsten und Edda; `node scripts/pack-karsten-edda.mjs scholz` für Michael Scholz. Das Werkzeug liest die angegebenen Figuren aus ihren jeweiligen Quellenordnern. Die Quellbilder bleiben dabei erhalten. Messwerte und Kontaktbögen landen außerhalb der ausgelieferten Anwendung unter `../work/<figuren-ids>/`.
