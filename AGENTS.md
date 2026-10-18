# Regeln für Arbeiten an asksinpp-web

## Arbeitsumfang und bestehende Inhalte

- Vor Änderungen `git status --short --branch` lesen. Vorhandene lokale Änderungen erhalten und ausschließlich im vom Nutzer vorgegebenen Entwicklungsbranch arbeiten. Keinen neuen Branch ohne Auftrag erstellen.
- Keine Commits, Pushes, Pull Requests oder Veröffentlichungen ohne ausdrücklichen Auftrag. Originalbeispiele in Referenz-Repositories nicht verändern.
- VuePress 1 und die vorhandenen Abhängigkeiten beibehalten. Neue Pakete nur bei zwingender fachlicher Notwendigkeit ergänzen.
- Bestehende Inhalte, URLs und Navigation erhalten. Gute vorhandene Erklärungen verlinken; Änderungen daran fachlich begründen.
- Technische Referenzen außerhalb dieses Website-Repositories klonen. Submodule prüfen und den tatsächlich analysierten Stand dokumentieren.

## Persönliche Änderungen und Nutzerentscheidungen

- Persönliche Änderungen und Anpassungen des Nutzers sind zu erhalten. Sie dürfen nur überschrieben oder zurückgenommen werden, wenn der aktuelle Nutzerprompt diese konkrete Änderung ausdrücklich verlangt oder ihre Anpassung zwingend erforderlich ist, um den beauftragten Zweck zu erfüllen.
- Keine eigenmächtigen „Korrekturen“, Bereinigungen, Umformatierungen oder Rücksetzungen persönlicher Änderungen außerhalb des ausdrücklich beauftragten Umfangs vornehmen. Bei notwendigen Änderungen den Eingriff auf das erforderliche Maß begrenzen.
- Wenn eine persönliche Änderung möglicherweise fehlerhaft, unvollständig oder technisch problematisch ist, den konkreten Befund und seine Auswirkung mitteilen. Nicht stillschweigend ändern; eine Anpassung nur vornehmen, wenn der Nutzerprompt sie verlangt oder der Auftrag ohne sie nicht erfüllt werden kann.
- Vor Änderungen den Arbeitsbaum prüfen und betroffene persönliche Änderungen identifizieren. Bei Unsicherheit Änderungen erhalten und den Nutzer auf den offenen Punkt hinweisen.

## Fachliche Genauigkeit

- Der tatsächliche Quellcode am dokumentierten Commit ist die maßgebliche technische Referenz. Keine Klassen, Methoden, Parameter oder Verhaltensweisen erfinden.
- Komplexe Aussagen mit Quelldatei und relevantem Symbol belegen. GitHub-Links auf Repositories und Dateien standardmäßig auf `main` setzen, nicht auf Commit-Hashes. Den tatsächlich analysierten Commit weiterhin intern dokumentieren; feste Hashes in Anweisungen oder Buildnachweisen nur dann verwenden, wenn sie für die Reproduzierbarkeit erforderlich sind.
- Nachgewiesene Fakten, Schlussfolgerungen und Annahmen erkennbar unterscheiden. Ungeklärte Sachverhalte in `Handbuch/Intern/Offene-Fragen.md` festhalten.
- Verhalten der Library und Entscheidungen des jeweiligen Sketches ausdrücklich trennen. Insbesondere sind Batterieschwellen, Messverfahren und Reaktionen auf `critical()` nicht für alle Geräte gleich.
- Quellcodeanalyse, Kompilierung und Prüfung auf Hardware als unterschiedliche Prüfstufen ausweisen. Ein erfolgreicher Website-Build bestätigt keine Firmware oder elektrische Schaltung.

## Sprache und Aufbau

- Dokumentationssprache ist Deutsch. Technisch präzise und verständlich schreiben, Fachbegriffe beim ersten Auftreten erklären und Zusammenhänge erläutern.
- Einsteiger schrittweise heranführen; weiterführende Implementierungsdetails für Fortgeschrittene kenntlich machen.
- Vollständig ausgearbeitete Kapitel enthalten nach Möglichkeit: Ziel und Voraussetzungen; Konzept und technische Grundlagen; relevante Klassen und Methoden; Erklärung der Implementierung; praktisches Codebeispiel; typische Fehler; weiterführende Informationen; relevante Quelldateien.
- Einstiegsseiten und geplante Kapitel klar als Überblick beziehungsweise Platzhalter kennzeichnen. Kapitel erst im jeweils beauftragten Umfang ausarbeiten.
- Markdown als UTF-8 speichern. Codeblöcke mit Sprachkennung schreiben, C++ mit `cpp`. Templates außerhalb von Codeblöcken in Backticks setzen, damit Vue sie nicht als HTML interpretiert.

