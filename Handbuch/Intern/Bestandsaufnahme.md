# Bestandsaufnahme und Architektur

**Status:** Quellcodeanalyse und Planung, kein vollständiges Entwicklerhandbuch. Maßgeblich sind die Commits in [Quellenstand](./Quellenstand.md).

## Vorhandene Website

| Vorhandener Bereich | Bereits erklärt beziehungsweise enthalten | Verwendung im Handbuch / Lücke |
| --- | --- | --- |
| `README.md` und lokale Theme-Komponente `Home.vue` | Einstieg und Zweck der Sammlung; die Startseite wird durch das lokale VuePress-Theme gestaltet | Startseite erhalten, neuen Einstieg über die Hauptnavigation anbieten. |
| `Grundlagen/README.md`, `01_hardware.md` | Pro Mini, CC1101, Verdrahtung, Versorgung, Batteriebetrieb, Hinweise auf Stromverbrauch | Verlinken. Es fehlt eine Erklärung der Firmwarearchitektur und der Zuordnung von Hardware zu HAL-Typen. |
| `Grundlagen/02_software.md` | HM-RC-P1 als Ausgangspunkt, Pins, ID/Serial, Arduino IDE, PlatformIO, Flashen, OTA | Verlinken. Keine zweite Installationsanleitung erstellen. Ein eigenes Gerät mit eigenen Kanal- und Registertypen wird noch nicht systematisch hergeleitet. |
| `Grundlagen/03_ccu.md` | Anlernen von Standard- und HomeBrew-Komponenten, Add-ons | Verlinken. Library-seitiger Pairing-Ablauf und Abgrenzung zu Peering fehlen. |
| `Grundlagen/04-isp.md` | ISP, avrdude, Fuses und Fehlersuche | Verlinken. Hardwareabhängige Fuses später mit Datenblatt und Boardkonfiguration prüfen, nicht pauschal übernehmen. |
| `Grundlagen/FAQ/Debugging.md`, `ftdi-flash-probleme.md` | Debugausgaben, CCU-Protokolle, ID-Kollisionen und Uploadfehler | Als praktische Fehlersuche nutzen; Alarm-/Interrupt-Kontext und Statusflags fehlen. |
| `Grundlagen/FAQ/Fehlerhafte_CC1101.md` | FreqTest, Frequenzanpassung, Speicherbereich für Funkkonfiguration | Verlinken. Zusammenarbeit von `Radio`, `CC1101`, `Message` und `Device` fehlt. |
| `Grundlagen/FAQ/Standard_vs_gesicherte_Uebertragung.md` | Hinweis auf AES beziehungsweise Standardübertragung | Verlinken. Signaturen und Protokolldetails werden später nur anhand der aktiven Implementierung erklärt. |
| `Grundlagen/FAQ/babbling_idiot.md` | Brown-out, Reset-Schleifen, Fuses, externe Vertiefung | Als bestehende Erklärung verlinken; keine allgemein sichere Unterspannungsgrenze daraus ableiten. Eine systematische Batterieanalyse fehlt. |
| `Grundlagen/FAQ/LED_Grundlagen.md` | Elektrische LED-Grundlagen, PWM, Konstantstrom/-spannung und Dimmverfahren | Für Aktorhintergrund verlinken; kein Ersatz für `SwitchChannel` oder Zustandsmaschinen. |
| `Grundlagen/STM32/` | Boardaufbau, Flashen, PlatformIO, Funkprüfung, Hardware-Seriennummer | Als Plattformmaterial erhalten. Neues Handbuch beginnt mit benanntem AVR-Fokus; kein Anspruch auf gleiche Sleep-/ADC-Implementierung aller Plattformen. |
| `Sketche/README.md` | Umfangreiche Linksammlung nach Autoren und Gerätearten | Als zentrales Gesamtverzeichnis erhalten. Ergänzend ein didaktischer Katalog mit nachgewiesenen Klassen und Kanalzahlen. |
| `Projekte/README.vue`, Projektdateien | Projektsammlung aus Frontmatter; Material und Umbauten | Nicht in `README.md` umwandeln. Kanonische URL `/Projekte/` erhalten. |
| `Projekte/psi/HMSensor/` | Platine, Drehgriffkontakt, BME280 mit RTC, externe Batteriemessung bei Step-up | Für Hardwarebezug und Weiterleitungen nutzen. Ältere gezeigte Konfigurationen weichen vom aktuellen Library-Beispiel ab. |
| `Platinen/`, `Gehaeuse/`, `rftypes/` | Materialsammlungen und Geräte-XMLs | Verlinken. Verbindung zwischen Registerlisten und CCU-Gerätebeschreibung soll ein späteres Kapitel herstellen. |

