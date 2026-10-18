# Architektur im Überblick

Dieses Kapitel zeigt, wie ein AskSinPP-Sketch Geräteobjekt, Kanäle, Hardwareabstraktion, Funk und dauerhafte Konfiguration zusammenführt. Es ist der Einstieg in die Klassenkapitel: Die Aufgaben und Verbindungen werden hier erklärt; API-Details folgen in [Device](../Klassen/Device.md), [Channel](../Klassen/Channel.md) und [HAL](../Klassen/HAL.md). Grundbegriffe und weitere Einstiege stehen auf der [Handbuch-Startseite](../README.md).

## Das Gesamtbild

Ein Sketch beschreibt ein konkretes Gerät, indem er Typen auswählt, Objekte anlegt und `setup()` sowie `loop()` implementiert. Gerät und HAL sind getrennte Objekte: Bei der Initialisierung erhält das Geräteobjekt eine Referenz auf die HAL. Kanäle gehören zum Gerät und verwenden dessen Verbindung zu Konfiguration und Funk.

```text
Sketch: Typdefinitionen, Pins, setup(), loop()
  |
  +-- Geräteobjekt
  |     MultiChannelDevice<HAL, Kanaltyp, Kanalzahl>
  |       erbt von ChannelDevice<...>
  |         erbt von Device<...>
  |     +-- Kanalobjekte: Channel oder spezialisierte Kanäle
  |     +-- Registerlisten und Peer-Daten
  |     +-- Nachrichten, Identität und Gerätespeicher
  |
  +-- HAL-Objekt: AskSin<LED, Batterie, Radio, Summer>
        +-- LED, Batteriesensor, Activity, Radio, optionaler Summer
              +-- Radio -> CC1101 -> SPI -> Funkmodul

  AlarmClock und Systemzeit koordinieren zeitgesteuerte Aufgaben.
  Storage vermittelt den Zugriff auf Register- und Peer-Konfiguration.
```

Der obere Teil ist eine **Vererbungskette**; die Einrückungen darunter zeigen enthaltene oder verwendete Objekte, nicht weitere Basisklassen. `MultiChannelDevice` ist also ein `ChannelDevice`, und dieses ist ein `Device`. Die HAL ist dagegen eine eigene Instanz. In der konkreten Gerätedefinition werden ihre Typen als Templateparameter verbunden. Das Diagramm ist eine Orientierung, keine vollständige Darstellung aller Treiber und Plattformvarianten.

## Aufgaben der Bausteine

| Baustein | Aufgabe im Zusammenspiel |
| --- | --- |
| Sketch | Wählt Implementierungen und Pins, erzeugt die Geräte- und HAL-Objekte und bestimmt den konkreten Ablauf in `setup()` und `loop()`. |
| `DeviceInfo` und `Device` | Beschreiben die protokollseitige Geräteidentität und bündeln die gemeinsame Gerätefunktion: Zugriff auf HAL-Komponenten, Funkabfrage und Nachrichtenversand. `DeviceInfo` enthält unter anderem Gerätekennung, Seriennummer, Modell, Firmware- und Gerätetyp. |
| `ChannelDevice` | Ergänzt das Gerät um Kanäle und die geräteweite Konfiguration. Beim Initialisieren werden Kanäle mit ihrer Gerätenummer und Speicherposition eingerichtet. |
| `MultiChannelDevice` | Stellt eine feste Anzahl von Kanalobjekten desselben Typs bereit. Ein Einkanalgerät kann daher ebenfalls diesen Gerätetyp verwenden. |
| `Channel` | Bildet eine Gerätefunktion ab und bietet Zugriff auf deren Registerlisten, Status und gegebenenfalls direkte Peers. Spezialisierungen ergänzen etwa Sensor- oder Aktorverhalten. |
| Listen und `Storage` | Stellen Konfigurationswerte und Peer-Daten über die ausgewählte Speicherimplementierung bereit. Listentypen werden vom konkreten Gerät beziehungsweise Kanal festgelegt. |
| HAL (`AskSin` / `AskSinRTC`) | Verbindet Gerätelogik mit konkreten Implementierungen für LED, Batterie, Funk, Aktivität und optionalen Zusatzfunktionen. `AskSinRTC` ergänzt einen RTC-Zeitpfad. |
| `Radio` und Funkchiptreiber | `Radio` koordiniert Funkoperationen und Ereignisse; der Treiber, beispielsweise `CC1101`, bedient den Chip über die jeweilige Schnittstelle wie SPI. |
| `Alarm` und `AlarmClock` | Verwalten zeitgesteuerte Arbeit. Je nach Alarmkonfiguration wird Arbeit direkt im Interruptpfad oder später über `runready()` im Anwendungskontext ausgelöst. |
| `Activity` | Bietet die Schnittstelle für Wachhalte- und Energiesparentscheidungen. Der Sketch entscheidet, wann eine passende Ruhe- beziehungsweise Empfangsstrategie aufgerufen wird. |

