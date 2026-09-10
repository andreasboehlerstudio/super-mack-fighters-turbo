# Kampfrufe

Vom Benutzer freigegebene generische Kampfrufe, über Magnific / ElevenLabs v3 generiert. Keine Stimmen der realen dargestellten Personen.

- Männliche Bank: Alistair Kingsley (895), Creation `fHjIAbzCDY`.
- Weibliche Bank: Vera Raze (531), Creation `ksyFDSb16B`.
- Einstellungen: stability 0.3, similarity 0.35, speed 1.12.
- Text: `[shouting] Hah! [pause] [shouting] Huh! [pause] [shouting] Hyah! [pause] [shouting] Hiyah! [pause] [shouting] YAAAH! [pause] [grunts] Ugh! [pause] [grunts] Agh!`

`node scripts/build-combat-calls.mjs` benötigt ffmpeg und schneidet die sieben Silben aus den MP3-Originalen. Mono, 22050 Hz, normalisierte Lautstärke, kurze Ein-/Ausblendungen. Die exportierten WAV-Banken und Clip-Zeitmarken werden lokal ausgeliefert. Neue Aktionen ersetzen die aktuelle Silbe; Pause stoppt laufende Rufe. Wenn die Bank nicht lädt, bleibt der bisherige synthetische Ersatz aktiv.
