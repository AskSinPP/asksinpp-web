# Batterie: Schwellenwerte

::: warning Geplantes Kapitel
Diese Seite ist ein Platzhalter. Geplant sind Einheiten und Rundung, Low-Battery- und Critical-Battery-Vergleiche sowie die Reaktion des Sketches auf kritische Spannung. Konkrete Grenzwerte müssen zur Hardware passen.
:::

Eine als kritisch erkannte Spannung und ein anschließender Aufruf von `sleepForever()` sind getrennte Schritte. Im späteren Kapitel werden Beispiele mit und ohne diese Reaktion gegenübergestellt. Ein softwareseitiger Ruhezustand trennt keine Batterie elektrisch ab.

Voraussetzung: [Messverfahren](./Messverfahren.md). Weiter: [Energiesparen](./Energiesparen.md). Quellen: `BattSensor::current`, `low` und `critical` in `BatterySensor.h` sowie `Activity::sleepForever` in `Activity.h` am [festgelegten Quellstand](../Referenz/README.md).
