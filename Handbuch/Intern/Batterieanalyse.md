# Batterie und Energie: technische Voranalyse

**Interne Analyse, kein ausgearbeitetes Batteriekapitel.** Bezug: Library-Commit `21bab8b92f7982c29beca08ff3c0ad6ef1e72a5c`. Öffentlich bleiben vier gekennzeichnete Platzhalter. Befunde unten sind Quellcodebefunde; elektrische Genauigkeit, Verbrauch und sichere Betriebsgrenzen wurden nicht gemessen.

## Schichten und vorhandene Varianten

Quelle für die folgende Tabelle: [BatterySensor.h][battery]. Ergänzende Messwertbehandlung: [Globals.cpp][globals].

| Baustein | Nachgewiesene Aufgabe | Konsequenz für das geplante Kapitel |
| --- | --- | --- |
| `NoBattery` | Liefert `current() == 33`; `low()` und `critical()` sind immer falsch. | Ein Schnittstellenersatz für Geräte ohne Messung, keine gemessene Versorgung. |
| `InternalVCC` | Messquelle mit `init/start/finish`; AVR-Pfad misst die interne Bandgap gegen AVCC und berechnet `1100UL * 1024 / ADC` in mV. | Versorgung des Controllers wird geschätzt. Hinter einem Spannungswandler ist das nicht automatisch die Batteriespannung. |
| `ExternalVCC<SENSPIN,ACTIVATIONPIN,ACTIVATIONSTATE,VCC,FACTOR>` | Schaltet den Messpfad, liest `analogRead`, rechnet `value * refvcc * FACTOR / 1024 / 10`; Default `VCC=3300`, `FACTOR=57`, Einschaltwartezeit 250 ms. `VCC=0` verwendet zusätzlich `InternalVCC::finish()`. | Faktor ist ein in Zehnteln angegebener Skalierungsfaktor, standardmäßig 5,7. Das konkrete Teilerverhältnis und die ADC-Referenz der Schaltung müssen passen. |
| `ExternalVCCEFM32<SENS_CHANNEL>` | Nur im EFM32-Pfad; ADC-Eingang mit 2,5-V-Referenz und Umrechnung durch 4096. | Gesonderte Plattformvariante; nicht mit AVR-Formeln gleichsetzen. |
| `SyncMeter<SENSOR,DELAY>` | Startet Messquelle, wartet blockierend und liest aus. `start()` hält den kleinsten gültigen Wert seit Initialisierung beziehungsweise `resetCurrent()`. `measure()` ruft `start()` auf. | `current()` repräsentiert beim Standard-`BatterySensor` kein fortlaufend überschriebenes Live-Sample und keinen Mittelwert. |
| `AsyncMeter<SENSOR,DELAY>` | Startet den Messpfad und plant das Ende über `sysclock`. `trigger()` übernimmt nur einen kleineren Messwert. `measure()` blockiert dagegen und überschreibt den Wert unmittelbar. | „Async“ bedeutet hier bei der Standardkonfiguration zeitversetztes Beenden über einen Alarm, nicht automatisch Ausführung im Interrupt. Initialmessung und periodische Messung unterscheiden. |
| `BattSensor<METER>` | Initialmessung, Wiederholungsperiode und Vergleiche. `current()` rundet mV auf 0,1 V, `low()` und `critical()` vergleichen diesen Wert. | Einheiten, Quantisierung und strikten Vergleich dokumentieren. Enthält keine automatische Unterspannungsreaktion. |
| Alias `BatterySensor` | `BattSensor<SyncMeter<InternalVCC>>`. | Versorgungsschätzung, synchron, gespeichertes Minimum. |
| `BatterySensorUni<SENSPIN,ACTIVATIONPIN,VCC>` | `BattSensor<SyncMeter<ExternalVCC<...,LOW,VCC,57>>>`. | Externe Messung mit festem Faktor 57 in dieser Komfortklasse. Für andere Faktoren wäre die explizite Template-Zusammensetzung zu untersuchen. |
| `BatterySensorExt<SENSPIN,ACTIVATIONPIN,VCC>` | Erbt von `BatterySensor`; `init()` setzt Referenzspannung und Teiler und startet die geerbte interne Messung. Eigene Methode `voltage()` liest den externen Pin. Geerbte `current/low/critical/voltageHighRes` verwenden weiterhin den internen Meter. | Bedeutender Unterschied zur `Uni`-Klasse. `voltage()` ist kein Überschreiben der nichtvirtuellen Basismethode und ändert die geerbten Grenzwertprüfungen nicht. Vor Tutorial-Nutzung Kompatibilität klären (B4). |
| `IrqBaseBatt` | Gemeinsame Schwellen und statischer Messzustand; ADC-Steuerung ist geschützt. | Ein gemeinsamer Hintergrundmesspfad, nicht beliebig viele unabhängige Batteriesensoren. |
| `IrqInternalBatt` | Kontinuierliche AVR-ADC-Messung per Interrupt. `init(period,clock)` ignoriert beide Parameter. Öffentliche `setIdle/unsetIdle` koordinieren Nutzung vor/nach analoger Messung und Sleep. | Das im Sketch angegebene Stundenintervall hat bei dieser Klasse keine periodische Wirkung. |
| `IrqExternalBatt<SENSPIN,ACTIVATIONPIN,FACTOR>` | AVR-Hintergrundmessung über externen Teiler; misst interne Versorgung als Umrechnungsbasis und aktiviert den Teiler bei `unsetIdle()`. | Gemeinsame ADC-Nutzung beachten; Formel nutzt ebenfalls den Faktor in Zehnteln. |

