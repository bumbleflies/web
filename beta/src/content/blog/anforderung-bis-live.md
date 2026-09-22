---
title: "Zwischenspiel: Von der Anforderung bis zum Livegang an einem Export"
description: "Eine Support-Anfrage über eine fehlende Spalte im Export, vom KI-Assistenten über Ticket und Team-Chat bis zu Test, Rollout und Doku. So tragen die Fundamente aus Teil 02 einen echten Vorgang."
excerpt: "Eine fehlende Spalte im Export wandert vom Support-Chat ins Ticket, durch Anreicherung, Test und Batch-Rollout bis zu Regression und Doku. Einmal konkret, ohne interne Details."
category: "Beispiel"
image: "/images/blog/anforderung-bis-live.svg"
order: 2.5
date: 2026-09-22
author: "Chris 🦋 · Founder at bumbleflies / Senior Product Manager at JUNE"
readingTime: "11 Min."
published: true
lang: "DE"
---

Teil 02 war absichtlich abstrakt: Zustand und Interaktion als Fundamente, ohne ein einziges Beispiel von Anfang bis Ende. Dieses Zwischenspiel holt genau das nach, an einem kleinen, erfundenen, aber typischen Vorgang: Einer Kanzlei fehlt eine Spalte im Mandanten-Export.

Namen, Werkzeuge und Details sind hier bewusst allgemein gehalten. Was zählt, ist der Weg der Anforderung, nicht das jeweilige Produkt dahinter.

<div class="a-arch-diagram" role="img" aria-label="Diagramm: der Weg in sechs Stationen, Anfrage, Ticket, Anreicherung, Test und Rollout, Nachweis, Doku" style="--diagram-dark:url('/images/blog/anforderung-bis-live-journey.svg');--diagram-light:url('/images/blog/anforderung-bis-live-journey-light.svg')"></div>

*Die Nummern im Diagramm folgen den Abschnitten unten. Die Bauzeit dazwischen bleibt bewusst ausgelassen.*

## Morgens: die Anfrage landet im Support-Chat

Die Anfrage beginnt nicht als Ticket, sondern als Gespräch im Support-Chat. Dort antwortet zuerst ein KI-Assistent. Er kennt die häufigsten Fragen zum Export und löst sie direkt im Chat.

In unserem Beispiel fragt der Assistent zuerst nach: Welcher Export, welche Spalte, und was genau soll darin stehen? Dann prüft er, ob die Spalte nur ausgeblendet ist oder sich über eine Einstellung zuschalten lässt. Beides ist häufig, und beides wäre in wenigen Nachrichten erledigt. Hier greift keins davon: Die Spalte gibt es im Export schlicht nicht.

Erst wenn er keine belastbare Lösung findet, eskaliert er den Vorgang an unser Team. Das ist eine bewusste Grenze: Das Ticket entsteht nur aus einer echten Eskalation, nicht aus jeder Rückfrage.

Zur Eskalation gehört eine Übergabe, kein bloßes Weiterleiten. Der Assistent fasst zusammen, was die Kanzlei wollte, was er versucht hat und warum es nicht gereicht hat. Und er sagt der Kanzlei offen, dass jetzt ein Mensch übernimmt, statt eine Lösung zu versprechen, die er nicht hat.

Hier passiert etwas Wichtiges: Der Chat fängt das Rauschen ab, bevor daraus Arbeit für das Team wird. Das Ticket bleibt für Arbeit reserviert, die wirklich ein Team braucht.

## Wenig später: aus der Eskalation wird ein Ticket

Die Eskalation ist ein Ereignis. Die Automatisierung reagiert darauf und legt genau ein Ticket im Projektmanagement-Tool an, mit der Anfrage, dem bisherigen Chat-Verlauf und einer ersten Einordnung.

„Genau ein" ist dabei wörtlich gemeint. Ereignisse kommen gelegentlich doppelt an, etwa wenn eine Zustellung wiederholt wird. Die Automatisierung prüft deshalb zuerst, ob es zu diesem Gespräch schon ein Ticket gibt, und ergänzt es in dem Fall, statt ein zweites anzulegen. Ein Vorgang, zwei Tickets: Genau das wäre der Anfang eines Durcheinanders, das später niemand mehr auflöst.

Die erste Einordnung ist ein Vorschlag, keine Entscheidung. Fehlt die Spalte, weil etwas kaputt ist, oder weil sie nie vorgesehen war? Ist es ein Fehler, ein Wunsch oder eine Konfigurationsfrage? Das entscheidet ein Mensch, und die Entscheidung steht danach sichtbar im Ticket. Das Ticket selbst folgt einer festen Gliederung: was erwartet wurde, was tatsächlich passiert, welcher Bereich betroffen ist und was es für die Kanzlei bedeutet.

