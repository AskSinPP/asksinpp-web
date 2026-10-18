# Beispielkatalog

**Status:** Auswahl und statische Quellcodeanalyse, keine Kompilierung oder Hardwarevalidierung. Bezugsstände siehe [Quellenstand](./Quellenstand.md). E1–E5/E8 stammen aus `jp112sdl/Beispiel_AskSinPP`, E6/E7/E9 aus `pa-pa/AskSinPP`. Gleichnamige Klassen in einzelnen Sketchen sind nicht automatisch dieselben Library-Typen.

## Sichtung und Auswahl

Das Beispielrepository enthält am analysierten Stand **48 unmittelbare Unterverzeichnisse unter `examples/` und 69 `.ino`-Dateien** einschließlich Varianten und verschachtelter Projekte. Die Library enthält **43 `.ino`-Dateien unter `examples/`**. Diese Zahlen zählen Dateien beziehungsweise Verzeichnisse, keine 112 voneinander unabhängigen Geräte.

Die Verzeichnisse und Typdefinitionen wurden zur Orientierung gesichtet. Die folgenden **neun Beispiele** wurden anhand ihrer HAL, Kanäle, Hauptschleife und Konfiguration vertieft gelesen. Weitere vorhandene Gruppen umfassen unter anderem Displays, Leistungsmessung, Rollladen-/Markenaktorumbauten und Mehrkanalsender; sie sind Kandidaten für spätere Kapitel und werden hier nicht als vollständig geprüft ausgegeben.

| Pflicht-Lernfall | Auswahl | Begründung |
| --- | --- | --- |
| Einfaches batteriebetriebenes Sensorgerät | E1 BME280, alternativ E2 DHT22 | Ein Kanal; überschaubare Abfolge aus Alarm, Messung und Wettertelegramm. Bei E2 ist die Batteriemessung intern anspruchsvoller. |
| Sensor mit I²C | E1 BME280 | Konkreter Library-Adapter und klarer Sensor-/Kanalübergang. |
| Mehrkanalgerät | E3 HM-SCI-3-FM | Drei konfigurierte Kontakteingänge, Typ-/Speicherbezug und Nummerierung. |
| Schaltaktor | E4 HM-LC-Sw2-FM | Zwei gleichartige Schaltkanäle, lokale Bedienung und interne Peers. |
| Besondere Energiesparmechanismen | E6 RTC-Sensor und E7 Batterieaktor | Unterschiedliche Anforderungen an Zeitgenauigkeit und Erreichbarkeit im Schlaf. |

Schwierigkeitsgrad bezeichnet den Aufwand zum Verstehen und Anpassen der Firmware, nicht die elektrische Eignung eines Netzspannungsgeräts. Batteriezellzahl und Chemie sind nur genannt, wenn sie aus der untersuchten Quelle eindeutig hervorgehen; aus einem Klassennamen oder einer Schwelle wird keine Versorgung abgeleitet.

## E1: HM-WDS40-TH-I-BME280

**Quelle:** [Originalsketch][e1], insbesondere `WeatherChannel::setup/trigger`, `WeatherEventMsg::init`, `setup`, `loop`.

