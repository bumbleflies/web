---
title: "Statt KI zu kaufen: Was ich wirklich gebaut habe"
description: "Nicht „ich habe KI gekauft\", sondern „ich habe meine eigenen Betriebsabläufe in Code übersetzt, den ein Sprachmodell zusammensetzt\". Hier ist die Architektur dahinter."
excerpt: "Mehrere Agenten-Säulen auf gemeinsamen Fundamenten. Autonome Agenten, die Pull-Requests öffnen, ein Skill-Marktplatz für Firmenwissen, ein Cockpit, das den Tag plant. So sieht KI aus, wenn sie nicht in der Demo endet."
category: "Überblick"
image: "/images/blog/ki-agenten-betriebssystem.svg"
order: 1
date: 2026-09-08
author: "Chris 🦋 · Founder at bumbleflies / Senior Product Manager at JUNE"
readingTime: "9 Min."
published: true
lang: "DE"
---

Die häufigste Frage, die mir Leute zum Thema KI stellen, klingt ungefähr so:

> „Gehe ich richtig in der Annahme, dass man Feature-Requests einfach textuell eingibt, und dann laufen Agents los, implementieren das, machen Pull-Requests? Ich habe die romantische Vorstellung, dass ihr da einen aktuellen Schatz habt."

Das ist ein echtes Zitat aus einer Kundenanfrage. Und die ehrliche Antwort lautet: Ja, genau das haben wir gebaut, meine Kolleg:innen und ich bei JUNE, einem deutschen Legal-Tech-Unternehmen, wo ich es bis heute im Arbeitsalltag betreibe. Bei bumbleflies berate ich andere Unternehmen zu KI. Diese Serie ist deshalb mein persönlicher Erfahrungsbericht aus JUNE, kein bumbleflies-Kundenprojekt.

Diese Artikelserie beschreibt das System: wie es aufgebaut ist, welche Entscheidungen ich getroffen habe und vor allem die Lektionen. Fast jede Leitplanke darin lässt sich auf eine konkrete Erfahrung im Betrieb zurückführen.

## Der Kern: keine gekaufte KI, sondern kompilierte Betriebsabläufe

Ich habe keine KI-Lösung *eingekauft*. Ich habe die **operativen Verfahren von JUNE in Code übersetzt, den ein Sprachmodell zusammensetzt.**

Der Unterschied liegt tief. Ein generischer KI-Assistent kennt deine Deployment-Pipeline, Ticket-Konventionen und Freigabe-Regeln nicht automatisch. Er muss sie aus Kontext ableiten. Ein System, das diese Verfahren als versionierten, testbaren Code kennt, kann sie deterministisch ausführen. Das Sprachmodell trifft die Urteilsentscheidungen; deterministische Skripte führen die Mechanik aus.

Daraus ist das System entstanden, das heute meinen Arbeitsalltag trägt.

## Die Architektur: Fundamente und Säulen

<div class="a-arch-diagram" role="img" aria-label="Diagramm: die Fundamente Zustand und Interaktion tragen die Agenten-Säulen Nervensystem, Skill-Marktplatz, Agenten, Cockpit" style="--diagram-dark:url('/images/blog/ki-agenten-betriebssystem-architecture.svg');--diagram-light:url('/images/blog/ki-agenten-betriebssystem-architecture-light.svg')"></div>

Das mentale Modell besteht aus **Fundamenten** und den **Säulen**, die darauf stehen.

**Fundament 1, der Zustand.** Das Projektmanagement-Tool. Bei JUNE ist das ClickUp. Jede Arbeit wird als Ticket geboren oder gegen ein Ticket abgeglichen. Ein Statuswechsel, ein neuer Kommentar, ein geändertes Feld: jedes ist ein Ereignis, das Aktionen auslöst. Das Ticket ist damit zugleich der dauerhafte Zustand und der Auslöser für weitere Aktionen.

**Fundament 2, die Interaktion.** Der Team-Chat (Microsoft Teams). Hier trifft Autonomie auf Menschen: Hier lösen Menschen Agenten aus, hier melden Agenten ihren Status zurück, und hier koordinieren sich Agenten untereinander.

Darauf stehen die Säulen:

- **Säule 1, das Nervensystem.** Eine Automatisierungsplattform (n8n) reagiert auf Ereignisse aus Fundament 1 (dem Zustand) und steuert Fundament 2 (die Interaktion) sowie andere Systeme. Kein Mensch in der Schleife. Viele Workflows, eine Menge Verarbeitungsschritte. Hier entsteht z. B. aus einer Support-E-Mail automatisch ein klassifiziertes Ticket, doppelte Meldungen werden dabei zusammengeführt.

- **Säule 2, der Skill-Marktplatz.** Das Firmenwissen als installierbare, versionierte „Apps". Viele Plugins, noch mehr Skills. Jeder Skill ist die Kombination aus Modell-Urteil und deterministischem Skript, und funktioniert identisch für einen Menschen am Laptop, einen Agenten im Container und die CI-Pipeline.

