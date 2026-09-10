# Dynamisches Kampfgefühl – Pilot

Training: Roland und Michael Mack wählen, dann **KAMPFGEFÜHL: DYNAMISCH** einschalten. Umschalten setzt den Trainingskampf zurück. Andere Figuren und normale Spielmodi behalten ihr Timing.

SpriteCook, 10.09.2026: zwei Generierungen mit je 20 vorhandenen Credits, Modell v1.1, acht Frames, Pixel-Art, transparente Ausgabe, keine automatische Prompt-Erweiterung. Referenz jeweils die erste Standpose des bestehenden Kämpfers. IDs stehen in `spritecook-assets.json`.

- Roland: kurzer gerader Faustschlag, kompakte Ausholbewegung, klare Streckung und Rücknahme zur Deckung; Kleidung, Körpergröße und Blickrichtung der Referenz beibehalten.
- Michael: Knie anheben, seitlich nach vorne treten, Bein zurückziehen und zur Deckung zurückkehren; Referenzfigur und Fußlinie beibehalten.

`node scripts/pack-dynamic-combat.mjs` packt die Originale ohne Skalierung in 256×256-Zellen. Die Reihenfolge richtet die stärkste Pose am Kollisionsfenster aus. Die übrigen Schlag-, Tritt- und Luftangriffe verwenden vorhandene Zeichnungen mit neuer Phasenverteilung. Keine interpolierten oder weichgezeichneten Zwischenbilder.

Visuelle Referenz: [Pocket Bravery – Camille Gameplay Trailer](https://www.youtube.com/watch?v=_3Felv_PTnw). Die Timings sind eigene Testwerte, keine aus dem Video gemessenen Frame-Daten.
