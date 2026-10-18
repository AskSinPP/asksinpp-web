# Kanäle

Ein Kanal ist eine nummerierte Funktion eines Geräts. Das kann ein Sensor, ein Schaltausgang, ein Taster oder eine andere protokollseitige Funktion sein. Ein Kanal ist nicht automatisch ein eigener Pin und auch nicht automatisch ein eigener Funkchip. Dieses Kapitel baut auf [Geräteklassen](./Device.md) und [Architektur im Überblick](../Grundlagen/Architektur.md) auf.

## `Channel` verbindet Funktion, Gerät und Konfiguration

Die Basisklasse `Channel` ist ein Template mit den zentralen Typparametern:

```cpp
template<class HalType, class List1Type, class List3Type, class List4Type,
         int PeerCount, class List0Type = List0, class List2Type = EmptyList>
class Channel;
```

Das ist die Template-Signatur im analysierten Quellstand, keine vollständige Verwendung. Der konkrete Kanal setzt HAL-Typ, Registerlistentypen und maximale Peerzahl fest. `List0` wird als geräteweite Liste weitergereicht; `List2` ist standardmäßig leer.

Im Objekt hält `Channel` einen Zeiger auf das zugehörige `Device`, die Kanalnummer, eine Speicheradresse sowie Änderungs- und Inhibit-Flags. `ChannelDevice::layoutChannels()` ruft für aktive Kanäle `setup(device, number, address)` auf. Danach kann die Kanallogik über `device()` etwa Nachrichten senden oder auf HAL-Komponenten zugreifen. Die Nummerierung ist einsbasiert: `channel(1)` ist der erste Kanal. Ein nacktes, noch nicht durch `setup()` angebundenes Channel-Objekt besitzt keinen gültigen Gerätebezug.

## Registerlisten im Kanal

`Channel` stellt Zugriffsmethoden `getList1()`, `getList2()`, `getList3()` und `getList4()` bereit. Im üblichen Modell enthalten `List1` und `List2` kanalbezogene Konfiguration; `List3` und `List4` sind mit Peer-Einträgen verknüpft. Die jeweilige Registerstruktur wird durch die als Templateparameter verwendeten Typen definiert. Eine leere Liste wie `EmptyList` sagt aus, dass dieser Listentyp in der konkreten Konfiguration nicht belegt ist.

Ein Kanal verarbeitet die Werte nicht von sich aus. Die Liste stellt Registerdaten bereit; ein spezialisierter Kanal liest sie und setzt sie in Verhalten um. Änderungen können an `configChanged()` gemeldet werden. In `Channel` ist dieser Hook leer; Spezialisierungen implementieren das benötigte Verhalten.

`Channel::size()` berechnet den durch diese Implementierung gemeldeten Platz anhand von `Peer`, `List3`, `List4`, Peerzahl und `List1`. `List2` wird in `peerAddress()` als Offset berücksichtigt, ist jedoch in der `size()`-Berechnung dieses Quellstands nicht enthalten. Daher sollte die Speicherbelegung nicht aus einer vereinfachten Liste-Formel im Handbuch abgeleitet werden. Prüfe bei eigenen oder ungewöhnlichen Listenkombinationen die konkrete Implementierung und das Zusammenspiel mit `layoutChannels()` und Storage.

## Peers: direkte Kanalbeziehungen

Ein `Peer` identifiziert einen Homematic-Gerätepartner samt Kanalnummer. Die `PeerCount`-Angabe begrenzt, wie viele Peerplätze ein Channel dieses Typs verwalten kann. `peerat(i)`, `has(peer)`, `peer(peer)` und `deletepeer(...)` lesen, prüfen, speichern oder löschen solche Beziehungen über die Speicherabstraktion. Die `getList3(peer)`- und `getList4(peer)`-Überladungen greifen auf die für diesen Peer vorgesehenen Konfigurationslisten zu.

Ein Peer ist nicht dasselbe wie ein bei der Zentrale angemeldetes Gerät. Bei einer Direktverknüpfung können zwei Gerätekanäle Ereignisse austauschen und peerbezogene Parameter auswerten. Zentralen-Anmeldung und Verwaltung bleibt ein eigener Vorgang; siehe [Pairing mit der CCU](/Grundlagen/03_ccu.html). Nachrichten- und Listenformate vertiefen die Kapitel [Funk](../Funk/README.md) und [Register](../Register/README.md).

## Spezialisierte Kanäle

`Channel` enthält gemeinsame Anbindung und Registerzugriff. Verhalten kommt in abgeleiteten Klassen hinzu:

