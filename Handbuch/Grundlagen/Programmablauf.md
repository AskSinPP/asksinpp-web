# Programmablauf

Dieses Kapitel verfolgt einen AskSinPP-Sketch vom Start bis zur nächsten Messung oder Funknachricht. Danach kannst du erklären, wann Kanäle und HAL initialisiert werden, wie ein Alarm zur Ausführung kommt und warum die Hauptschleife regelmäßig zurückkehren muss. Voraussetzung sind [Architektur im Überblick](./Architektur.md), [Device](../Klassen/Device.md), [Channel](../Klassen/Channel.md) und [HAL](../Klassen/HAL.md).

Als konkrete Beispiele dienen der Einkanal-Sensor **HM-WDS40-TH-I-BME280** und der Zweikanal-Schaltaktor **HM-LC-Sw2-FM**. Die Darstellung folgt den unten verlinkten festen Quellständen. Timer- und Schlafdetails beziehen sich dort, wo ausdrücklich angegeben, auf den AVR-Pfad für einen ATmega328P.

## Einmal einrichten, danach Ereignisse bearbeiten

Die globale HAL, das Geräteobjekt und weitere globale Objekte werden vor `setup()` konstruiert. Damit existieren ihre C++-Objekte; Hardware, persistente Einstellungen und Interruptanbindung sind zu diesem Zeitpunkt noch nicht durch die Geräteinitialisierung eingerichtet. Arduino ruft anschließend `setup()` einmal und `loop()` wiederholt auf.

```text
Globale Objekte werden konstruiert
                 |
setup(): sdev.init(hal)
         zusätzliche Geräteeinrichtung
         sdev.initDone()
                 |
                 v
        +--> loop(): hal.runready()
        |            sdev.pollRadio()
        |                   |
        |            Beide melden keine Arbeit?
        |              | nein          | ja
        |              |       activity.savePower<Saver>(hal)
        |              |       (Wachhaltezeit berücksichtigen,
        |              |        gegebenenfalls Ruhephase)
        +--------------+---------------+
```

Timer- und Pin-Interrupts können diesen Anwendungsablauf unterbrechen. Sie melden Ereignisse oder treiben Zeitgeber an; daraus folgt noch nicht, dass die gesamte zugehörige Gerätefunktion im Interrupt ausgeführt wird. AskSinPP verwendet dafür unter anderem eine Liste fälliger Alarmaufgaben.

## Was `sdev.init(hal)` tatsächlich erledigt

Bei den beiden Beispielen ist `sdev` ein `MultiChannelDevice`. Der Aufruf landet in der geerbten Methode `ChannelDevice::init()`. Die Reihenfolge innerhalb dieser Methode ist festgelegt:

| Schritt | Was die Library tut | Bedeutung für eigenen Code |
| --- | --- | --- |
| 1. Kanäle anbinden | `layoutChannels()` ruft `setup(device, number, address)` jedes aktiven Kanals auf. | Ein eigener Kanal muss seine Basisklasse anbinden und kann hier bereits eigene Einrichtung vornehmen. |
| 2. Konfigurationsspeicher prüfen | `storage().setup(checksum())` entscheidet, ob Standardwerte eingerichtet werden müssen. | Die Rückgabe `first` beschreibt eine Speichererstinitialisierung; sie bedeutet nicht einfach „der Mikrocontroller wurde gerade eingeschaltet“. |
| 3. Gegebenenfalls Defaults setzen | `firstinit()` initialisiert KeyStore, List0 und Kanäle; anschließend wird gespeichert. | Benutzer- oder Peer-Voreinstellungen sollten vorhandene Einstellungen nicht bei jedem Neustart überschreiben. |
| 4. HAL binden | Nach `keystore().init()` folgt `setHal(hal)` und das Ermitteln der Gerätekennung. | Erst ab der Bindung sind die HAL-Zugriffe über das Geräteobjekt verfügbar. |
| 5. HAL starten | `hal.init(id)` richtet unter anderem LED, Radio und Systemzeitgeber ein; `hal.config(...)` wendet gespeicherte Funkparameter an. | Eine zusätzliche Batteriemessinitialisierung oder Relaisanbindung bleibt Aufgabe des konkreten Sketches. |

