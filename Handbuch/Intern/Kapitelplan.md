# Kapitelplan

**Status:** Gliederung für die schrittweise Ausarbeitung. P0 = zuerst nötig, P1 = anschließende Kernkapitel, P2 = Vertiefung. „Architektur im Überblick“, „Geräteklassen“, „Kanäle“, „Hardwareabstraktion“ und „Programmablauf“ sind vollständig ausgearbeitet; andere Seiten sind öffentliche Einstiegs-/Platzhalterseiten. Unterkapitel dieser Tabelle können zunächst Abschnitte bleiben und später bei Bedarf eigene Seiten erhalten.

## Geplanter Lernweg und Veröffentlichungsumfang

| Priorität | Bereich / vorhandene Einstiegsdatei | Vollständige geplante Inhalte | Voraussetzungen und Quellen | Abnahmekriterium der späteren Ausarbeitung |
| --- | --- | --- | --- | --- |
| P0 | `README.md` | Zielgruppen, Voraussetzungen, Lesepfade, Versionsbezug, Mitwirkung | Bestehende Grundlagen und Quellenstand | Einsteiger finden ihren Einstieg; Platzhalter sind erkennbar. |
| P0 | `Grundlagen/Architektur.md` | Gerät, Kanal, HAL, Vererbung und enthaltene Objekte; Register, Funk und Scheduler als zusammenhängendes Modell | `Device.h`, `MultiChannelDevice.h`, `Channel.h`, `AskSinPP.h` | **Erledigt:** BME280-Sketchablauf und Architekturbausteine erklärt; Beziehungen am festgelegten Quellstand belegt. |
| P0 | `Grundlagen/Programmablauf.md` | `setup`, `init`, Erstinitialisierung, `initDone`, Hauptschleife, Alarme, Radio-Polling und Ruhephase | Architektur; `AlarmClock`, `Activity`; E1/E4 | **Erledigt:** Ablaufdiagramme, BME280-Messdurchlauf, kommentierte Schleife und eigener Alarm; Interrupt-/Hauptkontext sowie AVR-/RTC-Grenzen am Quellstand erklärt. Firmwareprüfung gehört zum nächsten Gerätetutorial. |
| P0 | `Grundlagen/Erstes-Geraet.md` | Ausgangssketch wählen, ID/Serial/Pins, HAL-/Kanaltypen, Kompilieren, Anlernen und erste Anpassung | Bestehende Hardware-/Flash-Anleitungen, E1 | Reproduzierbarer Lernsketch mit Board-/Bibliotheksständen; vorhandene Einrichtung nur verlinken. |
| P1 | `Klassen/Device.md` | `DeviceInfo`, Identität, `Device`, `ChannelDevice`, `MultiChannelDevice`, spezialisierte Geräte, Erststart und Konfigurationsänderung | Architektur, HAL, Programmablauf | **Erledigt:** Identität, Vererbung, Initialisierung und Speicherlayout am festgelegten Quellstand erklärt. |
| P1 | `Klassen/Channel.md` | Kanalnummer, Channel-API, Status/Flags, Peers, ActorChannel, gleichartige und gemischte Kanaltypen | Architektur, Geräte und Register-Einführung, E3/E4 | **Erledigt:** Listen, Peers, Spezialisierungen und virtuelle gemischte Kanäle am Quellstand erklärt. |
| P1 | `Klassen/HAL.md` | `AskSinBase`, `AskSin`, `AskSinRTC`, Statusanzeige, Batterie, Radio, optionaler Summer, eigene HAL-Hooks | Architektur, Inventar | **Erledigt:** Typzusammensetzung, Komponenten, Scheduler- und Plattformgrenzen erklärt. |
| P1 | `Klassen/Templates.md` | C++-Grundbegriffe, Typ-/Wertparameter, Defaults, Aliase, abhängige Namen, statische und virtuelle Schnittstellen, Fehlersuche | Reale HAL-/Kanaldarstellungen | Leser können eine verschachtelte Template-Definition lesen und typische Fehler zuordnen. |
| P1 | `Batterie/Grundlagen.md` | Spannung statt Ladezustand, VCC versus Batterie, Wandler, Einheiten, Messquelle/Meter/Bewertung, Library versus Sketch | [Batterieanalyse](./Batterieanalyse.md), konkrete Schaltung | Keine pauschalen Laufzeiten oder Schwellen; Begriffe und Messgrenzen klar. |
| P1 | `Batterie/Messverfahren.md` | AVR-Bandgap gegen AVCC, externe Teiler, Referenzen, Kalibrierung, Sync/Async/IRQ, Minimum, ADC-Konflikte, Intervalle | Hardwareentscheidung B1/B2, Messreihe B3/B4 | Geprüfte Schaltung und Vergleichsmessung; `BatterySensorExt`-Sonderfall korrekt erklärt. |
| P1 | `Batterie/Schwellenwerte.md` | Rundung, striktes `<`, Low/critical, Default null, List0-Anbindung, Reaktionen und fehlende Reaktionen in Beispielen | Messverfahren, B5 | Schwellen samt Einheiten und realer Versorgung begründet; Sketchreaktion demonstriert. |
| P1 | `Batterie/Energiesparen.md` | Activity, Idle/Sleep/SleepRTC, Timer/ADC/BOD, Empfang, Wandler/Sensorversorgung, Lastspitzen, Messung, Wiederanlauf | Programmablauf, B1/B6/B7/B8, E6/E7 | Gemessene Werte mit vollständigem Aufbau; keine Behauptung elektrischer Abschaltung allein durch Sleep. |
| P1 | `Funk/README.md` | SPI/CC1101/Radio, Message-Aufbau, Header/Flags, ACK/NACK und Wiederholung, Pairing versus Peering, Burst/WOR, Erreichbarkeit | E4/E7, `Device`, `Message`, `Peer`; bestehende FreqTest-FAQ | Mindestens ein nachvollzogener Sende-/Empfangsablauf mit Quelle. |
| P1 | `Register/README.md` | Registeradressen versus Speicheradressen; List0/1/2/3/4; `DEFREGISTER`; Standards, eigene Register, CCU-XML; EEPROM/UserStorage; Layoutwechsel | E3/E4/E8, `Register`, `ChannelList`, `Storage` | Ein Parameter durchläuft Definition, Speicherung, Konfigurationsänderung und Anwendung. |
| P1 | `Sensoren/README.md` | Sensoradapter versus Kanal, Einheiten, I²C, BME280, DHT22, Kontakte, Timing, Fehlerbehandlung und ungültige Werte | E1/E2/E3; externe Treiberstände A1/A2 | Eine Messung inklusive Fehlerfall wird im kompilierten Beispiel behandelt. |
| P1 | `Aktoren/README.md` | `ActorChannel`, SwitchChannel/StateMachine, Polarität, Startzustand, Taster/Peers, Ein-/Auszeiten | E4, später E7 | Schaltablauf am Niedervolt-Lernaufbau nachvollziehbar. |
| P0/P1 | `Praxis/README.md` | Lernbeispiele und Tutorials in der Reihenfolge E1, E3, E4, anschließend E5/E6/E7/E8/E9 | [Beispielkatalog](./Beispielkatalog.md) | Lernziel, benötigte Klassen, Voraussetzungen und Prüfnachweis je Tutorial. |
| P0 | `Referenz/README.md` | Repositories/Hashes, zentrale Quelllinks, Lizenzen, Versions- und Plattformgrenzen | Quellenstand und L1 | Jeder technische Quellbezug lässt sich reproduzieren. |

