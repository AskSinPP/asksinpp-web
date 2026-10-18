# Klassen- und Templateinventar

**Stand:** AskSinPP `21bab8b92f7982c29beca08ff3c0ad6ef1e72a5c` (5.0.3). Kuratiertes Inventar der für den Lernweg wichtigen Symbole; keine automatisch erzeugte vollständige API-Referenz. Die Tabellen nennen Zweck, Verwendung, Basen, sämtliche benannten Template-Parameter, ausgewählte öffentliche Methoden, Abhängigkeiten und passende Beispiele.

**Zählweise:** Eine Tabellenzeile erfasst genau einen konkreten Klassen-/Template-Namen beziehungsweise `DeviceInfo` als Struktur. Aliase, Makros, globale Objekte und weitere im Text erwähnte Spezialisierungen werden nicht zusätzlich gezählt. Plattformvarianten gleichen Namens wie `Sleep` zählen einmal. Es sind **33 Klassen, 50 Klassentemplates und eine Struktur**, insgesamt **84 Einträge**.

**Leseschlüssel:** E = für Einsteiger beim Verwenden relevant; F = für Fortgeschrittene beim Erweitern oder Verstehen der Interna. E/F = beide, mit unterschiedlicher Tiefe. E1 bis E9 beziehen sich auf den [Beispielkatalog](./Beispielkatalog.md). Methoden können öffentlich geerbt sein; das wird bei wichtigen Fällen benannt. `–` bei Parametern bedeutet kein Klassentemplate. Basistypen sind zur Lesbarkeit ohne wiederholte vollständige Template-Argumentliste angegeben; die Parameter stehen daneben. Aufgeführte Beispielstellen belegen Verwendung, keine erfolgte Kompilierung.

## Gerät, Kanäle und HAL

Quellen: [AskSinPP.h][hal], [Device.h][device], [MultiChannelDevice.h][multi], [Channel.h][channel].

| Symbol / Datei | Zweck und typische Verwendung | Basen; Template-Parameter | Wichtige öffentliche Methoden | Abhängigkeiten und Beispiel | Niveau |
| --- | --- | --- | --- | --- | --- |
| `AskSinBase` / `AskSinPP.h` | Gemeinsame Hilfsfunktionen für Zeitformate, Prüfsummen und Pins | Keine; – | `pgm_read`, `crc16`, `crc24`, `nextSendSlot`, `readPin` | Arduino-/Plattformfunktionen; E6 nutzt Sendezeitplanung über `WeatherChannel` | F |
| `AskSin` / `AskSinPP.h` | HAL aus konkreten Hardwaretypen zusammensetzen | `AskSinBase`; `StatusLed`, `Battery`, `Radio`, `Buzzer=NoBuzzer` | `init`, `initBattery`, `runready`, `setIdle`, `unsetIdle`, `wakeup`; AVR: `idle`, `sleep`, `sleepForever` | Enthält LED, Batterie, `Activity`, Radio und Summer; E1 | E/F |
| `AskSinRTC` / `AskSinPP.h` | HAL mit zusätzlicher RTC-Zeitbasis | `AskSin`; dieselben vier Parameter | `init`, `initBattery`, `runready`, AVR: `sleep` | `rtc`, `SleepRTC`, ohne `NORTC`; E6 mit `USE_RTC` | F |
| `DeviceInfo` / `Device.h` | Struktur mit Geräte-ID, Seriennummer, Modell, Firmware und Infobytes | Keine; – | Keine Methoden; Datenfelder `DeviceID`, `Serial`, `DeviceModel`, `Firmware`, `DeviceType`, `DeviceInfo` | Häufig `PROGMEM`; E1–E9 initialisieren `devinfo` | E |
| `Device` / `Device.h` | Geräteidentität, HAL-Zugriff, Nachrichtenversand und Empfang | Keine; `HalType`, `List0Type=List0` | `pollRadio`, `process`, `send`, `sendPeerEvent`, `broadcastEvent`, `getDeviceID`, `getList0`, `battery`, `configChanged` | HAL, `Message`, `KeyStore`, List0; Basis von E1s Geräteklasse | E/F |
| `ChannelDevice` / `MultiChannelDevice.h` | Kanäle registrieren, Speicherlayout und Konfigurationsabläufe verwalten | `Device`; `HalType`, `ChannelType`, `ChannelCount`, `List0Type=List0` | `registerChannel`, `layoutChannels`, `init`, `initDone`, `firstinit`, `channel`, `startPairing`, `reset`, `getUserStorage` | Kanalzeiger, Register, `Storage`; E4 über `MultiChannelDevice` | E/F |
| `MultiChannelDevice` / `MultiChannelDevice.h` | Array gleichartiger Kanalobjekte besitzen und registrieren | `ChannelDevice`; `HalType`, `ChannelType`, `ChannelCount`, `List0Type=List0` | Konstruktor; `init`, `channel`, `channels` usw. geerbt | Konkreter Kanaltyp und dessen Speicherbedarf; E1 ein Kanal, E4 zwei | E/F |
| `Channel` / `Channel.h` | Gerätefunktion mit Konfiguration und Peerplätzen verbinden | Keine; `HalType`, `List1Type`, `List3Type`, `List4Type`, `PeerCount`, `List0Type=List0`, `List2Type=EmptyList` | `setup`, `number`, `device`, `peer`, `peerat`, `getList1/2/3/4`, `changed`, `process`, `configChanged` | `Device`, `Peer`, Registerlisten, Storage; E1 eigener Wetterkanal | E/F |
| `ActorChannel` / `Channel.h` | Empfangene Aktionen mit Aktorzustandsmaschine verbinden | `Channel` und Template-Typ `StateMachine`; `HalType`, `List1Type`, `List3Type`, `PeerCount`, `List0Type`, `StateMachine`, `List2Type=EmptyList` | `setup`, `process`, `stop`, `status`, `flags` | Aktorlisten und Zustandsmaschine; Basis von E4s `SwitchChannel` | F |
| `VirtBaseChannel` / `Channel.h` | Abstrakte virtuelle Schnittstelle für unterschiedliche Kanaltypen | Keine; `HalType`, `List0Type=List0` | Rein virtuelle `setup`, `process`, `status`, `flags`, `getList1/2/3/4`, `peer` | Schnittstelle für `ChannelDevice`; geeignet für spätere gemischte Kanalgeräte, kein E1–E9-Direktbeispiel | F |
| `VirtChannel` / `Channel.h` | Einen konkreten Kanal hinter `VirtBaseChannel` kapseln | `VirtBaseChannel`; `HalType`, `ChannelType`, `List0Type=List0` | Weiterleitungen wie `setup`, `process`, `status`, `getList1`; Umwandlung in `ChannelType&` | Enthält `ChannelType`; zusammen mit `VirtBaseChannel` für gemischte Kanäle, noch kein ausgewähltes Tutorial | F |