| Merkmal | Quellcodebefund |
| --- | --- |
| Gerätetyp und Messwerte | Temperatur-/Feuchtesensor, `DeviceType::THSensor`. Der BME280 kann zusätzlich Druck messen, dieser Sketch sendet aber nur Temperatur und Feuchte. |
| Sensor/Aktor | `as::Bme280` mit I²C über `sensors/Bme280.h`, `Wire`, externer BME280-Bibliothek. Optionales LCD ist mit `USE_LCD` abgeschaltet. |
| AskSinPP-Klassen | `AskSin`, `BatterySensor`, `AvrSPI`, `Radio`, `StatusLed`, `Channel`, `Alarm`, `Message`, `MultiChannelDevice`, `ConfigButton`. `WeatherChannel` und `WeatherEventMsg` sind lokale Sketchklassen. |
| Kanalstruktur | `MultiChannelDevice<Hal,WeatherChannel,1>`; List1, keine List3, List4, sechs Peerplätze. |
| Batterie und Sleep | Interne Versorgungsschätzung, Initialmessung und Stundenperiode; `initBattery(3600,22,19)`. Leerlauf mit `Sleep<>`. Keine `critical()`-Abfrage in `loop()`. Zellzahl/Chemie aus dem Sketch nicht eindeutig. |
| Besonderheiten | `MSG_INTERVAL=180`; jeder zwanzigste Zählerstand mit Rest 1 nutzt `sendPeerEvent`, andere `broadcastEvent`. Offsets für Temperatur und Feuchte. |
| Schwierigkeit und Lernwert | Mittel; bester Kandidat für den ersten Sensor-Lernweg nach Einführung in Gerät/HAL/Kanal. Vor Tutorial Sensorfehler und Unterspannungsstrategie ergänzend besprechen. |

## E2: HM-WDS40-TH-I-DHT22

**Quelle:** [Originalsketch][e2], `Hal`-Alias, lokaler `WeatherChannel`, `setup`, `loop`.

| Merkmal | Quellcodebefund |
| --- | --- |
| Gerätetyp und Sensor | Temperatur-/Feuchtesensor mit `Dht<DHT22_PIN,DHT22,4>`, Datenpin A5. Vier Messversuche möglich; keine I²C-Anbindung. |
| AskSinPP-Klassen | `AskSin`, `IrqInternalBatt`, `Dht`, `Channel`, `Alarm`, `Message`, `MultiChannelDevice`, `ConfigButton`, Standardfunk/LED. |
| Kanalstruktur | Ein lokaler Wetterkanal mit sechs Peerplätzen; Aufbau vergleichbar E1. |
| Batterie und Sleep | `initBattery(3600,22,19)`, aber `IrqInternalBatt::init` ignoriert Intervall und Clock und startet ADC-Hintergrundmessung. `Sleep<>`, keine kritische Abschaltung im Sketch. Versorgungstopologie/Zellen offen. |
| Besonderheiten | 180-s-Sendezyklus und Offsetkorrektur. Ein Messfehler wird protokolliert, die gespeicherten Sensorwerte werden anschließend dennoch gelesen. |
| Schwierigkeit und Lernwert | Mittel für Sensorablauf, höher für ADC-Interna. Als einfaches Einkanalgerät geeignet, wenn die interruptgestützte Batteriemessung zunächst klar abgegrenzt wird. |

## E3: HM-SCI-3-FM

**Quelle:** [Originalsketch][e3], `CHANNEL_COUNT`, `Hal::init`, `SCIList0/1`, `ChannelType`, `setup`, `loop`.

| Merkmal | Quellcodebefund |
| --- | --- |
| Gerätetyp und Sensoren | Kontakteingänge, `DeviceType::Swi`; konfiguriert drei, Pinarray für bis zu sieben Eingänge. |
| AskSinPP-Klassen | `AskSin`, `BatterySensorUni<A6,7>`, `DualStatusLed`, `TwoStateChannel`, `StateDevice`, `RegList0/1`, `DefList4`, `ConfigButton`. |
| Kanalstruktur | `StateDevice<Hal,ChannelType,CHANNEL_COUNT,SCIList0>`, `CHANNEL_COUNT=3`; zehn Peerplätze pro Kanal. Die Schleife initialisiert `channel(i+1)` mit dem passenden Pin. |
| Batterie und Sleep | Externe Messung, `battery.init(seconds2ticks(3600),sysclock)`. Die Teiler-/Versorgungsschaltung und Zellen sind nicht im Sketch vollständig festgelegt. `Sleep<>`; `critical()` wird abgefragt. |
| Wichtige Einschränkung | Der Sketch setzt weder `low` noch `critical`. Mit dem analysierten Library-Konstruktor bleiben beide Schwellen null; die kritische Abfrage löst dann keine Abschaltung aus. Nicht als fertig konfigurierten Tiefentladeschutz vermitteln. |
| Schwierigkeit und Lernwert | Mittel bis hoch; guter Mehrkanal-Lernfall für Kanalnummern, Speicherbedarf und Register. Hardware und Schwellen vor einem Tutorial klären. |

