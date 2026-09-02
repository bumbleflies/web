---
title: "Statt KI zu kaufen: Was ich wirklich gebaut habe"
description: "Nicht 'ich habe KI gekauft', sondern 'ich habe meine eigenen Betriebsabläufe in Code übersetzt, den ein Sprachmodell komponiert'. Die Landkarte eines echten Agenten-Systems in Produktion."
excerpt: "Vier Agenten-Säulen auf zwei Fundamenten. Autonome Agenten, die Pull-Requests öffnen, ein Skill-Marktplatz für Firmenwissen, ein Cockpit, das den Tag plant. So sieht KI aus, wenn sie nicht in der Demo endet."
category: "Überblick"
image: "/images/blog/ki-agenten-betriebssystem.svg"
order: 1
date: 2026-07-10
author: "Chris 🦋 | Founder at bumbleflies / Senior Product Manager at JUNE"
readingTime: "9 Min."
published: false
lang: "DE"
---

Die häufigste Frage, die mir Leute zum Thema KI stellen, klingt ungefähr so:

> „Gehe ich richtig in der Annahme, dass man Feature-Requests einfach textuell eingibt, und dann laufen Agents los, implementieren das, machen Pull-Requests? Ich habe die romantische Vorstellung, dass ihr da einen aktuellen Schatz habt."

Das ist ein echtes Zitat aus einer Kundenanfrage. Und die ehrliche Antwort lautet: Ja, genau das habe ich gebaut. Nur nicht bei bumbleflies. Ich habe es bei JUNE gebaut, einem deutschen Legal-Tech-Unternehmen, bei dem ich ebenfalls arbeite, und es trägt dort seit über einem Jahr meinen Arbeitsalltag.

Kurz zur Einordnung: Ich arbeite sowohl bei JUNE, wo ich dieses System gebaut habe und betreibe, als auch bei bumbleflies, wo ich andere Unternehmen in Sachen KI berate. Diese Serie ist mein persönlicher Erfahrungsbericht aus JUNE, kein bumbleflies-Kundenprojekt.

Diese Artikelserie beschreibt dieses System. Wie es aufgebaut ist, welche Entscheidungen ich getroffen habe, und vor allem die Narben, denn fast jede Schutzmaßnahme darin lässt sich auf einen konkreten Vorfall zurückführen.

## Der Kern: keine gekaufte KI, sondern kompilierte Betriebsabläufe

Der wichtigste Satz zuerst, weil er alles andere erklärt: Ich habe keine KI-Lösung *eingekauft*. Ich habe die **operativen Verfahren von JUNE in Code übersetzt, den ein Sprachmodell zusammensetzt.**

Der Unterschied liegt tief. Ein generischer KI-Assistent weiß nichts über deine Deployment-Pipeline, deine Ticket-Konventionen, deine Freigabe-Regeln, deine Kundenlandschaft. Er improvisiert, und improvisiert jedes Mal ein bisschen anders. Ein System, das deine Verfahren als versionierten, testbaren Code kennt, tut jedes Mal dasselbe. Das Sprachmodell trifft die Urteilsentscheidungen; deterministische Skripte führen die Mechanik aus.

Aus dieser einen Idee ist ein mehrschichtiges Betriebssystem gewachsen.

## Die Architektur: zwei Fundamente, vier Säulen

<div class="a-arch-diagram" role="img" aria-label="Diagramm: zwei Fundamente, Zustand und Interaktion, tragen vier Agenten-Säulen: Nervensystem, Skill-Marktplatz, Agenten, Cockpit" style="--diagram-dark:url('/images/blog/ki-agenten-betriebssystem-architecture.svg');--diagram-light:url('/images/blog/ki-agenten-betriebssystem-architecture-light.svg')"></div>

Das mentale Modell hat **zwei rechtwinklige Fundamente** und **vier Agenten-Säulen**, die darauf stehen.

**Fundament 1, der Zustand.** Das Projektmanagement-Tool. Bei JUNE ist das ClickUp. Jede Arbeit wird als Ticket geboren oder gegen ein Ticket abgeglichen. Ein Statuswechsel, ein neuer Kommentar, ein geändertes Feld: jedes ist ein Ereignis, das Aktionen auslöst. Das ist der dauerhafte Speicher der Wahrheit *und* die Zündung.

**Fundament 2, die Interaktion.** Der Team-Chat (Microsoft Teams). Hier trifft Autonomie auf Menschen: Hier lösen Menschen Agenten aus, hier melden Agenten ihren Status zurück, und hier koordinieren sich Agenten untereinander.

Darauf stehen die vier Säulen:

- **Säule 1, das Nervensystem.** Eine Automatisierungsplattform (n8n) reagiert auf Ereignisse aus Fundament 1 (dem Zustand) und steuert Fundament 2 (die Interaktion) sowie andere Systeme. Kein Mensch in der Schleife. 24 Workflows, knapp 700 Verarbeitungsschritte. Hier entsteht z. B. aus einer Support-E-Mail automatisch ein klassifiziertes Ticket, doppelte Meldungen werden dabei zusammengeführt.

- **Säule 2, der Skill-Marktplatz.** Das Firmenwissen als installierbare, versionierte „Apps". 11 Plugins, 53 Skills. Jeder Skill ist die Kombination aus Modell-Urteil und deterministischem Skript, und funktioniert identisch für einen Menschen am Laptop, einen Agenten im Container und die CI-Pipeline.