## Zeitsteuerung und Energieverwaltung

Quellen: [Alarm.h][alarm], [AlarmClock.h][clock], [AlarmClock.cpp][clockcpp], [Activity.h][activity]. Bei `Idle`, `Sleep` und `SleepRTC` beschreiben Parameter und Methoden den AVR-Pfad für den ATmega328P. Andere Präprozessorzweige können abweichen.

| Symbol / Datei | Zweck und typische Verwendung | Basen; Template-Parameter | Wichtige öffentliche Methoden | Abhängigkeiten und Beispiel | Niveau |
| --- | --- | --- | --- | --- | --- |
| `Alarm` / `Alarm.h` | Basistyp für zeitgesteuerte Aufgaben | `Link`; – | Rein virtuelles `trigger`; `set`, `async`, `active`; öffentliches 24-Bit-Feld `tick` | An einer `AlarmClock` anmelden; E1 eigener Kanal erbt zusätzlich `Alarm` | E/F |
| `RTCAlarm` / `Alarm.h` | Alarm mit zusätzlichem Millisekundenrest für RTC-Planung | `Alarm`; – | Geerbte `set`, `async`; Feld `millis`; `delayMillis` ist geschützt | `RealTimeClock` und `sysclock`; E6 über Library-`WeatherChannel` | F |
| `AlarmClock` / `AlarmClock.h/.cpp` | Warte- und Bereitschaftslisten für Aufgaben | Geschützt `Link`; – | `add`, `cancel`, `runready`, `runsingle`, `next`, `get`, `correct`, `operator--` | `Alarm`, atomare Abschnitte; E9 nutzt eine weitere Clock als Ereigniszähler | E/F |
| `SysClock` / `AlarmClock.h` | Plattformgebundener Systemtakt für Alarme | `AlarmClock`; – | `init`, `instance`, `enable`, `disable`, `add`; Listenmethoden geerbt | Auf AVR Timer1; globale Instanz `sysclock`; E1/E3 | E/F |
| `RealTimeClock` / `AlarmClock.h` | Sekundenzeitbasis mit plattformabhängiger Hardwareanbindung | `AlarmClock`; – | `init`, `instance`, `getCounter`, `getCurrentMillis`, `add`, `overflow` | Auf AVR asynchroner Timer2; globale Instanz `rtc`; E6 optional | F |
| `Activity` / `Activity.h` | Wachhaltezeit verwalten und Schlafstrategie ausführen | `Alarm`; – | `stayAwake` als Setter/Abfrage, `savePower<Saver,Hal>`, `sleepForever<Hal>`, `trigger` | `sysclock`, HAL und Sleep-Strategie; E5/E7 | E/F |
| `Idle` / `Activity.h` | AVR-Idle-Modus mit ausgewählter Peripherie | Keine; `ENABLETIMER2=false`, `ENABLEADC=false`, `ENABLETWI=false` | Statisch `waitSerial`, `powerSave<Hal>` | Low-Power-Library; E4 hält Funkempfang bereit | F |
| `Sleep` / `Activity.h` | AVR-Ruhephasen mit Abschalten und Zeitkorrektur | `Idle<ENABLETIMER2>`; `ENABLETIMER2=false` | Statisch `doSleep`, `powerSave<Hal>` | Low-Power, `sysclock`, HAL; E1/E3/E5 | E/F |
| `SleepRTC` / `Activity.h` | AVR-Schlafstrategie bei weiterlaufender RTC | `Idle<true>`; – | Statisch `doSleep`, `powerSave<Hal>` | Low-Power, Timer2, `rtc`, ohne `NORTC`; E6 mit `USE_RTC` | F |
| `BurstDetector` / `Activity.h` | Wiederkehrend Funkburst prüfen und bei Erkennung wach halten | `Alarm`; `HalType` | `trigger`, `enable` | HAL-Radio und Activity; E7 im alternativen Build ohne `USE_WOR` | F |

