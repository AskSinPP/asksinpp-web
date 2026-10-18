# Praxis und Lernbeispiele

**Status: Auswahl für spätere Tutorials.** Die Originalsketche wurden für die Planung gelesen; sie wurden in dieser Phase weder verändert noch neu kompiliert oder auf Hardware getestet.

| Beispiel | Lernziel | Einordnung |
| --- | --- | --- |
| [HM-WDS40-TH-I-BME280][bme] | Ein Sensorkanal mit I²C, zyklischer Messung und eigener Nachricht | Empfohlener Einstieg nach dem Architekturkapitel |
| [HM-WDS40-TH-I-DHT22][dht] | Batteriebetriebenes Sensorgerät mit einer Datenleitung | Alternative; interruptgestützte Batteriemessung als Vertiefung |
| [HM-SCI-3-FM][sci] | Mehrere gleichartige Kontakteingänge und Kanalnummern | Fortgeschrittene; externer Batteriespannungsteiler |
| [HM-LC-Sw2-FM][sw] | Zwei Schaltkanäle, lokale Taster und interne Peers | Einstieg in Aktoren |
| [HM-SEC-SC][sc] | Kontaktsensor mit umschaltbarer, zeitversetzter Spannungsmessung | Fortgeschrittene; Library und Sketch unterscheiden |
| [HM-WDS40-TH-I][rtc] | Sensor und Funkzeitplanung, optional mit RTC-Zeitbasis | Fortgeschrittene; Energiesparen und Timing |
| [HM-LC-SW1-BA-PCB][wor] | Batterieaktor mit Wake-on-Radio, alternativ BurstDetector | Fortgeschrittene; Empfang während Ruhephasen |
| [HM-Sen-LI-O][lux] | Helligkeitssensor mit Sendeintervall und Änderungsschwelle | Fortgeschrittene; weniger Funktelegramme |
| [HM-RC-P1][rc] | Tasterkanal und ereignisgesteuerte Batteriemessung | Ergänzung zur vorhandenen Flash-Anleitung |

Die Bezeichnungen in beiden Referenz-Repositories können ähnlich sein, obwohl sich ihre Implementierungen unterscheiden. Die Links sind deshalb an die [analysierten Commits](../Referenz/README.md) gebunden. Ob ein Sketch bei kritischer Batterie dauerhaft schläft, ist für jedes Beispiel getrennt zu prüfen.

Weitere Geräte: [vorhandene Sketchsammlung](/Sketche/) und [Projektübersicht](/Projekte/). Vorbereitung: [Das erste eigene Gerät](../Grundlagen/Erstes-Geraet.md).

[bme]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-WDS40-TH-I-BME280/HM-WDS40-TH-I-BME280.ino
[dht]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-WDS40-TH-I-DHT22/HM-WDS40-TH-I-DHT22.ino
[sci]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-SCI-3-FM/HM-SCI-3-FM.ino
[sw]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-LC-Sw2-FM/HM-LC-Sw2-FM.ino
[sc]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-SEC-SC/HM-SEC-SC.ino
[rtc]: https://github.com/pa-pa/AskSinPP/blob/main/examples/HM-WDS40-TH-I/HM-WDS40-TH-I.ino
[wor]: https://github.com/pa-pa/AskSinPP/blob/main/examples/HM-LC-SW1-BA-PCB/HM-LC-SW1-BA-PCB.ino
[lux]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-Sen-LI-O/HM-Sen-LI-O.ino
[rc]: https://github.com/pa-pa/AskSinPP/blob/main/examples/HM-RC-P1/HM-RC-P1.ino
