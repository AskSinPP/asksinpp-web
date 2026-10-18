# Das erste eigene Gerät

In diesem Tutorial entsteht ein Einkanalgerät, das mit einem BME280 Temperatur und relative Luftfeuchte misst und als Homematic-Sensor sendet. Du lernst, einen Ausgangssketch einzuordnen, Pins und Geräteidentität festzulegen, eine passende Softwarekombination zu kompilieren und die ersten Messungen zu prüfen.

**Prüfstand:** Sowohl der unveränderte Originalsketch als auch der hier angebotene Lernsketch wurden mit der unten festgelegten Kombination erfolgreich kompiliert. Aufbau, Flashen, Funkempfang, Anlernen und Sensorfehler wurden für dieses Tutorial noch nicht auf Hardware getestet. Die nachfolgenden Hardwareprüfschritte beschreiben, was du an deinem Aufbau kontrollieren sollst.

Vorausgesetzt werden die vorhandenen Anleitungen zu [Hardware](/Grundlagen/01_hardware.html), [Software und Flashen](/Grundlagen/02_software.html) und [Anlernen an die CCU](/Grundlagen/03_ccu.html). Die Zusammenhänge erklären [Architektur](./Architektur.md), [Device](../Klassen/Device.md), [Channel](../Klassen/Channel.md), [HAL](../Klassen/HAL.md) und [Programmablauf](./Programmablauf.md).

## Ausgangspunkt und vollständiger Lernsketch

Ausgangspunkt ist [HM-WDS40-TH-I-BME280 von papa/jp112sdl][original]. Davon getrennt steht eine angepasste, vollständige Datei bereit:

- [Lernsketch herunterladen][sketch] – `HM-WDS40-TH-I-BME280-Lernsensor.ino`.
- [Build-Nachweis herunterladen][nachweis] – genaue Versionen, Quellen-/Archivprüfsummen und Speicherbelegung beider Prüfbuilds.

Lege die `.ino`-Datei in einen gleichnamigen Ordner **HM-WDS40-TH-I-BME280-Lernsensor**. Speichere den verlinkten Quelltext, nicht die HTML-Seite eines GitHub-Dateibrowsers. Die Ausschnitte dieses Kapitels erläutern die Download-Datei; sie sind keine zusätzlichen Dateien.

Der Lernsketch verwendet eine stabile 3,3-V-Versorgung und `NoBattery`. Damit kannst du zuerst Sensor, Funk und Gerätefunktion nachvollziehen. Er verändert das Referenzrepository nicht. Die Unterschiede sind bewusst gewählt:

| Bereich | Original | Lernsketch |
| --- | --- | --- |
| Batterie | `BatterySensor` mit Schwellen, ohne `critical()`-Abfrage in `loop()` | `NoBattery`, keine Spannungsmessung und keine Batterieschutzreaktion |
| Sensorzugriff | Library-Adapter `as::Bme280` | `BME280I2C` direkt im Kanal, um Gleitkommawerte vor der Ganzzahlumwandlung zu prüfen |
| Sensormodus | Forced-Modus des Adapters | Normal-Modus mit Standby-Einstellung 1000 ms und Oversampling x1; der Sensor misst auch zwischen den Funkereignissen weiter |
| Fehler | Rückgabe der Messung wird vom Sketch nicht ausgewertet | Fehlender/falscher Chip, I²C-Timeout, nicht endliche oder außerhalb des gewählten Bereichs liegende Werte unterdrücken das Messwerttelegramm; nächster Versuch beim nächsten Termin |
| Weitere Funktionen | Optionales LCD und Messwert-Offsets | Diese Erweiterungen sind für den Einstieg weggelassen |

Der Normal-Modus macht den Messablauf überschaubar. Der Sketch ist damit kein optimiertes Batteriegerät. `NoBattery::current()` liefert einen festen Ersatzwert; er darf nicht als gemessene Versorgungsspannung interpretiert werden. Quellen: [Originalsketch][original], [`as::Bme280`][adapter] und [`NoBattery`][battery].

## Referenzaufbau und Pinbelegung

