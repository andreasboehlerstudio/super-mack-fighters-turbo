# Sébastien Ganzer

Team S: gelbes Polo mit rotem S, dunkle Jeans, weiße Sneaker, kurze braune Haare,
rechteckige Brille und kurzer Bart. Gesicht nach den zwei vom Benutzer gelieferten
Fotos. Roland dient als Referenz für kompakte Arcade-Proportionen und Portraitstil.
Portrait: Kopf und Brust, Dreiviertelansicht nach rechts, ohne Beine im Ausschnitt.

Mit dem eingebauten Imagegen-Tool erzeugt. Alle Prompts und Referenzrollen stehen
in `prompts.json`; die ausgewählten Originalbilder bleiben hier erhalten.

Sieben Animationsblätter mit jeweils acht Posen: Stand, Lauf, Schlag, Tritt,
Luftschlag, Lufttritt und Reaktionen. Reaktionen in der Reihenfolge Sprung,
Landung/Hocke, Block, Treffer, Spezialvorbereitung, Spezialauslösung, Niederlage,
Sieg. Kein dauerhaftes Requisit. Effekte werden im Spiel auf dem Kampfraster gezeichnet.

Export: `node --experimental-strip-types scripts/pack-karsten-edda.mjs sebastien`
und `node scripts/build-runtime-art.mjs`. 256er Zellen, 196 Pixel Standhöhe,
feste Skalierung pro Clip, verlustfreie WebP-Clips. Keine pauschale 2×2-Vergröberung.
