# HomeBrew Types

Liste und _reservierte_ Bereiche von Device-Model IDs die durch AddOns bereitgestellt werden.  
Jeder Entwickler sollte seinen eigenen Bereich wählen damit Kollisionen vermieden werden.


## Bereichsübersicht

| Entwickler | Bereich
|------------|----------
| [Jerome](https://github.com/jp112sdl/) | `E901-E902`, `F1D0-F1D1`, `F300-F3FF`, `F9D2-F9D7`
| [pa-pa](https://github.com/pa-pa/) | `F201-F207`, `F299`
| [stan23](https://github.com/stan23/) | `F501`
| [Tom Major](https://github.com/TomMajor/) | `F103-F13F`
| [Dirk (FHEM 2014)](https://github.com/kc-GitHub/Wettersensor) | `F101-F102`
| [Manawyrm](https://github.com/manawyrm) | `FA01-FA0F`
| [ssbingo](https://github.com/ssbingo) | `FAB0-FABF`
| [BoruCz](https://github.com/BoruCz) | `F1D2`
| [SteMaker](https://github.com/SteMaker) | `FA00`
| [HMSteve](https://github.com/HMSteve) | `F800-F83F`


## Jerome

 Bild | ID | Name | Device-Model | Datei 
------|----|------|----------|-------
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-press_thumb.png" width=25/> | [HB-UNI-Sen-PRESS](https://github.com/jp112sdl/HB-UNI-Sen-PRESS) | Drucksensor | `0xE901` | [hb-uni-sen-press](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-press.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-press_thumb.png" width=25/> | [HB-UNI-Sen-PRESS-SC](https://github.com/jp112sdl/HB-UNI-Sen-PRESS) | Drucksensor | `0xE902` | [hb-uni-sen-press-sc](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-press-sc.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-wea_thumb.png" width=25/> | [HB-UNI-Sen-WEA](https://github.com/jp112sdl/HB-UNI-Sen-WEA) | Wetterstation | `0xF1D0` | [hb-uni-sen-wea](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-wea.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-iaq_thumb.png" width=25/> | [HB-UNI-Sen-IAQ](https://github.com/jp112sdl/HB-UNI-Sen-IAQ) | universeller Luftgütesensor _(temporarily discontinued)_ [(see HM-Forum)](https://homematic-forum.de/forum/viewtopic.php?f=76&t=49422)| `0xF1D1` | [hb-uni-sen-iaq](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-iaq.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-ibut-8_thumb.png" width=25/> | [HB-IBUT-8](https://github.com/pa-pa/AskSinPP/tree/master/examples/custom/HB-IBUT-8) | iButton Sender Taster/Schließer | `0xF206` | [hb-ibut-8](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-ibut-8.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-cap-moist_thumb.png" width=25/> | [HB-UNI-Sen-CAP-MOIST](https://github.com/jp112sdl/HB-UNI-Sen-CAP-MOIST) | kapazitiver Bodenfeuchtesensor<br/>_optional mit DS18B20 Temperatursensor_ | `0xF311` | [hb-uni-sen-cap-moist](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-cap-moist.xml)
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-cap-moist_thumb.png" width=25/> | [HB-UNI-Sen-CAP-MOIST-T](https://github.com/jp112sdl/HB-UNI-Sen-CAP-MOIST) | kapazitiver Bodenfeuchtesensor<br/>_optional mit DS18B20 Temperatursensor_ | `0xF312` | [hb-uni-sen-cap-moist-t](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-cap-moist-t.xml)
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-temp-ds18b20_thumb.png" width=25/> | [HB-UNI-Sen-TEMP-DS18B20](https://github.com/jp112sdl/HB-UNI-Sen-TEMP-DS18B20) | 1..8fach DS18B20 Temperatursensor | `0xF301` | [hb-uni-sen-temp](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-temp.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-temp-ir_thumb.png" width=25/> | [HB-UNI-Sen-TEMP-IR](https://github.com/jp112sdl/HB-UNI-Sen-TEMP-IR) | MLX90614 Infrarot Temperatursensor | `0xF308` | [hb-uni-sen-temp-ir](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-temp-ir.xml) |
| | HB-LC-SW12-FM | | `0xF320` | [hb-lc-sw12-fm](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-lc-sw12-fm.xml)
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-rc-2-pbu-led_thumb.png" width=25/> | [HB-RC-2-PBU-LED](https://github.com/jp112sdl/HB-RC-2-PBU-LED) | 2 Kanal Taster mit RGB-Hintergrundbeleuchtung | `0xF330` | [hb-rc-2-pbu-led](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-rc-2-pbu-led.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-senact-4-4_thumb.png" width=25/> | [HB-UNI-SenAct-4-4-SC](https://github.com/jp112sdl/HB-UNI-SenAct-4-4) | 4fach - Sender & - Aktor | `0xF331` | [hb-uni-senact-4-4-sc](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-senact-4-4-sc.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-senact-4-4_thumb.png" width=25/> | [HB-UNI-SenAct-4-4-RC](https://github.com/jp112sdl/HB-UNI-SenAct-4-4) | 4fach - Sender & - Aktor | `0xF332` | [hb-uni-senact-4-4-rc](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-senact-4-4-rc.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-senact-4-4_thumb.png" width=25/> | [HB-UNI-SenAct-4-4-SC-BAT](https://github.com/jp112sdl/HB-UNI-SenAct-4-4) | 4fach - Sender & - Aktor | `0xF333` | [hb-uni-senact-4-4-sc-bat](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-senact-4-4-sc-bat.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-senact-4-4_thumb.png" width=25/> | [HB-UNI-SenAct-4-4-RC-BAT](https://github.com/jp112sdl/HB-UNI-SenAct-4-4) | 4fach - Sender & - Aktor | `0xF334` | [hb-uni-senact-4-4-rc-bat](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-senact-4-4-rc-bat.xml) |
|<img src="https://raw.githubusercontent.com/eq-3/occu/master/WebUI/www/config/img/devices/50/PushButton-2ch-wm_thumb.png" width=25/> | [HB-LC-Sw1PBU-FM](https://github.com/jp112sdl/Beispiel_AskSinPP/tree/master/examples/HB-LC-Sw1PBU-FM) | alternative Firmware für den<br/>HM-LC-Sw1PBU-FM (getrennte Taster-/Relais-Kanäle) | `0xF335` | [hb-lc-sw1pbu-fm](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-lc-sw1pbu-fm.xml) |
|<img src="https://raw.githubusercontent.com/eq-3/occu/master/WebUI/www/config/img/devices/50/PushButton-2ch-wm_thumb.png" width=25/> | [HB-LC-Sw2PBU-FM](https://github.com/jp112sdl/Beispiel_AskSinPP/tree/master/examples/HB-LC-Sw2PBU-FM) | alternative Firmware für den<br/>HM-LC-Sw2PBU-FM (getrennte Taster-/Relais-Kanäle) | `0xF336` | [hb-lc-sw2pbu-fm](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-lc-sw2pbu-fm.xml) |
|<img src="https://raw.githubusercontent.com/eq-3/occu/master/WebUI/www/config/img/devices/50/PushButton-2ch-wm_thumb.png" width=25/> | [HB-LC-Bl1PBU-FM](https://github.com/jp112sdl/Beispiel_AskSinPP/tree/master/examples/HB-LC-Bl1PBU-FM) | alternative Firmware für den<br/>HM-LC-Bl1PBU-FM (getrennte Taster-/Relais-Kanäle) |  `0xF337` | [hb-lc-bl1pbu-fm](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-lc-bl1pbu-fm.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-senact-8-8_thumb.png" width=25/> | [HB-UNI-SenAct-8-8-RC](https://github.com/jp112sdl/HB-UNI-SenAct-8-8) | 8fach - Sender & - Aktor | `0xF338` | [hb-uni-senact-8-8-rc](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-senact-8-8-rc.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-senact-8-8_thumb.png" width=25/> | [HB-UNI-SenAct-8-8-RC-BAT](https://github.com/jp112sdl/HB-UNI-SenAct-8-8) | 8fach - Sender & - Aktor | `0xF339` | [hb-uni-senact-8-8-rc-bat](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-senact-8-8-rc-bat.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-senact-8-8_thumb.png" width=25/> | [HB-UNI-SenAct-8-8-SC](https://github.com/jp112sdl/HB-UNI-SenAct-8-8) | 8fach - Sender & - Aktor | `0xF33A` | [hb-uni-senact-8-8-sc](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-senact-8-8-sc.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-senact-8-8_thumb.png" width=25/> | [HB-UNI-SenAct-8-8-SC-BAT](https://github.com/jp112sdl/HB-UNI-SenAct-8-8) | 8fach - Sender & - Aktor | `0xF33B` | [hb-uni-senact-8-8-sc-bat](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-senact-8-8-sc-bat.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-rfid-rc_thumb.png" width=25/> | [HB-UNI-Sen-RFID-RC](https://github.com/jp112sdl/HB-UNI-Sen-RFID-RC) | RFID-Reader als Sender (Tasterschnittstelle) | `0xF33C` | [hb-uni-sen-rfid-rc](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-rfid-rc.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-rgb-led-ctrl_thumb.png" width=25/> | [HB-UNI-RGB-LED-CTRL](https://github.com/jp112sdl/HB-UNI-RGB-LED-CTRL) | RGB Controller für WS28xx / Neopixel / etc. | `0xF341` | [hb-uni-rgb-led-ctrl](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-rgb-led-ctrl.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-dmx-master_thumb.png" width=25/> | [HB-UNI-DMX-Master](https://github.com/jp112sdl/HB-UNI-DMX-Master) | (sehr) einfacher DMX Master Controller | `0xF342` | [hb-uni-dmx-master_le_v10](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-dmx-master_le_v10.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-dis-ep-42bw_thumb.png" width=25/> | [HB-Dis-EP-42BW](https://github.com/jp112sdl/HB-Dis-EP-42BW) | 4.2" ePaper Display | `0xF343` | [hb-dis-ep-42bw_e_v1_0](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-dis-ep-42bw_e_v1_0.xml) [hb-dis-ep-42bw_e_v1_1](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-dis-ep-42bw_e_v1_1.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-ou-mp3-led_thumb.png" width=25/> | [HB-OU-MP3-LED](https://github.com/jp112sdl/HB-OU-MP3-LED) | MP3-Player mit LED | `0xF344` | [hb-ou-mp3-led](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-ou-mp3-led.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-rc-12-ep-bw_thumb.png" width=25/> | [HB-RC-12-EP-29C](https://github.com/jp112sdl/HB-RC-12-EP) | 12 Kanal Fernbedienung mit Farb- oder Schwarz/Weiß-ePaper-Display | `0xF345` | [hb-rc-12-ep-c](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-rc-12-ep-c.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-rc-12-ep-bw_thumb.png" width=25/> | [HB-RC-12-EP-29BW](https://github.com/jp112sdl/HB-RC-12-EP) | 12 Kanal Fernbedienung mit Farb- oder Schwarz/Weiß-ePaper-Display | `0xF346` | [hb-rc-12-ep-bw](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-rc-12-ep-bw.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-dis-ep-75bw_thumb.png" width=25/> | [HB-Dis-EP-75BW](https://github.com/jp112sdl/HB-Dis-EP-75BW) | 7.5" ePaper Display | `0xF347` | [hb-dis-ep-75bw_e_1_0](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-dis-ep-75bw_e_1_0.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-ou-mot-servo_thumb.png" width=25/> | [HB-OU-MOT-SERVO](https://github.com/jp112sdl/HB-OU-MOT-SERVO) | Servo-Motor Steuerung | `0xF348` | [hb-ou-mot-servo](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-ou-mot-servo.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-volt_thumb.png" width=25/> | [HB-UNI-Sen-VOLT](https://github.com/jp112sdl/HB-UNI-Sen-VOLT) | universeller Spannungssensor (Template) | `0xF34A` | [hb-uni-sen-volt](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-volt.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-weight_thumb.png" width=25/> | [HB-UNI-Sen-WEIGHT](https://github.com/jp112sdl/HB-UNI-Sen-WEIGHT) | universeller Wägesensor | `0xF34B` | [hb-uni-sen-weight](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-weight.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-weight-sc_thumb.png" width=25/> | [HB-UNI-Sen-WEIGHT-SC](https://github.com/jp112sdl/HB-UNI-Sen-WEIGHT-SC) | universeller Wägesensor mit Schließerkontakt | `0xF34C` | [hb-uni-sen-weight-sc](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-weight-sc.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-dis-ep-42bw_thumb.png" width=25/> | [HB-Dis-EP-42BW-MAINS](https://github.com/jp112sdl/HB-Dis-EP-42BW) | 4.2" ePaper Display | `0xF353` | [hb-dis-ep-42bw_e_v1_1_mains](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-dis-ep-42bw_e_v1_1_mains.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-dis-ep-75bw_thumb.png" width=25/> | [HB-Dis-EP-75BW-MAINS](https://github.com/jp112sdl/HB-Dis-EP-75BW) | 7.5" ePaper Display | `0xF357` | [hb-dis-ep-75bw_mains_e_1_0](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-dis-ep-75bw_mains_e_1_0.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-dummy-beacon_thumb.png" width=25/> | [HB-UNI-Sen-DUMMY-BEACON](https://github.com/jp112sdl/HB-UNI-Sen-DUMMY-BEACON) | Dummy-Device zum Simulieren<br/>zyklischer Statusmeldungen sowie Ack-Nachrichten | `0xF3FF` | [hb-uni-sen-dummy-beacon](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-dummy-beacon.xml) |
|<img src="https://raw.githubusercontent.com/eq-3/occu/master/WebUI/www/config/img/devices/50/5_hm-lc-sw2-fm_thumb.png" width=25/> | [HB-LC-Sw2-FM](https://github.com/stan23/HB-LC-Sw2-FM) | alternative Firmware für den<br/>HB-LC-Sw2-FM (getrennte Taster-/Relais-Kanäle) special thx to [stan23](https://github.com/stan23)! | `0xF501` | [hb-lc-sw2-fm](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-lc-sw2-fm.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-lev-us_thumb.png" width=25/> | [HB-UNI-Sen-LEV-US](https://github.com/jp112sdl/HB-UNI-Sen-LEV-US) | Ultraschall Füllstandsensor | `0xF9D2` | [hb-uni-sen-lev-us](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-lev-us.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-lev-tof_thumb.png" width=25/> | [HB-UNI-Sen-LEV-TOF](https://github.com/jp112sdl/HB-UNI-Sen-LEV-TOF) | Time-of-Flight Füllstandsensor | `0xF9D3` | [hb-uni-sen-lev-tof](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-lev-tof.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-dist-tof_thumb.png" width=25/> | [HB-UNI-Sen-DIST-TOF](https://github.com/jp112sdl/HB-UNI-Sen-DIST-TOF) | Time-of-Flight Abstandsensor | `0xF9D7` | [hb-uni-sen-dist-tof](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-dist-tof.xml) |
|<img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-uni-sen-dist-us_thumb.png" width=25/> | [HB-UNI-Sen-DIST-US](https://github.com/jp112sdl/HB-UNI-Sen-DIST-US) | Ultraschall Abstandsensor | `0xF9D6` | [hb-uni-sen-dist-us](https://github.com/jp112sdl/JP-HB-Devices-addon/blob/master/src/addon/firmware/rftypes/hb-uni-sen-dist-us.xml) |


## pa-pa

| ID | Name | Device-Model |
|----|------|----------|
| [HM_LC_SW2_FM](https://github.com/pa-pa/AskSinPP/tree/master/examples/custom/HM-LC-SW2-FM) | Funk-Schaltaktor 2-fach | `0xF201` 
| [HB-SW2-SENS](https://github.com/pa-pa/AskSinPP/tree/master/examples/custom/HB-SW2-SENS) | ?? | `0xF202`
| [HB-DoorBell](https://github.com/pa-pa/AskSinPP/tree/master/examples/stm32/HB-DoorBell) | Türklingel | `0xF203`
| [HB GEN SENS](https://github.com/pa-pa/AskSinPP/tree/master/examples/custom/HB-GEN-SENS) | generischer Sensor | `0xF205`
| [HB-IBUT8](https://github.com/pa-pa/AskSinPP/tree/master/examples/custom/HB-IBUT-8) | iButton Reader | `0xF206`
| [HB-LC-BL1-FM-2](https://github.com/pa-pa/AskSinPP) | Jalousieaktor, extra 2 Kanal Blind - da FHEM die dynamische Kanalanzahl nicht kann | `0xF207`
| [HB-LC-Dim1TPBU-FM](https://github.com/pa-pa/AskSinPP/tree/master/examples/custom/HB-LC-Dim1TPBU-FM) | Dimmer mit extra Features | `0xF299`


## stan23

 Bild | ID | Name | Device-Model | Datei 
------|----|------|----------|-------


## Tom Major

| Bild | ID | Name | Device-Model | Datei |
|------|----|------|----------|-------|
|<img src="https://raw.githubusercontent.com/TomMajor/SmartHome/master/HB-TM-Devices-AddOn/CCU_RM/src/addon/www/config/img/devices/50/hb-uni-sensor1_thumb.png" width=25/> | [HB-UNI-Sensor1](https://github.com/TomMajor/SmartHome/tree/master/HB-UNI-Sensor1) | Universalsensor Temperatur/Druck/Feuchte/Lux/UV/Dig.Eingang | `0xF103` | [HB-TM-Devices-AddOn](https://github.com/TomMajor/SmartHome/tree/master/HB-TM-Devices-AddOn) |
|<img src="https://raw.githubusercontent.com/TomMajor/SmartHome/master/HB-TM-Devices-AddOn/CCU_RM/src/addon/www/config/img/devices/50/hb-uni-sensor-heizung_thumb.png" width=25/> | [HB-UNI-Sensor-Heizung](https://github.com/TomMajor/SmartHome/tree/master/HB-UNI-Sensor-Heizung) | HomeMatic Sensor/Schwellwertschalter (HB-UNI-Sensor1 Variante) | `0xF105` | [HB-TM-Devices-AddOn](https://github.com/TomMajor/SmartHome/tree/master/HB-TM-Devices-AddOn) |
|<img src="https://raw.githubusercontent.com/TomMajor/SmartHome/master/HB-TM-Devices-AddOn/CCU_RM/src/addon/www/config/img/devices/50/hb-sen-ljet_thumb.png" width=25/> | [HB-SEN-LJet](https://github.com/TomMajor/SmartHome/tree/master/HB-SEN-LJet) | Kopplung der Projet LevelJET Ultraschall-Füllstandsanzeige mit HomeMatic | `0xF104` | [HB-TM-Devices-AddOn](https://github.com/TomMajor/SmartHome/tree/master/HB-TM-Devices-AddOn) |
|<img src="https://raw.githubusercontent.com/TomMajor/SmartHome/master/HB-TM-Devices-AddOn/CCU_RM/src/addon/www/config/img/devices/50/hb-uni-sensor2_thumb.png" width=25/> | [HB-UNI-Sensor2](https://github.com/TomMajor/SmartHome/tree/master/HB-UNI-Sensor1) | HB-UNI-Sensor1 Variante mit benutzerspezifische Sensordaten | `0xF112` | [HB-TM-Devices-AddOn](https://github.com/TomMajor/SmartHome/tree/master/HB-TM-Devices-AddOn) |
|<img src="https://raw.githubusercontent.com/TomMajor/SmartHome/master/HB-TM-Devices-AddOn/CCU_RM/src/addon/www/config/img/devices/50/hb-uni-sensor3_thumb.png" width=25/> | [HB-UNI-Sensor3](https://github.com/TomMajor/SmartHome/tree/master/HB-UNI-Sensor1) | HB-UNI-Sensor1 Variante mit benutzerspezifische Sensordaten | `0xF113` | [HB-TM-Devices-AddOn](https://github.com/TomMajor/SmartHome/tree/master/HB-TM-Devices-AddOn) |
|<img src="https://raw.githubusercontent.com/TomMajor/SmartHome/master/HB-TM-Devices-AddOn/CCU_RM/src/addon/www/config/img/devices/50/hb-uni-sensor4_thumb.png" width=25/> | [HB-UNI-Sensor4](https://github.com/TomMajor/SmartHome/tree/master/HB-UNI-Sensor1) | HB-UNI-Sensor1 Variante mit benutzerspezifische Sensordaten | `0xF114` | [HB-TM-Devices-AddOn](https://github.com/TomMajor/SmartHome/tree/master/HB-TM-Devices-AddOn) |
|<img src="https://raw.githubusercontent.com/TomMajor/SmartHome/master/HB-TM-Devices-AddOn/CCU_RM/src/addon/www/config/img/devices/50/hb-uni-sensor5_thumb.png" width=25/> | [HB-UNI-Sensor5](https://github.com/TomMajor/SmartHome/tree/master/HB-UNI-Sensor1) | HB-UNI-Sensor1 Variante mit benutzerspezifische Sensordaten | `0xF115` | [HB-TM-Devices-AddOn](https://github.com/TomMajor/SmartHome/tree/master/HB-TM-Devices-AddOn) |
|<img src="https://raw.githubusercontent.com/TomMajor/SmartHome/master/HB-TM-Devices-AddOn/CCU_RM/src/addon/www/config/img/devices/50/hb-uni-sensor6_thumb.png" width=25/> | [HB-UNI-Sensor6](https://github.com/TomMajor/SmartHome/tree/master/HB-UNI-Sensor1) | HB-UNI-Sensor1 Variante mit benutzerspezifische Sensordaten | `0xF116` | [HB-TM-Devices-AddOn](https://github.com/TomMajor/SmartHome/tree/master/HB-TM-Devices-AddOn) |


## Dirk (FHEM 2014)

 ID | Name | Device-Model 
----|------|----------
HB-UW-Sen-THPL-I | FHEM Wettersensor Innen (2014) | `0xF101`
HB-UW-Sen-THPL-O | FHEM Wettersensor Außen (2014) | `0xF102`

## Manawyrm

 ID | Name | Device-Model 
----|------|----------
[HB-Sen-Env-I](https://github.com/Manawyrm/HB-Sen-Env-I-Firmware) | Umgebungssensor (Temp, Humid, Pressure) Innen | `0xFA01`

## ssbingo
| Bild | ID | Name | Device-Model | Datei |
|------|----|------|----------|-------|
|<img src="https://raw.githubusercontent.com/ssbingo/HB-UNI-Sen-Lev-Vo/master/AddOn/usr/local/addon/www/config/img/devices/50/hb-uni-sen-lev-vo_thumb.png" width=25/> | [HB-UNI-Sen-Lev-Vo](https://github.com/ssbingo/HB-UNI-Sen-Lev-Vo) | Füllstandsensor für Tankanzeigen mit Votronic-Sonden | `0xFAB4` | [HB-UNI-Sen-Lev-Vo](https://github.com/ssbingo/HB-UNI-Sen-Lev-Vo/blob/master/AddOn/usr/local/addon/firmware/rftypes/hb-uni-sen-lev-vo.xml) |
|<img src="https://raw.githubusercontent.com/ssbingo/HB-OU-RGB-STACKFIRE/master/AddOn/usr/local/addons/jp-hb-devices-addon/www/config/img/devices/50/hb-ou-rgb-campfire_thumb.png" width=25/> | [HB-OU-RGB-STACKFIRE](https://github.com/ssbingo/HB-OU-RGB-STACKFIRE) | LED Leuchte (10/20 x 30 WS2812B) | `0xFAB5` | [HB-OU-RGB-STACKFIRE](https://github.com/ssbingo/HB-OU-RGB-STACKFIRE/blob/master/AddOn/usr/local/addons/jp-hb-devices-addon/firmware/rftypes/hb-ou-rgb-campfire.xml) |


## BoruCz
 ID | Name | Device-Model 
----|------|----------
HB-UNI-Sen-WIND | [Homematic wind sensor based on Ventus W132 ](https://github.com/BoruCz/HB-UNI-Sen-WIND) | `0xF1D2`

## SteMaker
| Bild | ID | Name | Device-Model 
|------|----|------|----------
| <img src="https://raw.githubusercontent.com/jp112sdl/JP-HB-Devices-addon/master/src/addon/www/config/img/devices/50/hb-lc-bl2-rd_thumb.png"> |HB-LC-Bl2-RD | Gerät mit zwei Rolladenaktoren und einem Regensensor  | `0xFA00`


## HMSteve
 ID | Name | Device-Model 
----|------|----------
HB-UNI-Sen-Sky | [Sky Sensor (Helligkeit, UV-Index, Himmelstemperatur) ](https://github.com/HMSteve/HB-UNI-Sen-Sky) | `0xF820`
HB-UNI-Sen-TH  | [Universalsensor (Temperatur, Luftfeuchte) ](https://github.com/HMSteve/HB-UNI-Sen-TH) | `0xF800`
HB-UNI-Sen-RainCounter | [Regenmesser-Umbau ](https://github.com/HMSteve/HB-UNI-Sen-RainCounter) | `0xF821`
