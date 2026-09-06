# Charakterporträts nach den Fotosheets

Andreas Boehler, Laurent Kuhn, Max Mager, Matthias Schilling, Reinhold Lamers und Nathalie Ruder wurden mit dem eingebauten Imagegen direkt anhand der sechs vom Nutzer bereitgestellten Charakterblätter neu illustriert. Max und Matthias tragen schwarze Baseball-Caps. Alle Bilder sind quadratische Pixelporträts mit dunklem blauem Hintergrund, warmem Gesichtslicht und kühlem Kantenlicht.

Die verwendeten Dateien liegen unter `public/assets/portraits/{andreas,laurent,max,matthias,reinhold,nathalie}.png`, jeweils 1024 × 1024 Pixel. Der gemeinsame `FighterPortrait`-Baustein verwendet sie in der Auswahl, dem Versus-Bild, den Lebensleisten und den übrigen Porträtdarstellungen. Eine neue URL-Version verhindert alte Bilder aus dem Browsercache.

Die exakten Prompts und Quellmetadaten sind im Arbeitsordner `../work/portraits-v2` gespeichert: sechs `{id}.prompt.txt`, `metadata-a.json` und `sources-b.json`. Laurent verwendet das erste, feinere Porträt, weil es die Ähnlichkeit zum Fotosheet besser erhält. Die alternative Stilkorrektur bleibt ausschließlich im Arbeitsordner. Die Bildausgabe wurde lediglich per Nearest-Neighbor auf die einheitliche Dateigröße gebracht.
