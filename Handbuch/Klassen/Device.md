# Geräteklassen

Dieses Kapitel erklärt die Geräteebene zwischen Sketch, Kanälen und HAL: `Device` stellt gemeinsame Gerätefunktionen bereit, `ChannelDevice` ergänzt Kanal- und Konfigurationsverwaltung, und `MultiChannelDevice` stellt gleichartige Kanalobjekte bereit. Es setzt das [Architekturkapitel](../Grundlagen/Architektur.md) voraus. Kanalfunktionen stehen im Kapitel [Channel](./Channel.md), die konkrete Hardwarezusammensetzung im Kapitel [HAL](./HAL.md).

## Geräteidentität: `DeviceInfo`

Ein Gerät braucht Identitätsdaten für das Homematic-Protokoll. Die Struktur `DeviceInfo` enthält im analysierten Quellstand die Felder `DeviceID[3]`, `Serial[11]`, `DeviceModel[2]`, `Firmware`, `DeviceType` und `DeviceInfo[2]` (`Device.h`, `DeviceInfo`). Ein Sketch legt üblicherweise eine konstante, im Programmspeicher abgelegte Instanz an. Die Felder beschreiben unter anderem die Gerätekennung, Seriennummer, Modellkennung, Firmware und den Protokoll-Gerätetyp.

Diese Metadaten sind nicht dasselbe wie die konkrete Kanalimplementierung oder die Registerdefinition. `Device::sendDeviceInfo()` setzt daraus eine Geräteinformationsnachricht zusammen. Die ausgegebene Seriennummer und Gerätekennung können abhängig von Compile-Optionen wie `USE_OTA_BOOTLOADER` oder `USE_HW_SERIAL` aus anderen Quellen stammen; behandle das im Sketch nicht als immer fest codierte Werte. In `getDeviceInfo()` wird das erste Byte der Informationsdaten als Kanalzahl ausgegeben, sofern nicht `DEVICE_CHANNEL_COUNT` dies überschreibt.

## Vererbung und Verantwortlichkeiten

```text
Device<HalType, List0Type>
  └─ ChannelDevice<HalType, ChannelType, ChannelCount, List0Type>
       └─ MultiChannelDevice<HalType, ChannelType, ChannelCount, List0Type>
```

`ChannelDevice` erbt von `Device`. `MultiChannelDevice` erbt von `ChannelDevice`. Es handelt sich um eine Vererbungskette und nicht um drei parallel verwendete Objekte.

### `Device<HalType, List0Type>`

`Device` hält unter anderem eine Referenz auf `DeviceInfo`, die geräteweite `List0`, die Nachricht und den Schlüssel-/Authentifizierungsspeicher `KeyStore`. Bei der Konstruktion ist sein HAL-Zeiger zunächst null; `ChannelDevice::init(hal)` bindet später die konkrete HAL mit `setHal()`. Aufrufe wie `led()`, `radio()`, `battery()`, `activity()` oder `getHal()` setzen deshalb voraus, dass diese Bindung erfolgt ist.

Zu den zentralen Schnittstellen gehören:

- `getDeviceID()` und `getDeviceSerial()` liefern die protokollseitige Identität unter Berücksichtigung der aktiven Compile-Optionen.
- `channels()`, `channels(n)` und `hasChannel(n)` lesen oder ändern die aktuell gemeldete Kanalzahl beziehungsweise prüfen eine Nummer.
- `pollRadio()` liest eine Nachricht über das Radio und übergibt zulässige Nachrichten an `process(Message&)`. Die Basismethode `process()` weist eine Nachricht zunächst zurück; abgeleitete Logik kann sie überschreiben.
- `send(Message&, destination)` ergänzt Absender und Empfänger und führt das Senden mit Wiederholungs-/Bestätigungslogik aus.
- `configChanged()` ist ein virtueller Erweiterungspunkt. Die Basismethode tut nichts; spezialisierte Geräte können darauf reagieren.

### `ChannelDevice<...>` und `MultiChannelDevice<...>`

`ChannelDevice` hält `List0`, Kanalreferenzen, die aktive Kanalzahl und die Verarbeitung von Konfigurationsnachrichten. `registerChannel()` ordnet einem Kanal eine Nummer zu. `layoutChannels()` ruft für jeden aktiven Kanal `setup(device, number, address)` auf und ermittelt so dessen fortlaufende Speicherposition. `MultiChannelDevice` besitzt ein fest dimensioniertes Array `ChannelType cdata[ChannelCount]` und registriert diese Kanäle im Konstruktor mit den Nummern 1 bis `ChannelCount`.

`ChannelCount` ist die zur Compile-Zeit festgelegte Kapazität des Arrays. `channels(n)` ändert die zur Laufzeit verwendete und gemeldete Zahl und begrenzt sie auf diese Kapazität. Das sind unterschiedliche Größen. Eine falsche Kanalzahl kann dazu führen, dass das Gerät eine andere Kanalstruktur meldet oder bearbeitet als beabsichtigt.

