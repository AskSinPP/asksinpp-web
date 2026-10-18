# Quellenstand

Analyse vom **17. Oktober 2026**. Die Git-Hashes wurden aus den lokalen Checkouts gelesen. Branch-Namen dienen zur Einordnung; alle fachlichen Verweise sollen auf die vollständigen Hashes zeigen.

| Repository | Branch | Analysierter Commit | Lokaler Ort |
| --- | --- | --- | --- |
| [AskSinPP/asksinpp-web](https://github.com/AskSinPP/asksinpp-web) | `aspp-doku` | `702f62f633ac595b018645795afc842eddfb6fa2` | Vorhandenes Arbeitsverzeichnis `Z:\Dokumente\GitHub\asksinpp-web` |
| [pa-pa/AskSinPP](https://github.com/pa-pa/AskSinPP) | `master` | `21bab8b92f7982c29beca08ff3c0ad6ef1e72a5c` | `%TEMP%\asksinpp-handbuch-referenzen\AskSinPP` |
| [jp112sdl/Beispiel_AskSinPP](https://github.com/jp112sdl/Beispiel_AskSinPP) | `master` | `c0ad384c66a8e4887f4cacc591af5d3b88167886` | `%TEMP%\asksinpp-handbuch-referenzen\Beispiel_AskSinPP` |

Der Website-Hash ist der Ausgangsstand vor dieser Handbuch-Erweiterung. Zu Beginn war der Arbeitsbaum sauber. Für die Erweiterung wurde kein Commit erstellt. Die Referenzen wurden mit `git clone --recurse-submodules` außerhalb des Website-Projekts geklont. Das temporäre Verzeichnis ist für diese Analyse geeignet; für längerfristige lokale Arbeit können die Referenzen in ein dauerhaftes separates Arbeitsverzeichnis umziehen.

Bei der Ausarbeitung von „Programmablauf“ wurden beide Referenz-HEADs erneut geprüft und unverändert vorgefunden. Untersucht wurden insbesondere `ChannelDevice::init`/`pollRadio`/`process`, die HAL-Clock-Anbindung, `AlarmClock::add`/`operator--`/`runready`, Radio-/Taster-Interruptpfade und die AVR-Ruhestrategien sowie die beiden Sketche HM-WDS40-TH-I-BME280 und HM-LC-Sw2-FM.

## Submodule und Abhängigkeiten

- Website: keine `.gitmodules` und keine registrierten Submodule.
- Library: keine `.gitmodules`; `git submodule status --recursive` liefert keine Einträge.
- Beispielrepository: vorhandene `.gitmodules` ist leer; `git submodule status --recursive` liefert keine Einträge. Es wird dadurch insbesondere kein passender AskSinPP-Commit festgelegt.
- `library.properties` der Library nennt Version **5.0.3**, die Architekturen `avr,STM32F1,stm32,esp32,rp2040,EFM32` und die Abhängigkeiten `EnableInterrupt,Low-Power`. Die Auflistung ist keine Bestätigung vollständiger Unterstützung jedes Features auf jeder Plattform.
- Sensoradapter können zusätzliche Bibliotheken voraussetzen, beispielsweise `BME280I2C.h` und `DHT.h`. Diese wurden nur im Quellcode identifiziert, nicht für einen Firmware-Build installiert.

## Lizenzbefund anhand der tatsächlich gelesenen Dateien

| Quelle | Befund | Konsequenz für die Dokumentation |
| --- | --- | --- |
| Website `LICENSE.txt` | Volltext mit Überschrift „Attribution-NonCommercial-ShareAlike 4.0 International“ | Bestehende Lizenzdatei erhalten; eigene Dokumentation in diese bestehende Struktur einordnen. |
| Website `package.json` und Lockfile | Abweichende Angabe `CC BY-SA License 4.0` | Der Nutzer klärt die Abweichung. Sie blockiert die laufende Dokumentation nicht; nach Klärung erfolgt vor Projektabschluss ein gemeinsamer Kollisionscheck. Metadaten nicht eigenmächtig ändern. |
| Library: unter anderem `AskSinPP.h`, `BatterySensor.h`, `Alarm.h`, `Register.h` | Dateiköpfe nennen papa und `http://creativecommons.org/licenses/by-nc-sa/3.0/de/`; keine zentrale LICENSE/COPYING-Datei im Checkout gefunden | Dateibezogene Hinweise prüfen und Urheber erhalten, falls später Code übernommen wird. Keine pauschale Lizenzbehauptung für alle enthaltenen Drittdateien. |
| Ausgewählte Beispielsketche | Entsprechende CC-BY-NC-SA-3.0-DE-Hinweise; BME280-Sketch nennt zusätzlich jp112sdl; keine zentrale LICENSE/COPYING-Datei gefunden | Beispiele verlinken; größere Übernahmen und Bearbeitungen erst mit geprüftem Lizenzhinweis. |

Die Dokumentation soll die technischen Inhalte vollständig und verständlich vermitteln. Erklärungen werden eigenständig formuliert; konkrete Übernahmen richten sich weiter nach den Hinweisen ihrer jeweiligen Quelldatei und werden mit Urheber sowie Quelle versehen. Der Nutzer hat entschieden, die Abweichung in den Website-Metadaten nicht als Sperrgrund für die laufende Dokumentation zu behandeln. Der gemeinsame Kollisionscheck folgt nach seiner Klärung; bis dahin werden keine Lizenzmetadaten geändert.

## Nachvollziehbare Referenzen

Die öffentlichen [Quellen](../Referenz/README.md) enthalten feste Links zu den zentralen Dateien. Das [Klasseninventar](./Klasseninventar.md) nennt konkrete Symbole und das [Beispielverzeichnis](./Beispielkatalog.md) die analysierten Sketche. Bei einer späteren Aktualisierung zuerst die Hashes und Änderungen der betreffenden Symbole vergleichen, dann Kapitel und Beispielzuordnungen anpassen.
