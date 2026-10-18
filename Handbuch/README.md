# AskSinPP-Entwicklerhandbuch

Dieses deutschsprachige Handbuch führt vom Aufbau eines Sketches zur Entwicklung eigener Homematic-Geräte mit AskSinPP. Es richtet sich an Einsteiger und an Entwickler, die Geräteklassen, Kanäle und die internen Abläufe verstehen möchten.

::: warning Im Aufbau
Das Handbuch wird kapitelweise erweitert. Vollständig ausgearbeitet sind derzeit [Architektur im Überblick](./Grundlagen/Architektur.md), [Geräteklassen](./Klassen/Device.md), [Kanäle](./Klassen/Channel.md), [Hardwareabstraktion](./Klassen/HAL.md) und [Programmablauf](./Grundlagen/Programmablauf.md). Weitere Einstiegsseiten sind noch als Platzhalter gekennzeichnet.
:::

## Voraussetzungen und Einstieg

Wer noch kein Gerät aufgebaut und geflasht hat, beginnt mit den vorhandenen [Grundlagen](/Grundlagen/), der [Hardware](/Grundlagen/01_hardware.html) und der [Softwareeinrichtung](/Grundlagen/02_software.html). Das Handbuch knüpft daran an.

1. [Architektur im Überblick](./Grundlagen/Architektur.md): Welche Aufgaben übernehmen Gerät, Kanal und Hardwareabstraktion?
2. [Das erste eigene Gerät](./Grundlagen/Erstes-Geraet.md): Ein geeignetes Ausgangsbeispiel wählen.
3. [Programmablauf](./Grundlagen/Programmablauf.md): Initialisierung, Ereignisse und Ruhephasen einordnen.

## Themenbereiche

| Bereich | Geplanter Inhalt |
| --- | --- |
| [Klassen und Templates](./Klassen/Device.md) | Geräte, Kanäle, Hardwareabstraktion und C++-Bausteine |
| [Batterie und Energie](./Batterie/Grundlagen.md) | Messung, Schwellenwerte, Energiesparen und Grenzen der Hardware |
| [Funk](./Funk/README.md) | CC1101, Nachrichten, Anlernen und Direktverknüpfungen |
| [Register](./Register/README.md) | Konfiguration, Registerlisten und persistente Speicherung |
| [Sensoren](./Sensoren/README.md) und [Aktoren](./Aktoren/README.md) | Messwerte erfassen und Schaltzustände steuern |
| [Praxis](./Praxis/README.md) | Schrittweise Tutorials anhand realer Geräte |
| [Referenz](./Referenz/README.md) | Nachvollziehbare Quellstände und Originalquellen |

Technische Aussagen beziehen sich auf den [dokumentierten Quellstand](./Referenz/README.md). Bei anderem Bibliotheksstand oder anderer Mikrocontroller-Plattform können Details abweichen. Das Handbuch wird kapitelweise erweitert; fachliche Rückmeldungen können über die [Issues des Website-Repositories](https://github.com/AskSinPP/asksinpp-web/issues) eingebracht werden.
