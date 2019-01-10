# Software / Flashen

Die Software für den Microcontroller wird bei Arduino als _Sketch_ bezeichnet.  
Der USB FTDI Adapter ist die Verbindung zwischen Microcontroller und PC.


## Arduino IDE

Die [Arduino IDE](https://www.arduino.cc/en/Main/Software) ist die gebräuchlichste
PC Software für den Umgang mit dem Arduino.

### Bibliothek einbinden

Damit die im Sketch verwendeten Bibliotheken zur Verfügung stehen, müssen diese eingebunden werden:
* AskSinPP
* EnableInterrupt
* Low-Power

Die AskSinPP Bibliothek kann als [ZIP](https://github.com/pa-pa/AskSinPP/archive/master.zip) 
heruntergeladen werden.
Anschließend geht man in der Arduino IDE auf `Sketch > Bibliothek einbinden > .ZIP-Bibliothek hinzufügen` 
und wählt die ZIP-Datei aus.

EnableInterrupt und Low-Power wird über `Sketch > Bibliothek einbinden > Bibliotheken verwalten`
gesucht und installiert.

### Board einstellen

* Board: `Arduino Pro or Pro Mini`
* Prozessor: `ATmega328P (3.3V, 8 MHz)`
* Port: COM-Port des FTDI Adapters 


## PlatformIO

PlatformIO gibt es als vollständige [Entwicklungsumgebung](https://platformio.org/platformio-ide) (IDE) und als [Command-Line-Interface](https://platformio.org/install/cli) (CLI).

Die nötigen Bibliotheken können über den [Library Manager](https://docs.platformio.org/en/latest/librarymanager/)
bequem installiert werden. Er enthält neben den gebräuchlichen EnableInterrupt und Low-Power auch AskSinPP.

Die Konfiguration des Boards kann über das Interface eingestellt werden und wird in der `platformio.ini` im
Projekt-Verzeichnis gespeichert. Diese Datei kann man sich also auch schnell selbst erstellen:

```ini
[env:pro8MHzatmega328]
platform = atmelavr
framework = arduino
board = pro8MHzatmega328
```


## Anschluss des FTDI Adapters

Um die Schaltung sehr kompakt zu halten, verzichtet man auf das Anlöten eines Steckverbinders.
Es reicht aus, wenn man die Pins des FTDI Adapters durch die Lötbohrungen steckt und während des Flash-Vorgangs verkantet.

![FTP Adapter verkantet am Arduino Pro Mini](./images/ftdi-verkantet.jpg)


## Sketch anpassen und flashen

Es gibt mittlerweile viele fertige [Sketche](/Sketche/) die je nach Aktor oder Sensor verwendet werden können.  
Als Beispiel wird hier der `HM-RC-P1` Paniktaster genommen.

Der komplette Sketch ist [HM-RC-P1.ino](https://github.com/pa-pa/AskSinPP/blob/master/examples/HM-RC-P1/HM-RC-P1.ino).

```cpp
// Arduino pin for the config button
#define CONFIG_BUTTON_PIN 8
// Arduino pins for the buttons
// A0 == PIN 14
#define BTN1_PIN 14
```

Hier sieht man die Button Belegung und kann diese entsprechend anpassen.  
Für das Beispiel des Paniktasters schließen wir also einen weiteren Taster an `A0` und `GND` an.

Weiterhin ist der DeviceInfo Block wichtig:
```cpp
// define all device properties
const struct DeviceInfo PROGMEM devinfo = {
    {0x12,0x09,0x01},       // Device ID
    "JPLRCP2001",           // Device Serial
    {0x00,0x1a},            // Device Model
    0x11,                   // Firmware Version
    as::DeviceType::Remote, // Device Type
    {0x00,0x00}             // Info Bytes
};
```

::: warning
Jedes Gerät in einer HomeMatic Umgebung hat 2 eindeutige Identifikationsmerkmale:

* die 10-stellige Seriennummer (wird in der WebUI in der Spalte Seriennummer in Einstellungen->Geräte angezeigt)
* die 3-Byte Geräteadresse (wird in einer Konfigurationsdatei im Dateisystem gespeichert)

Beide dürfen in einer HomeMatic-Installation nur **1x vergeben** werden.  
Ausschlaggebend für die Funk-Kommunikation ist die Geräte-Adresse.
::: 

Die Geräteadresse (im Sketch als `Device ID` bezeichnet) lautet in diesem Fall `0x12,0x09,0x01`.  
Die Seriennummer (im Sketch als `Device Serial` bezeichnet) lautet in diesem Fall `JPLRCP2001`.

Soll ein weiterer, auf diesen Sketch basierender HM-RC-P1 ins HomeMatic System integriert werden, verwendet man (- so mache ich es zumindest-) am besten eine fortlaufende Numerierung. 0x12, 0x09, 0x02 / JPLRCP2002.

Wichtig: Die Seriennummer muss immer 10-stellig sein! Sie darf Buchstaben und Zahlen enthalten.

Sind die Werte angepasst, kann der Programmcode kompiliert und an den Mikrocontroller 
übertragen werden. In der Arduino IDE heißt dieser Vorgang `Sketch hochladen` 
und bei PlatformIO `upload`.

Unter Device-Model wird ein zweistelliger Hexwert verwendet. Dieser Wert kann mehrfach vorkommen.
Durch diesen Wert wird das Format der Kommunikation vom und zum Gerät beschrieben. Weitere
von diesem Wert abhängigen Informationen sind im WebGUI sichtbar. So wird das Geräte-Icon
und die Darstellung der vom Gerät übertragenen Werte über die Device-Model referenziert.

Für die HM-Geräte und 1:1 Nachbauten sind die Device-Model in der CCU vorhanden. Für eigene
Geräte (Homebrew) werden sie z.B. über Addons hinzugefügt.

Im Beispiel ist das Device-Model `{0x00,0x1a}`. Über die Liste [RF-Types](/rftypes/) findet man, dass dieses
Device-Model `0x001A` der FunkPankiHandsender HM-RC-P1 ist, also ein Original HM-Gerät
und damit Icon und Beschreibung der Darstellung in der CCU schon vorhanden sind.

Das Feld Firmware beinhaltet einen HEX-Wert, der in der Web-GUI als zwei Ziffeern angezeigt wird.
Aus `0x11` wird dann "Firmware Version 1.1". Wenn auf die CCU eine höhere Firmware eingespielt wurde kann diese bei OTA-fähigen Geräten dann upgedatet werden.

In der über das Device-Model referenzierten Konfiguration kann auch eine von der Firmwareversion
abhängige Funktionalität enthalten sein, um etwa Varianten ab einer bestimmten Version zu ermöglichen.

Der Device-Type beschreibt eine Klasse an Geräten. So können etwa Taster mit unterschiedlicher Anzahl
an Tasten (und damit unterschiedlichem Device-Model) an anderen Stellen wieder gemeinschaftlich
behandelt werden.

Und letzlich gibt des noch die zweistellige HEX-Angabe Device-Info, wo weitere Details des Gerätes
beschrieben werden.


## Serieller Monitor

Der Arduino verfügt über eine Debug-Ausgabe die vom PC über den `seriellen Monitor`
abgerufen werden kann (Arduino IDE: Menü > Werkzeuge > serieller Monitor).
Aus dem Sketch kann man die verwendete Baudrate ablesen:

```cpp
void setup () {
  DINIT(57600,ASKSIN_PLUS_PLUS_IDENTIFIER);
  sdev.init(hal);
```

Hier also **57600 Baud**. Diese muss beim Verbindungsaufbau übereinstimmen, damit man
nicht nur wirre Zeichen erhält. Weiteres zum [Debugging](/Grundlagen/FAQ/Debugging.html) in den FAQ.
