# Weiteres


## FreqTest

Für den STM32 gibt es einen angepassten [FreqTest.ino](https://github.com/pa-pa/AskSinPP/blob/master/examples/stm32/FreqTest/FreqTest.ino) Sketch zum ermitteln der optimalen
Frequenz für das CC1101 Funkmodul. Der Wert kann allerdings (noch) nicht auf dem EEPROM gespeichert
werden weshalb man ihn hardcoded im Sketch hinterlegen muss.

_Beispiel Upload über PlatformIO und FTDI oder USB-Bootloader:_

```text
$ cd AskSinPP/examples/stm32/FreqTest
$ pio run -t upload -e dfu
...

$ pio device monitor

--- Miniterm on /dev/ttyACM0  57600,8,N,1 ---
--- Quit: Ctrl+C | Menu: Ctrl+T | Help: Ctrl+T followed by Ctrl+H ---
AskSin++ V4.1.1 (Nov  9 2019 16:37:02)
CC init1
...
Done: 0x21657A - 0x21664A
Calculated Freq: 0x2165E2
 868.347 MHz
```

Im Sketch kann nun die Frequenz hardcodiert hinterlegt werden:
```cpp
void setup () {
  // init stuff ...
  sdev.initDone();

  // CC1101 Frequency after sdev.init
  hal.radio.initReg(CC1101_FREQ2, 0x21);
  hal.radio.initReg(CC1101_FREQ1, 0x65);
  hal.radio.initReg(CC1101_FREQ0, 0xE2);
}
``` 

## HW-Serial

Einige Mikrocontroller wie der STM32 oder auch AVR644/1286 besitzen eine UUID,
also eine unverwechselbare 128-Bit-Zahl. AskSin++ kann diese UUID nutzen um 
wiederum eine eindeutige Device-ID sowie Serial zu berechnen. Dies
macht die Anpassung im DeviceInfo-Block des Sketch überflüssig:

```cpp
// Derive ID and Serial from the device UUID
#define USE_HW_SERIAL

const struct DeviceInfo PROGMEM devinfo = {
    // ID and Serial is derived from STM32-UUID (see #define USE_HW_SERIAL)
    {0x00,0x00,0x00},       // Device ID
    "0000000000",           // Device Serial
    {0x01,0x09},            // Device Model: HM-DW-WM 2-channel LED dimmer
    0x2C,                   // Firmware Version
    as::DeviceType::Dimmer, // Device Type
    {0x01,0x00}             // Info Bytes
};
```
