# Dauersender / Babbling Idiot

Abschaltung oder Dauersender/-störer trotz fast voller Batterien

Um die garantierten Spezifikationen des ATMega328P einzuhalten, ist ab Werk die so genannte 
[Brown-Out-Detection (BOD)](https://www.mikrocontroller.net/articles/Brownout) bei **2.7V** aktiviert. 
Sinkt die Eingangsspannung unter diesen Wert, fällt der µC in einen RESET-Zustand. 
Das _kann_ ungewollte Nebenfolgen haben 
(siehe ["Babbling Idiot"](https://github.com/TomMajor/AskSinPP_Examples/tree/master/Info/Babbling%20Idiot%20Protection))!
Weiterhin werden die Batterien dadurch auch nur sehr ineffektiv genutzt.

Bei der BOD handelt es sich um ein sogenanntes ["Fuse-Bit"](https://de.wikipedia.org/wiki/Fuse-Bit).

Fuse-Bits können nur mithilfe eines ISP (In-System-Programmer) verändert werden.

**Siehe [In-System-Programming (ISP)](../04-isp.html)!**


Um die BOD für einen Arduino Pro-Mini zu deaktiveren können folgende Fuse-Bits verwendet werden (avrdude args):
```
-Ulfuse:w:0xFF:m -Uhfuse:w:0xD2:m -Uefuse:w:0xFF:m
```

Zum Schluss muss die Ausgabe kontrolliert werden. Folgende Zeilen erscheint zum Schluss der Ausgabe
wenn alles erfolgreich war:

```
avrdude: safemode: Fuses OK (E:FF, H:D2, L:FF)

avrdude done.   Thank you.
```

Falls nicht ist die Ausgabe auf Fehlermeldungen zu kontrollieren.  
Die Version `avrdude -v` sollte mindestens 6.3 sein!
