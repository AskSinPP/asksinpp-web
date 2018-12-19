# Projekt hinzufügen

Die Projekte werden aus den Markdown-Dateien des Github Projekts [https://github.com/jp112sdl/AskSinPPCollection](https://github.com/jp112sdl/AskSinPPCollection) erzeugt.

Um ein neues Projekt hinzuzufügen wird unter `/Projekte/` eine beliebiger Datei angelegt, z.B. `/Projekte/HM-Mein-Projekt/README.md` oder `/Projekte/nickname/HM-Mein-Projekt.md`:

```markdown
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

Das Bild sollte im Format 16:9 sein und eine Breite von 640px haben.

Die `ProjectUrl` enthält den Link zum Projekt.
Dies kann z.B. dein Blog, GitHub-Repo oder ein Forum-Thread sein.
Alternativ kann die Markdown Datei auch eine vollständige Projektbeschreibung enthalten.  
Wichtig ist, dass hier alle nötigen Informationen zum Nachbau vorhanden sind.

Bitte orientiert euch bei den Tags an den vorhandenen. Natürlich kannst du auch neue hinzufügen
aber nur wenn diese thematisch nicht passen.

Einfach einen PullRequest stellen oder uns die Markdown-Datei und das Vorschaubild zukommen lassen.

PS: Es tut nicht weh, wenn es verschiedene Projekte zum selben Thema gibt :)