## VuePress-Bestand und Integration

- VuePress **1.9.10**, Vue 2, lokale Theme-Erweiterung. Navigation in `.vuepress/nav.js`; Sidebars in `.vuepress/sidebar.js`. `config.js` ruft die Sidebar-Funktion auf.
- Vorhandene Sidebar-Gruppen lesen Dateien aus ausgewählten Verzeichnissen. Das Handbuch erhält bewusst eine explizite, thematisch geordnete Liste. `Intern` wird darin nicht eingesammelt.
- Markdown-Syntaxhervorhebung und Zeilennummern sind vorhanden; C++-Codeblöcke können `cpp` nutzen. Für die erste Phase ist kein Diagramm- oder anderes Zusatzpaket nötig.
- VuePress sammelt standardmäßig Markdown- und Vue-Dateien aus dem gesamten Projekt. Nur einen Sidebar-Eintrag wegzulassen verhindert deshalb keine Veröffentlichung. Die ergänzten negativen `patterns` schließen `Handbuch/Intern/**` und `AGENTS.md` von der Seitenerzeugung aus; alle bisherigen Markdown-/Vue-Seiten bleiben im Suchmuster.
- PWA, Sitemap, Suchkonfiguration, Theme und bestehende Pfade bleiben erhalten. Neue Handbuchseiten sind über `/Handbuch/` erreichbar. Die vorhandene externe Algolia-Konfiguration benötigt gegebenenfalls einen späteren Crawl; ein lokaler Build aktualisiert keinen externen Suchindex.
- Paketdatei und Lockfile bleiben unverändert. Die vorhandenen Build- und Postinstall-Skripte setzen POSIX-Shellsyntax voraus; die lokale Windows-Ausführung erfolgt mit Git Bash als npm-Shell.

## Technische Bestandsaufnahme der Library

Die folgenden Aussagen beschreiben den festgehaltenen Library-Commit, vorwiegend die AVR-Pfade. Die Beziehungen sind Aufgabenbeziehungen; die konkreten Basisklassen stehen im [Inventar](./Klasseninventar.md).