- **Säule 3, die autonomen Agenten.** Claude Code, das rund um die Uhr als Daemon läuft. Diese Serie nennt jeden KI-Prozess, der eine Rolle ausfüllt, einheitlich „Agent", auch die, die ohne Zutun autonom laufen. Ein Wort im Team-Chat weckt einen Agenten; er implementiert Code, öffnet Pull-Requests, adressiert Review-Kommentare, rollt Hotfixes aus und meldet sich zurück. Mehrere Personas aus *einem* gemeinsamen Bausatz.

- **Säule 4, das persönliche Cockpit.** Ein Meta-Agent, der viele Quellen parallel scannt und daraus den Tag eines Menschen plant. Er liest beide Fundamente und sogar die eigene Gesprächshistorie der KI, um offene Fäden wiederzufinden.

## Wie die Komponenten zusammenspielen

Das sind keine getrennten Projekte. Sie koordinieren sich über die Fundamente: Chat-Nachrichten lösen Aktionen aus, Tickets und Kommentare transportieren Zustand und Kontext. Die Komponenten müssen sich deshalb nicht direkt aufrufen.

Ein durchgängiger Ablauf, wie er täglich passiert:

1. Ein Kunde schreibt an den Support. Das Nervensystem erzeugt daraus automatisch ein klassifiziertes Ticket. Sobald ein Pull-Request das Ticket adressiert, verweisen beide aufeinander.
2. Jemand tippt im Team-Chat ein Triggerwort. Der Agent wacht auf, sichtet die Pull-Requests, die zu offenen Tickets gehören, und triagiert sie.
3. Nach expliziter menschlicher Freigabe rollt der Agent aus, erst die Datenbank-Migrationen, dann die Services.
4. Der Agent hinterlässt einen Kommentar am zugehörigen Ticket; das Nervensystem generiert daraus automatisch die kundensichtbaren Release-Notes, durch einen mehrstufigen Datenschutz-Filter.
5. Am nächsten Morgen taucht der gesamte Vorgang im Tagesbriefing des Cockpits auf, zusammengeführt mit den Tickets, damit nichts doppelt auftaucht.

Mehrere Säulen, ein Arbeitsvorgang. Kein einziger Direktaufruf zwischen den Komponenten.

## Die wiederkehrenden Prinzipien

Über alle Säulen hinweg tauchen dieselben Entwurfsprinzipien auf:

**Vertraue dem Modell nicht, verifiziere mit Code.** Die durchgängige Antwort auf „Wie macht man ein Sprachmodell in Produktion sicher?" lautet: eine deterministische Grenze drumherum ziehen. Das Modell schreibt, ein Regex-Filter prüft, das Modell korrigiert, derselbe Filter prüft erneut, und blockiert im Zweifel.

**Lektionen als Design.** Fast jede Leitplanke geht auf eine konkrete Erfahrung zurück: eine Nacht, in der ein Agent im Leerlauf Tokens verbrannte, eine Regression bei der Terminbuchung, eine defekte Konfiguration auf einem Netzlaufwerk. Die Systeme wachsen, indem sie ihre eigenen Fehler in Regeln gießen.

**Koordination über dauerhafte Artefakte, nicht über RPC.** Agenten und Menschen sprechen über Tickets, Tags, Status und Chat-Nachrichten miteinander, nachvollziehbar, wiederaufnehmbar, für Menschen einsehbar.

**Eine Definition, viele Laufzeiten.** Derselbe Skill läuft identisch für einen Menschen am Laptop, einen Agenten im Container und die CI-Pipeline. Ein Skript, keine drei. Kein Copy-Paste.

**Mensch am Bremshebel.** Deutschsprachige Trigger, eine Rechts-Domäne und vor allem: Alle wirklich folgenreichen Aktionen (Freigaben, Merges, Produktiv-Deployments) brauchen eine explizite menschliche Bestätigung. Autonomie mit der Hand am Hebel.

Das alles ist der aktuelle Zustand eines laufenden Systems, mit allen Lektionen, die darin stecken, und manche Entscheidungen darin sind mir bis heute nicht ganz geheuer.

## Was in dieser Serie kommt

Die nächsten Artikel nehmen jeweils ein Fundament oder eine Säule genauer auseinander:

- **Die Fundamente**: warum ich den Stack über Standard-SaaS-Tools koordiniere statt über eigene Services.
- **Das Nervensystem**: Event-Automatisierung und der Datenschutz-Filter.
- **Skills als Apps**: wie Firmenwissen als installierbare Skills funktioniert.
- **Die Agenten**: Claude Code als autonomer Daemon, und was dabei schiefging.
- **Das Cockpit**: wie ein ganzer Fächer von Agenten meinen Arbeitstag zusammenfasst.

Das ist keine Zukunftsvision. Das läuft. Jeder folgende Artikel zeigt deshalb nicht nur eine Komponente, sondern auch die Leitplanken dahinter und die Erfahrung, die zu ihnen geführt hat.