## E4: HM-LC-Sw2-FM

**Quelle:** [Originalsketch][e4], `SwitchType`, `InternalButton`, `initPeerings`, `loop`.

| Merkmal | Quellcodebefund |
| --- | --- |
| Gerätetyp und Aktoren | Zweifach-Schaltaktor, `DeviceType::Switch`; zwei Relais-/Schaltausgänge auf A3/A2. Zwei lokale Taster zusätzlich zum Konfigurationstaster. |
| AskSinPP-Klassen | `AskSin`, `NoBattery`, `SwitchChannel`, `MultiChannelDevice`, `InternalButton`, `ConfigButton`, `Peer`, `HMID`. |
| Kanalstruktur | Zwei `SwitchChannel<Hal,8,List0>`-Kanäle; lokale Taster erzeugen interne Ereignisse für Kanal 1/2. |
| Versorgung und Ruhemodus | `NoBattery`, keine Spannungsmessung. Versorgungshardware aus dem Sketch nicht eindeutig; dauerhaft verfügbarer Funk mit `Idle<>` im Leerlauf. |
| Besonderheiten | Interne Peers werden nur bei Erstinitialisierung angelegt. `LOW_ACTIVE` legt die Ausgangspolarität fest. |
| Schwierigkeit und Lernwert | Mittel; geeigneter Einstieg in Aktoren, Peering und Initialzustände. Geplanter Lernaufbau mit LEDs/Niedervolt-Ausgängen, ohne Veränderung des Originalsketches. |

## E5: HM-SEC-SC

**Quelle:** [Originalsketch][e5], `SwitchSensor`, `BatSensor`, `SCType::configChanged`, `loop`.

| Merkmal | Quellcodebefund |
| --- | --- |
| Gerätetyp und Sensor | Tür-/Fensterkontakt mit einem Kontakteingang und Sabotagepin. `devinfo` verwendet die Protokollkategorie `ThreeStateSensor`, der konkrete Kanal ist trotzdem ein `TwoStateChannel`. |
| AskSinPP-Klassen | `InternalVCC`, `ExternalVCC<17,7,LOW,3000>`, `BattSensor<AsyncMeter<SwitchSensor>>`, `AskSin`, `TwoStateChannel`, `StateDevice`, `RegList0/1`. |
| Kanalstruktur | Ein Kanal, zehn Peerplätze, zyklischer Status mit `CYCLETIME` 16 Stunden bei entsprechendem List0-Parameter. |
| Batterie und Sleep | `DEVICE_CONFIG` setzt Step-up-Modus aus und Schwellen 22/19. `configChanged()` übernimmt sie und schaltet den eigenen Messadapter um. Stundenperiode; `critical()` führt im Leerlauf zu `sleepForever()`, sonst `Sleep<>`. Zellen/Chemie offen. |
| Besonderheiten | Eigener `SwitchSensor` vereinheitlicht interne/externe Messquelle. `AsyncMeter` vermeidet die 250-ms-Wartephase im periodischen Startpfad; Initialmessung bleibt synchron. |
| Schwierigkeit und Lernwert | Hoch; guter Vergleich für Template-Komposition und die Trennung von Library-Funktion und Sketchentscheidung. Kein erster vollständiger Anfänger-Sketch. |

## E6: HM-WDS40-TH-I mit optionaler RTC

**Quelle:** [Originalsketch der Library][e6] sowie [Weather.h][weather], [AskSinPP.h][hal].