`Globals.cpp`, `IrqBaseBatt::__vectorfunc`, ignoriert zunächst zehn ADC-Ergebnisse; anschließend bleibt der kleinste übernommene Wert erhalten, bis `resetCurrent()` ihn zurücksetzt. Ein Aufwachen startet den Zähler neu. Dieser Zustand ist von einer Mittelwertbildung zu unterscheiden.

## ADC und Referenz beim ATmega328P

**Belegt:** Der AVR-Pfad von `InternalVCC::finish()` setzt AVCC als ADC-Referenz und die interne Bandgap als Messkanal, wartet 350 µs und führt eine Wandlung aus. Die interne nominelle 1,1-V-Spannung wird dabei **gegen** AVCC gemessen. Sie ist in diesem Verfahren nicht die ausgewählte ADC-Referenz. Die Berechnung enthält die feste Konstante 1100; eine öffentliche Kalibriermethode bietet diese Klasse am untersuchten Stand nicht.

**Belegt:** `ExternalVCC::finish()` verwendet `analogRead(SENSPIN)`. Der Template-Wert `VCC` ist eine Rechengröße; er programmiert selbst keine ADC-Referenz. `ExternalVCC::init()` setzt lediglich Pinmodi. Deshalb müssen Board-Core, `analogReference`-Zustand und vorherige ADC-Nutzung separat geprüft werden.

**Noch zu klären:** Tatsächliche Bandgap-Toleranz, zulässiger Eingangswiderstand, Einschwingzeiten, Rückwirkungen eines geschalteten Teilers und Genauigkeit über Temperatur. Dafür braucht es das benannte ATmega328P-Datenblatt, den verwendeten Arduino-Core und Messungen. Ein nicht näher spezifiziertes Board erhält keine pauschale Kalibrierformel oder Widerstandsempfehlung.

## Kalibrierung und Intervalle

