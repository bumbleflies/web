---
title: "Ein KI-Agenten-Betriebssystem für ein Legal-Tech-Unternehmen"
description: "Nicht 'wir haben KI gekauft', sondern 'wir haben unsere eigenen Betriebsabläufe in Code übersetzt, den ein Sprachmodell komponiert'. Die Landkarte eines echten Agenten-Systems in Produktion."
excerpt: "Vier Agenten-Schichten auf zwei Fundament-Ebenen. Autonome Bots, die Pull-Requests öffnen, ein Skill-Marktplatz für Firmenwissen, ein Cockpit, das den Tag plant. So sieht KI aus, wenn sie nicht in der Demo endet."
category: "Überblick"
order: 1
date: 2026-07-10
readingTime: "9 Min."
published: false
---

Die häufigste Frage, die uns Unternehmen zum Thema KI stellen, klingt ungefähr so:

> „Gehe ich richtig in der Annahme, dass man Feature-Requests einfach textuell eingibt — und dann laufen Agents los, implementieren das, machen Pull-Requests? Ich habe die romantische Vorstellung, dass ihr da einen aktuellen Schatz habt."

Das ist ein echtes Zitat aus einer Kundenanfrage. Und die ehrliche Antwort lautet: Ja. Genau das haben wir gebaut — nicht als Demo, nicht als Proof-of-Concept, sondern als produktives System, das seit über einem Jahr den Arbeitsalltag eines deutschen Legal-Tech-Unternehmens trägt.

Diese Artikelserie beschreibt dieses System. Wie es aufgebaut ist, welche Entscheidungen wir getroffen haben — und vor allem die Narben, denn fast jede Schutzmaßnahme darin lässt sich auf einen konkreten Vorfall zurückführen.

## Der Kern: keine gekaufte KI, sondern kompilierte Betriebsabläufe

Der wichtigste Satz zuerst, weil er alles andere erklärt: Wir haben keine KI-Lösung *eingekauft*. Wir haben die **operativen Verfahren des Unternehmens in Code übersetzt, den ein Sprachmodell zusammensetzt.**

Der Unterschied ist fundamental. Ein generischer KI-Assistent weiß nichts über Ihre Deployment-Pipeline, Ihre Ticket-Konventionen, Ihre Freigabe-Regeln, Ihre Kundenlandschaft. Er improvisiert — und improvisiert jedes Mal ein bisschen anders. Ein System, das Ihre Verfahren als versionierten, testbaren Code kennt, tut jedes Mal dasselbe. Das Sprachmodell trifft die Urteilsentscheidungen; deterministische Skripte führen die Mechanik aus.

Aus dieser einen Idee ist ein mehrschichtiges Betriebssystem gewachsen.

## Die Architektur: zwei Ebenen, vier Schichten

Das mentale Modell hat **zwei rechtwinklige Fundament-Ebenen** und **vier Agenten-Schichten**, die darauf operieren.

**Die Zustandsebene** ist das Projektmanagement-Tool (in unserem Fall ClickUp). Jede Arbeit wird als Ticket geboren oder gegen ein Ticket abgeglichen. Ein Statuswechsel, ein neuer Kommentar, ein geändertes Feld — jedes ist ein Ereignis, das Aktionen auslöst. Das ist der dauerhafte Speicher der Wahrheit *und* die Zündung.

**Die Interaktionsebene** ist der Team-Chat (Microsoft Teams). Hier trifft Autonomie auf Menschen: Hier lösen Menschen Agenten aus, hier melden Agenten ihren Status zurück, und hier koordinieren sich Agenten untereinander.

Darauf sitzen die vier Schichten:

- **Schicht 1 — das Nervensystem.** Eine Automatisierungsplattform (n8n) reagiert auf Ereignisse der Zustandsebene und steuert die Interaktionsebene sowie andere Systeme. Kein Mensch in der Schleife. 24 Workflows, knapp 700 Verarbeitungsschritte. Hier entsteht z. B. aus einer Support-E-Mail automatisch ein klassifiziertes, entdupliziertes Ticket.

- **Schicht 2 — der Skill-Marktplatz.** Das Firmenwissen als installierbare, versionierte „Apps". 11 Plugins, 53 Skills. Jeder Skill ist die Kombination aus Modell-Urteil und deterministischem Skript — und funktioniert identisch für einen Menschen am Laptop, einen Bot im Container und die CI-Pipeline.