Wichtig: `async(true)` kann einen Alarm in den Interruptkontext verlagern; `AsyncMeter` benennt dagegen zunächst einen zeitversetzten Messablauf. `AlarmClock::add()` mit `tick == 0` legt direkt in die Ready-Liste ab. Keine allgemeine ISR-Garantie allein aus Klassennamen ableiten.

## Batteriesensoren und Messbausteine

Quelle: [BatterySensor.h][battery], für IRQ-Wertübernahme auch [Globals.cpp][globals]. Vollständige Befunde und Grenzen stehen in [Batterieanalyse](./Batterieanalyse.md).

| Symbol / Datei | Zweck und typische Verwendung | Basen; Template-Parameter | Wichtige öffentliche Methoden | Abhängigkeiten und Beispiel | Niveau |
| --- | --- | --- | --- | --- | --- |
| `NoBattery` / `BatterySensor.h` | Schnittstellenersatz ohne echte Messung | Keine; – | `current`, `low`, `critical`, `resetCurrent`, `setIdle`, `unsetIdle` | Kein ADC; E4 | E |
| `InternalVCC` / `BatterySensor.h` | Controller-Versorgung bestimmen, AVR über Bandgap | Keine; – | `init`, `start`, `finish`; Typ `ValueType`, Konstante `DefaultDelay` | Plattform-ADC; E1/E6 über Alias `BatterySensor` | F |
| `ExternalVCC` / `BatterySensor.h` | Geschaltete externe ADC-Messung skalieren | `InternalVCC`; `SENSPIN`, `ACTIVATIONPIN`, `ACTIVATIONSTATE=LOW`, `VCC=3300`, `FACTOR=57` | `init`, `start`, `finish` | GPIO, `analogRead`; E5 eigener `SwitchSensor`, E3 über `BatterySensorUni` | F |
| `ExternalVCCEFM32` / `BatterySensor.h` | EFM32-ADC-Eingang mit eigener Referenz lesen | `InternalVCC`; `SENS_CHANNEL` | `init`, `start`, `finish` | Nur `ARDUINO_ARCH_EFM32`; mit `BattSensor` komponierbar, kein EFM32-Tutorial ausgewählt | F |
| `SyncMeter` / `BatterySensor.h` | Messquelle synchron betreiben und Minimum halten | Keine; `SENSOR`, `DELAY=SENSOR::DefaultDelay` | `start`, `measure`, `value`, `sensor`, `resetCurrent` | Messquelle mit `ValueType`, `init/start/finish`; E1 über `BatterySensor` | F |
| `AsyncMeter` / `BatterySensor.h` | Ende der Messung über Alarm verzögern | `Alarm`; `SENSOR`, `DELAY=SENSOR::DefaultDelay` | `start`, `trigger`, `measure`, `value`, `sensor`, `resetCurrent` | Messquelle und `sysclock`; E5/E7 | F |
| `BattSensor` / `BatterySensor.h` | Messintervall und Batterieschwellen verbinden | `Alarm`; `METER` | `init`, `trigger`, `current`, `voltageHighRes`, `low`, `critical`, `meter`, `resetCurrent` | Messablauf und gewählte `AlarmClock`; E1/E5/E7 | E/F |
| `BatterySensorUni` / `BatterySensor.h` | Externe Messung mit Low-Aktivierung und Faktor 57 konfigurieren | `BattSensor<SyncMeter<ExternalVCC<...>>>`; `SENSPIN`, `ACTIVATIONPIN`, `VCC=3300` | Geerbte `init`, `current`, `low`, `critical`, `meter` | Spannungsteiler und definierte Referenz; E3, E6 optional | E/F |
| `BatterySensorExt` / `BatterySensor.h` | Ältere externe Abfrage neben internem geerbten Meter | Alias `BatterySensor`; `SENSPIN`, `ACTIVATIONPIN`, `VCC=3300` | Eigene `init`, `voltage`; geerbte `current`, `low`, `critical` beziehen sich auf internen Meter | GPIO/ADC; direkte `voltage()`-Nutzung muss getrennt betrachtet werden, kein empfohlenes Tutorial vor Klärung B4 | F |
| `IrqBaseBatt` / `BatterySensor.h` | Gemeinsame Schwellen und statischer ADC-Messwert | Keine; – | `current`, `low`, `critical`, `voltage`, `voltageHighRes`, `resetCurrent`; ADC-Steuerung geschützt | AVR und globale ISR-Daten; Basis von E2s Batterieklasse | F |
| `IrqInternalBatt` / `BatterySensor.h` | AVR-Bandgap-Messung im Hintergrund | `IrqBaseBatt`; – | `init` mit/ohne Parameter, `setIdle`, `unsetIdle`, statisch `irq` | Kontinuierlicher ADC; `period/clock` ignoriert; E2 | F |
| `IrqExternalBatt` / `BatterySensor.h` | AVR-Teilerspannung im Hintergrund messen | `IrqBaseBatt`; `SENSPIN`, `ACTIVATIONPIN`, `FACTOR=57` | `init`, `getInternalVcc`, `setIdle`, `unsetIdle`, statisch `irq` | ADC, Teiler, gemeinsame globale IRQ-Daten; geeignet für spätere Gegenüberstellung zu E3, kein ausgewählter Direkteinsatz | F |

## Registerlisten

Quellen: [ChannelList.h][lists] und [Register.h][register]. Die älteren `List0`, `List1` und `List4` sind konkrete Klassen in `ChannelList.h`; sie werden hier als vorhandene Standardtypen eingeordnet und nicht als Alias von `DefList0/1/4` behandelt.

