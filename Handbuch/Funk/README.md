# Funk, Nachrichten und Peers

::: warning Geplanter Bereich
Diese Seite ist ein Platzhalter. Geplant sind CC1101 und SPI, Nachrichtenaufbau, Sendeablauf und Bestätigungen, Anlernen an die Zentrale, Direktverknüpfungen und die Erreichbarkeit schlafender Geräte.
:::

Ein **Peer** bezeichnet hier einen Kommunikationspartner mit Geräteadresse und Kanal. Die genaue Rolle von Registerlisten, Burst-Verfahren und Nachrichtenflags wird anhand realer Abläufe erläutert.

Vorhandene Anleitungen: [Anlernen](/Grundlagen/03_ccu.html), [Funkprobleme und FreqTest](/Grundlagen/FAQ/Fehlerhafte_CC1101.html), [Standard und gesicherte Übertragung](/Grundlagen/FAQ/Standard_vs_gesicherte_Uebertragung.html).

Quellen: `Radio.h` (`Radio`, `AvrSPI`), `Radio-CC1101.h` (`CC1101`), `Message.h` (`Message`), `Peer.h` (`Peer`) und `MultiChannelDevice.h` (`ChannelDevice::startPairing`) am [festgelegten Quellstand](../Referenz/README.md).
