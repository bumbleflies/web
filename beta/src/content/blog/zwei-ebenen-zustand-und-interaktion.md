---
title: "Die zwei Ebenen, auf denen alles läuft: Zustand und Interaktion"
description: "Warum ein ganzes KI-Agenten-System über zwei Standard-SaaS-Tools koordiniert statt über eigene Microservices — und was das über robuste Agenten-Architektur verrät."
excerpt: "Das Projektmanagement-Tool ist der Speicher der Wahrheit und die Zündung. Der Team-Chat ist die Interaktions- und Transportschicht. Agenten koordinieren sich über dauerhafte Artefakte, nicht über direkte Aufrufe."
category: "Architektur"
image: "/images/blog/zwei-ebenen-zustand-und-interaktion.svg"
order: 2
date: 2026-07-12
readingTime: "8 Min."
published: false
---

Wenn man ein System aus autonomen Agenten baut, ist die verführerischste Idee, sie direkt miteinander reden zu lassen. Bot A ruft eine API von Bot B auf, der schickt eine Nachricht an Dienst C. Nach ein paar Wochen hat man ein Geflecht aus Direktaufrufen, das niemand mehr überblickt, das bei jedem Neustart Zustand verliert und das man nicht nachvollziehen kann, wenn nachts etwas schiefgeht.

Wir haben es anders gemacht. Das gesamte Agenten-System eines deutschen Legal-Tech-Unternehmens koordiniert über **zwei Fundament-Ebenen aus Standard-Tools** — und fast keine Komponente ruft eine andere direkt auf.

## Ebene A: das Projektmanagement-Tool als Zustandsebene

Die erste Ebene ist ClickUp — das Projektmanagement-Tool, in dem das Unternehmen ohnehin arbeitet. Es ist zweierlei zugleich: der **dauerhafte Speicher der Wahrheit** und die **Zündung** für Automatisierung.

Jedes Arbeitselement wird als Ticket geboren oder gegen ein Ticket abgeglichen. Und jede Veränderung an einem Ticket ist ein Ereignis: ein Statuswechsel per Drag-and-Drop, ein neuer Kommentar, ein geändertes Feld. Vier solcher Ereignistypen — Ticket erstellt, verschoben, kommentiert, aktualisiert — zünden praktisch jede Automatisierung im ganzen Stack. Das Prinzip heißt schlicht: **Veränderung → Aktion.**

Drei Details, die aus der Praxis stammen und die zeigen, dass „ein Ticket-Tool als Datenbank benutzen" mehr Disziplin verlangt, als es klingt:

- **Der Kommentar-Befehlsbus.** Kommentare, deren erstes Wort ein festes Steuerwort ist, werden zu Kommandos. Ein Mensch kann sie tippen, ein Bot kann sie posten, und beide sind für immer im Ticket protokolliert. Die gesamte Release-Pipeline wird über diesen einen, auditierbaren Kanal gesteuert — kein separates Dashboard, keine versteckte API.

- **Sentinel-Kommentare als Zustand.** Maschinenlesbare Marker in Kommentaren tragen wiederaufnehmbaren Zustand über Sitzungsgrenzen hinweg. Wenn ein Bot mitten in einem mehrstündigen Rollout neu startet, liest er aus diesen Markern, wo er war. Der Zustand lebt im Ticket, nicht im Arbeitsspeicher eines Prozesses.

- **Kein globales „erledigt".** Eine Lektion, die weh tat: Verschiedene Listen benutzen verschiedene Namen für den Abschluss-Status — mal „complete", mal „Closed", mal „resolved". Man kann nicht hart auf einen Namen prüfen. Jede Automatisierung fragt pro Liste ab, welcher Status als „geschlossen" gilt. Solche Kleinigkeiten trennen ein Demo-System von einem, das drei Jahre lang läuft.

Der Vorteil: Alles ist für Menschen einsehbar. Wenn ein Agent etwas tut, steht es als Kommentar oder Statuswechsel im Ticket — nicht in einem Log, das niemand liest.

