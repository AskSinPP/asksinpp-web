[Startseite](https://github.com/jp112sdl/AskSinPPCollection/blob/master/README.md)
## FAQ / häufige Fehler

- Debugging

  Sollte es einmal klemmen und die aufgebaute Schaltung nicht funktionieren, ist es immer von Vorteil, strukturiert nach dem Fehler zu suchen.<br/>
  Wichtig und aufschlussreich sind die seriellen Debugmeldungen, die vom Mikrocontroller ausgegeben werden. Um sich diese anzeigen zu lassen, ist der "serielle Monitor" zu öffnen. _(Arduino IDE: Menü -> Werkzeuge -> serieller Monitor)_<br/>
  Dabei muss ggf. noch die Baudrate (unten links im Fenster) auf **57600** Baud eingestellt werden.<br/>
  
  (korrektes) Starten eines AskSinPP Device:
  ```
  AskSin++ V3.1.1 (Nov  7 2018 18:15:23)
  Address Space: 32 - 902
  CC init1
  CC Version: 04
  - ready
  ```
  ggf. erscheint nach einem Reset, neuem Sketch (erstmaliger Inbetriebnahme) zwischendring noch:
  ```
  CAFEFAC4
  Init Storage: CAFE85D5
  ```

  Wenn diese Meldungen so erscheinen, ist schon mal das Funkmodul **korrekt** initialisiert worden.
  
  Gibt es Probleme mit der Kommunikation mit dem Funkmodul:
  ```
  CC init1
  Error at 00 expected: 2E read: 00
  Error at 02 expected: 06 read: 00
   ...
  Error at 3E expected: 03 read: 00
  CC Version: 00
  Error at 3E expected: C0 read: 00
  - ready
   ```
   Dann unbedingt nochmals die Verdrahtung überprüfen.
  
  
  Weitere Ausgaben im seriellen Monitor:
  
  | Meldung | Beschreibung |
  | ------------- |-------------|
  | <- ... | gesendetes Telegramm |
  | -> ... | empfangenes, an das Gerät gerichtetes Telegramm |
  | ignore ... | empfanges, nicht an das Geräte gerichtetes Telegramm |
  
  _to be continued_

- Standard vs. gesicherte Übertragung
  - HM-Sec-... Geräte haben nach dem Anlernen in der WebUI standardmäßig die "gesicherte Übertragung" aktiviert. Diese muss auf "Standard" umgestellt werden _(sofern man im Sketch kein [AES](https://github.com/pa-pa/AskSinPP#enable-aes-support) implementiert hat)_.
  - klassisches Beispiel: falls bei einem Fenster- oder Drehgriffkontakt der Status nicht übertragen/angezeigt wird, ist dies zuerst zu prüfen