| Symbol / Datei | Zweck und typische Verwendung | Basen; Template-Parameter | Wichtige öffentliche Methoden | Abhängigkeiten und Beispiel | Niveau |
| --- | --- | --- | --- | --- | --- |
| `BaseList` / `ChannelList.h` | Speicherbereich über Startadresse zugänglich machen | Keine; – | `address`, `valid`, `getByte`, `setByte`, `setBit`, `getData`, `clear` | `storage()`; Basis aller betrachteten Registerlisten, E3 | F |
| `GenericList` / `ChannelList.h` | Einheitliche Sicht auf verschiedene Registerlistentypen | `BaseList`; – | `getOffset`, `getRegister`, `getSize`, `readRegister`, `writeRegister` | Funktionszeiger für Mapping; Konfigurationsverarbeitung von `ChannelDevice`, E4 indirekt | F |
| `ChannelList` / `ChannelList.h` | Liste anhand einer Datentypbeschreibung abbilden | `BaseList`; `DataType` | `getOffset`, `getRegister`, `size`, `readRegister`, `writeRegister`, Konversion zu `GenericList` | Standardlisten in E1; ältere Listendefinitionen | F |
| `EmptyList` / `ChannelList.h` | Nicht verwendete Listen mit Größe null repräsentieren | `ChannelList<EmptyListData>`; – | `size`, `defaults`, `single`, `even`, `odd` | Platzhalter im Kanaltemplate; E1 ohne List3 | E/F |
| `RegisterList` / `Register.h` | Ausgewählte Registernummern auf EEPROM-Offsets abbilden | `BaseList`; `RegisterType` | `readRegister`, `writeRegister`, `readBit`, `writeBit`, `clear`, `defaults`, `size` | Registerbeschreibung, meist aus `DEFREGISTER`; E3 | F |
| `RegList0` / `Register.h` | Typisierte geräteweite Parameter | `RegisterList<Register>`; `Register` | `masterid`, `transmitDevTryMax`, `lowBatLimit`, `cycleInfoMsg`, `localResetDisable` | Nur tatsächlich definierte Register speicherbar; E3/E5/E7 mit eigenen List0-Klassen | E/F |
| `RegList1` / `Register.h` | Typisierte Kanalparameter | `RegisterList<Register>`; `Register` | `aesActive`, `msgForPosA/B/C`, `eventDelaytime`, `ledOntime`, `transmitTryMax` | Registerauswahl des Kanals; E3/E5 | E/F |
| `RegList2` / `Register.h` | Typisierte Felder für List2, unter anderem Empfängeradressen | `RegisterList<Register>`; `Register` | `ADDRESS_SENDER_HIGH_BYTE`, `ADDRESS_RECEIVER_HIGH_BYTE`, `BROADCAST_BEHAVIOR` | Explizite Registerbeschreibung; in E1–E9 kein eigener List2-Lernfall ausgewählt | F |
| `RegList3` / `Register.h` | Peerbezogene Aktorparameter lesen und schreiben | `RegisterList<Register>`; `Register` | `onDly`, `onTime`, `offDly`, `offTime`, `actionType` | Kurz-/Langdrucklisten, Aktorzustände; E4 über `SwitchList3` | F |
| `RegList4` / `Register.h` | Peerbezogene Burst-/AES-Eigenschaften | `RegisterList<Register>`; `Register` | `peerNeedsBurst`, `burst`, `expectAES` | Senderkanal und Peer; E3/E9 über `DefList4` | F |
| `ShortLongList` / `Register.h` | Zwei Registerbereiche für Kurz-/Langdruck verbinden | `BaseList`; `PeerListType` | `sh`, `lg`, `size`, `getOffset`, `getRegister`, Konversion zu `GenericList` | Peerregisterliste und Adressoffsets; E4 über `SwitchList3Tmpl` | F |

## Persistente Speicherung

Quelle: [Storage.h][storage]. Externe I²C-Speichertreiber sind nur unter passenden Wire-Header-Bedingungen enthalten. „EEPROM“ bezeichnet auf anderen Plattformen nicht zwingend echtes internes EEPROM.

