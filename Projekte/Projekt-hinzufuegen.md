# Projekt hinzufügen

Die Projekte werden aus den Markdown-Dateien des Github Projekts [https://github.com/jp112sdl/AskSinPPCollection](https://github.com/jp112sdl/AskSinPPCollection) erzeugt. In das Repository dürfen nur berechtigte
Contributoren direkt schreiben weshalb die Änderungen über einen Pull-Request eingereicht werden müssen.

Wer keine Lust hat sich mit GitHub und Pull-Requests auseinander zu setzen kann mir auch
einfach eine [E-Mail](mailto:asppc@psi.cx) schreiben oder ein [Issue](https://github.com/jp112sdl/AskSinPPCollection/issues)
aufmachen.

Ein Projekt sollte alle nötigen Informationen zum Nachbau enthalten, also zumindest die verwendete Hardware, Bauteile, die Verdrahtung und den Sketch. 

PS: Es tut nicht weh, wenn es verschiedene Projekte zum selben Thema gibt :)


## Aufbau der Projekt-Datei

Die Markdown-Dateien sowie Vorschaubilder werden unter `/Projekte/<nickName>/` abgelegt.  
Je nach Bedarf können hier beliebige Unterordner zur Sturkturierung erstellt werden.

Jedes Projekt besteht aus einer Markdown-Datei (z.B. `/Projekte/psi/HM-LC-Dim1PWM.md`)
und einem Vorschaubild welches im Format 16:9 sein sollte, also z.B. 640x360px.

Beim Aufbau der Datei kann man sich an den [bestehenden Projekten](https://github.com/jp112sdl/AskSinPPCollection/tree/master/Projekte) orientieren.


### Frontmatter

In der Markdown-Datei wird das Projekt über einen Code-Block spezifiziert:

```
---
isProject: true
Desc: Die Kurzbeschreibung des Projekts
ProjectUrl: https://eine-url-zur-projektbeschreibung
Author: Names des Autors
AuthorUrl: https://website-des-authors
Tags: Filter-Tags, mit Komma, getrennt
Thumb: vorschaubild.jpg
---

# Name des Projekts
```

* `isProject: true`: Gibt an, dass diese Datei eine Projektspezifikation ist.
* `Desc`: Eine Kurzbeschreibung welche auf der Übersicht unterhalb des Bildes angezeigt wird.
* `ProjectUrl`: Die URL unter der die Projektbeschreibung zu finden ist, z.B. ein GitHub Repo, Blog Post oder Forum-Thread.
* `Author`: Der Name des Autors.
* `AuthorUrl`: Die URL die aufgerufen wird, wenn man auf den Autor-Namen klickt.
* `Tags`: Eine Komma-separierte Liste mit Schlagworten für die Filterung.
* `Thumb`: Der Pfad zum Vorschaubild, relativ zur aktuellen Markdown-Datei.

Hat man keinen eigenen Platz zur Veröffentlichung des Projekts kann man dies auch innerhalb der Markdown-Datei tun.
Ein Beispiel hierfür ist [HM-LC-Dim1PWM](https://github.com/jp112sdl/AskSinPPCollection/tree/master/Projekte/psi/HM-LC-Dim1PWM).


### Tags

Bei der Wahl der Tags sollte sich vor allem an den schon vorhandenen Schlagworten orientiert werden.
Tags, die auf alle Projekte zutreffend sind zu vermeiden (Bsp. Homematic, AskSinPP). Natürlich können
neue Tags hinzugefügt werden sofern dies Sinn ergibt. Sie werden automatisch in die Filterleiste mit
aufgenommen.
