---
title: "Zwischenspiel: Von der Anforderung bis zum Livegang an einem Export"
description: "Eine Support-Anfrage über eine fehlende Spalte im Export, vom KI-Assistenten über Ticket und Team-Chat bis zu Test, Rollout und Doku. So tragen die Fundamente aus Teil 02 einen echten Vorgang."
excerpt: "Eine fehlende Spalte im Export wandert vom Support-Chat ins Ticket, durch Anreicherung, Test und Batch-Rollout bis zu Regression und Doku. Einmal konkret, ohne interne Details."
category: "Beispiel"
image: "/images/blog/anforderung-bis-live.svg"
order: 2.5
date: 2026-09-22
author: "Chris 🦋 · Founder at bumbleflies / Senior Product Manager at JUNE"
readingTime: "7 Min."
published: false
lang: "DE"
---

Teil 02 war absichtlich abstrakt: Zustand und Interaktion als Fundamente, ohne ein einziges Beispiel von Anfang bis Ende. Dieses Zwischenspiel holt genau das nach, an einem kleinen, erfundenen, aber typischen Vorgang: Einer Kanzlei fehlt eine Spalte im Mandanten-Export.

Namen, Werkzeuge und Details sind hier bewusst allgemein gehalten. Was zählt, ist der Weg der Anforderung, nicht das jeweilige Produkt dahinter.

<div class="a-arch-diagram" role="img" aria-label="Diagramm: der Weg in sechs Stationen, Anfrage, Ticket, Anreicherung, Test und Rollout, Nachweis, Doku" style="--diagram-dark:url('/images/blog/anforderung-bis-live-journey.svg');--diagram-light:url('/images/blog/anforderung-bis-live-journey-light.svg')"></div>

*Die Nummern im Diagramm folgen den Abschnitten unten. Die Bauzeit dazwischen bleibt bewusst ausgelassen.*

## Morgens: die Anfrage landet im Support-Chat

Die Anfrage beginnt nicht als Ticket, sondern als Gespräch im Support-Chat. Dort antwortet zuerst ein KI-Assistent. Er kennt die häufigsten Fragen zum Export und löst sie direkt im Chat.

Erst wenn er keine belastbare Lösung findet, eskaliert er den Vorgang an unser Team. Das ist eine bewusste Leitplanke: Das Ticket entsteht nur aus einer echten Eskalation, nicht aus jeder Rückfrage.

Hier passiert etwas Wichtiges: Der Chat fängt das Rauschen ab, bevor daraus Arbeit für das Team wird. Das Ticket bleibt für Arbeit reserviert, die wirklich ein Team braucht.

## Wenig später: aus der Eskalation wird ein Ticket

Die Eskalation ist ein Ereignis. Die Automatisierung reagiert darauf und legt genau ein Ticket im Projektmanagement-Tool an, mit der Anfrage, dem bisherigen Chat-Verlauf und einer ersten Einordnung.

Ab diesem Moment gilt das Prinzip aus Teil 02: **Veränderung wird zu Aktion.** Jede Änderung an diesem Ticket, ein Statuswechsel, ein Kommentar, ein geändertes Feld, kann weitere Schritte auslösen.

Der dauerhafte Ort, an dem der Zustand liegt, ist damit zugleich der Auslöser für alles Weitere.

## Vormittags: der Untersuchungs-Bot reichert das Ticket an

Das Team antwortet nicht mit einer Vermutung, sondern bittet den Untersuchungs-Bot im Team-Chat, sich das Ticket anzusehen. Der Bot prüft die vermutete Ursache, sammelt nachvollziehbare Schritte und, falls vorhanden, Fehlerprotokolle ein und schreibt alles als Anreicherung zurück ins Ticket. Danach wandert das Ticket in Richtung Entwicklung.

Mensch und Bot arbeiten dabei mit denselben Artefakten: demselben Ticket, denselben Kommentaren und denselben Markierungen. Es gibt kein separates Maschinen-Interface neben dem Interface für Menschen.

Der Team-Chat ist dabei der Ort, an dem Autonomie auf Menschen trifft: auslösen, Status zurückmelden, alles im selben Faden.

## Mittags: Entwicklung (bewusst ausgelassen)

Wie Entwickler mit ihren KI-Werkzeugen an der Lösung arbeiten, lasse ich hier aus. Das verdient eine eigene Serie und würde hier zu weit führen. Wichtig ist nur der Übergang: Das Ticket gilt erst als bereit für den Test, wenn die Lösung dafür bereitsteht.

## Nachmittags: Test-Bot und Mensch testen gemeinsam

Ein Statuswechsel übergibt das Ticket in den Test. Der Test-Bot startet seinen Durchlauf, während ein Mensch die Ergebnisse mitprüft, und berichtet seine Befunde in einem Unter-Ticket, damit das Haupt-Ticket lesbar bleibt.

Einzelne Tickets gehen nicht einzeln live. Wenn alle Tickets eines Stapels fertig sind, wird der ganze Stapel ausgerollt.

Koordination läuft damit über dauerhafte Artefakte. Wer nachts fragt, warum etwas getestet oder zurückgehalten wurde, findet die Antwort als Kommentar mit Zeitstempel, nicht in einem Log, das niemand liest.

## Nach dem Rollout: Nachweis, Lücken, Doku

Nach dem Rollout laufen drei Dinge parallel an:

1. **Nachweis.** Die volle Regressionsprüfung läuft und belegt, dass alles wie erwartet funktioniert.
2. **Lückenanalyse.** Ein Analyse-Agent identifiziert fehlende Tests und legt dafür Backlog-Items an. In ruhigen Stunden erweitert ein Nacht-Bot daraus die Test-Suite.
3. **Doku.** Weitere Bots aktualisieren die Dokumentation, schneiden ein kurzes Demo-Video und legen Screenshots für die Doku ab.

Niemand ruft dabei jemanden direkt auf. Ticket-Kommentare und Statuswechsel steuern alles, für Menschen einsehbar und nach einem Neustart wiederaufnehmbar.

## Der rote Faden

Der Ablauf lässt sich auf drei Eigenschaften aus Teil 02 zurückführen: Wiederaufnehmbarkeit, Nachvollziehbarkeit und eine gemeinsame Sprache. Diesmal nicht abstrakt, sondern an einem Vorgang entlang: vom Support-Chat über Ticket und Team-Chat bis zu Test, Stapel-Rollout, Regression und Doku.

Die Begriffe dazu stehen in Teil 02. Wie die Automatisierung auf diese Ereignisse reagiert und das Sprachmodell dabei ehrlich hält, zeigt der nächste Teil.