Ab diesem Moment gilt das Prinzip aus Teil 02: **Veränderung wird zu Aktion.** Jede Änderung an diesem Ticket, ein Statuswechsel, ein Kommentar, ein geändertes Feld, kann weitere Schritte auslösen.

Der dauerhafte Ort, an dem der Zustand liegt, ist damit zugleich der Auslöser für alles Weitere.

## Vormittags: der Untersuchungs-Bot reichert das Ticket an

Das Team antwortet nicht mit einer Vermutung, sondern bittet den Untersuchungs-Bot im Team-Chat, sich das Ticket anzusehen. Der Bot prüft die vermutete Ursache, sammelt nachvollziehbare Schritte und, falls vorhanden, Fehlerprotokolle ein und schreibt alles als Anreicherung zurück ins Ticket. Danach wandert das Ticket in Richtung Entwicklung.

Die Bitte selbst ist unspektakulär: eine kurze Nachricht im Team-Chat, mit Verweis auf das Ticket. Der Bot bestätigt im selben Faden, dass er übernommen hat, und meldet sich dort wieder, wenn er fertig ist. Die eigentliche Arbeit landet im Ticket, im Chat steht nur, dass und wo.

Was er zurückschreibt, hat eine feste Form:

- **Reproduktion.** Die Schritte, mit denen sich das Verhalten auf einer Testumgebung nachstellen lässt, mit Beispieldaten statt Kundendaten.
- **Betroffener Bereich.** Wo im System der Export entsteht und an welcher Stelle die Spalte fehlt.
- **Verwandte Vorgänge.** Frühere Tickets, die dasselbe Thema berühren, damit niemand dieselbe Frage zweimal löst.
- **Hypothesen, getrennt von Befunden.** Was der Bot belegt hat, steht in einem Abschnitt; was er nur vermutet, steht klar markiert in einem anderen. Eine Vermutung, die wie ein Befund klingt, kostet später mehr Zeit als gar keine.

In unserem Beispiel ist der Befund klar: Das Feld existiert im System, wird aber in diesem Export nie mit ausgegeben. Kein Konfigurationsproblem, eine echte Lücke. Der Bot arbeitet dabei nur lesend. Ob daraus Entwicklungsarbeit wird, entscheidet ein Mensch.

Mensch und Bot arbeiten dabei mit denselben Artefakten: demselben Ticket, denselben Kommentaren und denselben Markierungen. Es gibt kein separates Maschinen-Interface neben dem Interface für Menschen.

Der Team-Chat ist dabei der Ort, an dem Autonomie auf Menschen trifft: auslösen, Status zurückmelden, alles im selben Faden.

## Mittags: Entwicklung (bewusst ausgelassen)

Wie Entwickler mit ihren KI-Werkzeugen an der Lösung arbeiten, lasse ich hier aus. Das verdient eine eigene Serie und würde hier zu weit führen. Wichtig ist nur der Übergang: Das Ticket gilt erst als bereit für den Test, wenn die Lösung dafür bereitsteht.

Zum Übergang gehört eine Testbeschreibung, die die Entwicklung ins Ticket schreibt: was sich geändert hat, wie man es prüft und welche benachbarten Bereiche es berühren könnte. Sie ist kein Formular zum Abhaken. Sie ist die wichtigste Eingabe für den nächsten Schritt, denn genau daraus leitet der Test-Bot ab, was er prüft.

## Nachmittags: Test-Bot und Mensch testen gemeinsam

Ein Statuswechsel übergibt das Ticket in den Test. Der Test-Bot startet seinen Durchlauf, während ein Mensch die Ergebnisse mitprüft, und berichtet seine Befunde in einem Unter-Ticket, damit das Haupt-Ticket lesbar bleibt.

Der Durchlauf folgt einem festen Ablauf:

- **Testplan.** Der Bot leitet ihn aus drei Quellen ab: den Akzeptanzkriterien, der Testbeschreibung aus der Entwicklung und der Änderung selbst. Im Beispiel heißt das: Die Spalte ist da, sie ist korrekt befüllt, sie ist leer, wo es keinen Wert gibt, und die übrigen Spalten sehen aus wie vorher.
- **Zwei Arten von Fällen.** Was sich über die Schnittstelle prüfen lässt, prüft der Bot automatisch. Was man nur in der Oberfläche sieht, klickt er durch und zeichnet es als kurzes Video auf.
- **Der Mensch entscheidet, was der Bot nicht beurteilen kann.** Ob ein Video wirklich zeigt, was es zeigen soll, entscheidet ein Mensch. Ein Bot, der seine eigene Aufnahme für bestanden erklärt, prüft am Ende nur sich selbst.
- **Jeder Fehlschlag wird ein eigenes Fehler-Ticket.** Geschrieben aus Sicht der Person, die den Fehler meldet: was sie getan hat, in welcher Reihenfolge und was ihr aufgefallen wäre. Vermutungen über die Ursache stehen in einem eigenen, markierten Abschnitt.

