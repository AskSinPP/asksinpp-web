# FTDI Flash-Probleme

```text
avrdude: stk500_recv(): programmer is not responding
avrdude: stk500_getsync() attempt 1 of 10: not in sync: resp=0x00
avrdude: stk500_recv(): programmer is not responding
avrdude: stk500_getsync() attempt 2 of 10: not in sync: resp=0x00
avrdude: stk500_recv(): programmer is not responding
...
avrdude: stk500_set_extended_parms(): protocol error, expect=0x14, resp=0x10
avrdude: stk500_initialize(): failed
avrdude: initialization failed, rc=-1
```

Es kommt ab und an zu Problemen bei Upload/Flashen der Sketches über die UART-Schnittstelle (FTDI). Dies kann verschiedenste Ursachen haben:

* Der FTDI ist falsch angeschlossen.  
  `TX` (Senden) am AVR muss an `RX` (Empfangen) am FTDI angeschlossen sein und umgekehrt.
* Auf dem AVR muss ein entsprechender Bootloader (über [ISP](../04-isp.html)) geflasht sein um später per UART den eigentlichen Sketch flashen zu können. Ein Arduino Pro-Mini wird überlichweise mit einem Bootloader ausgeliefert. 
* Der FTDI kann keinen RESET des AVR durchführen.
  `RESET` Pin falsch angeschlossen oder es fehlt ein 100nF Kondensator in der Leitung. Ein Arduino Pro-Mini hat diesen on-board.
* Der interne Takt des AVR ist zu ungenau, flashen per ISP geht.  
  Dieses Problem tritt vor allem auf, wenn kein externer 8Mhz Oszillator verbaut ist (der Pro-Mini hat einen on-board).   
  Siehe [Baud-Error-Rates](https://cache.amobbs.com/bbs_upload782111/files_22/ourdev_508497.html)
    * Als Lösung kann der Sketch per ISP geflasht werden, denn der SPI-Bus bringt ein eigenes Taktsignal mit. Sofern man nicht per FTDI flashen möchte ist kein Bootloader nötig.
    * Es kann ein Bootloader versucht werden, der andere Baudraten zum flashen erlaubt, z.B. eine Version des [optiboot](https://github.com/svn2github/transistortester/blob/master/bootloaders/optiboot/optiboot_m328p_autoBaud_noLED.hex) mit _AutoBaud_. Beim Upload versucht man dann statt den üblichen 57600 Baud geringere Geschwindigkeiten wie 38400, 28800 oder noch weniger. Es empfiehlt sich im Sketch dann auch die niedrigere Baudrate für die serielle Konsole einzustellen z.B.:
     ```cpp
     // Init der seriellen Konsole mit 38400 Baud
     DINIT(38400, ASKSIN_PLUS_PLUS_IDENTIFIER);`)
     ```
* Mit dem ISP wurden die Fuses des AVR so geändert, dass er einen externen Takt erwartet, aber kein Quarz oder Resonator angeschlossen ist. 
  Dadurch kann der Bootloader nicht ausgeführt werden. Es muss zum Ändern der Fuses per ISP ein externer Takt angelegt werden. Der Diamex ISP unterstützt diese Funktion.