Wichtig für Erweiterungen: **Das Kanal-`setup()` aus Schritt 1 läuft vor der HAL-Bindung und vor der Defaultinitialisierung.** Es darf deshalb nicht voraussetzen, dass etwa `device().radio()` schon benutzt werden kann oder die Register bereits ihre geprüften endgültigen Werte enthalten. Der BME280-Sketch initialisiert dort seinen Sensor und meldet seinen Alarm an `sysclock` an. Die Alarmverwaltung existiert bereits als Objekt; der Hardwarezeitgeber wird erst beim späteren HAL-Start eingerichtet. Registerabhängige Einrichtung kann ein Kanal stattdessen in `configChanged()` vornehmen. Quelle: [`ChannelDevice::layoutChannels`, `init`, `firstinit`][multi] und [`AskSin::init`][hal].

Nach dem HAL-Start können bereits während des restlichen `setup()` Timerereignisse auftreten. Ein normaler fälliger Alarm bleibt jedoch zunächst in der Ready-Queue, bis der Sketch deren Verarbeitung aufruft. Ein direkt im Zeitgeberpfad ausgeführter Alarm muss auch mit dieser Startphase zurechtkommen.

## Geräteeinrichtung und `initDone()`

Nach der Rückkehr aus `sdev.init(hal)` ergänzt der Sketch seine Einrichtung. Beim BME280-Beispiel folgen `hal.initBattery(...)`, die Anbindung des Konfigurationstasters durch `buttonISR(...)` und `sdev.initDone()`. Beim Schaltaktor werden zuerst die beiden Relaiskanäle mit ihren Pins initialisiert, dann die Taster angebunden und gegebenenfalls interne Peer-Vorgaben angelegt. Dafür verwendet der Sketch den von `init()` zurückgegebenen Wert `first`.

`ChannelDevice::initDone()` markiert die Konfiguration als geändert, ruft `configChanged()` zuerst am Gerät und dann an allen aktiven Kanälen auf und führt `storage().store()` aus. Dadurch können Spezialisierungen beim Start vorhandene Registerwerte übernehmen oder daraus ihren internen Zustand vorbereiten. Der Aufruf bedeutet nicht, dass das Gerät bereits an einer Zentrale angelernt ist. Quellen: [`initDone()`][multi], [BME280-Sketch][bme] und [Schaltaktor-Sketch][switch].

## Die Hauptschleife und ihre Rückgabewerte

Eine aus den beiden Beispielen abgeleitete, kommentierte **Schleifenvariante für den schlafenden AVR-Sensor** sieht so aus. `hal` und `sdev` müssen bereits vollständig definiert und initialisiert sein; dies ist ein Codefragment, kein vollständiger Sketch.

```cpp
void loop() {
  const bool alarmWorked = hal.runready();
  const bool radioWorked = sdev.pollRadio();

  if (!alarmWorked && !radioWorked) {
    hal.activity.savePower<as::Sleep<>>(hal);
  }
}
```

Beide Arbeitsaufrufe werden in jedem Durchlauf ausgeführt. Eine Verkürzung zu `hal.runready() || sdev.pollRadio()` würde wegen der C++-Kurzschlussauswertung den zweiten Aufruf auslassen, sobald der erste `true` ergibt. In der Hauptschleife würde damit die Funkverarbeitung während laufender Alarmarbeit ausfallen.

Die Rückgabewerte haben unterschiedliche Bedeutungen:

- **`hal.runready()`** meldet bei `AskSin`, ob `sysclock.runready()` mindestens eine bereitstehende Alarmaufgabe ausgeführt hat. Eine zukünftige Aufgabe darf noch angemeldet sein, obwohl der Aufruf `false` liefert.
- **`sdev.pollRadio()`** meldet bei `ChannelDevice` das Ergebnis der Basis-Funkverarbeitung oder eigene Arbeit an geänderten Kanalstatusmeldungen. Die Methode ruft zuerst `Device::pollRadio()` auf und prüft danach `changed()` an den Kanälen. Sie kann dadurch auch senden, ohne zuvor eine Funknachricht empfangen zu haben.

`Device::pollRadio()` liest über `radio().read(msg)`. Nur bei ausreichender Nachrichtenlänge und einem fremden Absender ruft es `process(msg)` auf; dessen Ergebnis wird zurückgegeben. `false` beweist daher nicht, dass am Funkmodul überhaupt nichts passiert ist. Ebenso sind die beiden Schleifenvariablen kein vollständiger Schutz gegen Ereignisse, die erst nach den Abfragen eintreten. Die ausgewählte Energiesparimplementierung muss ihren Zeit- und Bereitschaftszustand selbst berücksichtigen. Quellen: [`AskSin::runready`][hal], [`AlarmClock::runready`][clock], [`Device::pollRadio`][device] und [`ChannelDevice::pollRadio`][multi].

