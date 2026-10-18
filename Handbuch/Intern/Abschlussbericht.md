# Abschlussbericht: erste Handbuchphase

**Stand:** 17. Oktober 2026, Branch `aspp-doku`. Analyse, Planung und VuePress-Einrichtung abgeschlossen. Keine vollständigen Fachkapitel, keine Firmwareänderungen, keine Commits, Pushes oder Pull Requests.

## 1. Analysierte Architektur

AskSinPP verbindet eine aus konkreten Typen zusammengesetzte HAL mit Geräte- und Kanalobjekten. `Device` stellt Identität, Funkverarbeitung und Versand bereit. `ChannelDevice` verwaltet Kanäle und Konfiguration; `MultiChannelDevice` besitzt gleichartige Kanalobjekte. Registerlisten und Peers liegen über `Storage` in einem persistenten Speicherlayout. `Radio` verbindet Nachrichten und Interrupts mit dem CC1101-Treiber und SPI. `AlarmClock` steuert zeitliche Aufgaben, `Activity` die Wach- und Ruhephasen. Sensoradapter liefern Werte; Aktorkanäle verbinden Konfiguration mit Zustandsmaschinen und Ausgängen.

Die Trennung zwischen Library und konkretem Sketch ist besonders bei Batterie, Messintervall und Sleep entscheidend. Details und Quellen: [Bestandsaufnahme](./Bestandsaufnahme.md), [Batterieanalyse](./Batterieanalyse.md), [Quellenstand](./Quellenstand.md).

## 2. Klassen und Templates

Das [Inventar](./Klasseninventar.md) enthält **33 Klassen, 50 Klassentemplates und die Struktur `DeviceInfo`**, insgesamt **84 Einträge**. Erfasst sind Datei, Zweck und Verwendung, Basen, Template-Parameter, öffentliche Methoden, Abhängigkeiten, Lernbeispiele und Zielgruppenniveau. Aliase und Makros sind gesondert erläutert und nicht doppelt gezählt. Das Inventar ist eine kuratierte Arbeitsgrundlage; es behauptet keine vollständige API-Abdeckung aller Display-, Dimmer- oder Plattformtreiber.

## 3. Ausgewählte Gerätebeispiele

| Beispiel | Vorgesehener Lernfall |
| --- | --- |
| E1 HM-WDS40-TH-I-BME280 | Einfacher Einkanalsensor, I²C und zyklische Nachricht |
| E2 HM-WDS40-TH-I-DHT22 | Alternativer Batteriesensor-Sketch, DHT und IRQ-Messung |
| E3 HM-SCI-3-FM | Mehrkanalgerät mit Kontakteingängen und eigenen Registern |
| E4 HM-LC-Sw2-FM | Schaltaktor mit zwei Kanälen, lokalen Tastern und Peers |
| E5 HM-SEC-SC | Umschaltbare, zeitversetzte Batteriemessung und Sketch-Schutzreaktion |
| E6 HM-WDS40-TH-I, Library | Optionaler RTC-Pfad, Messung vor dem Sendezeitpunkt |
| E7 HM-LC-SW1-BA-PCB, Library | Batterieaktor, Wake-on-Radio und alternative Burst-Prüfung |
| E8 HM-Sen-LI-O | Sensoradapter, Register und änderungsabhängiges Senden |
| E9 HM-RC-P1, Library | Tasterereignisse und Batteriemessung nach Sendeereignissen |

Der [Beispielkatalog](./Beispielkatalog.md) enthält die jeweiligen Originalquellen, HAL-/Kanalzuordnung, Batteriehinweise, Besonderheiten, Schwierigkeit und Lernwert. Die Sketche wurden statisch analysiert, nicht in dieser Phase kompiliert oder auf Hardware getestet.

## 4. Kapitelstruktur und Integration

Unter `Handbuch/` sind **18 öffentliche Seiten** eingerichtet: Einstieg; Architektur, erstes Gerät und Programmablauf; Device, Channel, HAL und Templates; vier Batterieabschnitte; Funk, Register, Sensoren, Aktoren, Praxis und Referenz. Die Fachkapitel sind als Platzhalter gekennzeichnet. Der [Kapitelplan](./Kapitelplan.md) enthält Inhalte, Prioritäten, Voraussetzungen und spätere Abnahmekriterien.