| Symbol / Datei | Zweck und typische Verwendung | Basen; Template-Parameter | Wichtige öffentliche Methoden | Abhängigkeiten und Beispiel | Niveau |
| --- | --- | --- | --- | --- | --- |
| `InternalEprom` / `Storage.h` | Plattformabhängiger interner Speichertreiber | Keine; – | `present`, `size`, `getByte`, `setByte`, `getData`, `setData`, `clearData`, `store` | AVR-EEPROM beziehungsweise andere Plattformpfade; Standard in E1–E9 | F |
| `StorageWrapper` / `Storage.h` | Treiber um Layoutinitialisierung und Hilfszugriffe ergänzen | Template-Typ `DRIVER`; `DRIVER=InternalEprom` | `setup`, `setBits`, `clearBits`, `getData`, `setData`, `clearData`, `reset`, `dump` | Gewählter Speichertreiber; E1 über `Storage` | F |
| `Storage` / `Storage.h` | Konkrete globale Speicheranbindung registrieren | `StorageWrapper<STORAGEDRIVER>`; – | Konstruktor; Zugriffsmethoden geerbt | Makro `STORAGEDRIVER`, globales `storage()`; E1–E9 | F |
| `StorageConfig` / `Storage.h` | Separaten Konfigurationsbereich prüfen und adressieren | Keine; – | `checksum`, `validate`, `valid`, `getByte`, `setByte`, `clear` | `STORAGE_CFG_START`, Funkfrequenzkonfiguration; alle Beispiele über HAL-Konfiguration | F |
| `UserStorage` / `Storage.h` | Freien Bereich nach Gerätedaten zugänglich machen | Keine; – | `getAddress`, `getSize`, `getByte`, `setByte`, `getData`, `setData`, `clear` | `ChannelDevice::getUserStorage`; geeignet für spätere eigene persistente Daten, kein E1–E9-Direkteinsatz | F |
| `at24cX` / `Storage.h` | Externen I²C-EEPROM ansprechen | Keine; `ID`, `EEPROM_NUM_PAGES`, `EEPROM_PAGESIZE` | `present`, `size`, `getByte`, `setByte`, `getData`, `setData`, `store` | `Wire` und EEPROM-Geometrie; spätere Speichererweiterung, keine Standardversorgung in E1–E9 | F |
| `CachedAt24cX` / `Storage.h` | Externen EEPROM mit Seitenpuffer verwenden | `at24cX`; `ID`, `PAGES`, `EEPROM_PAGESIZE` | `store`, `getByte`, `setByte`, `getData`, `setData`, `clearData` | Puffer und explizites Schreiben; Aliase `at24c32/64`, noch kein ausgewähltes Tutorial | F |

## SPI und Funk

Quellen: [Radio.h][radio], [Radio-CC1101.h][cc1101]. Weitere Funkchips sind vorhanden; ihr eigener Treiberumfang ist für spätere Plattformkapitel vorgesehen.

| Symbol / Datei | Zweck und typische Verwendung | Basen; Template-Parameter | Wichtige öffentliche Methoden | Abhängigkeiten und Beispiel | Niveau |
| --- | --- | --- | --- | --- | --- |
| `AvrSPI` / `Radio.h` | SPI-Kommunikation für die Funkhardware bereitstellen | Keine; `CS`, `MOSI`, `MISO`, `SCLK`, `PINTYPE=ArduinoPins` | `init`, `select`, `deselect`, `send`, `strobe`, `readReg`, `writeReg`, `readBurst`, `writeBurst` | Pins/AVR-SPI, bedingte Plattformpfade; E1 `AvrSPI<10,11,12,13>` | E/F |
| `LibSPI` / `Radio.h` | SPI über Arduino-SPI-Library ansprechen | Keine; `CS`, `CLOCK=2000000`, `BITORDER=SPI_BITORDER_MSBFIRST`, `MODE=SPI_MODE0` | `init`, `shutdown`, `select`, `send`, `readReg`, `writeReg`, `readBurst`, `writeBurst` | `SPI`, Einstellungen; Kandidat für spätere Portierung, kein E1–E9-Direktbeispiel | F |
| `CC1101` / `Radio-CC1101.h` | Funkchip konfigurieren, schlafen lassen, senden und empfangen | Keine; `SPIType`, `PWRPIN` | `init`, `initReg`, `tuneFreq`, `setIdle`, `wakeup`, `sndData`, `rcvData`, `detectBurst`, `recalibrate` | SPI-Typ, Chipregister, optional `USE_WOR`; E7 über `Radio` | F |
| `Radio` / `Radio.h` | Chiptreiber mit Interrupts, Puffer und Nachrichten verbinden | Template-Typ `HWRADIO`; `SPIType`, `GDO0`, `PWRPIN=0xff`, `SENDDELAY=100`, `HWRADIO=CC1101<SPIType,PWRPIN>` | `init`, `enable`, `disable`, `handleInt`, `read`, `write`, `setIdle`, `wakeup`, `setSendTimeout` | `Message`, `sysclock`, Hardwaretreiber; E1–E9 | E/F |
| `CalibratedRadio` / `Radio.h` | Wiederkehrende Rekalibrierung des Radios anstoßen | `Radio` und `Alarm`; dieselben fünf Parameter wie `Radio` | `init`, `trigger`, Radiomethoden geerbt | Treibermethode `recalibrate`, Alarmclock; Erweiterungsbeispiel zum Funkkapitel, kein ausgewählter Direkteinsatz | F |

## Nachrichten und Adressen

Quellen: [Message.h][message], [HMID.h][hmid], [Peer.h][peer]. Die vielen weiteren Konfigurations-, ACK/NACK- und AES-Nachrichten werden als Familien geplant; diese Phase schreibt keine separate API-Seite für jede Nachricht.