## Wie ein Alarm zur Ausführung kommt

Ein `Alarm` besitzt eine Methode `trigger(AlarmClock&)` und einen Verzögerungswert `tick`. Ein Alarmobjekt wird mit `clock.add(alarm)` bei einem Zeitgeber angemeldet. Für die normale Systemzeit helfen `seconds2ticks(...)` und `millis2ticks(...)`, Werte in Ticks umzurechnen. Der Standard ist `TICKS_PER_SECOND == 100`; `Alarm(5)` bezeichnet daher fünf Ticks und keine fünf Sekunden. Das `tick`-Feld ist in diesem Quellstand 24 Bit breit. Die Zeitgeber verändern seine Werte bei der Verwaltung; es ist kein allgemeiner Zeitstempel.

Für eine positive Verzögerung ergibt sich beim normalen Systemzeitgeber dieser Weg:

```text
sysclock.add(alarm) mit positiver Verzögerung
                  |
           Timer treibt --sysclock an
                  |
             Alarm wird fällig
             /              \
     async(false)          async(true)
          |                    |
    Ready-Queue          trigger() direkt im
          |              Zeitgeberpfad
    hal.runready()
          |
    trigger() im Hauptkontext
```

Auf dem betrachteten AVR-Pfad ruft der Timer1-Interrupt den Systemtakt auf. Ein fälliger Alarm mit `async(false)` wird dabei in die **Ready-Queue**, also die Liste ausführungsbereiter Aufgaben, gestellt. `AlarmClock::runready()` entnimmt Aufgaben und ruft `trigger()` im aufrufenden Anwendungskontext auf. Ein mit `async(true)` angemeldeter Alarm wird beim Fälligwerden direkt aus `AlarmClock::operator--()` ausgeführt; beim AVR-Systemtakt liegt das im Interruptpfad. Die Standardkonstruktoren setzen das Async-Flag zunächst nicht.

Auch `AlarmClock::correct()` ruft zum Nachführen der Schlafzeit `operator--()` auf; dieser Aufruf kann aus dem Anwendungspfad der Schlafstrategie kommen. Der direkte Alarmcode muss deshalb interruptgeeignet sein, ohne dass das Async-Flag eine ausschließliche Ausführung innerhalb einer Hardware-ISR zusichert.

Es gibt eine wichtige Sonderregel: `AlarmClock::add()` mit `tick == 0` legt die Aufgabe unmittelbar in die Ready-Queue, auch wenn ihr Async-Flag gesetzt ist. Die Bezeichnung „asynchron“ allein garantiert also keinen bestimmten Ausführungskontext. Quellen: [`Alarm`][alarm], [`AlarmClock::add`, `operator--`][clockcpp] und [`runready`, `runsingle`, Systemtakt][clock].

### Eigene periodische Aufgabe

Das folgende **eigenständig formulierte Codefragment** zählt beispielhaft alle zehn Sekunden einen Durchlauf. Es verwendet die tatsächliche Alarm-API, ist aber kein vollständiger Gerätesketch. Das globale Objekt bleibt während seiner Anmeldung gültig.

```cpp
#include <AskSinPP.h>

class PeriodicCounter : public as::Alarm {
  uint16_t count_;

public:
  PeriodicCounter() : as::Alarm(0, false), count_(0) {}

  void begin() {
    as::sysclock.cancel(*this);
    set(seconds2ticks(10UL));
    as::sysclock.add(*this);
  }

  void trigger(as::AlarmClock& clock) override {
    ++count_;
    set(seconds2ticks(10UL));
    clock.add(*this);
  }

  uint16_t count() const { return count_; }
};

PeriodicCounter counter;
```

