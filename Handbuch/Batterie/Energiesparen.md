# Batterie: Energiesparen

::: warning Geplantes Kapitel
Diese Seite ist ein Platzhalter. Geplant sind `Activity`, Wachhaltezeiten, `Idle<>`, `Sleep<>`, `SleepRTC`, Funkempfang und Messung des tatsächlichen Stromverbrauchs. Die Umsetzung ist plattformabhängig.
:::

Für den ATmega328P werden Timer, ADC, Sensorversorgung, Brown-out Detection und die verwendete Low-Power-Bibliothek zusammen betrachtet. Aussagen über Ruhestrom und Laufzeit brauchen Messungen an einer benannten Schaltung.

Vorbereitung: [Programmablauf](../Grundlagen/Programmablauf.md). Vorhandene Hinweise: [Batteriebetrieb](/Grundlagen/01_hardware.html#batteriebetrieb), [Dauersender](/Grundlagen/FAQ/babbling_idiot.html), [ISP](/Grundlagen/04-isp.html). Diese bestehenden Hinweise ersetzen keine Prüfung der konkreten Hardwarekonfiguration.

Quellen: `Activity.h` und `AskSinPP.h` am [festgelegten Quellstand](../Referenz/README.md).