## Geplante Vertiefungen nach den Kernkapiteln

| Priorität | Thema | Vorgesehene Einordnung und noch benötigte Analyse |
| --- | --- | --- |
| P2 | Timer, Interrupts und Nebenläufigkeit | Vertiefung von Programmablauf: `async`, atomare Abschnitte, Ready-Queue, Entprellung, ISR-Laufzeit; keine blockierenden Sensorzugriffe im ISR-Kontext empfehlen. |
| P2 | Gemischte Kanaltypen | Erweiterung der Klassenkapitel: `VirtBaseChannel`, `VirtChannel`, reales gemischtes Gerät auswählen und kompilieren. |
| P2 | Persistenz und Migration | Registerbereich: externe EEPROM-Treiber, `store`, `UserStorage`, Größenlimits, Layoutwechsel und Erhalt beziehungsweise Neuinitialisierung vorhandener Konfiguration. |
| P2 | Funkdetails und Signaturen | Funkbereich: AES/KeyStore, Challenge/Response, Fehlersuche und präzise Abgrenzung der Sicherheitsfunktion am Quellcode. |
| P2 | Dimmer und Rollladenaktoren | Aktorbereich: konkrete Templates, virtuelle Dimmerkanäle, Rampen, Fahrzeiten, Treiber; zusätzliche Beispiele aus `Dimmer.h` und `Blind.h` vertieft lesen. |
| P2 | Weitere Plattformen | Sensor-/HAL-/Energiekapitel: STM32F1 versus STM32, EFM32, ESP32, RP2040 mit festem Board-Core und bestätigter Featurematrix. |
| P2 | Diagnose und Wartung | Querverweise auf bestehende FAQs, serielle Ausgabe, Gerätebeschreibung, Identitätskollisionen, OTA-/Bootloaderkonfiguration; bestehende Erklärungen nicht duplizieren. |

## Arbeitseinheit für ein vollständiges Kapitel

Jedes Kapitel nach `AGENTS.md` ausarbeiten: Ziel/Voraussetzungen, Konzept, relevante Klassen, Implementierung, praktisches Beispiel, Fehler/Fallstricke, Vertiefung und Quellverweise. Den Quellstand zuerst prüfen, dann den Text schreiben; Aussagen mit offenen Hardware- oder Versionsabhängigkeiten sichtbar begrenzen. Code als vollständigen Sketch oder Fragment kennzeichnen, Kompilier- und Hardwarestatus angeben.

## Grenze dieser Phase

Kein vollständiges Batteriehandbuch und keine generierte API-Dokumentation. Keine neuen Abhängigkeiten, Frameworkänderung oder Umstrukturierung bestehender Bereiche. Interne Planung bleibt aus Seitengenerierung und Navigation ausgeschlossen. Commits, Pushes und Pull Requests bleiben einem ausdrücklichen späteren Auftrag vorbehalten.