In einem bestehenden Sketch rufst du `counter.begin()` beispielsweise nach `sdev.init(hal)` und vor `sdev.initDone()` auf. Danach führt die vorhandene Hauptschleife den Zähler über `hal.runready()` aus. `trigger()` meldet sich selbst erneut an; ohne diese erneute Anmeldung wäre es eine einmalige Aufgabe. `begin()` entfernt vor einer neuen Anmeldung einen gegebenenfalls bestehenden Eintrag. Ein Alarmobjekt darf nicht mehrfach gleichzeitig in dieselbe verkettete Verwaltung eingehängt werden und muss bis zum Abmelden beziehungsweise Abarbeiten existieren.

`10UL` kennzeichnet das Zeitargument ausdrücklich als `unsigned long`; der Standardfaktor `TICKS_PER_SECOND` ist ebenfalls als `100UL` definiert. Bei eigenen Zeitberechnungen müssen Zwischenwerte und das 24-Bit-Zielfeld groß genug sein. Die Umrechnungen gehören zur Systemzeitbasis; Werte für andere Zeitgeber müssen zu deren Einheit passen. Dieses Fragment ist für `sysclock` gedacht. Es wurde anhand der API geprüft, für dieses Kapitel aber weder als Firmware kompiliert noch auf Hardware getestet.

## Interrupts, Hauptkontext und Wartezeiten

Die Hauptschleife führt ihre Aufgaben nacheinander aus. Ein langsamer Sensorzugriff in einem normalen `trigger()` blockiert daher während seiner Laufzeit die nächste Funkabfrage im Sketch. Auch `Device::send()` kann bei bestätigungspflichtigen Nachrichten auf Antworten warten und erneut senden. Alarmverarbeitung ist somit kein Versprechen, dass jede Aktion sofort fertig ist oder alle Aufgaben parallel laufen.

Im normalen Anwendungsfall sollten Interrupts kurz bleiben. Der Funkinterrupt setzt über `Radio::handleInt()` bei ausbleibendem eigenem Sendevorgang einen Empfangszustand; das Lesen und Dekodieren übernimmt später `Radio::read()`. `StateButton::irq()` plant einen Prüf-Alarm ein, dessen `trigger()` den Taster außerhalb des Interrupts weiterverarbeitet. Das sind konkrete Library-Muster, keine pauschale Aussage über beliebige eigene Interruptfunktionen. Quellen: [`Radio::handleInt`, `read`][radio] und [`buttonISR`, `StateButton::irq`, `CheckAlarm`][button].

Lange `delay()`-Aufrufe oder Schleifen, die auf einen Zustand warten, können die Hauptschleife ebenso verzögern. Für spätere Arbeit bietet sich ein Alarm an. Ein `trigger()`, das sich immer mit Verzögerung null neu anmeldet, kann umgekehrt verhindern, dass `runready()` überhaupt zurückkehrt: Die Methode arbeitet die Ready-Queue ab, bis keine weitere Aufgabe entnommen werden kann. Bei Interruptarbeit müssen außerdem die konkrete Plattform und gemeinsam genutzte Daten berücksichtigt werden.

## Ein realer Messdurchlauf: HM-WDS40-TH-I-BME280

Im festgelegten Beispiel arbeitet der lokale `WeatherChannel` zugleich als `Channel` und `Alarm`. Der folgende Durchlauf verbindet die beschriebenen Ebenen:

1. **Anmelden:** Der Konstruktor verwendet `Alarm(5)`. Während `sdev.init(hal)` ruft das Gerät das Kanal-`setup()` auf. Dieses bindet die Channel-Basis, initialisiert den BME280 und meldet den Alarm bei `sysclock` an. Der Hardwaretakt startet erst im späteren HAL-Schritt.
2. **Start abschließen:** Der Sketch richtet Batteriemessung und Konfigurationstaster ein und ruft `initDone()` auf.
3. **Fällig werden:** Nach Ablauf der fünf Systemticks stellt der Zeitgeber den normalen Alarm bereit. Bei 100 Ticks pro Sekunde entsprechen fünf Ticks rechnerisch 50 Millisekunden; das ist keine garantierte Zeit vom Einschalten bis zur ersten Messung.
4. **Ausführen:** `hal.runready()` ruft `WeatherChannel::trigger()` auf. Der Kanal holt einen Nachrichtenzähler, setzt seinen nächsten Termin und meldet sich erneut an. `MSG_INTERVAL` beträgt im Beispiel 180 Sekunden. Diese erneute Anmeldung steht vor der eigentlichen Messung im Quellcode.
5. **Messen und senden:** Der Kanal liest Temperatur und Feuchte, füllt seine lokale `WeatherEventMsg` und wählt nach dem Nachrichtenzähler zwischen `sendPeerEvent()` und `broadcastEvent()`. Die Bedingung für den Peerpfad lautet `msgcnt % 20 == 1`; dies beschreibt die Auswahl des Aufrufs, nicht die Zusicherung eines erfolgreichen Empfangs.
6. **Zur Schleife zurückkehren:** Nach dem Alarmaufruf läuft die Schleife weiter zu `sdev.pollRadio()`. Da in diesem Durchlauf Alarmarbeit stattfand, wird der Ruheaufruf zunächst ausgelassen. In einem späteren arbeitslosen Durchlauf kann `Activity` eine Ruhephase zulassen.