## Codebeispiele

- Gültige C++-Syntax und reale AskSinPP-Implementierungen verwenden. Vollständige Sketche und Codefragmente ausdrücklich unterscheiden.
- Unkompilierte beziehungsweise nicht auf Hardware getestete Beispiele entsprechend kennzeichnen; nach Möglichkeit für die benannte Board- und Bibliothekskonfiguration kompilieren und Ergebnis dokumentieren.
- Keine ungeprüften universellen Spannungsgrenzen, Fuse-Werte, Stromverbräuche oder Batterielaufzeiten versprechen.

## Quellen und Lizenzen

- Repository, Branch und vollständigen Commit-Hash in `Handbuch/Intern/Quellenstand.md` pflegen. Öffentliche Repo- und Dateilinks führen auf `main`; Versions- und Analyseangaben stehen im Quellenverzeichnis.
- Relevante Originalquellen verlinken und bei konkreten Übernahmen die Hinweise der jeweils verwendeten Dateien beachten. Quellen- und Urheberangaben dort knapp erhalten, wo sie gebraucht werden, etwa im Kopf eines abgeleiteten Codebeispiels.
- Lizenzhinweise im Fließtext sparsam einsetzen. Keine wiederholten pauschalen Lizenzwarnungen in technischen Kapiteln; Lizenzstände und offene Projektfragen gehören an eine zentrale Referenz- oder interne Planungsstelle.
- Die vom Nutzer aufgeschobene Abweichung zwischen `LICENSE.txt` und `package.json` ist während der laufenden Dokumentation kein Sperrgrund für wichtige technische Inhalte. Erklärungen eigenständig formulieren und erforderliche Beispiele sorgfältig mit Quelle und Urheberhinweis dokumentieren; Hinweise der jeweils verwendeten Originaldatei weiterhin beachten.
- Nachdem der Nutzer die Lizenzfrage geklärt hat, vor Projektabschluss die Website-Lizenz, Paketmetadaten und tatsächlich übernommene Dokumentations-/Codeinhalte gemeinsam auf mögliche Lizenzkollisionen prüfen und Befunde berichten. Keine Lizenzdatei oder Paketmetadaten ohne Auftrag ändern.

## Navigation, interne Planung und Qualität

- Öffentliche Handbuchseiten unter `Handbuch/` ablegen und ausdrücklich in `.vuepress/sidebar.js` eintragen. Den Hauptpunkt „Entwicklerhandbuch“ in `.vuepress/nav.js` erhalten.
- `Handbuch/Intern/**` und `AGENTS.md` bleiben durch `patterns` in `.vuepress/config.js` von der Seitengenerierung ausgeschlossen. Nicht von öffentlichen Seiten auf interne Planungsdateien verlinken. Das ist eine Veröffentlichungsgrenze, keine Zugriffskontrolle für das Git-Repository.
- `Bestandsaufnahme.md`, `Klasseninventar.md`, `Beispielkatalog.md`, `Kapitelplan.md`, `Offene-Fragen.md`, `Quellenstand.md` und `Arbeitsstand.md` in `Handbuch/Intern/` aktuell halten.
- Bei umfangreichen Änderungen an der Architektur oder fachlich folgenreichen Unklarheiten zuerst mit dem Nutzer klären; kleine Umsetzungsentscheidungen innerhalb des Auftrags selbst treffen.
- Für Dokumentationsänderungen den VuePress-Build, neue interne Links, Sidebar-Ziele und den Ausschluss interner Dateien prüfen. Bestehende Warnungen von neu eingeführten Problemen unterscheiden.
- Installation mit `npm ci`, Build mit `npm run build`. Die vorhandenen npm-Skripte verwenden POSIX-Syntax; unter Windows Git Bash als npm-Shell verwenden, siehe `Handbuch/Intern/Arbeitsstand.md`. Paket- und Lockdatei für reine Dokumentationsarbeiten nicht beiläufig ändern.