| Symbol / Datei | Zweck und typische Verwendung | Basen; Template-Parameter | Wichtige öffentliche Methoden | Abhängigkeiten und Beispiel | Niveau |
| --- | --- | --- | --- | --- | --- |
| `HMID` / `HMID.h` | Drei Byte große Geräteadresse darstellen | Keine; – | `id0`, `id1`, `id2`, `valid`, Vergleichs-/Zuweisungsoperatoren, `dump` | Geräte- und Zieladressen; E4 bei internen Peers | E/F |
| `Peer` / `Peer.h` | Geräteadresse um Kanalnummer ergänzen | `HMID`; – | `channel`, `even`, `odd`, `size`, Vergleichsoperator, `dump` | Channel-Peerliste und Storage; E4 interne Verknüpfungen | E/F |
| `Message` / `Message.h` | Telegramm mit Header, Nutzdaten und Flags darstellen | Keine; – | `init`, `length`, `count`, `from`, `to`, `data`, `ackRequired`, `burstRequired`, `dump` | HMID, Protokollkonstanten; E1 eigene Nachricht erbt davon | E/F |
| `RemoteEventMsg` / `Message.h` | Tastenevent mit Kanal, Zähler und Langdruckstatus | `Message`; – | `init`, `peer`, `counter`, `isLong` | Nachrichtenbuffer; Konstruktor geschützt, Verwendung über Buffer-Sicht oder Ableitung; E9 und E4 intern | F |
| `SensorEventMsg` / `Message.h` | Sensorereignis um einen Wert ergänzen | `RemoteEventMsg`; – | `init`, `value` | Peer-/Kanalereignisse, Konstruktor geschützt; E3 über Kontaktkanal | F |
| `InfoActuatorStatusMsg` / `Message.h` | Status und Flags eines Kanals übertragen | `Message`; – | `init<ChannelType>`, `status`, `flags` | Kanal liefert `number/status/flags`, Radio-RSSI; E4 über Geräteverarbeitung | F |

## Taster und Statusanzeigen

Quellen: [Button.h][button], [Led.h][led]. Interrupt-Anbindung erfolgt unter anderem über Makros wie `buttonISR`; diese sind keine Klassen und werden nicht mitgezählt.

| Symbol / Datei | Zweck und typische Verwendung | Basen; Template-Parameter | Wichtige öffentliche Methoden | Abhängigkeiten und Beispiel | Niveau |
| --- | --- | --- | --- | --- | --- |
| `StateButton` / `Button.h` | Tastenzustände und Entprell-/Langdruckablauf verwalten | `Alarm`; `OFFSTATE=HIGH`, `ONSTATE=LOW`, `MODE=INPUT_PULLUP`, `DBLPRESS=NoDoublePressAlarm` | `init`, `irq`, `state`, `trigger`, `setLongPressTime`, `setDoublePressTime` | `sysclock`, GPIO, optionale Doppeldrucklogik; E9 über `DoublePressButton` | E/F |
| `ConfigButton` / `Button.h` | Taster mit Pairing und Reset des Geräts verbinden | `StateButton`; `DEVTYPE`, `OFFSTATE=HIGH`, `ONSTATE=LOW`, `MODE=INPUT_PULLUP` | Konstruktor, `state`; `init/irq` geerbt | Gerät mit `startPairing/reset/getList0`; E1/E3/E5 | E |
| `InternalButton` / `Button.h` | Lokales Tastenevent an die eigene Geräteverarbeitung geben | `StateButton`; `DEVTYPE`, `OFFSTATE=HIGH`, `ONSTATE=LOW`, `MODE=INPUT_PULLUP` | `state`, `fillMsg`, `peer`, `shortPress` | `RemoteEventMsg`, Geräteadresse und Kanal; E4 | E/F |
| `StatusLed` / `Led.h` | Eine LED über vorgegebene Blinkzustände steuern | `LedStates`; `LEDPIN1`, `PINTYPE=ArduinoPins` | `init`, `set`, `active`, `ledOn`, `ledOff`, `invert`, `enable` | Enthält `Led<PINTYPE>` mit Alarmen; E1 | E |
| `DualStatusLed` / `Led.h` | Zwei LEDs für Statusmuster zusammenfassen | `LedStates`; `LEDPIN1`, `LEDPIN2`, `PINTYPE1=ArduinoPins`, `PINTYPE2=ArduinoPins` | `init`, `set`, `active`, `ledOn`, `ledOff`, `invert`, `enable` | Zwei `Led`-Objekte; E3/E5/E9 | E |

## Sensorgrundtypen und konkrete Adapter

Quellen: [Sensors.h][sensors], [sensors/Bme280.h][bme], [sensors/Dht.h][dht]. Die Basen benutzen virtuelle Vererbung von `Sensor`; ihre Methoden sind keine allgemeine virtuelle Sensor-Schnittstelle. Rückgabeeinheiten müssen am jeweiligen Adapter geprüft werden.

| Symbol / Datei | Zweck und typische Verwendung | Basen; Template-Parameter | Wichtige öffentliche Methoden | Abhängigkeiten und Beispiel | Niveau |
| --- | --- | --- | --- | --- | --- |
| `Sensor` / `Sensors.h` | Präsenzstatus und gemeinsame Ausgangsbasis | Keine; – | `present`, leere `init`, leere `measure` | Konkrete Adapter setzen `_present`; E1 über `Bme280` | E/F |
| `Temperature` / `Sensors.h` | Temperaturwert speichern und in Zehntelgrad ausgeben | Virtuell `Sensor`; – | `temperature` | Konkrete Temperaturmessung; E1/E2 | E |
| `Humidity` / `Sensors.h` | Feuchtewert speichern und ausgeben | Virtuell `Sensor`; – | `humidity` | Konkreter Sensoradapter; E1/E2 | E |
| `Pressure` / `Sensors.h` | Druckwert speichern und ausgeben | Virtuell `Sensor`; – | `pressure` | Einheit am Adapter prüfen; E1s BME-Adapter kann Druck, Sketch überträgt nur Temperatur/Feuchte | E/F |
| `Brightness` / `Sensors.h` | Helligkeitswert speichern und ausgeben | Virtuell `Sensor`; – | `brightness` | Bereich laut Header noch nicht einheitlich festgelegt; E8 über MAX44009 | E/F |
| `Position` / `Sensors.h` | Diskreten Kontaktzustand darstellen | Virtuell `Sensor`; – | `position`, `remap`, `interval`; Enum `State` | Positionadapter in `ContactState.h`; E3/E5 | E/F |
| `Bme280` / `sensors/Bme280.h` | I²C-Adapter für Temperatur, Feuchte und Druck | `Temperature`, `Pressure`, `Humidity`; – | `init`, `measure`; Wertabfragen geerbt | `Wire`, `BME280I2C`, Forced-Mode-Einstellungen; E1/E6 | E/F |
| `Dht` / `sensors/Dht.h` | DHT-Sensor lesen, optional Messversuche wiederholen | `Temperature`, `Humidity`; `DATAPIN`, `TYPE=DHT11`, `MAXMEASURE=1` | `init`, `measure`; Wertabfragen geerbt | `DHT.h`, mögliche Wartezeiten bei Wiederholung; E2 mit DHT22 und vier Versuchen | E/F |