Das Unter-Ticket trägt den Plan als Tabelle, mit einem Status pro Fall. Geht das Ticket nach einer Korrektur erneut in den Test, schreibt der Bot in dasselbe Unter-Ticket weiter, statt ein zweites anzulegen. Ein Marker im Unter-Ticket zeigt dem Bot, welches Unter-Ticket er wiederverwenden soll.

Einzelne Tickets gehen nicht einzeln live. Wenn alle Tickets eines Stapels fertig sind, wird der ganze Stapel ausgerollt.

Ein Ticket, das im Test hängt, hält den Stapel entweder auf oder wird bewusst herausgenommen. Diese Entscheidung trifft ein Mensch, und auch sie steht im Ticket. Vor dem Rollout geht eine Vorankündigung an die Kunden, die es betrifft.

Koordination läuft damit über dauerhafte Artefakte. Wer nachts fragt, warum etwas getestet oder zurückgehalten wurde, findet die Antwort als Kommentar mit Zeitstempel, nicht in einem Log, das niemand liest.

## Nach dem Rollout: Nachweis, Lücken, Doku

Nach dem Rollout laufen drei Dinge parallel an:

1. **Nachweis.** Die volle Regressionsprüfung läuft und belegt, dass alles wie erwartet funktioniert. Bekannte Fehler, deren Korrektur noch unterwegs ist, sind darin ausdrücklich als erwartet markiert, jeweils mit Begründung. Sobald die Korrektur live ist, fällt das auf, und ein Bot schlägt vor, die Markierung zu entfernen.
2. **Lückenanalyse.** Ein Analyse-Agent identifiziert fehlende Tests und legt dafür Backlog-Items an. Jedes Item beschreibt ein Verhalten, das bisher kein Test absichert, zum Beispiel: Die neue Spalte bleibt bei einem Export ohne Werte leer, statt den Export abbrechen zu lassen. In ruhigen Stunden erweitert ein Nacht-Bot daraus die Test-Suite, als Änderungsvorschlag und nicht als stille Änderung.
3. **Doku.** Weitere Bots aktualisieren die Dokumentation, schneiden ein kurzes Demo-Video und legen Screenshots für die Doku ab. Das alles entsteht in beiden Sprachen und auf einer Demo-Umgebung mit erfundenen Daten. Die Vorbereitung passiert außerhalb des Bildes, das Video zeigt nur die neue Spalte.

Und der Kreis schließt sich dort, wo er begann: Die Kanzlei aus dem Support-Chat erfährt, dass die Spalte da ist.

Niemand ruft dabei jemanden direkt auf. Ticket-Kommentare und Statuswechsel steuern alles, für Menschen einsehbar und nach einem Neustart wiederaufnehmbar.

## Wo es hakt, und wie wir es merken

Der Ablauf oben zeigt den Normalfall. Interessant wird es dort, wo etwas schiefläuft:

- **Doppelte Ereignisse.** Ereignisse kommen manchmal doppelt an. Jeder Schritt prüft deshalb zuerst, ob er schon gelaufen ist, bevor er etwas anlegt.
- **Der Bot, der nicht weiterkommt.** Auch Bots bleiben hängen, etwa weil eine Anmeldung abgelaufen ist oder ein angebundenes System nicht antwortet. Dafür gibt es im Team-Chat einen eigenen Bot-Kanal. Dort meldet der Bot, was ihn blockiert, statt still zu scheitern, und ein Mensch räumt das Hindernis aus dem Weg. Danach macht der Bot weiter, wo er stand, weil sein Zustand im Ticket liegt und nicht in ihm.
- **Die Markierung, die verdeckt.** Ein als erwartet markierter Fehlschlag kann einen neuen Fehler an derselben Stelle verstecken. Jede Markierung braucht deshalb eine konkrete Begründung.

Nichts davon ist ungewöhnlich. Entscheidend ist, dass ein Problem dort sichtbar wird, wo ein Mensch es sieht.

## Der rote Faden

Der Ablauf lässt sich auf drei Eigenschaften aus Teil 02 zurückführen: Wiederaufnehmbarkeit, Nachvollziehbarkeit und eine gemeinsame Sprache. Diesmal nicht abstrakt, sondern an einem Vorgang entlang: vom Support-Chat über Ticket und Team-Chat bis zu Test, Stapel-Rollout, Regression und Doku.

Die Begriffe dazu stehen in Teil 02. Wie die Automatisierung auf diese Ereignisse reagiert und das Sprachmodell dabei ehrlich hält, zeigt der nächste Teil.
