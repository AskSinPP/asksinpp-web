# Hardwareabstraktion (HAL)

Die Hardwareabstraktionsschicht (HAL) bündelt die konkreten Hardwarebausteine, die ein AskSinPP-Gerät verwendet. Sie verbindet die gemeinsame Geräte- und Kanal-API mit ausgewählten Implementierungen für Statusanzeige, Batterie, Funk und Aktivität. Die HAL ist ein eigener Sketch-Gegenstand, der an `ChannelDevice::init(hal)` übergeben wird. Grundlagen dazu stehen unter [Architektur im Überblick](../Grundlagen/Architektur.md); die Geräte- und Kanalebenen erklären [Device](./Device.md) und [Channel](./Channel.md).

## Statisch aus Typen zusammengesetzt

`AskSin` ist ein C++-Template mit den Parametern `StatusLed`, `Battery`, `Radio` und einem optionalen `Buzzer`. Für jede konkrete HAL legt der Sketch diese Typen fest. Die Library erzeugt damit eine konkrete C++-Klasse samt enthaltenen Komponenten; zur Laufzeit wird nicht über einen allgemeinen Gerätebaukasten eine beliebige Hardware gesucht.

```cpp
using DeviceHal = AskSin<StatusLed<LedPin>, BatterySensor, Radio<RadioSPI, 2>>;
```

Dies ist ein **schematisches Typfragment**, kein vollständiger Sketch. `LedPin` und `RadioSPI` müssen zuvor als konkrete Typen beziehungsweise Boardanbindung definiert werden. Eine andere Geräteschaltung kann zum Beispiel `NoBattery`, einen anderen Radio-Typ oder einen Summer verwenden. Der Zweikanal-Schaltaktor HM-LC-Sw2-FM verwendet tatsächlich `StatusLed<LED_PIN>`, `NoBattery` und `Radio<RadioSPI, 2>`; der BME280-Sensor wählt `BatterySensor`.

## `AskSinBase`, `AskSin` und Komponenten

`AskSinBase` stellt gemeinsame Hilfsfunktionen bereit. Dazu gehören unter anderem Programm-/Flash-Lesezugriffe, CRC-Funktionen und Zeitwertumrechnungen. Die konkreten Plattformpfade sind durch Präprozessorbedingungen begrenzt; insbesondere AVR-Programmspeicherzugriffe unterscheiden sich von anderen Targets.

`AskSin<StatusLed, Battery, Radio, Buzzer>` erbt von `AskSinBase` und enthält öffentliche Instanzen seiner Typen: `led`, `battery`, `activity`, `radio` und `buzzer`. Typ-Aliase (`LedType`, `BatteryType`, `RadioType`, `BuzzerType`) machen diese Auswahl auch für Gerätetemplates nutzbar. Häufige Schnittstellen sind:

| Methode oder Element | Zweck |
| --- | --- |
| `init(id)` | Initialisiert LED und Summer, initialisiert/aktiviert das Radio, startet die Systemuhr, signalisiert den Startzustand und setzt einen anfänglichen Sendetimeout. |
| `initBattery(interval, low, critical)` | Initialisiert den ausgewählten Batteriesensor mit dem Systemzeitgeber und setzt seine beiden Schwellen. Diese Methode muss der Sketch passend aufrufen; die Wahl der Sensorimplementierung und der Reaktion darauf bleibt gerätespezifisch. |
| `config(storageConfig)` | Wendet bei gültigen gespeicherten Funkparametern die konfigurierte Frequenz über das Radio an. |
| `runready()` | Führt fällige Aufgaben der Systemuhr aus. |
| `prepareSend(msg)` und `sendPeer()` | Erweiterungspunkte rund um Sendeabläufe; die Basismethoden sind leer und können von einer angepassten HAL überschrieben werden. |
| `setIdle()`, `unsetIdle()`, `wakeup()` | Steuern beteiligte Komponenten in den zugehörigen Ruhe-/Wachpfaden; die Basismethoden schalten unter anderem Radio und Batterie passend. |
| `activity` | Verwaltet Wachhaltezeit und stellt die gewählte Energiesparstrategie bereit. |

Die normale `AskSin::init()` ruft nicht automatisch `initBattery()` auf. `ChannelDevice::init(hal)` bindet und initialisiert die HAL; der Sketch ruft zusätzliche Funktionen wie `initBattery(...)` explizit auf, sofern sein Gerät sie benötigt. Eine gesetzte Schwelle allein erzwingt keine Reaktion auf einen kritischen Batteriestatus.

## Funkpfad: `Radio` und Treiber

Die HAL enthält einen konkreten Radio-Typ. In den verbreiteten CC1101-Aufbauten verwendet `Radio` einen Funkbus-/SPI-Typ; `Radio-CC1101.h` implementiert den Zugriff auf den Funkchip. `Device::send()` nutzt die Radio-Schnittstelle und behandelt je nach Nachricht Wiederholung und Empfang einer Bestätigung. `Device::pollRadio()` fragt eingehende Nachrichten ab. Dieser Zusammenhang erlaubt einem Gerät, Funk über HAL-Schnittstellen anzusprechen, ohne dass die Geräteklasse selbst die SPI-Register des CC1101 programmiert.

