# Jan Reiff

Spielbarer Regisseur nach dem bereitgestellten Character Sheet: beige T-Shirt, schwarze Hose, längeres blondgraues Haar, weißer Bart und transparente Brille. Rechts blickendes Portrait und sieben neue Imagegen-Animationsblätter. Eingaben und Prompts sind in `prompts.json` dokumentiert; private Originalfotos werden nicht veröffentlicht.

Normale Form: 256 × 256 Pixel pro Spielpose, etwa 196 Pixel Körperhöhe. Nach dem zweiten ungeblockten Treffer beginnt eine 90-Tick-Verwandlung mit grüner Energiesäule, Bodenwelle und aufsteigenden Partikeln. Währenddessen steht exakt „You made jan angry now“ auf dem Bildschirm. Reduzierte Bewegung deaktiviert die Partikel und reduziert die Lichtintensität.

Die separate grüne Form (`../janhulk`) ist etwa 294 Pixel hoch in 384 × 384 Zellen. Beide Formen werden im gleichen Raster ohne Vergrößerung einzelner Posen gerendert. Die Verwandlung endet auch bei einem gleichzeitigen Rundenende.

Nur Rückenangriffe können Jan besiegen. In der Riesenform lösen Faust, Kick und Ultra drei Regie-Spezialangriffe ohne Energiekosten aus. Jeder verbundene Angriff gewinnt; lange Vorbereitung, Erholung und verzögertes Umdrehen ermöglichen den Rücken-Konter. Vorne tödlicher Schaden wird in der normalen Form auf einen Lebenspunkt begrenzt. Ein Zeitablauf kann einen noch lebenden Jan nicht besiegen. Teamwechsel erhält die Form; eine neue Runde setzt sie zurück.

Export: `node --experimental-strip-types scripts/pack-karsten-edda.mjs jan`

Die Arcade-Tour wird pro Durchlauf mit gespeichertem Seed gemischt. Frederik Mack beginnt, Michael Mack steht in der Mitte, Roland Mack am Ende. Jan ist im zufälligen Pool enthalten.