## Initialisierung und persistente Konfiguration

Die Reihenfolge in `ChannelDevice::init(hal)` ist relevant:

1. `layoutChannels()` bindet jeden aktiven Kanal an Gerät, Nummer und Startadresse.
2. `storage().setup(checksum())` prüft die Speicherinitialisierung anhand des von der Geräte-/Registerstruktur berechneten Prüfsummenwerts.
3. Wenn der Speicher eine Erstinitialisierung meldet, ruft die Klasse `firstinit()` auf und speichert die Standardwerte.
4. Der Geräteschlüsselspeicher wird initialisiert, die HAL an `Device` gebunden und die Gerätekennung ermittelt.
5. `hal.init(id)` initialisiert die HAL; `hal.config(...)` wendet gegebenenfalls gespeicherte Funkkonfiguration an.

Anschließend ruft der Sketch üblicherweise `initDone()` auf. Diese Methode markiert die Konfiguration als geändert, ruft geräte- und kanalspezifische `configChanged()`-Hooks auf und speichert den Storage. Ein Sketch muss außerdem seine konkrete Hardware (zum Beispiel Relaispins) und Interrupts einrichten; das erledigt `Device::init()` nicht automatisch.

Die Prüfsumme wird aus ausgewählten Aspekten wie KeyStore-Größe, `List0`-Registern, den abgefragten Listen `List1`, `List3`, `List4` und Peerzahl gebildet (`ChannelDevice::checksum()`). Änderungen an diesen Teilen können daher als geänderte Speicherstruktur erkannt werden. Das ist kein allgemeines Versions- oder Migrationssystem: vor Änderungen an Registerdefinitionen und Peer-Kapazität sind bestehende Gerätekonfigurationen gesondert zu berücksichtigen.

## Beispiel: ein Zwei-Kanal-Schaltgerät

Das Beispiel `HM-LC-Sw2-FM` wählt eine HAL mit Status-LED, `NoBattery` und einem Radio und verwendet `MultiChannelDevice` mit zwei `SwitchChannel`-Objekten. Der folgende **schematische C++-Ausschnitt** zeigt die Form der Typverknüpfung; Namen wie `LedType` und `RadioType` stehen für vorher festgelegte konkrete Implementierungen. Dies ist kein vollständiger Sketch und wurde nicht separat kompiliert.

```cpp
using DeviceHal = AskSin<LedType, NoBattery, RadioType>;
using SwitchDevice = MultiChannelDevice<
    DeviceHal, SwitchChannel<DeviceHal, PeerCount, List0>, 2>;
```

Im realen Sketch ruft `setup()` `sdev.init(hal)` auf, initialisiert danach die beiden Relaiskanäle und Taster, setzt die aktive Kanalzahl und schließt mit `sdev.initDone()` ab. In `loop()` werden Schedulerarbeit und Funkabfrage bearbeitet. Die konkrete Implementierung steht im [HM-LC-Sw2-FM-Sketch](https://github.com/jp112sdl/Beispiel_AskSinPP/blob/main/examples/HM-LC-Sw2-FM/HM-LC-Sw2-FM.ino); hier wird die Typidee eigenständig zusammengefasst.

## Häufige Fehler

- `DeviceInfo` beschreibt Protokollidentität und Gerätedaten, aber nicht automatisch die C++-Kanaltypen.
- `ChannelCount` und `channels()` sind nicht synonym: Erstere ist Kapazität, Letztere aktive Zahl.
- HAL-Komponenten nicht vor `sdev.init(hal)` über `sdev.radio()` oder `sdev.battery()` verwenden.
- `initDone()` nicht mit der gesamten Sketchinitialisierung verwechseln. Pins, Taster, Interrupts und Sensoren brauchen weiterhin ihre spezifischen Initialisierungen.
- Eine geänderte Prüfsumme nicht als zuverlässige Migration alter Einstellungen auffassen. Änderungen am Speicherlayout können Defaultwerte einrichten.
- `process()` in `Device` ist nur ein Basiserweiterungspunkt. Tatsächliche Nachrichtenbearbeitung entsteht in den abgeleiteten Geräte- und Kanaltypen.

## Weiter und Quellen

Weiter mit [Channel](./Channel.md) und [HAL](./HAL.md); der Ablauf steht unter [Programmablauf](../Grundlagen/Programmablauf.md).

Quellbelege: [`Device.h` – `DeviceInfo`, `Device`](https://github.com/pa-pa/AskSinPP/blob/main/Device.h), [`MultiChannelDevice.h` – `ChannelDevice`, `MultiChannelDevice`](https://github.com/pa-pa/AskSinPP/blob/main/MultiChannelDevice.h), [`Storage.h` – `StorageWrapper`](https://github.com/pa-pa/AskSinPP/blob/main/Storage.h). Analysierter Versionsstand und Plattformgrenzen: [Quellenverzeichnis](../Referenz/README.md).