- Die Parameter `VCC` und `FACTOR` wirken im externen Verfahren direkt auf die berechnete Spannung. `BatterySensorExt::init` nimmt zusätzlich Referenz und Teiler zur Laufzeit entgegen. Ein konkreter Kalibrierablauf ist erst mit bekannter Schaltung und Vergleichsmessung belastbar.
- `BattSensor::init(period,clock)` erwartet die Einheiten der übergebenen Uhr, führt sofort eine Messung aus und meldet einen Alarm an. `trigger()` setzt dieselbe Periode erneut. Eine Periode von null ist in den Beispielen nicht als sinnvoller Standard belegt.
- `AskSin::initBattery(interval,low,critical)` erwartet Sekunden und wandelt mit `seconds2ticks` für `sysclock` um. `AskSinRTC::initBattery` übergibt das Sekundenintervall direkt an `rtc`.
- `AsyncMeter::start()` plant sein Ende immer auf `sysclock`, auch wenn der umgebende `BattSensor` an einer anderen Uhr hängt. Eine RTC-Kombination muss deshalb beide Uhren bedienen.
- Beim Library-Beispiel HM-RC-P1 ist die übergebene Uhr dagegen `btncounter`; `battery.init(50,btncounter)` folgt 50 Aufrufen des HAL-Hooks `sendPeer()`, nicht 50 Sekunden oder rohen Tastenkanten. Lange Tastendrücke können mehrere solche Sendeereignisse erzeugen. Beim DHT22-Beispiel E2 ignoriert `IrqInternalBatt` den übergebenen Zeitraum ganz.

Quellen: [AskSinPP.h][hal] (`AskSin::initBattery`, `AskSinRTC::initBattery`), [BatterySensor.h][battery], [Beispielkatalog](./Beispielkatalog.md) E2/E9.

## Schwellen und Verhalten

`BattSensor::current()` und `IrqBaseBatt::current()` berechnen `(Messwert_in_mV + 50) / 100` mit ganzzahliger Division. `22` entspricht damit 2,2 V in der gerundeten Darstellung. Der Vergleich lautet **kleiner als** die Schwelle, nicht kleiner oder gleich. Beispielsweise ergeben 2150 mV den Wert 22 und bei Schwelle 22 noch kein `low()`. Die Defaultschwellen werden mit null initialisiert; der Sketch beziehungsweise seine HAL muss sie konfigurieren.

| Library garantiert am analysierten Stand | Sketch legt fest |
| --- | --- |
| Boolesche Bewertung des gespeicherten Messwerts durch `low()` und `critical()` | Geeignete Grenzwerte, Wahl des Messverfahrens, Initialisierung und eventuelle Rücksetzung des Minimums |
| Hilfsmethode `Activity::sleepForever()` mit nicht zurückkehrender Schleife | Ob und wann `critical()` abgefragt wird, ob danach `sleepForever()` aufgerufen wird und welche Ausgänge vorher gesetzt werden |
| `Activity::savePower()` berücksichtigt eine Wachhaltezeit | Welche Schlafstrategie zur Empfangsanforderung und Hardware passt |

Konkrete Gegenüberstellung:

- E1 BME280: `initBattery(3600,22,19)` und `Sleep<>`; keine `critical()`-Abfrage in `loop()`.
- E2 DHT22: dieselben Grenzwerte, aber `IrqInternalBatt`; ebenfalls keine `critical()`-Abfrage.
- E3 HM-SCI-3-FM: `critical()`-Abfrage vorhanden, aber keine Schwelleninitialisierung im Sketch. Mit den Null-Defaults der analysierten Library löst diese Abfrage keine Abschaltung aus.
- E5 HM-SEC-SC: Schwellen aus `DEVICE_CONFIG` (22/19), Abfrage im Leerlauf und danach `sleepForever()`.
- E6 Library-Wettersensor: Default 21/19; optional externe Messung und RTC; explizite kritische Reaktion.
- E7 Batterieaktor: Low-Schwelle aus List0; keine Initialisierung einer kritischen Schwelle und keine entsprechende Abschaltung im untersuchten Sketch.

Die nicht zurückkehrende Schleife schaltet keinen externen Verbraucher automatisch elektrisch ab. `hal.setIdle()` setzt Funk und Batteriemessung in den passenden Zustand; Relais-, Sensor- oder Wandlerpins werden dadurch nicht allgemein abgeschaltet. Eine Hardwareprüfung muss alle Verbraucher und Leckpfade berücksichtigen. Beim ausgewählten Aktor darf keine Schutzfunktion behauptet werden, die im Sketch fehlt.

## Sleep, Funk und Energie

Quelle: [Activity.h][activity] (`Idle`, `Sleep`, `SleepRTC`, `Activity`, `BurstDetector`), [AskSinPP.h][hal] und [Radio-CC1101.h][radio]. Aussagen hier gelten für den betrachteten AVR-Pfad; andere Plattformzweige unterscheiden sich.