## Ebene B: der Team-Chat als Interaktionsebene

Die zweite Ebene ist Microsoft Teams — der Chat, in dem das Team ohnehin kommuniziert. Hier trifft Autonomie auf den Menschen.

Der Chat ist gleich vierfach belastet:

- Er ist der **einzige Auslöser** für die autonomen Bots. Kein Webhook — ein schlichter 30-Sekunden-Poll, der nach einem Triggerwort sucht. Das klingt primitiv, ist aber robust: Es gibt keine Webhook-Registrierung, die kaputtgehen kann, keine offene Schnittstelle nach außen.
- Er ist der Kanal, auf dem Bots ihren **Status zurückmelden** — direkt im Thread, den der Mensch gerade sieht.
- Er ist der **Agent-zu-Agent-Bus**: ein gemeinsamer Gruppenchat, in dem sich Agenten auf verschiedenen Rechnern registrieren, gegenseitig erwähnen und Fäden hinterlassen.
- Er ist eine **Scan-Quelle** für das persönliche Cockpit.

## Das schwierigste Detail: Identität

Der lehrreichste Teil dieser Ebene ist die Identität — und er ist zugleich die Warnung an alle, die so etwas nachbauen.

Die Bots posten über den OAuth-Token eines menschlichen Betreibers. Das heißt: In der Chat-Oberfläche teilen sich Bot und Mensch einen Anzeigenamen. Man kann sich also **niemals auf die `from.user`-Identität verlassen**, um zu erkennen, ob eine Nachricht von einem Menschen oder vom Bot kam. Die gesamte Logik muss sich stattdessen an Nachrichten-IDs festmachen: „Diese Antwort habe *ich* gepostet, jene nicht."

Der Agent-zu-Agent-Bus treibt denselben Trick ins Positive: Alle Agenten posten unter *einer* technischen Dienst-Identität, aber der *logische* Absender steht im Nachrichtentext, und eine Erwähnung wie „@planer" verweist technisch auf den Menschen, der diesen Agenten hostet. Eine Identität, viele logische Agenten — und die Benachrichtigung landet trotzdem bei der richtigen Person.

## Warum das die richtige Architektur ist

Man könnte all das mit eigenen Services und einer Message-Queue bauen. Wir haben es bewusst nicht getan — aus drei Gründen, die für jedes Agenten-System gelten:

1. **Wiederaufnehmbarkeit.** Zustand, der in einem Ticket-Kommentar lebt, überlebt jeden Neustart, jedes Deployment, jeden Absturz. Ein Agent kann jederzeit dort weitermachen, wo er aufgehört hat, weil der Zustand nicht in seinem Prozess steckt.

2. **Auditierbarkeit.** Jede Koordination ist ein sichtbares Artefakt. Man muss nicht raten, warum ein Agent nachts etwas getan hat — es steht als Kommentar da, mit Zeitstempel.

3. **Menschen und Maschinen sprechen dieselbe Sprache.** Ein Mensch, ein Bot und ein zeitgesteuerter Job benutzen dasselbe Vokabular: dieselben Tickets, dieselben Tags, dieselben Steuerwörter. Es gibt kein „Maschinen-Interface" neben dem „Menschen-Interface".

Das ist die vielleicht wichtigste Erkenntnis aus einem Jahr Produktivbetrieb: **Koordiniere Agenten über dauerhafte, für Menschen einsehbare Artefakte — nicht über direkte Aufrufe.** Die Werkzeuge, in denen Ihr Team ohnehin arbeitet, sind oft die beste Koordinationsschicht, die Sie haben können. Man muss sie nur ernst genug nehmen, um ihre Kanten zu kennen.

Im nächsten Teil steigen wir eine Ebene höher: in das Nervensystem, das auf diese Ereignisse reagiert — und in den mehrstufigen Filter, mit dem wir das Sprachmodell ehrlich halten.
