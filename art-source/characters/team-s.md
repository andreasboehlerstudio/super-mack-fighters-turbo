# Social-Media-Team S · Alpha 0.2.3

Spielbare IDs: `schaer` (Nathalie Schär), `glen` (Glen Homburg), `steffen` (Steffen Weber).

## Gestaltung

Gelbes Poloshirt mit großem roten S für alle drei. Nathalie mit zwei Zöpfen, gestreifter Culotte und schwarzen Sandalen; Glen ohne Bart mit grauen Chinos und hellen Sneakers; Steffen mit kurzen dunklen Haaren, Bart, dunkler Hose und weißen Sneakers. Keine dauerhaften Requisiten. Social-Media-Motive erscheinen nur bei Spezialangriffen.

Die Identitätsvorlagen wurden vom Benutzer bereitgestellt. Nathalies freigegebenes Portrait berücksichtigt insbesondere die zusätzlichen Frontalfotos; Glen erhielt auf Wunsch eine schmalere untere Gesichtshälfte. Die final freigegebenen Portraits vereinfachen die Hautschattierung in größere Pixelcluster, mit Roland als Stilreferenz. Die Rohfotos werden nicht mit dem Spiel veröffentlicht.

Referenzclips:
- Nathalie und Glen: https://www.instagram.com/europapark/reel/DapWU8AkecY/
- Steffen: https://www.instagram.com/p/DcdYwnOlGLG/

## Quelldateien und Export

Jeder Charakterordner enthält das Portrait, sieben Animationsquellen mit je acht Zeichnungen und `prompts.json` mit Erzeugungs- und Revisionsprompts. `revisionPrompt` beschreibt die finale Abweichung vom ersten Entwurf.

Export: `node scripts/pack-karsten-edda.mjs schaer glen steffen`. Der vorhandene Exporter entfernt den einfarbigen Hintergrund, ordnet die Posen festen Fußankern zu und schreibt verlustfreie Aktionsblätter. Die Bewegung wird aus Zeichnungen aufgebaut, ohne Zwischenbilder weich zu überblenden.

Für die Größenkontinuität gelten die in `prompts.json` gespeicherten einheitlichen Faktoren je Clip: Nathalie Reaktionen 0,95; Glen Luftschlag 1,28 und Reaktionen 0,86; Steffen Reaktionen 0,83. Glens erhobener Arm verfälschte zuvor die automatische Kopfbreitenmessung beim Luftschlag. Kein einzelner Frame wird zur Normalisierung seiner Haltung gestreckt.

Prüfung: alle 96 Spieltests, TypeScript, Pages-Build; Charakterauswahl über beide Seiten, Trainingskämpfe mit allen drei Figuren, Luftangriffe, Ultras, Tag-Wechsel und zentrierte Move-Liste im Browser. Keine protokollierten Laufzeitfehler. Ein physischer Gamepad-Test wurde nicht durchgeführt.
