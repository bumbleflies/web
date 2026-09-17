---
title: "Die Fundamente, auf denen alles läuft: Zustand und Interaktion"
description: "Warum ein ganzes KI-Agenten-System über Standard-SaaS-Tools koordiniert statt über eigene Microservices, und was das über robuste Agenten-Architektur verrät."
excerpt: "Das Projektmanagement-Tool ist der dauerhafte Ort, an dem der Zustand liegt und der Auslöser für Automatisierung. Der Team-Chat ist das zweite Fundament: Interaktion und Transport. Agenten koordinieren sich über dauerhafte Artefakte, nicht über direkte Aufrufe."
category: "Architektur"
image: "/images/blog/zwei-ebenen-zustand-und-interaktion.svg"
order: 2
date: 2026-09-15
author: "Chris 🦋 · Founder at bumbleflies / Senior Product Manager at JUNE"
readingTime: "8 Min."
published: true
lang: "DE"
---

Die naheliegende Idee bei autonomen Agenten ist: Sie reden direkt miteinander. Agent A ruft Agent B auf, der schickt etwas an Dienst C. Nach ein paar Wochen hat man ein Geflecht aus Direktaufrufen, das niemand mehr überblickt, das bei jedem Neustart Zustand verliert und das man nicht nachvollziehen kann, wenn nachts etwas schiefgeht.

Wir haben es anders gemacht. Das gesamte Agenten-System, das ich mit meinen Kolleg:innen bei JUNE gebaut habe, einem deutschen Legal-Tech-Unternehmen, koordiniert über **Fundamente aus Standard-Tools**, und fast keine Komponente ruft eine andere direkt auf.

## Fundament 1: das Projektmanagement-Tool als Zustandsfundament

Das erste Fundament ist ClickUp, das Projektmanagement-Tool, in dem JUNE ohnehin arbeitet. Es ist beides zugleich: der **dauerhafte Ort, an dem der Zustand liegt**, und der **Auslöser** für Automatisierung.

Jedes Arbeitselement wird als Ticket geboren oder gegen ein Ticket abgeglichen. Und jede Veränderung an einem Ticket ist ein Ereignis: ein Statuswechsel per Drag-and-Drop, ein neuer Kommentar, ein geändertes Feld. Aus diesen Veränderungen entstehen die Ereignisse, die praktisch jede Automatisierung im Stack auslösen: erstellt, verschoben, kommentiert, aktualisiert. Das Prinzip heißt schlicht: **Veränderung → Aktion.**

Ein paar Details, die aus der Praxis stammen und die zeigen, dass „ein Ticket-Tool als Datenbank benutzen" mehr Disziplin verlangt, als es klingt:

- **Der Kommentar-Befehlsbus.** Kommentare, deren erstes Wort ein festes Steuerwort ist, werden zu Kommandos. Ein Mensch kann sie tippen, ein Agent kann sie posten, und beide sind dauerhaft im Ticket protokolliert. Die gesamte Release-Pipeline wird über diesen einen, auditierbaren Kanal gesteuert, ohne separates Dashboard und ohne versteckte API.

- **Sentinel-Kommentare als Zustand.** Maschinenlesbare Marker in Kommentaren tragen wiederaufnehmbaren Zustand über Sitzungsgrenzen hinweg. Wenn ein Agent mitten in einem mehrstündigen Rollout neu startet, liest er aus diesen Markern, wo er war. Der Zustand lebt im Ticket, nicht im Arbeitsspeicher eines Prozesses.

- **Kein globales „erledigt".** Eine Lektion, die weh tat: Verschiedene Listen benutzen verschiedene Namen für den Abschluss-Status, mal „complete", mal „Closed", mal „resolved". Auf einen hartcodierten Namen kann man deshalb nicht prüfen. Jede Automatisierung fragt pro Liste ab, welcher Status als „geschlossen" gilt.

Der Vorteil: Alles ist für Menschen einsehbar. Wenn ein Agent etwas tut, steht es als Kommentar oder Statuswechsel im Ticket, nicht in einem Log, das niemand liest.

## Fundament 2: der Team-Chat als Interaktionsfundament