Die Referenzdefinition für dieses Tutorial ist ein **Arduino Pro Mini mit ATmega328P, 3,3 V und 8 MHz**, ein **CC1101-Modul für 868 MHz** und ein **BME280-Träger mit für 3,3 V geeigneter Versorgung und I²C-Pegeln**. Dazu kommen Konfigurationstaster, Status-LED mit Vorwiderstand, eine stabile Versorgung und ein USB-UART-Adapter mit passenden 3,3-V-Pegeln. Sie beschreibt den Zielaufbau des kompilierten Sketches; ein konkretes Trägerboard wurde hier nicht praktisch geprüft.

| Verbindung | Pin am Pro Mini | Gegenstelle |
| --- | --- | --- |
| Funk-Interrupt | D2 | CC1101 GDO0 |
| Statusanzeige | D4 | LED mit Vorwiderstand nach bestehender Hardwareanleitung |
| Konfigurationstaster | D8 | Taster nach GND; der Sketch verwendet den internen Pull-up |
| Funk-Chip-Select | D10 | CC1101 CSn |
| SPI-Ausgang | D11 | CC1101 SI/MOSI |
| SPI-Eingang | D12 | CC1101 SO/MISO |
| SPI-Takt | D13 | CC1101 SCLK |
| I²C-Daten | A4 | BME280 SDA, bei manchen Trägern SDI genannt |
| I²C-Takt | A5 | BME280 SCL, bei manchen Trägern SCK genannt |
| Versorgung / Bezug | VCC 3,3 V / GND | Passende Versorgungsanschlüsse und gemeinsame Masse aller Module |