Die genaue Verbindung ist jedoch durch die gewählten Templates und Board-Pins bestimmt. Die CC1101-Variante ist kein Beleg dafür, dass alle HALs denselben Funkchip, Bus oder dieselben Interruptpins verwenden. Bibliotheksquellen führen weitere Radioimplementierungen; ihre Verfügbarkeit ersetzt keine konkrete Board- und Treiberprüfung.

## Schlafen und wach bleiben: `Activity`

`Activity::stayAwake(ticks)` hält das Gerät für eine Zeit wach. `Activity::savePower<Saver>(hal)` prüft diesen Zustand: Während das Gerät wach bleiben soll, ruft es `hal.wakeup()` auf; andernfalls übergibt es die Ruhephase an `Saver::powerSave(hal)`. Der Sketch wählt also den konkreten Saver und den Moment seines Aufrufs.

Die Saver-Typen sind plattformspezifisch. Im untersuchten `AskSin`-Quellstand sind `idle()` und `sleep()` für bestimmte AVR-Targets verfügbar; ein `sleep()`-Pfad ist auch für RP2040 definiert. Der RTC-Zweig `SleepRTC` ist an AVR-Bedingungen geknüpft. `Idle` und `Sleep` unterscheiden sich darin, welche Hardware während der Ruhephase weiterlaufen darf. Aktive Funkempfänger und Geräte, die auf bestimmte Timer oder ADC-Vorgänge angewiesen sind, benötigen eine dazu passende Strategie. „Sleep“ ist weder eine plattformunabhängige Garantie noch eine automatische Abschaltung aller Verbraucher.

## `AskSinRTC`

Wenn `NORTC` nicht definiert ist, stellt die Library `AskSinRTC` als Ableitung von `AskSin` bereit. Die Klasse initialisiert zusätzlich die RTC und überschreibt die Zeitpfadmethoden für `initBattery()`, `runready()` und – auf den betreffenden AVR-Zielen – `sleep()`. Damit werden zeitabhängige Aufgaben und Batteriemessintervalle an eine andere Zeitbasis angebunden. Der Sketch muss dennoch `AskSinRTC` als seinen HAL-Typ auswählen; ein RTC-Objekt an anderer Stelle schaltet nicht automatisch auf diesen Pfad um.

Welche Genauigkeit, Aufweckquelle und Schlafdauer damit erreichbar sind, hängt von Platformdefinition, RTC-Hardware und konkretem Aufbau ab. Diese Details sollten nur für ein benanntes Board und einen bestätigten Compiler-Core beschrieben werden.

## Typische Fehler

- HAL-Komponenten nicht als lose globale Funktionen auffassen: `hal.radio`, `hal.battery` und `hal.activity` sind Instanzen konkreter Typen.
- Keine Komponentenmethoden über das Gerät aufrufen, ehe `sdev.init(hal)` die HAL gebunden hat.
- `initBattery()` nicht mit automatischer Abschaltung oder universeller Überwachung verwechseln; der Sketch muss die Mess- und Reaktionslogik festlegen.
- Eine HAL-Auswahl nicht allein aus einem Beispiel auf ein anderes Board übertragen. Pins, SPI-Typ, Sensor und Radioverdrahtung gehören zur jeweiligen Schaltung.
- `Idle`, `Sleep` und `SleepRTC` nicht austauschbar behandeln; verfügbare Methoden und Timerverhalten hängen von `#if`-Bedingungen und Plattform ab.
- RTC-Verhalten nicht nur aus dem Typnamen ableiten. `AskSinRTC` muss ausgewählt und seine konkreten Plattformbedingungen müssen geprüft werden.

## Weiter und Quellen

Weiter zu [Device](./Device.md), [Channel](./Channel.md), [Programmablauf](../Grundlagen/Programmablauf.md) und [Batteriegrundlagen](../Batterie/Grundlagen.md).

Quellbelege: [`AskSinPP.h` – `AskSinBase`, `AskSin`, `AskSinRTC`](https://github.com/pa-pa/AskSinPP/blob/main/AskSinPP.h), [`Activity.h` – `Activity::stayAwake`, `savePower`, `Sleep`, `Idle`](https://github.com/pa-pa/AskSinPP/blob/main/Activity.h), [`BatterySensor.h` – Batteriemessimplementierungen](https://github.com/pa-pa/AskSinPP/blob/main/BatterySensor.h), [`Radio.h`](https://github.com/pa-pa/AskSinPP/blob/main/Radio.h), [`Radio-CC1101.h`](https://github.com/pa-pa/AskSinPP/blob/main/Radio-CC1101.h), [`Led.h`](https://github.com/pa-pa/AskSinPP/blob/main/Led.h) und [`Buzzer.h`](https://github.com/pa-pa/AskSinPP/blob/main/Buzzer.h). Analysierter Versionsstand und Plattformgrenzen: [Quellenverzeichnis](../Referenz/README.md).