## Spezialisierte Kanäle und Zustandsmaschinen

Quellen: [ContactState.h][contact], [Switch.h][switch], [Remote.h][remote], [Weather.h][weather], [StateMachine.h][state]. `WeatherChannel` existiert auch als gleichnamige lokale Klasse in manchen Sketchen; diese Tabellenzeile bezeichnet ausdrücklich den Typ der Library.

| Symbol / Datei | Zweck und typische Verwendung | Basen; Template-Parameter | Wichtige öffentliche Methoden | Abhängigkeiten und Beispiel | Niveau |
| --- | --- | --- | --- | --- | --- |
| `StateGenericChannel` / `ContactState.h` | Positionssensor mit Funkereignissen und optionaler Sabotagemeldung verbinden | `Channel`, `Alarm`; `Sensor`, `HALTYPE`, `List0Type`, `List1Type`, `List4Type`, `PEERCOUNT` | `setup`, `init`, `status`, `flags`, `trigger`, `msgSent`, `patchStatus` | Positionsadapter, Nachrichten, Peerlisten; E3/E5 über `TwoStateChannel` | F |
| `TwoStateChannel` / `ContactState.h` | Eingang mit zwei Zuständen konfigurieren | `StateGenericChannel<OnePinPosition<...>,...>`; `HALTYPE`, `List0Type`, `List1Type`, `List4Type`, `PEERCOUNT`, `WAITMILLIS_AFTER_ENABLE=0` | `init` mit Pin-/Enable-/Sabotagevarianten; Kanalmethoden geerbt | GPIO-Positionssensor; E3/E5 | E/F |
| `ThreeStateChannel` / `ContactState.h` | Zwei Pins auf drei Kontaktpositionen abbilden | `StateGenericChannel<TwoPinPosition,...>`; `HALTYPE`, `List0Type`, `List1Type`, `List4Type`, `PEERCOUNT` | `init` mit zwei Pins, optional Map/Sabotagepin | `TwoPinPosition`; möglicher Folgefall HM-SEC-RHS in der Library, noch kein E1–E9-Tutorial | F |
| `StateDevice` / `ContactState.h` | Kontaktkanäle um zyklische Statusmeldungen ergänzen | `MultiChannelDevice`; `HalType`, `ChannelType`, `ChannelCount`, `List0Type`, `CycleTime=DEFCYCLETIME` | `configChanged`, `restartCycleTimer`; Geräte-API geerbt | Interner `CycleInfoAlarm`, List0; E3/E5 | E/F |
| `SwitchStateMachine` / `Switch.h` | Ein-/Auszustände, Zeiten und Peeraktionen auswerten | `Alarm`; – | `setup`, `changed`, `switchState`, `jumpToTarget`, `set`, `status`, `stop` | `SwitchPeerList`, `sysclock`; `trigger` ist hier privat; E4/E7 über `SwitchChannel` | F |
| `SwitchChannel` / `Switch.h` | Schaltkanal mit GPIO-Ausgang bereitstellen | `ActorChannel<...,SwitchStateMachine>`; `HalType`, `PeerCount`, `List0Type`, `IODriver=ArduinoPins` | `init`, `flags`, `switchState`; `status/process` geerbt | `SwitchList1`, `SwitchList3`, Pin-Treiber; E4/E7 | E/F |
| `RemoteChannel` / `Remote.h` | Tasterkanal mit Funkereignissen verbinden | `Channel`, Template-Typ `ButtonType`; `HALTYPE`, `PEERCOUNT`, `List0Type=List0`, `List1Type=RemoteList1`, `ButtonType=Button` | `button`, `state`, `pressed`, `repeatCount`, `configChanged`, `status`, `flags` | `RemoteEventMsg`, Taster und Peers; E9 | E/F |
| `WeatherChannel` / `Weather.h` | Messung vor geplantem Wettersendezeitpunkt ansetzen | `Channel`, geschützt `RTCAlarm`; `HAL`, `CLOCKTYPE`, `SENSORSTYPE`, `PEERS_PER_CHANNEL`, `EXTRADELAY`, `LIST0`, `LIST1=List1`, `LIST4=List4` | `setup`, `trigger`, `reactivate`, `sensors`, `status`, `flags` | Sensorcontainer mit `before/temperature/humidity`, Clock, `WeatherEventMsg`; E6, ausdrücklich nicht E1s lokale gleichnamige Klasse | F |
| `StateMachine` / `StateMachine.h` | Gemeinsame Aktorlogik als Erweiterungsbasis | `Alarm`; `PeerList` | Keine zusätzliche öffentliche API; `Alarm::set/active` geerbt, eigene Hooks wie `switchState`, `setState`, `trigger` geschützt | Peerregister und `sysclock`; für spätere Dimmer-/Rollladenvertiefung, nicht die Basis von `SwitchStateMachine` | F |