Dieser Ablauf ist aus dem [BME280-Sketch][bme] nachgezeichnet. Er belegt die Aufrufreihenfolge, keine garantierte Funklatenz, Messgenauigkeit oder Zeitgenauigkeit.

## Ruhephase, Empfang und RTC

`Activity::savePower<Saver>(hal)` prüft zunächst, ob das Gerät wach bleiben soll. `stayAwake(ticks)` kann diese Wachhaltezeit beispielsweise für Kommunikation verlängern. Solange sie aktiv ist, weckt beziehungsweise aktiviert `savePower()` das Radio über `hal.wakeup()`. Erst andernfalls wird die gewählte Saver-Implementierung aufgerufen.

| Beispiel beziehungsweise Strategie | Verhalten im betrachteten AVR-Aufbau |
| --- | --- |
| BME280-Sketch mit `Sleep<>` | Kann den Mikrocontroller und Funk in eine tiefere Ruhephase versetzen. Die Systemuhr wird für den Schlafpfad angehalten und nach dem Aufwachen unter Berücksichtigung der verstrichenen Zeit korrigiert. |
| Schaltaktor mit `Idle<>` | Verwendet eine Ruhephase mit weiterlaufendem Systemtimer und SPI; der Sketch hält das Radio für den Empfang bereit. |
| `AskSinRTC` mit `SleepRTC` | Verwendet einen zusätzlichen RTC-Zeitpfad mit eigenen Aufweck-/Timerbedingungen. Die HAL muss ausdrücklich ausgewählt sein und zur Hardware passen. |

Im AVR-`Sleep<>::powerSave()` wird der Bereitschaftszustand der Systemuhr vor der eigentlichen Ruhephase nochmals geprüft. Ein zukünftiger Alarm verhindert nicht grundsätzlich Schlaf: Sein nächster Termin wird bei der Auswahl der Ruhezeit berücksichtigt. Die Wiederaufnahme setzt den Ablauf im bestehenden Programm fort; sie ruft nicht erneut Arduino-`setup()` auf. Einzelheiten der Schlafmodi und ihrer Aufweckquellen sind plattformabhängig. Quellen: [`Activity::savePower`, `stayAwake`, AVR-`Idle`/`Sleep`][activity] und [Schaltaktor-Sketch][switch].

`AskSinRTC::runready()` fragt im untersuchten Stand zuerst `rtc.runready()` ab und verknüpft das Ergebnis mit dem normalen Systempfad durch `||`. Meldet die RTC Arbeit, wird der Systempfad in diesem Aufruf übersprungen und kann erst beim nächsten Durchlauf drankommen. Zeiten dürfen daher nicht ungeprüft zwischen den beiden Clock-Varianten übertragen werden. Quelle: [`AskSinRTC`][hal].

Eine Behandlung von `battery.critical()` und ein Aufruf von `sleepForever()` gehören zur ausdrücklichen Sketchlogik. Der BME280-Sketch setzt Schwellen, hat aber keine solche Abfrage in seiner Schleife. Ein normaler Schlafzyklus und die dauerhafte Schutzreaktion sind unterschiedliche Programmabläufe; Details folgen unter [Batterie und Energie](../Batterie/Grundlagen.md).

## Konfiguration während des Betriebs

Die Initialisierung ist nicht die einzige Stelle, an der Konfigurationswerte wirksam werden. `ChannelDevice::process()` bearbeitet im Funkpfad auch Konfigurationsnachrichten. Beim Ende einer Konfigurationsübertragung setzt es das Änderungskennzeichen, benachrichtigt das Gerät oder den betroffenen Kanal über `configChanged()` und speichert den Storage. Die weitere Anwendung der Werte steht in der jeweiligen Spezialisierung. Deshalb gehört registerabhängiges Verhalten an den passenden Konfigurationshook und nicht ausschließlich in den einmaligen Sketchstart. Quelle: [`ChannelDevice::process`, Zweig `AS_CONFIG_END`][multi].