| Merkmal | Quellcodebefund |
| --- | --- |
| Gerätetyp und Sensoren | Temperatur-/Feuchtesensor mit wählbarem Adapter; am untersuchten Stand `SENSOR_BME280` aktiv. Weitere Adapter sind als Alternativen vorgesehen. |
| AskSinPP-Klassen | `AskSin` beziehungsweise `AskSinRTC`, `BatterySensor` beziehungsweise optional `BatterySensorUni<17,7,3000>`, Library-`WeatherChannel`, `SysClock`/`RealTimeClock`, `MultiChannelDevice`, `Alarm`. |
| Kanalstruktur | Ein Wetterkanal mit sechs Peerplätzen, eigener `WeatherList0`; ein Sensorcontainer plant die Messung vor dem Versand. |
| Batterie und Sleep | Defaultschwellen 21/19; Stundenmessung; explizite `critical()`-Reaktion mit `sleepForever()`. `hal.sleep<>()` wählt beim RTC-Typ `SleepRTC`. Batteriezellzahl nicht eindeutig. |
| Besonderheiten | `USE_RTC` ist standardmäßig auskommentiert; eine passende AVR-Timer2-Taktquelle muss für die RTC-Variante vorhanden sein. `Sensors::before()` liefert 4000 ms, `EXTRAMILLIS=730`; der Sendezeitpunkt wird berechnet statt eines festen 180-s-Zyklus. |
| Schwierigkeit und Lernwert | Hoch; zentraler Kandidat für Timing, Schlafmodus und Messung vor dem Senden. Gleichnamige Website-Hardwareseite verwendet ältere Beispielkonfigurationen. |

## E7: HM-LC-SW1-BA-PCB

**Quelle:** [Originalsketch der Library][e7], `SwitchType::configChanged`, `setup`, `loop`; [Radio-CC1101.h][cc1101] für `USE_WOR`.

| Merkmal | Quellcodebefund |
| --- | --- |
| Gerätetyp und Aktor | Batterie-Schaltaktor mit einem Ausgang, `DeviceType::Switch`. |
| AskSinPP-Klassen | `AskSin`, `BattSensor<AsyncMeter<InternalVCC>>`, `Radio`, `SwitchChannel`, `MultiChannelDevice`, `RegList0`, `ConfigToggleButton`, `ResetOnBoot`; alternativ `BurstDetector`. |
| Kanalstruktur | Ein Schaltkanal, acht Peerplätze, eigener `SwList0` mit `DREG_LOWBATLIMIT`. |
| Batterie und Sleep | Stundenperiode für interne Messung; Low-Schwelle standardmäßig 22 und Übernahme aus List0. Keine Konfiguration einer Critical-Schwelle und keine `critical()`-Abfrage. `Sleep<>`; 15 Sekunden Wachhaltezeit nach Start. Zellzahl/Chemie und Relaisversorgung offen. |
| Besonderheiten | `USE_WOR` ist im Sketch definiert: CC1101-Wake-on-Radio im Ruhezustand. Nur ohne diese Definition wird der `BurstDetector` des Sketches aktiviert. Interne Peers werden bei Erststart erzeugt. |
| Schwierigkeit und Lernwert | Hoch; geeigneter Sonderfall für Empfangslatenz und Energiebedarf. Kein Beleg für eine automatische elektrische Abschaltung von Aktor oder Batterie. |

## E8: HM-Sen-LI-O

**Quelle:** [Originalsketch][e8], `SENSOR_CLASS`, `LuxChannel::trigger`, `Hal::init`, `loop`.

| Merkmal | Quellcodebefund |
| --- | --- |
| Gerätetyp und Sensoren | Helligkeitssensor; `MAX44009<>` aktiv, `Bh1750` und `Tsl2561` als auskommentierte Alternativen. |
| AskSinPP-Klassen | `AskSin`, `BatterySensor`, `MAX44009`, `Channel`, `Alarm`, `RegList0/1`, `Message`, `MultiChannelDevice`, `ConfigButton`. Lokaler Template-Kanal `LuxChannel<SENSOR>`. |
| Kanalstruktur | Ein Kanal, sechs Peerplätze; eigene Register für Sendeabstand und Änderungsschwelle. |
| Batterie und Sleep | Interne Messung jede Stunde, Schwellen 22/19; im Leerlauf `critical()` und `sleepForever()`, sonst `Sleep<>`. Versorgungsschaltung/Zellen nicht eindeutig. |
| Besonderheiten | Minimaler Mess-/Prüfabstand aus `txMindelay`, mindestens acht Sekunden. `LUX_EVENT_CYCLIC_TIME` ist 120 Sekunden; ein Kommentar im Ablauf spricht abweichend von drei Minuten. Änderungsereignisse können Funkverkehr reduzieren; `cyclicInfoMsgDis` steuert ausgelassene Zyklen. |
| Schwierigkeit und Lernwert | Hoch; gut für eigene Register, Sensoradapter und bedarfsgesteuertes Senden. Tatsächlichen Verbrauch gesondert messen. |

