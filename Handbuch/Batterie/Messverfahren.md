# Batterie: Messverfahren

::: warning Geplantes Kapitel
Diese Seite ist ein Platzhalter. Geplant sind ADC-Messung der Versorgung, interne Referenz, externe Spannungsteiler, Kalibrierung, Messintervalle sowie synchrone, zeitversetzte und interruptgestützte Messung.
:::

Zu behandeln sind `InternalVCC`, `ExternalVCC`, `BattSensor`, `SyncMeter`, `AsyncMeter`, `BatterySensorUni`, `BatterySensorExt`, `IrqInternalBatt` und `IrqExternalBatt`. Die Verfahren unterscheiden sich unter anderem bei ADC-Nutzung und Speicherung des Messwerts; sie sind keine beliebig austauschbaren Varianten.

Voraussetzung: [Batteriegrundlagen](./Grundlagen.md). Weiter: [Schwellenwerte](./Schwellenwerte.md). Quelle: `BatterySensor.h` und `Globals.cpp` am [festgelegten Quellstand](../Referenz/README.md).