SPI zum Funkmodul und I²C zum Sensor sind zwei unterschiedliche Busse. A4/A5 ergeben sich aus dem ATmega328P-Core; die D10–D13-Verbindung gehört zu dessen Hardware-SPI. Ein geänderter Pinname im Sketch ersetzt keine passende Hardwareanbindung. Die [vorhandene Verdrahtungsanleitung](/Grundlagen/01_hardware.html#verdrahtung) zeigt den Funkaufbau; für die AVR-Zuordnung ist der [festgelegte Arduino-Core][core] maßgeblich.

Der Lernsketch wählt **I²C-Adresse `0x76`**. Beim BME280-Chip ergibt sich diese Adresse aus SDO an GND, `0x77` aus SDO an VDDIO. CSB an VDDIO wählt I²C. Bei einem fertigen Träger können diese Verbindungen und Pull-ups bereits vorhanden sein; prüfe dessen Beschriftung und Schaltung. Pull-ups müssen zum 3,3-V-Bus passen. Die Schnittstellenwahl beschreibt das [Bosch-Datenblatt, Abschnitte 6.1/6.2][bosch].

::: warning Passender Aufbau
Verwende die 3,3-V-/8-MHz-Ausführung und passende Signalpegel. Ein als „BME280“ angebotener BMP280 besitzt keine Feuchtemessung und wird vom Lernsketch zurückgewiesen. Für die Versorgung des konkreten Trägerboards gelten dessen Anschlüsse und Schaltplan; ein vorhandener Regler oder eine andere VIN-Beschriftung darf nicht übergangen werden. Beim Flashen die Versorgung über Adapter und Aufbau bewusst aufeinander abstimmen; siehe [USB-UART-Anschluss](/Grundlagen/02_software.html#anschluss-des-ftdi-adapters).
:::

## Die kompilierte Softwarekombination

Der lokale Nachweis vom **17. Oktober 2026** gilt für diese Auswahl:

| Bestandteil | Festgelegter Stand |
| --- | --- |
| Rechner / Buildwerkzeug | Windows x64, Arduino CLI **1.5.1** (`01f3d4f2b`) |
| Boardkennung (FQBN) | `arduino:avr:pro:cpu=8MHzatmega328` |
| Boardpaket | Arduino AVR Boards **1.8.6** |
| Compiler | AVR GCC **7.3.0**, Paket `7.3.0-atmel3.6.1-arduino7` |
| AskSinPP | **5.0.3**, Commit `21bab8b92f7982c29beca08ff3c0ad6ef1e72a5c` |
| EnableInterrupt | **1.1.0** |
| Low-Power | Bibliotheksmanager-Version **1.81.0**; die Bibliothek selbst meldet **1.81** |
| BME280 | **3.0.0 von Tyler Glenn / finitespace**, mit Header `BME280I2C.h` |
| Wire / SPI | Je **1.0**, mit AVR-Core 1.8.6 geliefert |
| Zusätzliche Optionen | Kein LCD, kein OTA-Bootloader, kein `USE_AES` |

Die gleichnamige Adafruit-Bibliothek stellt eine andere API bereit und ersetzt `BME280I2C.h` nicht. Auch die Versionsnummer von AskSinPP allein reicht nicht zur Reproduktion: Für diesen Nachweis ist der genannte Commit maßgeblich. Die [Manifestdatei][nachweis] enthält die Prüfsummen des kompilierten Lernsketches sowie der drei zusätzlich installierten Bibliotheksarchive.

### Getrennte Buildumgebung in PowerShell

Installiere beziehungsweise entpacke [Arduino CLI 1.5.1 für Windows][cli-zip] und stelle `arduino-cli` über den Suchpfad bereit; alternativ ersetze es in den Befehlen durch den vollständigen Pfad zur EXE. Git wird für den festen AskSinPP-Quellstand benötigt. Die folgenden Befehle gehören in dieselbe PowerShell-Sitzung. Sie richten ein neues Verzeichnis für dieses Tutorial ein:

```powershell
$root = Join-Path $env:TEMP ('asksinpp-bme280-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $root | Out-Null
$cfg = Join-Path $root 'arduino-cli.yaml'
$dir = $root.Replace('\', '/')
$config = @"
directories:
  data: $dir/data
  downloads: $dir/downloads
  user: $dir/sketchbook
updater:
  enable_notification: false
"@
[IO.File]::WriteAllText($cfg, $config, [Text.UTF8Encoding]::new($false))

arduino-cli version
arduino-cli --config-file "$cfg" core update-index
arduino-cli --config-file "$cfg" core install arduino:avr@1.8.6
arduino-cli --config-file "$cfg" lib install 'EnableInterrupt@1.1.0' 'Low-Power@1.81.0' 'BME280@3.0.0'

git clone https://github.com/pa-pa/AskSinPP.git "$root\sketchbook\libraries\AskSinPP"
git -C "$root\sketchbook\libraries\AskSinPP" checkout --detach 21bab8b92f7982c29beca08ff3c0ad6ef1e72a5c
git -C "$root\sketchbook\libraries\AskSinPP" rev-parse HEAD

$sketch = Join-Path $root 'sketches\HM-WDS40-TH-I-BME280-Lernsensor'
New-Item -ItemType Directory -Path $sketch | Out-Null
```

Fahre nur fort, wenn die Installationsbefehle erfolgreich waren und `rev-parse HEAD` den angegebenen Hash ausgibt. Speichere jetzt die [vollständige `.ino`-Datei][sketch] unter `$sketch\HM-WDS40-TH-I-BME280-Lernsensor.ino`. Das von `$cfg` ausgewählte Bibliotheksverzeichnis ist Teil dieses Tutorials. Zusätzliche Bibliothekskopien aus einem anderen Sketchbook sollen nicht unbemerkt statt dieser Stände verwendet werden. Syntax und Verzeichnisoptionen dokumentiert die [Arduino-CLI-Anleitung][cli-install].

## Geräteidentität vor dem ersten Anlernen ändern

Der vollständige Sketch enthält diese **Beispielidentität**:

```cpp
const DeviceInfo PROGMEM devinfo = {
  {0xA1, 0xB2, 0xC3},
  "ASBME00001",
  {0x00, 0x3F},
  0x10,
  as::DeviceType::THSensor,
  {0x01, 0x00}
};
```

Wähle **eine in deiner Installation unbenutzte Drei-Byte-Gerätekennung und eine unbenutzte zehnstellige Seriennummer**. Die abgedruckten Werte sind nicht reserviert oder automatisch eindeutig. Notiere beide zusammen mit dem späteren Gerätestand. Die bestehende [Geräte-Konfigurationsanleitung](/Grundlagen/02_software.html#device-konfiguration) erklärt diese Zuordnung.

Behalte für dieses Tutorial die Modellkennung `0x00, 0x3F`, den THSensor-Typ und die übrigen Modellinformationen bei. Die Modellkennung beschreibt die protokollseitige Gerätefunktion; die Zahl `1` im Gerätetemplate bestimmt die Zahl der eigenen Kanäle. Der vom BME280-Treiber zusätzlich gelesene Druck wird mit diesem Telegramm nicht übertragen. Ändere die Identität möglichst vor dem Anlernen; ein späterer Wechsel muss mit der vorhandenen Zuordnung in der Zentrale abgestimmt werden.

## HAL, Kanal und Messablauf im Lernsketch

Die HAL verbindet `StatusLed`, `NoBattery` und das CC1101-Radio. `MultiChannelDevice<Hal, WeatherChannel, 1>` legt genau einen Wetterkanal an. Der lokale `WeatherChannel` erbt zusätzlich von `Alarm` und meldet sich in `trigger()` jeweils erneut an. Der Abstand beträgt zunächst **180 Sekunden**; der erste Termin verwendet wie das Original fünf Systemticks. Einzelheiten dazu erklärt [Programmablauf](./Programmablauf.md).

Im Lernsketch richtet das Kanal-`setup()` nur die Channel-Basis, `Wire` einschließlich Timeout und den ersten Alarm ein. Das eigentliche `sensor_.begin()` erfolgt beim ersten Messaufruf. Dadurch läuft diese Arbeit nach der vollständigen Geräteinitialisierung im Hauptkontext. Nach erfolgreicher Initialisierung wartet der Sketch einmal 50 ms auf eine erste Messung im Normal-Modus. Der Standardmodus bleibt aktiv, auch wenn der Mikrocontroller anschließend schläft.

Der Sensorzugriff verwendet `BME280I2C` direkt. Das ist hier eine bewusste Abweichung vom ursprünglichen `as::Bme280`-Adapter: Dessen Ganzzahlumwandlung würde bereits innerhalb von `measure()` geschehen. Der Lernsketch prüft davor endliche Temperatur-/Feuchtewerte, die gewählten Bereiche −40 bis +85 °C und 0 bis 100 % sowie das Wire-Timeoutkennzeichen. Danach rundet er auf Zehntelgrad beziehungsweise ganze Prozentpunkte und füllt die Nachricht. Das ist eine einfache Plausibilitätsprüfung, keine Kalibrierung oder Zusicherung der Messgenauigkeit. Die Sensorgrenzen sind im [Bosch-Datenblatt][bosch] beschrieben.

Bei Fehlern sendet der Messpfad keine neuen Wetterdaten und versucht beim nächsten Alarm erneut zu initialisieren. Er verschickt auch kein besonderes Fehlertelegramm; eine Zentrale kann folglich einen alten angezeigten Wert behalten. Die genaue Fehlererkennung hängt zusätzlich vom Treiber und elektrischen Bus ab. Es wird kein erfolgreicher Hardware-Fehlertest behauptet. In der [BME280-Bibliothek 3.0.0][bme-package] stehen dazu `BME280::read`, `chipModel` und `BME280I2C::ReadRegister`; das Timeout stammt aus [Wire des AVR-Cores 1.8.6][wire].

In `setup()` folgen auf `sdev.init(hal)` die Tasteranbindung und `sdev.initDone()`. Ein `initBattery()`-Aufruf entfällt bei dieser HAL. `loop()` bearbeitet die Alarm- und Funkarbeit jeweils mit einem eigenen Aufruf und nutzt bei ausbleibender Arbeit `Sleep<>`. Eine stabile Versorgung bedeutet damit nicht dauerhafte Empfangsbereitschaft. Ein Tastendruck kann über die Gerätefunktion eine Wachhaltephase zum Anlernen veranlassen.

## Kompilieren und Ergebnis einordnen

Baue die gespeicherte Datei in derselben Sitzung:

```powershell
arduino-cli --config-file "$cfg" compile --fqbn 'arduino:avr:pro:cpu=8MHzatmega328' --warnings default --build-path "$root\build" --output-dir "$root\output" "$sketch"
```

Der Befehl entspricht dem durchgeführten Prüfbuild; für dessen Protokoll wurde zusätzlich `--verbose` verwendet. Bei der Reproduktion lässt sich damit auch prüfen, aus welchen Verzeichnissen die Bibliotheken geladen werden. Nach Fehlern wird nicht zum Flashen übergegangen. Ein erfolgreicher Build erzeugt unter anderem die HEX-Datei im Ausgabeordner. Die [CLI-Referenz zum Kompilieren][cli-compile] beschreibt die Optionen.

| Tatsächlicher Prüfbuild | Programmspeicher | Statisch belegtes RAM | Ergebnis |
| --- | --- | --- | --- |
| Unverändertes HM-WDS40-TH-I-BME280 am festgelegten Beispielcommit | 25.432 von 30.720 Byte | 973 von 2.048 Byte | Exitcode 0 |
| Downloadbarer Lernsketch, unveränderte Tutorialkonfiguration | 24.832 von 30.720 Byte | 901 von 2.048 Byte | Exitcode 0 |

Die Werte gelten für die im [Build-Nachweis][nachweis] bezeichneten Quelldateien. Eigene Änderungen können sie verändern. Statisch freies RAM ist keine Garantie für ausreichend Stack und Heap während des Betriebs. Der Build beweist auch weder eine passende Funkfrequenz am realen Modul noch erfolgreichen Sensorzugriff, Flashvorgang oder Anlernen.

## Flashen, seriell prüfen und anlernen

1. Prüfe Versorgung, Busverbindungen und die gewählte Geräteidentität. Für den USB-UART-Anschluss einschließlich RX/TX und DTR gilt die [Flash-Anleitung](/Grundlagen/02_software.html). Der Bootloader muss zur gewählten Pro-Mini-Ausführung passen.
2. Ermittle den Anschluss deines Adapters. Mit `arduino-cli --config-file "$cfg" board list` kannst du vorhandene Ports anzeigen; ein USB-UART-Adapter muss dabei nicht automatisch als Pro Mini erkannt werden. Im folgenden Beispiel ist **COM7 ein zu ersetzender Platzhalter**.
3. Übertrage ausschließlich den erfolgreich gebauten Stand. Der Uploadbefehl kompiliert selbst nicht erneut:

```powershell
arduino-cli --config-file "$cfg" upload --fqbn 'arduino:avr:pro:cpu=8MHzatmega328' --port COM7 --input-dir "$root\output" "$sketch"
```

Schließe einen gegebenenfalls geöffneten seriellen Monitor vor dem Upload. Öffne ihn anschließend mit **57.600 Baud**. Erwartet werden Startdiagnosen und später beispielsweise `T=... C, H=... %` oder eine ausdrückliche BME280-Fehlermeldung. Diese Zeichenfolgen stammen aus dem Sketch; sie sind kein aufgezeichnetes Ergebnis eines Hardwareversuchs. Den Upload beschreibt auch die [offizielle CLI-Referenz][cli-upload].

Versetze danach die CCU in den Anlernmodus und betätige den Konfigurationstaster **kurz**. Der `ConfigButton` löst dabei `startPairing()` aus. Folge dem bestehenden [Anlernvorgang](/Grundlagen/03_ccu.html) und prüfe im Posteingang Identität, erkannte Gerätefunktion und Kanal. Der Build verwendet kein `USE_AES`; die Übertragungseinstellung muss dazu passen. Änderungen an Gerätebeschreibungen oder eine zusätzliche Druckanzeige sind kein Bestandteil dieses Modells.

### Was du am aufgebauten Gerät prüfen sollst

| Prüfschritt | Erwartetes Verhalten / Diagnose |
| --- | --- |
| Serieller Start mit korrekter Baudrate | Plausible Startausgabe; bei Zeichensalat Boardtakt, Baudrate und Versorgung kontrollieren |
| Sensor angeschlossen | Temperatur-/Feuchteausgabe; Werte mit einem geeigneten Vergleich und nach Einschwingen beurteilen |
| Adresse passt nicht oder statt BME280 ist ein BMP280 verbaut | Diagnose, kein neues Messwerttelegramm aus dem Messpfad, erneuter Versuch beim nächsten Intervall |
| Sensorfehler prüfen | Aufbau ausschalten, Sensorverbindung gezielt trennen, neu starten und Diagnose beobachten; anschließend ausgeschaltet wiederherstellen |
| Anlernen | Gerät mit der selbst gewählten Kennung im Posteingang; andernfalls Taster, Radioverdrahtung, Frequenz und Versorgung prüfen |
| Nach dem Anlernen | Temperatur und Feuchte im betreffenden Kanal vergleichen; eine unveränderte alte Anzeige allein beweist keinen neuen Empfang |

Diese Tabelle ist ein Arbeitsauftrag für die Hardwareprüfung. Im [Build-Nachweis][nachweis] sind `hardware_tested`, `upload_performed` und `pairing_tested` deshalb jeweils `false`.

## Erste gezielte Anpassungen

Ändere zunächst nur eine Sache und notiere den vorherigen Stand:

- **Sendeintervall:** Ersetze `#define MSG_INTERVAL 180UL` beispielsweise durch `300UL`. Das verändert die Alarmabstände für Messwertversand, nicht die interne Abtastrate des BME280 im Normal-Modus. Anschließend neu kompilieren und den neuen Stand flashen.
- **I²C-Adresse:** Wenn dein BME280-Träger auf `0x77` konfiguriert ist, ersetze in `sensorSettings` `BME280I2C::I2CAddr_0x76` durch `BME280I2C::I2CAddr_0x77`. Ersetze nicht die Homematic-Gerätekennung; sie gehört zum Funkgerät und hat mit der Sensoradresse nichts zu tun.

Die Größenangaben des Prüfbuilds beziehen sich auf die herunterladbare 180-Sekunden-/0x76-Konfiguration. Batterie, Kalibrierung, Filter, LCD und andere Gerätetypen sollten danach jeweils als eigene Änderung folgen. Für ein Batteriegerät müssen HAL-Messverfahren, reale Versorgung, Schwellen und Reaktion auf `critical()` zusammen festgelegt werden; ein bloßer Austausch von `NoBattery` liefert noch keinen Schutz.

## Häufige Stolperstellen und Quellen

Eine fehlende Datei `BME280I2C.h` weist auf die fehlende oder falsche Bibliothek hin. Fehlende `Wire.setWireTimeout`-Methoden sprechen für einen abweichenden Core. Bei `Low-Power` ist die Manager-Version 1.81.0 trotz der kürzeren Eigenangabe 1.81 korrekt. Ein erfolgreicher Upload mit falschem Takt kann trotzdem fehlerhafte Laufzeit- oder serielle Eigenschaften ergeben. Bei korrekten seriellen Messungen und fehlenden CCU-Werten liegt die nächste Diagnose im Funk-/Anlernpfad.

Der Sketch übernimmt die Quellenangaben aus der Originaldatei und kennzeichnet die Tutorialänderungen direkt im Dateikopf. Das Referenzrepository blieb unverändert.

Technische Quellen: [Originalsketch][original], [AskSinPP-Repository][asksin], [`as::Bme280`][adapter], [BME280 3.0.0][bme-package], [AVR-Core][core], [Wire][wire] und [Bosch BME280][bosch]. Der [allgemeine Quellenstand](../Referenz/README.md) ordnet die bisherigen Kapitel und den analysierten Commit ein. Weitere Geräte findest du unter [Praxis und Lernbeispiele](../Praxis/README.md), in der [Sketchsammlung](/Sketche/) und der [Projektübersicht](/Projekte/). Als nächster Themenblock folgen die [Batteriegrundlagen](../Batterie/Grundlagen.md) für einen ausdrücklich festgelegten Batterieaufbau.

[sketch]: /handbuch/beispiele/HM-WDS40-TH-I-BME280-Lernsensor/HM-WDS40-TH-I-BME280-Lernsensor.ino
[nachweis]: /handbuch/beispiele/HM-WDS40-TH-I-BME280-Lernsensor/build-nachweis.json
[original]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-WDS40-TH-I-BME280/HM-WDS40-TH-I-BME280.ino
[asksin]: https://github.com/pa-pa/AskSinPP/tree/main
[battery]: https://github.com/pa-pa/AskSinPP/blob/main/BatterySensor.h
[bme-package]: https://downloads.arduino.cc/libraries/github.com/finitespace/BME280-3.0.0.zip
[core]: https://github.com/arduino/ArduinoCore-avr/tree/main
[wire]: https://github.com/arduino/ArduinoCore-avr/blob/main/libraries/Wire/src/Wire.h
[bosch]: https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme280-ds002.pdf
[cli-zip]: https://downloads.arduino.cc/arduino-cli/arduino-cli_1.5.1_Windows_64bit.zip
[cli-install]: https://arduino.github.io/arduino-cli/1.5/installation/
[cli-compile]: https://arduino.github.io/arduino-cli/1.5/commands/arduino-cli_compile/
[cli-upload]: https://arduino.github.io/arduino-cli/1.5/commands/arduino-cli_upload/