Das zweite Fundament ist Microsoft Teams, der Chat, in dem das Team ohnehin kommuniziert. Hier trifft Autonomie auf den Menschen.

Der Chat übernimmt dabei gleich mehrere Aufgaben:

- Er ist der **einzige Auslöser** für die autonomen Agenten. Kein Webhook. Stattdessen ein schlichter, kurz getakteter Poll, der nach einem Triggerwort sucht. Das klingt primitiv, ist aber robust: Es gibt keine Webhook-Registrierung, die kaputtgehen kann, keine offene Schnittstelle nach außen.
- Er ist der Kanal, auf dem Agenten ihren **Status zurückmelden**, direkt im Thread, den der Mensch gerade sieht.
- Er ist der **Agent-zu-Agent-Bus**: ein gemeinsamer Gruppenchat, in dem sich Agenten auf verschiedenen Rechnern registrieren, gegenseitig erwähnen und Fäden hinterlassen.
- Er ist eine **Scan-Quelle** für das persönliche Cockpit.

## Das schwierigste Detail: Identität

Am meisten gelernt habe ich an der Identität, und genau da liegt die Falle für alle, die so etwas nachbauen.

Die Agenten posten über den OAuth-Token eines menschlichen Betreibers. Das heißt: In der Chat-Oberfläche teilen sich Agent und Mensch einen Anzeigenamen. Man kann sich also **niemals auf die `from.user`-Identität verlassen**, um zu erkennen, ob eine Nachricht von einem Menschen oder vom Agenten kam. Die Logik muss sich deshalb an Nachrichten-IDs festmachen: „Diese Antwort habe *ich* gepostet, jene nicht."

Der Agent-zu-Agent-Bus treibt denselben Trick ins Positive: Alle Agenten posten unter *einer* technischen Dienst-Identität, aber der *logische* Absender steht im Nachrichtentext, und eine Erwähnung wie „@planer" verweist technisch auf den Menschen, der diesen Agenten hostet. Eine Identität, viele logische Agenten, und die Benachrichtigung landet trotzdem bei der richtigen Person.

## Warum wir es so gebaut haben

Man könnte all das mit eigenen Services und einer Message-Queue bauen. Ich habe es bewusst nicht getan, aus drei Gründen:

1. **Wiederaufnehmbarkeit.** Zustand, der in einem Ticket-Kommentar lebt, überlebt jeden Neustart, jedes Deployment, jeden Absturz. Ein Agent kann jederzeit dort weitermachen, wo er aufgehört hat, weil der Zustand nicht in seinem Prozess steckt.

2. **Auditierbarkeit.** Jede Koordination ist ein sichtbares Artefakt. Man muss nicht raten, warum ein Agent nachts etwas getan hat; es steht als Kommentar da, mit Zeitstempel.

3. **Menschen und Maschinen sprechen dieselbe Sprache.** Ein Mensch, ein Agent und ein zeitgesteuerter Job benutzen dasselbe Vokabular: dieselben Tickets, dieselben Tags, dieselben Steuerwörter. Es gibt kein „Maschinen-Interface" neben dem „Menschen-Interface".

**Agenten koordinieren sich über dauerhafte, für Menschen einsehbare Artefakte, nicht über direkte Aufrufe.** Nach einem Jahr Produktivbetrieb würde ich es nicht mehr anders bauen. Die Werkzeuge, in denen das Team ohnehin arbeitet, können eine erstaunlich gute Koordinationsschicht sein, wenn man ihre Kanten gut genug kennt, um ihnen zu vertrauen.

Ich weiß auch noch nicht, wo dieser Ansatz an seine Grenze stößt. Der Kommentar-Befehlsbus und die Sentinel-Kommentare laufen seit über einem Jahr, aber beide sind, ehrlich gesagt, Hacks auf einem Tool, das nie als Datenbank gedacht war. Ich werde die Grenze irgendwann finden, ich weiß nur noch nicht, wo sie liegt.

Im nächsten Teil geht es eine Stufe höher: in das Nervensystem, das auf diese Ereignisse reagiert, und in den mehrstufigen Filter, mit dem ich das Sprachmodell ehrlich halte.
