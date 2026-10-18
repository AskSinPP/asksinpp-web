# Register und Speicherung

::: warning Geplanter Bereich
Diese Seite ist ein Platzhalter. Geplant sind Geräte- und Kanalregister, List0/1/2/3/4, Kurz- und Langdruckparameter, Standardwerte, EEPROM-Aufteilung und eigene persistente Daten.
:::

Ein **Register** bezeichnet einen konfigurierbaren Wert; Registerlisten bündeln diese Werte für Gerät, Kanal oder Direktverknüpfung. Das Kapitel wird auch erklären, weshalb Änderungen am Speicherlayout eine Neuinitialisierung auslösen können und wie Konfiguration mit der Gerätebeschreibung der Zentrale zusammenhängt.

Vorbereitung: [Kanäle](../Klassen/Channel.md). Bestehende [RF-Types](/rftypes/) enthalten ergänzendes Material zu Gerätebeschreibungen.

Quellen: `Register.h` (`RegisterList`, `RegList0` bis `RegList4`, `DEFREGISTER`), `ChannelList.h`, `Storage.h` (`StorageWrapper`, `StorageConfig`, `UserStorage`) und `ChannelDevice::checksum` am [festgelegten Quellstand](../Referenz/README.md).
