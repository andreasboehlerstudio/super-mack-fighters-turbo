# Arcade-Ablauf und Umsetzung

## Beobachtete Vorbilder

- [Super Street Fighter II Turbo HD Remix](https://www.youtube.com/watch?v=JME0kO9JoOE), TheInnocentSinful, 18:34. Ausgewählte sichtbare Stellen: Logo auf Schwarz (0:10), Titel mit Startaufforderung (0:35), Charakterwahl (1:05), VS-Porträts (1:14), Kampf (1:26), Siegpose (1:51), Karte und nächster Gegner (1:58).
- [Blazing Strike – Alexander Arcade](https://www.youtube.com/watch?v=9uTMknR6bL8), Loading Geek, 17:47. Bei ungefähr 16:55: großes Congratulations, Figurenensemble, Pixel-Konfetti und Initialeneingabe. Der Abschluss erhält dadurch einen eigenen feierlichen Moment.
- [Pocket Bravery](https://www.youtube.com/watch?v=1ohauhI2scM): ausgewählte Kampfstellen als Referenz für lesbare Silhouetten, Porträts und Lebensleisten. [KOF 2002](https://www.youtube.com/watch?v=Bvj__IRCaAE) dient als weitere Kampf- und Kulissenreferenz. Keine vollständige Frame-für-Frame-Analyse dieser Videos.

Eigener Ablauf: Logo-Ladebild → animierter Titel → ARCADE / VERSUS / ONLINE / TRAINING → Auswahl beziehungsweise Online-Einladung → Parkwelt / VS / Kampf → Runden- und Kampfergebnis. Die Arcade-Tour endet mit dem individuellen Ending, Congratulations, drei Initialen und der gespeicherten Rangliste. Illustrationen und Tonspuren der Referenzspiele werden nicht übernommen.

## Spielumfang

21 spielbare Figuren einschließlich Wakala, sechs MACK-Media-Mitarbeitern und zwölf Mitgliedern der Familie Mack; ein erfundener Endgegner. Drei Specials je Figur, Ultra bei voller Super-Leiste, optional Parry, zwei Rundensiege. Klassisches, Turbo- oder Hyper-Tempo. Optionale Zweierteams werden mit beiden Porträts in der Auswahl gezeigt. Jeder Partner behält seinen Lebensstand; die Super-Leiste teilen beide.

Die aktive Parkwelt und Arenawahl enthalten nur 21 Themenbereiche. Große Tour: 21 Duelle; klassische Tour: acht; vier erfundene Festival-Touren: je fünf. Breite Wege verbinden Eingänge in einer vereinfachten Pixelwelt. Die nahe Kamera folgt der Figur. Übersicht und begehbare Welt benutzen dieselbe Anordnung. Dies ist eine Spielkarte, keine geografisch maßstabsgetreue Rekonstruktion des Parks. Frühere Kulissen bleiben als Assets erhalten, sind aber nicht als Firmen- oder Achterbahnstationen auswählbar.

Training bietet stehenden/blockenden/kämpfenden Dummy, echte aktive Treffer- und Körperzonen, Reset, unbegrenzte Zeit und Super-Energie. Kombos zählen nur tatsächliche Treffer während der Trefferstarre; geblockte Angriffe zählen nicht. Trefferpause, Funken, Kamerabewegung und ein bildfüllendes K.O. betonen den Einschlag. Die Simulation läuft mit festen 60 Schritten pro Sekunde. Sechs Schritte Eingabepuffer helfen beim Timing. Zusätzliche gezeichnete Animationsphasen bleiben für die Bewegungsqualität der kommerziellen Vorbilder notwendig.

## Steuerung und Mehrspieler

1P: A/D laufen, W springen, S ducken; F Faust, G Kick, H Block; Q Parry, R Ultra, E Teamwechsel.

2P lokal: Pfeile bewegen, J Faust, K Kick, L Block; I Parry, O Ultra, P Teamwechsel. Spieler 2 tritt ausdrücklich mit Taste 2, dem Beitrittsknopf oder Start auf einem eigenen Controller bei. Ein Controller belegt nur einen Platz. Bei Trennung pausiert der Kampf.

Gamepad: Stick/Steuerkreuz bewegen, A springen, X Faust, B Kick, LB Block, RB Parry, Y Ultra, LT Teamwechsel, Start Pause. Im Menü A bestätigen und B zurück. Die Beschriftung kann je nach Controller abweichen.

Online: Einladungscode, zehn Minuten gültig, zuverlässiger WebRTC-Datenkanal, vier Simulationsschritte Eingabeverzögerung und gemeinsames Warten auf fehlende Eingaben. Beide Geräte benutzen die 1P-Steuerung. Der Modus ist ein Direktverbindungsprototyp ohne TURN-Relay oder Rollback-Netcode; restriktive Netzwerke können ihn blockieren. Ein Einladungscode gewährt keinen Zugang zu einer privat bereitgestellten Website.

## Speicherung

Lokale Vorlieben und Tourfortschritt liegen auf dem Gerät. Highscores und kurzlebige Online-Einladungen liegen in D1. Das Schema und die Migration sind in `db/` und `drizzle/` enthalten. Jeder Tourlauf besitzt eine eindeutige ID, sodass wiederholtes Absenden keinen zweiten Eintrag erzeugt. Punkte werden im Spiel berechnet; die Rangliste ist eine Prototyp-Rangliste ohne serverseitigen Anti-Cheat-Nachweis.

## Prüfung am 6. September 2026

41 automatisierte Tests bestehen: alle Specials/Ultras, Parry, Tag-Team, echte Kampfkollisionen, Eingabepuffer, Training, kompletter 21-Arenen-Durchlauf, Wege und Kollision, Kameragrenzen, Beitrittsregeln und deterministisch identische Online-Simulation.

Im Browser geprüft: nahe Parkansicht und mitlaufende Kamera, Weg zur Italien-Arena, zugehöriger Parkplan, Italien-Kampf mit größeren Zuschauern, Training-Hitboxen, Porträtauswahl und Teamdarstellung, Pixel-Pause, Congratulations und Initialeneingabe mit dauerhaftem Ranglisteneintrag. Zwei lokale Spielfenster wurden tatsächlich per Einladung verbunden und hinsichtlich Kampfzustand, Pause und Verbindungsabbruch geprüft. Ungültige Highscores wurden zurückgewiesen; doppelte Lauf-IDs verändern vorhandene Einträge nicht. Eigene QA-Ranglisteneinträge und die temporäre Vorschauseite wurden entfernt. Kein physischer Test mit zwei Gamepads und kein Test über zwei unabhängige Internetanschlüsse.
