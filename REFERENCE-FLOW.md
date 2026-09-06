# Arcade-Ablauf und Umsetzung

Referenz des Nutzers: [Super Street Fighter II Turbo HD Remix (Xbox Live Arcade) Arcade as Ryu](https://www.youtube.com/watch?v=JME0kO9JoOE), TheInnocentSinful, 18:34. Am 6. September 2026 anhand ausgewählter sichtbarer Videostellen geprüft; kein vollständiges Frame-für-Frame-Protokoll.

Beobachtet: Logo auf schwarzem Grund bei 0:10, Titelbild mit Startaufforderung bei 0:35, Charakterwahl mit Porträts und Globus bei 1:05, große VS-Porträts bei 1:14, Kampf mit jubelnder Hintergrundkulisse und Super-Leisten bei 1:26, Siegpose in der Arena bei 1:51, Karte und nächster Gegner bei 1:58.

Übertragen auf Super Mack Fighters Turbo: Logo-Ladebild → animierter Titel → Arcade oder lokales Duell → Porträtwahl und Regeln → Parkwelt beziehungsweise VS → Rundenansage → Kampf → Siegpose/Ergebnis → nächste Arena oder Continue → individuelles Arcade-Ending nach dem Finale. Die begehbare Parkwelt und der freigegebene Pixel-Art-Stil bleiben Teil des eigenen Spiels. Aus dem Video werden weder Illustrationen noch Tonspuren übernommen.

## Turnierregeln

20 spielbare Figuren, ein fiktiver Endgegner. Jede Figur hat drei Specials (Viertelkreis mit Faust, Viertelkreis mit Kick, Zurückhalten und vorwärts mit Faust), eine Ultra bei voller Super-Leiste und optional Parry. Zwei Rundensiege entscheiden. Klassisches, Turbo- oder Hyper-Tempo. Optionale Zweierteams behalten beim Wechsel ihren eigenen Lebensstand; ihre Super-Leiste ist gemeinsam.

50 Stationen auf der großen Tour, acht in der klassischen Tour, vier erfundene Festival-Touren mit jeweils fünf Stationen. Die sieben Spezialarenen ergänzen 21 Themenbereiche, 14 Achterbahnen und die MACK-Stationen. Wind und niedrige Schwerkraft gelten für beide Seiten; Kulisseneffekte verursachen keinen Schaden.

## Eingaben

1P: A/D laufen, W springen, S ducken; F Faust, G Kick, H Block; Q Parry, R Ultra, E Teamwechsel.

2P: Pfeile bewegen, J Faust, K Kick, L Block; I Parry, O Ultra, P Teamwechsel.

Standard-Gamepad: Stick/Steuerkreuz bewegen, A springen, X Faust, B Kick, LB Block, RB Parry, Y Ultra, LT Teamwechsel, Start Pause. In Menüs A bestätigen und B zurück. Die Tastenbezeichnungen können je nach Gamepad abweichen.

## Prüfung

32 automatisierte Tests einschließlich aller 63 Specials, 21 Ultras, Parry, Teamwechsel, Zeitablauf, Arenaphysik, beider kompletten Tour-Simulationen, Wegenetz und gespeicherter Regeln. TypeScript-Prüfung und Produktionsbuild erfolgreich. Browserprüfungen ergänzen die Logiktests; ein physisches Zwei-Gamepad-Setup wurde nicht verwendet.