Die Templates sind eine wesentliche Architekturentscheidung: Ein konkreter HAL-Typ kann beispielsweise LED-, Batteriesensor- und Funktreibertyp festlegen; der Gerätetyp legt HAL, Kanaltyp und Kanalzahl fest. Der Compiler setzt diese Auswahl zu konkreten C++-Typen zusammen. Namen allein reichen deshalb nicht immer zur Identifikation: Ein Sketch kann einen eigenen lokalen Typ `WeatherChannel` deklarieren, während die Library einen gleichnamigen Typ bereitstellt. Maßgeblich sind Deklaration und Namespace im jeweils verwendeten Quellstand.

## Kanal, Register und Peer

Ein Kanal ist die logische Funktion innerhalb eines Geräts, nicht zwingend ein eigener physischer Anschluss. Ein Sensorkanal kann Messwerte veröffentlichen, ein Aktorkanal kann Schaltzustand und Zeitverhalten steuern. Der konkrete Kanaltyp bestimmt, welche Funktion tatsächlich implementiert ist.

Die Konfigurationslisten sind unterschiedlichen Ebenen zugeordnet. `List0` ist die geräteweite Ebene; Kanäle besitzen unter anderem kanalbezogene Listen wie `List1` und `List2`. Peer-bezogene Listen wie `List3` und `List4` hängen von einer direkten Verknüpfung ab. Welche Listen ein Gerät verwendet, ergibt sich aus den konkreten Typen und der Registerdefinition, nicht allein aus dem Klassennamen `Channel`.

Ein **Peer** bezeichnet in diesem Zusammenhang einen Kommunikationspartner beziehungsweise eine direkte Verknüpfung zu einem anderen Kanal. Das ist von der Anmeldung des Geräts an einer Zentrale zu unterscheiden: Die Zentrale verwaltet das Gerät, während Peer-Konfiguration eine direkte Beziehung zwischen Gerätekanälen beschreibt. Details zum Anlernen stehen in der bestehenden Anleitung zum [Pairing mit der CCU](/Grundlagen/03_ccu.html); die vertiefte Behandlung von Listen und Funk folgt in den jeweiligen Fachbereichen.

`Storage` vermittelt den Zugriff auf die persistenten Daten. Bei `ChannelDevice::init()` wird anhand der Geräte- und Kanalstruktur die Speicherbelegung vorbereitet und geprüft; bei der Erstinitialisierung werden Standardwerte eingerichtet. `initDone()` schließt die Initialisierung ab und speichert die Konfiguration. Änderungen an Registertypen oder Kanalaufbau können deshalb Auswirkungen auf vorhandene Konfigurationsdaten haben. Das ist kein allgemeiner Mechanismus zur Sicherung oder Migration alter Speicherstände.

## Vom Start bis zur Ruhephase: BME280-Sketch

Der Sketch [HM-WDS40-TH-I-BME280](../Praxis/README.md) zeigt diese Architektur an einem Einkanal-Sensor. **E1** ist nur der interne Index, den der Beispielkatalog für diesen Sketch verwendet; es ist kein Begriff aus AskSinPP oder dem Gerät. Die folgende Reihenfolge ist aus dem festgelegten Sketch- und Library-Quellstand nachgezeichnet; sie ist keine vollständige Vorlage für jedes Gerät.

1. **Typen und Objekte:** Der Sketch wählt eine `AskSin`-HAL mit konkreten Komponenten und definiert sein Geräteobjekt als `MultiChannelDevice` mit einem eigenen `WeatherChannel`. Dieser `WeatherChannel` und die zugehörige Nachrichtenklasse sind lokal im Sketch definiert.
2. **Geräteinitialisierung:** In `setup()` ruft der Sketch `sdev.init(hal)` auf. `ChannelDevice` richtet dabei Kanäle und Konfigurationsspeicher ein; die Geräteinitialisierung bindet die HAL ein und initialisiert die benötigten Geräte- und Funkfunktionen.
3. **Gerätebereitschaft:** Danach konfiguriert der Sketch den Taster-Interrupt und die Batterieparameter und ruft `sdev.initDone()` auf. Das markiert das Ende der geräteseitigen Initialisierung und stößt die Speicherung der Konfiguration an.
4. **Anwendungsarbeit:** In der Hauptschleife führt der Sketch fällige Arbeit über `hal.runready()` aus und fragt mit `sdev.pollRadio()` empfangene Funkarbeit ab. Der lokale Sensoralarm veranlasst die Messung und den Versand der Wetterdaten.
5. **Warten:** Wenn weder Alarmarbeit noch empfangene Funkarbeit anliegt, wählt der Sketch eine Ruhephase über `hal.activity.savePower<Sleep<>>(hal)`. Das ist eine explizite Entscheidung des Sketches, keine automatische Folge davon, dass die HAL `Sleep` kennt.

