# Fehlerhafte CC1101 Module

Es sind CC1101 Module im Umlauf die auf einer leicht verschobenen Frequenz senden.  
Dies führt zu sehr schlechte RSI Werten. Meist kann der Aktor gar nicht erst angelernt werden.

Näheres ist im [FEHM-Forum Thread](https://forum.fhem.de/index.php/topic,91740.0.html) erläutert.

![CC1101 Modulvergleich](./images/CC1101_bad-vs-working.jpg)

Lösungsvorschläge: 
* [Anpassung der Frequenz per Sketch](https://forum.fhem.de/index.php/topic,91740.msg872348.html#msg872348)
* Tausch der Kondensatoren gegen 12µF.

