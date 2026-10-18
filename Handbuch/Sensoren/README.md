# Sensoren entwickeln

::: warning Geplanter Bereich
Diese Seite ist ein Platzhalter. Geplant sind Sensoradapter, Messwerteinheiten, I²C-Anbindung, Messfehler, zeitgesteuerte Messungen und die Aufbereitung für Funknachrichten.
:::

Der Einstieg wird einen BME280-Sensor behandeln und zwischen physischem Sensor, Library-Adapter und Gerätekanal unterscheiden. Weitere Beispiele umfassen DHT22 und Kontakteingänge. Vorhandene Aufbauinformationen: [BME280 an der HMSensor-Platine](/Projekte/psi/HMSensor/HM-WDS40-TH-I-RTC-BME280.html).

Quellen: `Sensors.h` (`Sensor`, `Temperature`, `Humidity`, `Pressure`), `sensors/Bme280.h` und `ContactState.h` am [festgelegten Quellstand](../Referenz/README.md). Siehe [Praxis](../Praxis/README.md).
