---
isProject: true
Desc: 1-Kanal PWM LED Dimmer für 7-24V mit Tastereingängen
ProjectUrl: psi/HM-LC-Dim1PWM/
Author: Psi
AuthorUrl: https://psi.cx
Tags: LED, Aktor, Taster, Dimmer
Thumb: images/thumb.jpg
sidebar: auto
Added: 2019-02-15
---

# HM-LC-Dim1PWM

1-Kanal PWM LED Dimmer für 7-24V mit Eingängen für zwei externe Taster.

![HM-LC-Dim1PWM](./images/Dim1PWM.jpg)

::: warning
Es hat sich gezeigt, dass die zwei Tasterschnittstellen nicht vernünftig von der CCU verarbeitet werden. Ich empfehle diese **nicht** zu verwenden.
:::

::: warning
Der Fade-Effekt ist wegen der 8-Bit Auflösung des 328p nicht ganz _smooth_, eine gute Alternative bietet 
der Dimmer auf [HM-LC-DW-WM](/Projekte/der-pw/HM-LC-DW-WM/) auf Basis des STM32.
:::

## Schaltplan

![Dim1PWM Schaltplan](./images/HM-LC-Dim1PWM.svg)

Zur Sicherheit kann noch ein Gate-Widerstand von ca 100Ω eingefügt werden.


## Hardware

### Bauteile

![Bauteile](./images/Dim1PWM_parts.jpg)

* Arduino Pro Mini ATmega328P (3.3V/8MHz)
* CC1101 Funkmodul (868 MHz)
* Festspannungsregler L78L05ACZ
* Taster 6x6
* Led 5mm
* Widerstände 1/4W 100Ω, 300Ω, 4,7kΩ
* MOSFET [IRLZ44N](http://www.irf.com/product-info/datasheets/data/irlz44n.pdf) (oder ggf. besser [IRF3708](http://www.irf.com/product-info/datasheets/data/irf3708.pdf), siehe [Forum-Beitrag](https://homematic-forum.de/forum/viewtopic.php?f=19&t=46999#p472462))
* AKL 057-03 Anschlussklemme, 3-pol, alternativ 1x WAGO 250-503 (Federklemmen sind zu bevorzugen)
* 2x AKL 057-02 Anschlussklemme, 2-pol, alternativ 1x WAGO 250-504

### Platine

Der Dim1PWM lässt sich ganz gut auf einer Streifenraster-Platine aufbaun.  
Eleganter geht is mit der Platine von Ronny.

![Dim1PWM-PCB top](./images/Dim1PWM_PCB-top.jpg)

Wer Bedarf an einer Platine hat kann [Ronny über Facebook kontaktieren](https://www.facebook.com/ronny.thomas.83)


### Aufbau

Mit einer dritten Hand und einer selbstklemmenden Pinzette ist der Dim1PWM im Handumrehene verlötet.  
Man fängt mit den niedrigen Bauteilen an. Die Widerstände werden unter dem Arduino platziert. Die Anode der Status-LED ist durch
den geraden Strich symbolisiert und zeigt Richtung _Gnd_.  

![Dim1PWM teilweise bestückt](./images/Dim1PWM_PCB_partly-assembled.jpg)

Ursprünglich wurden zwei Kondensatoren zur Entstörung und Glättung der Spannung vorgesehen. Diese blieben bislang
unbestückt da sich keine Probleme ergaben. Optional kann man noch einen Klemmblock für zwei die zwei Tastereingänge verlöten.

![Dim1PWM_fertig](./images/Dim1PWM_finish-1.jpg)

Die Version 1.4 der Platine hat noch einen Fehler. Die Leiterbahn, markiert durch den roten Kreis, muss unterbrochen werden und GND muss über zwei Drahtbrücken verbunden werden.

![Dim1PWM Reparatur v1.4 ](./images/Dim1PWM_1.4-repair.jpg)

### Gehäuse

// TBD


## Software

Als Sketch kommt [HM-LC-Dim1PWM_btns.ino](https://github.com/AskSinPP/asksinpp-web/blob/master/Projekte/psi/HM-LC-Dim1PWM/HM-LC-Dim1PWM_btns.ino) zum Einsatz. 

::: warning
Stand 16.12.2018: Es musst zwingend der [Master-Branch](https://github.com/pa-pa/AskSinPP/archive/master.zip)
von AskSinPP verwendet werden da in V3 der
[Fehler in der pwmtable](https://github.com/pa-pa/AskSinPP/issues/80) noch nicht behoben ist was dazu führt,
dass die LEDs auch bei 0% noch sichtbar glimmen.
:::

PS: Man denke daran die `Device ID` und `Device Serial` zu verändern da diese nur einmal pro Homematic Installation vorkommen dürfen.


## Betrieb

Da im Sketch ein `ConfigToggleButton` definiert ist wird durch:

* kurzen Tastedruck der Zustand verändert: LED an / aus
* langen Tastendruck (~3s) der Anlernmodus gestartet
* ganz langen Tastendruck (~7s) ein RESET des Aktors ausgeüfhrt

Das Anlernen kann auch über die Serial durchgeführt werden.

![Dim1PWM in action](./images/Dim1PWM_finish-2.jpg)

Optional kann man den Dimmer über zwei potentialfreie Taster bedienen. 
Das Verhalten der 2. und 3. _internen Gerätetaste_ kann in der CCU eingestellt werden.  

![Einstellung der internen Gerätetasten](./images/interne-tasten-config.png)


## Weiteres

* Solltest du Anmerkungen oder Probleme mit dem Nachbau haben, lasst es [mich](mailto:asppc@psi.cx) bitte wissen damit dieses Projekt verbessert werden kann.
* Sofern du die Möglichkeit hast den Dimmer an seine Grenzen zu bringen (also anständig Last am MOSFET) wäre ich sehr an den Ergebnissen interessiert.

Danke an pa-pa und Jérôme für ihre Arbeit und den vielen Support! Ohne diesen würde es das hier nicht geben.