- `ActorChannel` kombiniert `Channel` mit einer Zustandsmaschine. Es verarbeitet unter anderem `ActionSetMsg`, Remote- und Sensorereignisse und stellt Status/Funktionen der State Machine bereit.
- `SwitchChannel` ist eine konkrete Aktorkanal-Spezialisierung. Sie verwendet Switch-Register und `SwitchStateMachine`; Pin- und Relaisinitialisierung ist weiterhin gerätespezifisch und wird vom Sketch ausgeführt.
- Sensorkanäle können `Channel` mit `Alarm` oder Sensorlogik verbinden. Der Sketch `HM-WDS40-TH-I-BME280` (im Beispielkatalog intern als **E1** bezeichnet) definiert einen lokalen `WeatherChannel` für Messung und zyklischen Versand. E1 ist keine AskSinPP-Bezeichnung. Der Name `WeatherChannel` bezeichnet dort den Typ aus dem Sketch und darf nicht ohne Prüfung mit einem Library-Typ gleichgesetzt werden.
- `VirtBaseChannel` beschreibt eine virtuelle Schnittstelle, die eine Teilmenge gemeinsamer Kanaloperationen einschließlich Status, Listen, Peers und Nachrichtenverarbeitung festlegt. `VirtChannel<HalType, ChannelType>` adaptiert einen konkreten Kanaltyp an diese Schnittstelle. Damit können Geräte wie `DimmerAndRemoteDevice` unterschiedlich spezialisierte Kanaltypen unter der virtuellen Basisschnittstelle verwalten; das geschieht explizit durch das jeweilige Gerät und ist keine automatische Ableitung aus `MultiChannelDevice`.

## Praktisches Beispiel: zwei Schaltkanäle

Im `HM-LC-Sw2-FM`-Sketch ist das Geräteobjekt ein `MultiChannelDevice` mit zwei `SwitchChannel`-Instanzen. Das Gerät initialisiert in `setup()` beide Kanäle mit den jeweiligen Relaispins; Taster-Interrupts sind ebenfalls einzeln an die Kanäle gebunden. Beide Kanäle nutzen dieselbe Kanalimplementierung, aber besitzen eigene Nummern und Register-/Peer-Daten.

Der folgende **schematische Ausschnitt** verdeutlicht die Perspektive eines Geräts auf seinen Kanal. `device`, `channel` und `msg` stehen hier für bereits angebundene reale Objekte beziehungsweise eine gültige Nachricht. Es ist kein allein kompilierbarer Sketch und wurde nicht separat kompiliert.

```cpp
auto& ch = device.channel(1);   // Kanalnummern beginnen bei 1
const uint8_t number = ch.number();
auto list1 = ch.getList1();     // Registerzugriff dieses Kanals
device.send(msg);               // Nachricht über das Geräteobjekt
```

Der reale Sketch im Beispielrepository ist [HM-LC-Sw2-FM.ino](https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-LC-Sw2-FM/HM-LC-Sw2-FM.ino). Für einen einzelnen Kanalzugriff muss die Gerätenummer gültig und der Kanal initialisiert sein.

## Häufige Fehler

- Kanalnummer 0 ist kein erster Datenkanal. `ChannelDevice::channel()` verwendet einsbasierte Nummern.
- Peerzahl ist die Kapazität je Kanaltyp, nicht die aktuelle Zahl verknüpfter Geräte.
- Registerliste und Verhalten auseinanderhalten: Ein Registerwert löst ohne implementierende Kanal-/Sketchlogik keine Aktion aus.
- `setup()` des Channels nicht auslassen, wenn ein eigener Gerätetyp von der üblichen Initialisierung abweicht. Ohne Gerätezeiger und Adresse funktionieren Kanalzugriff und Storage nicht korrekt.
- Nicht annehmen, dass jeder Basiskanal dieselben `status()`- und `flags()`-Methoden anbietet. Diese Schnittstellen gehören unter anderem zum `VirtBaseChannel`-Vertrag und werden von konkreten Klassen wie `ActorChannel` implementiert.
- Gemischte Kanaltypen brauchen eine passende Geräteabstraktion wie `VirtBaseChannel`/`VirtChannel`; die einfache `MultiChannelDevice`-Variante besitzt ein Array eines einzigen `ChannelType`.

## Weiter und Quellen

Weiter zu [HAL](./HAL.md), [Register](../Register/README.md), [Funk](../Funk/README.md) und [Programmablauf](../Grundlagen/Programmablauf.md).

Quellbelege: [`Channel.h` – `Channel`, `ActorChannel`, `VirtBaseChannel`, `VirtChannel`](https://github.com/pa-pa/AskSinPP/blob/main/Channel.h), [`MultiChannelDevice.h` – `ChannelDevice::layoutChannels`, `channel`](https://github.com/pa-pa/AskSinPP/blob/main/MultiChannelDevice.h), [`Peer.h` – `Peer`](https://github.com/pa-pa/AskSinPP/blob/main/Peer.h), [`Dimmer.h` – `DimmerAndRemoteDevice`](https://github.com/pa-pa/AskSinPP/blob/main/Dimmer.h). Analysierter Versionsstand und Plattformgrenzen stehen im [Quellenverzeichnis](../Referenz/README.md).