- **Schicht 3 — die autonomen Bots.** Claude Code, das rund um die Uhr als Daemon läuft. Ein Wort im Team-Chat weckt einen Bot; er implementiert Code, öffnet Pull-Requests, adressiert Review-Kommentare, rollt Hotfixes aus — und meldet sich zurück. Vier Personas aus *einem* gemeinsamen Bausatz.

- **Schicht 4 — das persönliche Cockpit.** Ein Meta-Agent, der zehn Quellen parallel scannt und daraus den Tag eines Menschen plant. Er liest beide Fundament-Ebenen — und sogar die eigene Gesprächshistorie der KI, um offene Fäden wiederzufinden.

## Das Verbindungsgewebe

Der eigentlich interessante Punkt: Das sind keine vier getrennten Projekte. Es ist ein **Netz mit benannten, tragenden Nähten** — und fast jede Verbindung läuft über die zwei Fundament-Ebenen. Komponenten stoßen sich gegenseitig über Chat-Nachrichten an und koordinieren sich über Tickets und Kommentare, statt sich direkt aufzurufen. Die Ebenen *sind* das gemeinsame Vokabular.

Ein durchgängiger Ablauf, wie er täglich passiert:

1. Ein Kunde schreibt an den Support. Das Nervensystem erzeugt daraus automatisch ein KI-klassifiziertes Ticket.
2. Jemand tippt im Team-Chat ein Triggerwort. Der Support-Bot wacht auf, sichtet die offenen Pull-Requests, triagiert sie.
3. Nach expliziter menschlicher Freigabe rollt der Bot aus — erst die Datenbank-Migrationen, dann die Services.
4. Der Bot hinterlässt einen Kommentar am Ticket; das Nervensystem generiert daraus die kundensichtbaren Release-Notes — durch einen mehrstufigen Datenschutz-Filter.
5. Am nächsten Morgen taucht der gesamte Vorgang im Tagesbriefing des Cockpits auf, dedupliziert gegen die Tickets.

Vier Schichten, ein Arbeitsvorgang. Kein einziger Direktaufruf zwischen den Komponenten.

## Die wiederkehrenden Prinzipien

Über alle Schichten hinweg tauchen dieselben Entwurfsprinzipien auf. Sie sind der eigentliche Wert — und der rote Faden dieser Serie:

**Vertraue dem Modell nicht — verifiziere mit Code.** Die durchgängige Antwort auf „Wie macht man ein Sprachmodell in Produktion sicher?" lautet: eine deterministische Grenze drumherum ziehen. Das Modell schreibt, ein Regex-Filter prüft, das Modell korrigiert, derselbe Filter prüft erneut — und verweigert im Zweifel hart.

**Narben als Design.** Fast jede Schutzmaßnahme zitiert einen datierten Vorfall: eine Nacht, in der ein Bot für mehrere hundert Euro Tokens verbrannte, eine Regression bei der Terminbuchung, eine defekte Konfiguration auf einem Netzlaufwerk. Die Systeme wachsen, indem sie ihre eigenen Fehler in Regeln gießen.

**Koordination über dauerhafte Artefakte, nicht über RPC.** Agenten und Menschen sprechen über Tickets, Tags, Status und Chat-Nachrichten miteinander — nachvollziehbar, wiederaufnehmbar, für Menschen einsehbar.

**Eine Definition, viele Laufzeiten.** Ein Skill, N Bot-Personas. Ein Skript für Mensch, Bot und CI. Kein Copy-Paste.

**Mensch am Bremshebel.** Deutschsprachige Trigger überall, Rechts-Domäne, und alle wirklich folgenreichen Aktionen — Freigaben, Merges, Produktiv-Deployments — sind an eine explizite menschliche Bestätigung gebunden. Autonomie mit der Hand am Hebel.

## Was in dieser Serie kommt

Die folgenden Artikel gehen je eine Ebene tief:

- **Die zwei Ebenen**, auf denen alles läuft — warum der ganze Stack über zwei SaaS-Tools koordiniert statt über eigene Services.
- **Das Nervensystem** — Event-Automatisierung und der Datenschutz-Filter als Musterbeispiel für „verifiziere mit Code".
- **Skills als Apps** — der Plugin-Marktplatz für Firmenwissen.
- **Bots, die nachts arbeiten** — Claude Code als autonomer Daemon, und die Narben.
- **Ein Cockpit für einen Menschen** — den eigenen Tag mit zehn Agenten orchestrieren.

Das ist keine Zukunftsvision. Das läuft. Und der Grund, warum wir es aufschreiben, ist einfach: Weil die romantische Vorstellung, dass da irgendwo ein Schatz liegt, stimmt — und weil wir ihn für andere Unternehmen genauso heben können.