## Häufige Fehler und nächster Schritt

- `initDone()` auslassen und erwarten, dass alle Spezialisierungen ihre Startkonfiguration bereits angewendet haben.
- Im Kanal-`setup()` bereits auf die noch nicht gebundene Geräte-HAL zugreifen.
- Ticks mit Sekunden verwechseln oder ein zu kleines Integerformat für Zeitumrechnungen verwenden.
- Einen Alarm nur einmal anmelden und eine automatische Wiederholung erwarten.
- Ein noch angemeldetes Alarmobjekt zerstören oder mehrfach einhängen.
- In `loop()` einen Arbeitsaufruf durch Kurzschlussauswertung auslassen oder durch lange Wartezeiten verzögern.
- `async(true)` pauschal mit beliebiger Hintergrundarbeit gleichsetzen; der direkte Ausführungspfad muss interruptgeeignet sein.
- Den Saver eines schlafenden Sensors ungeprüft auf einen empfangsbereiten Aktor übertragen.

Der nächste praktische Schritt ist [Das erste eigene Gerät](./Erstes-Geraet.md): einen konkreten Sketch mit festgelegten Board- und Bibliotheksständen aufbauen, kompilieren und nachvollziehbar anpassen. Die Beispiele dieses Kapitels sind statisch am Quellcode geprüft. Firmwarekompilierung und Hardwaretests stehen für das spätere Gerätetutorial aus; der Website-Build prüft die Dokumentationsdarstellung.

## Quellen und Versionsbezug

Library: AskSinPP 5.0.3 am Commit `21bab8b92f7982c29beca08ff3c0ad6ef1e72a5c`; Beispiele: Commit `c0ad384c66a8e4887f4cacc591af5d3b88167886`. Der [Quellenüberblick](../Referenz/README.md) ordnet diese Stände ein. Die folgenden Links halten die verwendeten Dateien fest:

| Thema | Quellen und zentrale Symbole |
| --- | --- |
| Gerät und Initialisierung | [MultiChannelDevice.h][multi]: `ChannelDevice::init`, `initDone`, `pollRadio`, `process` |
| HAL und Clock-Auswahl | [AskSinPP.h][hal]: `AskSin`, `AskSinRTC` |
| Alarmverwaltung | [Alarm.h][alarm], [AlarmClock.h][clock], [AlarmClock.cpp][clockcpp]: `Alarm`, `AlarmClock`, `SysClock`, `add`, `cancel`, `runready`, `operator--` |
| Funk- und Tasterereignisse | [Device.h][device], [Radio.h][radio], [Button.h][button] |
| Wach- und Schlafphasen | [Activity.h][activity]: `Activity`, AVR-`Idle`, `Sleep`, `SleepRTC` |
| Reale Abläufe | [HM-WDS40-TH-I-BME280][bme], [HM-LC-Sw2-FM][switch] |

Die Erläuterungen und der periodische Zähler sind eigenständig formuliert; die kommentierte Schleifenvariante folgt dem Ablauf der verlinkten Sketche.

[multi]: https://github.com/pa-pa/AskSinPP/blob/main/MultiChannelDevice.h
[hal]: https://github.com/pa-pa/AskSinPP/blob/main/AskSinPP.h
[alarm]: https://github.com/pa-pa/AskSinPP/blob/main/Alarm.h
[clock]: https://github.com/pa-pa/AskSinPP/blob/main/AlarmClock.h
[clockcpp]: https://github.com/pa-pa/AskSinPP/blob/main/AlarmClock.cpp
[device]: https://github.com/pa-pa/AskSinPP/blob/main/Device.h
[radio]: https://github.com/pa-pa/AskSinPP/blob/main/Radio.h
[button]: https://github.com/pa-pa/AskSinPP/blob/main/Button.h
[activity]: https://github.com/pa-pa/AskSinPP/blob/main/Activity.h
[bme]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-WDS40-TH-I-BME280/HM-WDS40-TH-I-BME280.ino
[switch]: https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-LC-Sw2-FM/HM-LC-Sw2-FM.ino