- **Säule 3, die autonomen Agenten.** Claude Code, das rund um die Uhr als Daemon läuft — diese Serie nennt jeden KI-Prozess, der eine Rolle ausfüllt, einheitlich „Agent", auch die, die ohne Zutun autonom laufen. Ein Wort im Team-Chat weckt einen Agenten; er implementiert Code, öffnet Pull-Requests, adressiert Review-Kommentare, rollt Hotfixes aus, und meldet sich zurück. Vier Personas aus *einem* gemeinsamen Bausatz.

- **Säule 4, das persönliche Cockpit.** Ein Meta-Agent, der zehn Quellen parallel scannt und daraus den Tag eines Menschen plant. Er liest beide Fundamente, und sogar die eigene Gesprächshistorie der KI, um offene Fäden wiederzufinden.

## Das Verbindungsgewebe

Das sind keine vier getrennten Projekte. Es ist ein **Netz mit benannten, tragenden Nähten**, und fast jede Verbindung läuft über die zwei Fundamente. Komponenten stoßen sich gegenseitig über Chat-Nachrichten an und koordinieren sich über Tickets und Kommentare, statt sich direkt aufzurufen. Die Fundamente *sind* das gemeinsame Vokabular.

Ein durchgängiger Ablauf, wie er täglich passiert:

1. Ein Kunde schreibt an den Support. Das Nervensystem erzeugt daraus automatisch ein klassifiziertes Ticket — sobald ein Pull-Request das Ticket adressiert, verweisen beide aufeinander.
2. Jemand tippt im Team-Chat ein Triggerwort. Der Agent wacht auf, sichtet die Pull-Requests, die zu offenen Tickets gehören, und triagiert sie.
3. Nach expliziter menschlicher Freigabe rollt der Agent aus, erst die Datenbank-Migrationen, dann die Services.
4. Der Agent hinterlässt einen Kommentar am zugehörigen Ticket; das Nervensystem generiert daraus automatisch die kundensichtbaren Release-Notes, durch einen mehrstufigen Datenschutz-Filter.
5. Am nächsten Morgen taucht der gesamte Vorgang im Tagesbriefing des Cockpits auf, zusammengeführt mit den Tickets, damit nichts doppelt auftaucht.

Vier Säulen, ein Arbeitsvorgang. Kein einziger Direktaufruf zwischen den Komponenten.

## Die wiederkehrenden Prinzipien

Über alle Säulen hinweg tauchen dieselben Entwurfsprinzipien auf. Sie sind der eigentliche Wert, und der rote Faden dieser Serie:

**Vertraue dem Modell nicht, verifiziere mit Code.** Die durchgängige Antwort auf „Wie macht man ein Sprachmodell in Produktion sicher?" lautet: eine deterministische Grenze drumherum ziehen. Das Modell schreibt, ein Regex-Filter prüft, das Modell korrigiert, derselbe Filter prüft erneut, und verweigert im Zweifel hart.

**Narben als Design.** Fast jede Schutzmaßnahme zitiert einen datierten Vorfall: eine Nacht, in der ein Agent für mehrere hundert Euro Tokens verbrannte, eine Regression bei der Terminbuchung, eine defekte Konfiguration auf einem Netzlaufwerk. Die Systeme wachsen, indem sie ihre eigenen Fehler in Regeln gießen.

**Koordination über dauerhafte Artefakte, nicht über RPC.** Agenten und Menschen sprechen über Tickets, Tags, Status und Chat-Nachrichten miteinander, nachvollziehbar, wiederaufnehmbar, für Menschen einsehbar.

**Eine Definition, viele Laufzeiten.** Derselbe Skill läuft identisch für einen Menschen am Laptop, einen Agenten im Container und die CI-Pipeline — ein Skript, keine drei. Kein Copy-Paste.

**Mensch am Bremshebel.** Deutschsprachige Trigger überall, Rechts-Domäne, und alle wirklich folgenreichen Aktionen, Freigaben, Merges, Produktiv-Deployments, sind an eine explizite menschliche Bestätigung gebunden. Autonomie mit der Hand am Hebel.

Das ist kein Bauplan zum Kopieren. Es ist der aktuelle Zustand eines laufenden Systems, Narben inklusive, und manche Entscheidungen darin sind mir bis heute nicht ganz geheuer.

## Was in dieser Serie kommt

Die folgenden Artikel nehmen sich je ein Fundament oder eine Säule vor:

- **Die zwei Fundamente**, auf denen alles läuft, warum der ganze Stack über zwei SaaS-Tools koordiniert statt über eigene Services.
- **Das Nervensystem**, Event-Automatisierung und der Datenschutz-Filter als Musterbeispiel für „verifiziere mit Code".
- **Skills als Apps**, der Plugin-Marktplatz für Firmenwissen.
- **Agenten, die nachts arbeiten**, Claude Code als autonomer Daemon, und die Narben.
- **Ein Cockpit für einen Menschen**, den eigenen Tag mit zehn Agenten orchestrieren.

Das ist keine Zukunftsvision. Das läuft. Und alles, was in dieser Serie folgt, ist ein Narben-Protokoll, die Schutzmaßnahme und der datierte Vorfall dahinter.