| Mechanismus | Nachgewiesener Quellcodebefund |
| --- | --- |
| `Activity::stayAwake(time)` | Verlängert bei Bedarf eine Wachphase über `sysclock`. `savePower<Saver>` ruft die Strategie nur ohne aktive Wachhaltezeit auf, andernfalls `hal.wakeup()`. |
| `Idle<>` | Verwendet `LowPower.idle`; Timer1 und SPI bleiben im betrachteten AVR-Aufruf aktiv. Die Strategie ruft nicht selbst `hal.setIdle()` auf. |
| `Sleep<>` | Deaktiviert vorübergehend die Systemuhr, prüft Bereitschaft und nächsten Termin, ruft `hal.setIdle()` auf und korrigiert danach die Systemuhr. Nutzt abhängig vom Timer2-Parameter `powerDown` oder `powerExtStandby`; ADC/BOD werden für diese Aufrufe ausgeschaltet. |
| `SleepRTC` | Verwendet `LowPower.powerSave` mit aktivem Timer2, liest RTC-Zähler vorher/nachher und korrigiert die Systemuhr anhand der verstrichenen Zeit. Auf AVR ist eine passende RTC-Taktquelle erforderlich. |
| `sleepForever` | AVR-Schleife mit `powerDown(SLEEP_FOREVER,ADC_OFF,BOD_OFF)`. Nach einem Interrupt kehrt der Ablauf in die Schleife zurück; es wird kein normaler `loop()`-Betrieb wieder aufgenommen. Neustartbedingungen hardwareabhängig prüfen. |
| Empfang eines Batterieaktors | E7 definiert `USE_WOR`; der alternative, im Sketch auskommentierte Buildpfad nutzt `BurstDetector` mit regelmäßiger Burst-Prüfung. Energiebedarf und Latenz sind hardwareseitig zu messen. |

Die Library verändert damit nicht automatisch die gespeicherten BOD-Fuse-Einstellungen. BOD-Abschaltung während eines Schlafaufrufs, Brown-out-Verhalten im Wachzustand und sichere Takt-/Spannungsbereiche sind getrennte Themen.

## Mess- und Optimierungsplan für das spätere Kapitel

Noch keine Verbrauchswerte oder Laufzeiten versprechen. Geplant ist eine Messreihe mit dokumentiertem Board, Versorgung, Wandler, Sensor, Funkmodul, Fuse-/Taktkonfiguration, Library- und Core-Version:

1. Ruhestrom getrennt von Aufwach-, Mess- und Funkphasen messen.
2. Einfluss von Board-LED, Regler, Teiler, Pull-ups und Sensor-Breakout erfassen.
3. Sendewiederholungen, Bestätigungen, Burst-Empfang und Messintervall vergleichen.
4. Softwaremesswerte mit Referenzmessgerät über den vorgesehenen Spannungsbereich vergleichen, auch unter Funklast.
5. Unterspannung und Neustartverhalten kontrolliert auf Hardware prüfen; erst danach gerätespezifische Empfehlungen formulieren.

Offene Prüfaufträge: B1 bis B8 in [Offene Fragen](./Offene-Fragen.md). Gute bestehende Hintergrundtexte bleiben verlinkt: [Hardware](../../Grundlagen/01_hardware.md), [Dauersender](../../Grundlagen/FAQ/babbling_idiot.md), [HMSensor mit BME280](../../Projekte/psi/HMSensor/HM-WDS40-TH-I-RTC-BME280.md).

[battery]: https://github.com/pa-pa/AskSinPP/blob/main/BatterySensor.h
[globals]: https://github.com/pa-pa/AskSinPP/blob/main/Globals.cpp
[hal]: https://github.com/pa-pa/AskSinPP/blob/main/AskSinPP.h
[activity]: https://github.com/pa-pa/AskSinPP/blob/main/Activity.h
[radio]: https://github.com/pa-pa/AskSinPP/blob/main/Radio-CC1101.h
