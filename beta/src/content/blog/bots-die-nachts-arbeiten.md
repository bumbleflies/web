---
title: "Bots, die arbeiten, während du schläfst: Claude Code als autonomer Daemon"
description: "Vier autonome Bots, die einen Team-Chat beobachten, Code implementieren, Pull-Requests öffnen und Hotfixes ausrollen — und die Narben, die jede einzelne Schutzmaßnahme erklären."
excerpt: "Ein Wort im Chat weckt einen Bot. Er implementiert, öffnet einen PR, meldet sich zurück. Vier Personas aus einem Bausatz. Und die Nacht, in der ein Bot für mehrere hundert Euro Tokens verbrannte."
category: "Autonomie"
image: "/images/blog/bots-die-nachts-arbeiten.svg"
order: 5
date: 2026-07-22
readingTime: "10 Min."
published: false
lang: "DE"
---

Das ist der Artikel, auf den die eingangs zitierte Kundenfrage wirklich zielte: *„Man gibt Feature-Requests textuell ein — und dann laufen Agents los, implementieren das, machen Pull-Requests?"*

Ja. So funktioniert es. Und so haben wir es gebaut.

## Die Grundidee: ein Bot ist Claude Code als Daemon

Ein „Bot" ist nichts anderes als **Claude Code, das als langlebiger Daemon in einem Container läuft** — angetrieben von Chat-Nachrichten statt von einem Menschen am Terminal. Es beobachtet einen Team-Chat-Kanal, und sobald ein Triggerwort fällt, implementiert es Code-Änderungen, öffnet Pull-Requests, adressiert Review-Kommentare, rollt Hotfixes aus oder testet die Anwendung im Browser — alles unbeaufsichtigt.

Die eleganteste Entscheidung steckt in der Architektur: Es gibt vier Personas — einen Entwickler-Bot, einen Support-Bot, einen Produktmanagement-Bot, einen Test-Bot — aber sie sind **nicht vier Codebasen.** Sie sind dieselbe Laufzeit, spezialisiert allein durch einen anderen Systemprompt, eine andere Liste installierter Skills und ein paar Umgebungsvariablen.

> „Ein neuer Bot ist einfach ein Container mit anderen Umgebungsvariablen und einem anderen Systemprompt."

Das ist DRY-Prinzip auf Agenten-Ebene. Eine Verbesserung am gemeinsamen Bausatz erreicht sofort alle vier.

## Der Auslöser: kein Webhook, ein simpler Poll

Man würde erwarten, dass ein solches System über Webhooks getrieben wird. Tut es nicht. Jeder Bot ist eine **30-Sekunden-Poll-Schleife.** Alle 30 Sekunden fragt er den Chat ab: Gibt es eine neue Nachricht mit dem Triggerwort? Ist die Antwort ja, startet er das Sprachmodell. Ist sie nein, schläft er weiter — ohne einen einzigen Token zu verbrennen. Keine Webhook-Registrierung, die stillschweigend kaputtgeht, keine nach außen offene Schnittstelle. Und um die gefühlte Latenz zu verstecken, gibt es einen hübschen UX-Trick: Noch bevor das Modell überhaupt startet, postet der Poll eine Vorab-Bestätigung — „Ich kümmere mich drum! 🐳" — die sich alle 15 Sekunden mit dem aktuellen Arbeitsschritt aktualisiert. Der Mensch sieht innerhalb einer Sekunde eine Reaktion, statt zwei Minuten auf den ersten Token zu warten.

## Wie es Claude Code kopflos ausführt

Im Kern ruft der Bootstrap Claude Code im Headless-Modus auf, mit übersprungenen Berechtigungs-Abfragen — der Bot soll ja nicht bei jeder Datei nachfragen. Genau deshalb ist eine der wichtigsten Schutzmaßnahmen ein **harter Stopp per Hook**: Ein Merge nach `master` oder `main` wird kategorisch verweigert.

> „Autonomes Mergen ist deaktiviert … überlasse den Merge einem Menschen."

Der Bot darf pushen, darf Pull-Requests öffnen — aber der Merge in die Hauptlinie bleibt eine menschliche Entscheidung. Das ist die „Hand am Bremshebel", von der sich das ganze System leiten lässt. Weil die Berechtigungen übersprungen sind, muss dieser Stopp ein *harter* Code-Stopp sein — eine bloße Prompt-Regel wäre nur ein Ratschlag, den das Modell im Eifer ignorieren könnte.

## Die Narben — und warum sie das Wertvollste sind

Jetzt zum ehrlichen Teil. Fast jede Schutzmaßnahme in diesem System lässt sich auf einen konkreten, datierten Vorfall zurückführen. Das ist keine Peinlichkeit, sondern die Methode: **Das System wächst, indem es seine eigenen Fehler in Code gießt.**