`AlarmClock` kann fällige asynchrone Alarme direkt im Takt-/Interruptpfad auslösen; gewöhnliche fällige Aufgaben werden in eine Ready-Queue gestellt und durch `runready()` im Hauptkontext abgearbeitet. Deshalb darf man nicht pauschal annehmen, Alarmcode laufe immer im Interrupt oder immer in der Hauptschleife. Für `async` gelten die konkreten Anforderungen an Laufzeit und Nebenläufigkeit.

Der BME280-Sketch setzt Batterieschwellen bei der Initialisierung, prüft in seiner Schleife aber nicht `critical()`. Das Beispiel belegt daher weder eine automatische Abschaltung noch ein für alle Geräte geltendes Batterieverhalten. Auch die gewählte `Sleep<>`-Strategie ist an Sketch und Plattform gebunden. Der [Programmablauf](./Programmablauf.md) und das Batteriekapitel, beginnend mit den [Batteriegrundlagen](../Batterie/Grundlagen.md), behandeln diese Details gesondert.

## Typische Verwechslungen

- **Vererbung und Zusammensetzung:** `MultiChannelDevice` erbt über `ChannelDevice` von `Device`; die HAL wird als separates Objekt an das Gerät übergeben.
- **Gerät und Kanal:** Ein Gerät kann mehrere logische Kanäle enthalten. Ein Einkanalgerät ist nicht automatisch eine andere Geräteklasse.
- **Zentrale und Peer:** Pairing mit einer Zentrale und direkte Peer-Verknüpfungen sind unterschiedliche Beziehungen.
- **Register und Programmverhalten:** Ein Register stellt konfigurierbare Daten bereit. Was das Gerät damit tut, bestimmen Kanal- und Sketchlogik.
- **HAL und automatische Steuerung:** Die HAL bietet Funktionen; Initialisierungsreihenfolge, Alarmbehandlung und Schlafaufrufe werden vom konkreten Sketch mitbestimmt.
- **Bibliothekstyp und Sketch-Typ:** Gleiche Bezeichner können verschiedene Deklarationen meinen. Verifiziere Include, Namespace und lokale Klassendefinition im verwendeten Beispiel.

## Weiterführende Kapitel

- [Programmablauf](./Programmablauf.md): `setup()`, Initialisierung, Hauptschleife, Alarme und Ruhephasen.
- [Device](../Klassen/Device.md), [Channel](../Klassen/Channel.md) und [HAL](../Klassen/HAL.md): Klassen, Schnittstellen und konkrete Erweiterungsmöglichkeiten.
- [Register](../Register/README.md) und [Funk](../Funk/README.md): Konfiguration, Nachrichten, Pairing und direkte Verknüpfungen.
- [Batteriegrundlagen](../Batterie/Grundlagen.md): Messung, Schwellen und der Unterschied zwischen HAL-Funktion und Sketchreaktion.

## Quellen und Geltungsbereich

Die Aussagen wurden am festgelegten Stand der [AskSinPP-Quellen](../Referenz/README.md) geprüft: `Device.h` (`Device`, `DeviceInfo`), `MultiChannelDevice.h` (`ChannelDevice::init`, `initDone`, `MultiChannelDevice`), `Channel.h` (Listen und `Channel`), `AskSinPP.h` (`AskSin`, `AskSinRTC`), `AlarmClock.cpp` (`AlarmClock::operator--`, `runready`), `Activity.h` (`Activity::savePower`) und `Storage.h` (`StorageWrapper`). Das Ablaufbeispiel folgt dem verlinkten BME280-Sketch im festgelegten Beispielquellstand und belegt keine allgemeine Plattformgarantie. Der Text wurde gegen den Quellcode geprüft; Firmware oder Hardware wurden für dieses Kapitel nicht kompiliert oder getestet.