Der neue Hauptpunkt heißt **Entwicklerhandbuch**. Die Handbuch-Sidebar ist explizit gruppiert; bisherige Navigation und Sidebars bleiben erhalten. `Handbuch/Intern/**` und `AGENTS.md` werden von der Seitengenerierung ausgeschlossen. Vorhandene Hardware-, Flash-, Pairing-, FAQ-, Projekt- und Sketchseiten werden verlinkt; ihre Inhalte und URLs bleiben erhalten. Die Root-`AGENTS.md` legt Quellen-, Stil-, Code-, Lizenz- und Prüfregeln fest.

## 5. Wichtige offene technische Fragen

- Referenzschaltung, Versorgung, ADC-Referenz, Kalibrierung sowie BOD-/Taktkonfiguration für belastbare Batterieempfehlungen festlegen.
- Minimumspeicherung und ADC-Nutzung unter Last messen. Die Sonderrolle von `BatterySensorExt` vor Verwendung im Lernweg klären.
- Beispielunterschiede berücksichtigen: E1/E2/E9 reagieren trotz konfigurierter Schwelle nicht auf `critical()`; E3 fragt `critical()` ab, lässt die Schwellen aber auf ihren Null-Defaults. E7 hat keine kritische Schutzreaktion.
- Reproduzierbare Board-/Core-/Treiberkombinationen für die unabhängig gepflegten Repositories kompilieren.
- RTC-Genauigkeit, WOR/Burst-Verbrauch und Wiederanlauf auf benannter Hardware prüfen.
- Der Nutzer klärt die abweichenden Website-Lizenzmetadaten. Nach seiner Klärung folgen vor Projektabschluss ein gemeinsamer Kollisionscheck und ein Abgleich der tatsächlich verwendeten Inhalte; die laufende technische Dokumentation wird dadurch nicht ausgesetzt. Lizenzhinweise konkreter Quelldateien bleiben maßgeblich.

Alle Punkte sind mit konkreten Prüfaufträgen in [Offene Fragen](./Offene-Fragen.md) festgehalten. Aus Quellcode allein werden keine allgemein sicheren Spannungen, Stromverbräuche oder Laufzeiten abgeleitet.

## 6. Build und Qualitätsprüfung

**VuePress-Produktionsbuild erfolgreich, Exitcode 0.** Getestete Umgebung: Node 21.6.1, npm 10.2.4, VuePress 1.9.10 unter Windows mit Git Bash als npm-Shell. Vorhandene Abhängigkeiten aus dem Lockfile installiert; Paket- und Lockdatei unverändert.

Die Prüfung umfasst 18 erzeugte Handbuchseiten, 18 Sidebar-Ziele und 632 lokale Linkvorkommen einschließlich Anker. Es fehlen keine Ziele. Bestehende Navigation und Sidebars wurden strukturell gegen den Ausgangscommit verglichen; interne Dateien erscheinen nicht als HTML-Seiten oder Sitemap-Einträge. 77 feste Quellverweise wurden gegen die geklonten Stände geprüft. Der Build erzeugt eine Sitemap mit 141 Einträgen.

Vorhandene Meldungen zu veralteten Abhängigkeiten/Browserslist, `punycode` und dem benutzerspezifischen Updatecheck verhindern den Build nicht. Die lokale Prüfung ersetzt keinen CI-Lauf mit der dort konfigurierten Node-Version 26. Befehle, Grenzen und Einzelbefunde stehen in [Arbeitsstand](./Arbeitsstand.md).

## 7. Empfohlenes erstes vollständiges Kapitel

**„Architektur im Überblick“ zuerst ausarbeiten.** Es erklärt die Beziehungen zwischen Gerät, Kanal und HAL und gibt dem Leser die Grundlage für Register, Nachrichten und Energieverwaltung. Ein BME280-Sensorsketch (E1) und der Zweikanal-Schaltaktor (E4) liefern dazu zwei konkrete Sichtweisen. Danach folgen Programmablauf und der erste kompilierte Lernsketch; das ausführliche Batteriekapitel wird auf dieser Grundlage und mit festgelegter Referenzhardware entwickelt.

