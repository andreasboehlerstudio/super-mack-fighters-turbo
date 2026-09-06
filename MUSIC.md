# Super Mack Fighters Turbo · Soundtrack

Alle 21 aktiven Themenbereiche besitzen eine eigene Komposition. Es sind Originalstücke, keine Transkriptionen offizieller Europa-Park-Songs. Russland/Euro-Mir verwendet „Orbit 17“, ein eigenes Space-Dance-Thema. Eine Bearbeitung von „Feel Free“ oder „Adventure“ ist nicht enthalten; dafür wurde eine Audio-, MIDI- oder Notenvorlage angefragt.

## Im Spiel

- Die gewählte Kampfarena bestimmt ihren Soundtrack in Arcade, Versus, Online und Training.
- Optionen → Sound enthält einen Sound-Test mit allen 21 Bereichen und einzelnen MIDI-Downloads.
- `/art-gallery.html` verbindet jedes Arenabild mit einer hörbaren Vorschau und einem MIDI-Download. Es spielt jeweils nur eine Vorschau. Lautstärke, Pause und Fehlerzustände sind berücksichtigt.
- `/assets/music/park-soundtracks.zip` enthält die 21 MIDI-Dateien und die Titelliste.

## Komposition und Klang

`game/area-music.ts` enthält individuell notierte Haupt- und Antwortmelodien, Tonarten, Harmonien und Rhythmen. Jede Schleife umfasst 32 Takte mit Thema, Antwort, reduziertem Mittelteil und kräftiger Rückkehr. Die Stücke dauern etwa 33–70 Sekunden. Die Instrumentierung reicht von Flöte, Mandoline und Nylon-Gitarre bis zu Akkordeon, Orgel, Marimba und Space-Synths.

Die eigene Sample-Klangbank in `game/snes-music.ts` arbeitet mit 32 kHz, quantisierten Wellenformen, maximal acht gleichzeitig aktiven Musikstimmen, Hüllkurven, Panorama und kurzem Echo. Kampfgeräusche haben einen separaten Regler. Dies ist eine SNES-inspirierte Klangästhetik, kein bitgenauer Hardware-Emulator. Es wurden keine Samples aus kommerziellen Spielen übernommen.

`game/music-score.ts` liest und schreibt Standard-MIDI mit Noten, Anschlagstärke, Programmen, Tempoänderungen, Lautstärke und Panorama. Schleifenenden sind taktgenau. Importierte Dateien unterstützen noch keine Pitch-Bends, Sustain-Pedal-Auswertung oder beliebige Soundfonts. Die Wiedergabe in einem externen MIDI-Player hängt von dessen Klangbank ab; die Ogg-Vorschauen benutzen die Instrumente des Spiels.

## Exporte reproduzieren

Node 24 kann die TypeScript-Quelldateien direkt lesen. `scripts/export-music.mjs` erzeugt MIDI, Ogg-Vorschauen, Titelliste und die Musik-Karten in der vorhandenen Galerie. Dafür werden FFmpeg und das nur zum Offline-Rendern verwendete Paket `web-audio-engine@0.13.4` benötigt. Das Paket ist nicht Teil des ausgelieferten Spiels. Bei Installation außerhalb des Projekts zeigt `MUSIC_RENDER_MODULE` auf seinen absoluten Paketordner. `MUSIC_RENDER_OUTPUT` kann den Ordner für WAV-Zwischenstände und Pegelmessungen festlegen.

Die Audio-Vorschauen entstehen mit derselben Sample-Engine wie die Spielmusik. Eine zweite vollständig gerenderte Schleife enthält bereits Echo- und Ausklangreste am Anfang. MIDI- und Audio-Dateien werden lokal erzeugt; es werden keine Aufnahmen hochgeladen.

Die Tests prüfen alle 21 Zuordnungen, unterschiedliche Melodien, vollständige Takte, MIDI-Rückimport samt Schleifenlänge, Sampledaten, Pause, Musikwechsel und Wiederherstellung nach dem Sound-Test. Die gerenderten Stereo-Dateien wurden auf endliche Samples, hörbaren Pegel und Übersteuerung geprüft.