**Die Nacht mit mehreren hundert Euro Tokens.** Der Chat-Token eines Bots war abgelaufen. Der Poll interpretierte das als „es gibt Arbeit" und feuerte alle 30 Sekunden das Sprachmodell, um das vermeintliche Problem zu „lösen" — die ganze Nacht. Am Morgen: mehrere hundert Euro Token-Kosten für nichts. Die Antwort waren *drei* unabhängige Ausgaben-Wächter: ein stiller Token-Refresh, der zuerst versucht, das Problem ohne Modell zu lösen; eine Fehler-Zustandsmaschine, die nach wiederholten Fehlschlägen auf einen Versuch pro Stunde drosselt; und eine Wochenlimit-Markierung. Seither feuert ein abgelaufener Token *nie* das Modell — er überspringt einfach den Tick.

Die Wächter haben das Verbrennen gestoppt, aber sie haben einen eigenen Fehlermodus mitgebracht: Ein wirklich festgeklemmter Bot versucht jetzt höchstens einmal pro Stunde neu. Wenn der Bot wirklich kaputt ist, merkt man es nur noch langsam.

**Die Konfiguration auf dem Netzlaufwerk.** Anfangs lag die Bot-Konfiguration auf einem persistenten Netzlaufwerk. Dort ging das Klonen und Zurücksetzen des Git-Repositorys immer wieder kaputt, korrumpierte Dateien, und der defekte Ordner ließ sich nicht mehr löschen — der Bot hing fest. Die Lektion: Konfiguration auf flüchtigen lokalen Speicher, der bei jedem Start frisch geklont wird; nur der *Zustand* liegt persistent. Und niemals ein `sleep infinity` im Fehlerfall — lieber sauber beenden und den Container einen frischen Prozess starten lassen.

**Die Selbst-Neustart-Schleife.** Die Bots lernen dazu: Nach einem Review-Kommentar schreiben sie eine neue Regel in ihre Wissensbasis und pushen sie. Anfangs interpretierte die Deployment-Automatik diesen Push als Konfigurations-Änderung — und startete den Bot mitten in der Arbeit neu. Der Neustart wiederholte die Arbeit, lernte, committete, pushte, startete neu … eine unendliche Selbst-Neustart-Schleife. Die Korrektur: Pushes in die Wissensbasis explizit von der Neustart-Logik ausnehmen.

**„Verlasse dich nie auf die Absender-Identität."** Weil der Bot über den Token eines Menschen postet, teilen sich Bot und Mensch einen Anzeigenamen. Ein Vorfall, in dem der Bot auf seine eigene Statusnachricht reagierte — weil darin das Triggerwort vorkam — führte zur Regel: Alles macht sich an Nachrichten-IDs fest, nie an der Anzeige-Identität.

**„Gemacht zählt erst als gelernt, wenn es geschrieben steht."** Der Test-Bot, der die Anwendung im Browser durchklickt, führt eine eigene Wissensbasis über die Oberfläche des Produkts. Der Leitsatz dahinter ist zugleich die vielleicht beste Zusammenfassung des ganzen Ansatzes: Erfahrung, die nirgends notiert wird, ist verloren. Also schreiben die Bots ihre Lektionen auf und pushen sie — deploy-neutral, sofort für alle verfügbar.

## Die selbstlernende Schicht

Genau das ist der Grund, warum diese Bots über die Monate besser werden, statt gleich schlecht zu bleiben: Sie schreiben nach jedem Review, nach jeder Korrektur generalisierbare Regeln in eine Wissensbasis und teilen sie. Der Entwickler-Bot lernt Konventionen des Frontends, der Support-Bot lernt die Choreografie eines Rollouts, der Test-Bot lernt die Eigenheiten der Oberfläche. **Die Werkzeuge verbessern die Dokumente, die die Werkzeuge steuern** — dasselbe Kompound-Muster wie im Marktplatz.

## Was man daraus mitnimmt

Autonome Agenten in Produktion sind kein Magie-Trick. Sie sind ein sehr gewöhnliches Werkzeug (Claude Code) in einer sehr disziplinierten Umgebung: ein billiger Poll statt fragiler Webhooks, harte Code-Grenzen um die riskanten Aktionen, drei unabhängige Kostenwächter, und eine Kultur, in der jeder Vorfall zu einer neuen Regel wird.

Der schwierigste Teil ist nicht, den Bot zum Arbeiten zu bringen. Der schwierigste Teil ist, ihm die Grenzen zu geben, an denen man nachts ruhig schläft.

Im letzten Teil der Serie drehen wir die Perspektive um: weg von den Maschinen, die autonom arbeiten, hin zu einem einzelnen Menschen — und dem Cockpit, das dessen Tag mit zehn Agenten orchestriert.