## Nachtrag: erstes vollständiges Kapitel

**17. Oktober 2026:** Auf Wunsch wurde [Architektur im Überblick](../Grundlagen/Architektur.md) als erstes Fachkapitel ausgearbeitet. Es erläutert die Vererbungsbeziehung `Device` → `ChannelDevice` → `MultiChannelDevice`, grenzt sie von der separat übergebenen HAL ab und behandelt Kanäle, Registerlisten, Peers, Storage, Alarme sowie den E1-Sensorablauf. Typische Fehlannahmen und weiterführende Kapitel sind verlinkt. Der Quellstand ist fest referenziert; das Kapitel behauptet keine Firmware- oder Hardwareprüfung.

Der Produktionsbuild nach dieser Ergänzung war erfolgreich (Exitcode 0); Client, Server, statisches HTML, Service Worker und Sitemap wurden neu erzeugt. Die 16 Markdown-Verweise des Kapitels zeigten auf vorhandene Ziele; `git diff --check` war fehlerfrei. Bestehende Meldungen zu veralteten Browserslist-Daten und `punycode` sowie zum benutzerspezifischen VuePress-Updatecheck blieben bestehen und verhinderten den Build nicht.

### Nachtrag: Klassenkapitel

Am selben Tag wurden auch [Device](../Klassen/Device.md), [Channel](../Klassen/Channel.md) und [HAL](../Klassen/HAL.md) auf Wunsch vollständig ausgearbeitet und in der Handbuch-Startseite als fertige Kapitel kenntlich gemacht. Die drei Seiten verlinken auf die am festgelegten Commit fixierten AskSinPP-Quelldateien. Der erneute Produktionsbuild war erfolgreich; 107 Markdown-Linkvorkommen in den vier Fachkapiteln, der Startseite und den aktualisierten internen Planungsseiten wurden geprüft, alle lokalen Ziele sind vorhanden. Die 16 festen Quelllinks der vier Fachkapitel zeigen auf Dateien in den lokalen Checkouts; die Verfügbarkeit externer Websites wurde nicht getestet. Es wurden keine Firmwaretests oder Hardwareprüfungen vorgenommen. Als nächster Lernabschnitt folgen Programmablauf und ein festgelegter, kompilierter BME280-Sketch. Die aktuelle Qualitätsprüfung steht im [Arbeitsstand](./Arbeitsstand.md).

### Nachtrag: Programmablauf

Auf weiteren Auftrag wurde [Programmablauf](../Grundlagen/Programmablauf.md) als fünftes Fachkapitel ausgearbeitet. Es führt von den globalen Objekten über Kanal-, Storage- und HAL-Initialisierung bis zu `initDone()`, Hauptschleife, Alarm-/Interruptpfaden, Funkabfrage und Ruhephase. Ein realer BME280-Durchlauf und der Vergleich zum Zweikanal-Schaltaktor verbinden die Klassenkapitel mit dem praktischen Ablauf. Eine kommentierte Schleife und ein eigenständig formulierter periodischer Zähler verdeutlichen die API; beide sind als Fragmente ohne Firmwarekompilierung gekennzeichnet. Die Grenzen von Tickeinheiten, Kurzschlussauswertung, blockierender Arbeit, RTC-Verarbeitung und Sketch-Batteriereaktionen sind erklärt.

Die Referenz-HEADs entsprechen unverändert den festgelegten Hashes. Der VuePress-Produktionsbuild war erfolgreich (Exitcode 0). Geprüft wurden 734 lokale Linkvorkommen einschließlich Anker auf allen 18 erzeugten Handbuchseiten, 18 Sidebar-Ziele und die 11 festen Quelldateilinks des neuen Kapitels. Es fehlen keine Ziele; interne HTML-Seiten und Sitemap-Einträge bleiben ausgeschlossen. Bestehende Umgebungswarnungen entsprechen dem [Arbeitsstand](./Arbeitsstand.md). Der nächste Schritt ist das Tutorial „Das erste eigene Gerät“ mit einer festgelegten und kompilierten BME280-Konfiguration.