## Aliase, Makros und zusätzliche Vertiefung

Nicht zusätzlich gezählt:

- `BatterySensor = BattSensor<SyncMeter<InternalVCC>>` in `BatterySensor.h`.
- `Button` und `DoublePressButton` sind `StateButton`-Aliase; `DoublePressAlarm` beziehungsweise `NoDoublePressAlarm` stellen die optionale Doppeldrucklogik. `ConfigToggleButton` ergänzt lokale Bedienung am Konfigurationstaster, etwa E7.
- `RTC` ist ein bedingter Alias von `RealTimeClock`; maßgebliche globale Objekte sind `sysclock` und `rtc`.
- `DefList0/1/4` sind `RegList`-Aliase mit ausgewählten Standardregistertypen. `DEFREGISTER` ist ein Makro, das Registerbeschreibungen erzeugt. Ältere `List0/1/4` sind davon zu unterscheiden.
- `SwitchList1`, `SwitchList3Tmpl`, `SwitchPeerList`, `SwitchList3` und `RemoteList1` konkretisieren die Register für die betreffenden Kanäle.
- `WeatherEventMsg` in `Weather.h` sowie lokale gleichnamige Sketchklassen erzeugen Wettertelegramme. Weitere Familien in `Message.h`: `ConfigMsg` und Konfigurationsuntertypen, `AckMsg`, `NackMsg`, `AckStatusMsg` und AES-Nachrichten.
- `RadioWatchdog<HAL,TIMEOUT=60>` in `AskSinPP.h` überwacht die Funkaktivität über einen Alarm; `NoRadio` und alternative Chiptreiber ergänzen das Baukastensystem.
- `Led`, `LedStates`, `ArduinoPins`, `KeyStore`, `BlindChannel` und die Dimmer-Typen sind Anknüpfungspunkte für spätere Vertiefungen; deren vollständige API wird in dieser Phase nicht inventarisiert. Vor Ausarbeitung muss insbesondere die genaue Template-Zusammensetzung dieser Aktoren erneut gelesen werden.

## Konsequenzen für den Lernweg

Zuerst die Verwendung von HAL, Gerät und einem Kanal erklären, anschließend Alarme und Nachrichten. Register- und Speicherinternas folgen erst, wenn der Leser eigene Konfiguration benötigt. IRQ-Messung, gemischte Kanaltypen, alternative Plattformen und Aktorzustandsmaschinen sind Fortgeschrittenenthemen. Offene Punkte und noch fehlende direkte Lernfälle stehen in [Offene Fragen](./Offene-Fragen.md) und [Kapitelplan](./Kapitelplan.md).

[hal]: https://github.com/pa-pa/AskSinPP/blob/main/AskSinPP.h
[device]: https://github.com/pa-pa/AskSinPP/blob/main/Device.h
[multi]: https://github.com/pa-pa/AskSinPP/blob/main/MultiChannelDevice.h
[channel]: https://github.com/pa-pa/AskSinPP/blob/main/Channel.h
[alarm]: https://github.com/pa-pa/AskSinPP/blob/main/Alarm.h
[clock]: https://github.com/pa-pa/AskSinPP/blob/main/AlarmClock.h
[clockcpp]: https://github.com/pa-pa/AskSinPP/blob/main/AlarmClock.cpp
[activity]: https://github.com/pa-pa/AskSinPP/blob/main/Activity.h
[battery]: https://github.com/pa-pa/AskSinPP/blob/main/BatterySensor.h
[globals]: https://github.com/pa-pa/AskSinPP/blob/main/Globals.cpp
[lists]: https://github.com/pa-pa/AskSinPP/blob/main/ChannelList.h
[register]: https://github.com/pa-pa/AskSinPP/blob/main/Register.h
[storage]: https://github.com/pa-pa/AskSinPP/blob/main/Storage.h
[radio]: https://github.com/pa-pa/AskSinPP/blob/main/Radio.h
[cc1101]: https://github.com/pa-pa/AskSinPP/blob/main/Radio-CC1101.h
[message]: https://github.com/pa-pa/AskSinPP/blob/main/Message.h
[hmid]: https://github.com/pa-pa/AskSinPP/blob/main/HMID.h
[peer]: https://github.com/pa-pa/AskSinPP/blob/main/Peer.h
[button]: https://github.com/pa-pa/AskSinPP/blob/main/Button.h
[led]: https://github.com/pa-pa/AskSinPP/blob/main/Led.h
[sensors]: https://github.com/pa-pa/AskSinPP/blob/main/Sensors.h
[bme]: https://github.com/pa-pa/AskSinPP/blob/main/sensors/Bme280.h
[dht]: https://github.com/pa-pa/AskSinPP/blob/main/sensors/Dht.h
[contact]: https://github.com/pa-pa/AskSinPP/blob/main/ContactState.h
[switch]: https://github.com/pa-pa/AskSinPP/blob/main/Switch.h
[remote]: https://github.com/pa-pa/AskSinPP/blob/main/Remote.h
[weather]: https://github.com/pa-pa/AskSinPP/blob/main/Weather.h
[state]: https://github.com/pa-pa/AskSinPP/blob/main/StateMachine.h