## E9: HM-RC-P1

**Quelle:** [Originalsketch der Library][e9], `Hal::init`, `sendPeer`, `runready`, `RemoteChannel`-Definition; `Device::sendPeerEvent` für den Hook.

| Merkmal | Quellcodebefund |
| --- | --- |
| Gerätetyp und Eingänge | Einkanal-Fernbedienung/Paniksender mit Sendetaster und Konfigurationstaster. |
| AskSinPP-Klassen | `AskSin`, `BatterySensor`, `AlarmClock`, `RemoteChannel`, `DoublePressButton`, `MultiChannelDevice`, `ConfigButton`, `DualStatusLed`. |
| Kanalstruktur | Ein Remote-Kanal, zehn Peerplätze, `RemoteList1`. |
| Batterie und Sleep | `battery.init(50,btncounter)`, Schwellen 22/19; `Sleep<>`, aber keine kritische Abschaltung im Sketch. Zellen/Chemie werden im Sketch nicht festgelegt. |
| Besonderheiten | Die zusätzliche `AlarmClock` wird im HAL-Hook `sendPeer()` dekrementiert; die erneute Messung folgt 50 solchen Ereignissen. Der Code zählt weder Sekunden noch rohe GPIO-Flanken. Lange Tastendrücke können mehrere Sendeereignisse erzeugen. |
| Schwierigkeit und Lernwert | Mittel; bekannte Basis der vorhandenen Software-/Flash-Anleitung. Gut für Taster und den Unterschied zwischen einer Clock als Ereigniszähler und einer Zeitbasis. |

## Vor dem ersten Tutorial

E1 als konkreten Sensorpfad verwenden, E4 anschließend als Aktorpfad. E2/E5/E6/E7 verdeutlichen unterschiedliche Batterie- und Energiemodelle. Für jeden Lernsketch zuerst Board, Core, externe Bibliotheken und AskSinPP-Commit festlegen, dann kompilieren und mit Hardware prüfen. Noch ungeklärte Kompatibilität und Schaltungen stehen in [Offene Fragen](./Offene-Fragen.md).

[e1]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-WDS40-TH-I-BME280/HM-WDS40-TH-I-BME280.ino
[e2]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-WDS40-TH-I-DHT22/HM-WDS40-TH-I-DHT22.ino
[e3]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-SCI-3-FM/HM-SCI-3-FM.ino
[e4]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-LC-Sw2-FM/HM-LC-Sw2-FM.ino
[e5]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-SEC-SC/HM-SEC-SC.ino
[e6]: https://github.com/pa-pa/AskSinPP/blob/main/examples/HM-WDS40-TH-I/HM-WDS40-TH-I.ino
[e7]: https://github.com/pa-pa/AskSinPP/blob/main/examples/HM-LC-SW1-BA-PCB/HM-LC-SW1-BA-PCB.ino
[e8]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-Sen-LI-O/HM-Sen-LI-O.ino
[e9]: https://github.com/pa-pa/AskSinPP/blob/main/examples/HM-RC-P1/HM-RC-P1.ino
[weather]: https://github.com/pa-pa/AskSinPP/blob/main/Weather.h
[hal]: https://github.com/pa-pa/AskSinPP/blob/main/AskSinPP.h
[cc1101]: https://github.com/pa-pa/AskSinPP/blob/main/Radio-CC1101.h