| Komponente | Nachgewiesener Ablauf und Zusammenhang | Zentrale Quellen und Symbole |
| --- | --- | --- |
| Gerät | `DeviceInfo` beschreibt Identität und Modell; `Device` bindet HAL, List0 und Nachrichten zusammen. `pollRadio()` liest und dispatcht empfangene Nachrichten. | `Device.h`: `DeviceInfo`, `Device::send`, `pollRadio` |
| Kanäle und Mehrkanalgeräte | `ChannelDevice` hält Kanalzeiger, legt Adressen fest und verarbeitet Konfiguration. `MultiChannelDevice` besitzt ein Array gleichartiger Kanäle; `VirtChannel` kann unterschiedliche konkrete Kanaltypen hinter einer Schnittstelle zugänglich machen. | `MultiChannelDevice.h`: `registerChannel`, `layoutChannels`, `process`; `Channel.h`: `VirtBaseChannel`, `VirtChannel` |
| HAL | `AskSin` enthält LED, Batterie, Radio, Activity und Summer als konkrete Typen. `init()` startet unter anderem Funk und Systemuhr; Batteriemessung wird gesondert initialisiert. `AskSinRTC` ergänzt `rtc`. | `AskSinPP.h`: `AskSin::init`, `initBattery`, `AskSinRTC` |
| Register | Listen bilden Protokollregisternummern auf Speicherpositionen ab. `DEFREGISTER` definiert ein ausgewähltes Registerinventar; `RegList0/1/2/3/4` bieten typisierte Zugriffe. List0 gehört zum Gerät, List1/2 zum Kanal, List3/4 zu Peers; tatsächliche Listenbelegung hängt vom Kanaltyp ab. | `Register.h`, `ChannelList.h`; `Channel::getList1/2/3/4`, `peerAddress` |
| EEPROM/Persistenz | `ChannelDevice::checksum()` berücksichtigt den Geräteaufbau. `StorageWrapper::setup()` vergleicht einen Magic-Wert mit Layoutprüfsumme; bei abweichendem Wert stößt `init()` Standardwerte an. Das ist kein allgemeiner Schutz aller Nutzdaten gegen Beschädigung. `InternalEprom` verwendet im AVR-Pfad EEPROM, andere Plattformpfade können RAM/Flash und explizites `store()` verwenden. | `Storage.h`: `InternalEprom`, `StorageWrapper::setup`; `MultiChannelDevice.h`: `checksum`, `firstinit`, `getUserStorage` |
| Funk und CC1101 | `AvrSPI` beziehungsweise `LibSPI` stellen den SPI-Zugriff bereit. `CC1101` implementiert Chipinitialisierung, Register, Empfang und Versand. `Radio` ergänzt Interruptanbindung, Zustände und Nachrichtentransport; `Device::send()` ergänzt Wiederholungen und Antworten. | `Radio.h`: `Radio::handleInt`, `read`, `write`; `Radio-CC1101.h`: `CC1101`; `Device.h`: `send`, `waitResponse` |
| Nachrichten und Partner | `Message` enthält Telegrammdaten und Flags; spezialisierte Nachrichtentypen interpretieren die Felder. `HMID` ist eine Geräteadresse, `Peer` ergänzt den Kanal. Kanal-Peerlisten speichern Direktverknüpfungen. Die Zentrale wird über List0-Master-ID und den Konfigurationsablauf eingebunden. | `Message.h`, `HMID.h`, `Peer.h`; `Channel::peer`; `ChannelDevice::startPairing` |
| Zeit und Interrupts | `Alarm` ist ein geplanter Rückruf. `AlarmClock` verwaltet Warte- und Bereitschaftslisten. Beim Ablauf führt `operator--` als asynchron markierte Aufgaben direkt aus, andere gelangen in die Ready-Liste. `runready()` arbeitet diese in der Anwendung ab. Auf AVR taktet Timer1 `sysclock`; der RTC-Pfad nutzt Timer2. | `Alarm.h`; `AlarmClock.h/.cpp`: `AlarmClock::add`, `operator--`, `runready`, AVR-ISRs |
| Batterie und Energie | Messquelle, Messablauf und Schwellenbewertung sind getrennte Schichten. `Activity` entscheidet anhand von Wachhaltezeiten über die Ausführung einer Sleep-Strategie. Der Sketch wählt diese Strategie und einen gegebenenfalls dauerhaften Ruhezustand. | `BatterySensor.h`, `Globals.cpp`, `Activity.h`, `AskSinPP.h`; [Batterieanalyse](./Batterieanalyse.md) |
| Sensoren | Wertklassen geben unter anderem Temperatur in Zehntelgrad zurück. Konkrete Adapter initialisieren und lesen Hardware. Ein Sensor ist nicht automatisch ein Kanal: beispielsweise enthält der BME-Sketch den Sensor im eigenen `WeatherChannel`. | `Sensors.h`, `sensors/Bme280.h`, `sensors/Dht.h`; Beispiele E1/E2 |
| Aktoren | `ActorChannel` verbindet Kanal und Zustandsmaschine. `SwitchChannel` setzt Schaltzustände auf einem Pin um; `SwitchStateMachine` verarbeitet Laufzeiten und Peeraktionen. Dimmer/Rollläden verwenden weitere Spezialisierungen. | `Channel.h`, `Switch.h`, `StateMachine.h`, `Dimmer.h`, `Blind.h` |
| Taster | `StateButton` entprellt und unterscheidet Tastenzustände über Alarmaufgaben. `ConfigButton` verknüpft Zustände mit Pairing/Reset; `InternalButton` erzeugt lokale Ereignisse. `buttonISR` verbindet Pins mit der Interruptbehandlung. | `Button.h`: `StateButton`, `ConfigButton`, `InternalButton`, `buttonISR`; `Remote.h` |

## Ergebnis und Grenzen

Es fehlen vor allem ein zusammenhängender Lernweg, ein nachvollziehbares Klassenbild und die Erklärung der Beziehungen zwischen Registern, Nachrichten, Zeitbasis und Energieverwaltung. Diese Phase ergänzt die Struktur sowie überprüfbare Arbeitsunterlagen. Vollständige Tutorials, eine Firmware-Kompatibilitätsmatrix und Messungen auf Hardware folgen später. Offene technische Punkte sind mit Prüfaufträgen in [Offene Fragen](./Offene-Fragen.md) erfasst.
