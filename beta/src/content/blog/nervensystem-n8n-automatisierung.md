---
title: "Das Nervensystem: Event-Automatisierung, und wie man ein Sprachmodell ehrlich hält"
description: "Wie ein always-on Automatisierungslayer aus Support-Mails klassifizierte Tickets macht, und der mehrstufige Datenschutz-Filter, der das beste Beispiel für 'vertraue dem Modell nicht, verifiziere mit Code' ist."
excerpt: "24 Workflows, knapp 700 Verarbeitungsschritte, kein Mensch in der Schleife. Ein selbstlernender Ticket-Router und ein Datenschutz-Filter, der das Sprachmodell schreiben lässt, aber ihm kein Wort glaubt."
category: "Automatisierung"
image: "/images/blog/nervensystem-n8n-automatisierung.svg"
order: 3
date: 2026-07-15
author: "Chris 🦋 | Founder at bumbleflies / Senior Product Manager at JUNE"
readingTime: "9 Min."
published: false
lang: "DE"
---

Wenn die zwei Fundament-Ebenen, Tickets und Chat, das Skelett des Systems sind, dann ist die Automatisierungsschicht das Nervensystem: immer wach, ereignisgetrieben, ohne Menschen in der Schleife. Sie reagiert auf jede Veränderung an einem Ticket und steuert daraus die anderen Systeme.

Ich habe diese Schicht bei JUNE mit n8n gebaut, einer Open-Source-Automatisierungsplattform. 24 Workflows, knapp 700 Verarbeitungsschritte. Sie verwandelt eine Support-Mail in ein klassifiziertes Ticket, ein Call-Recording in eine strukturierte Aufgabenliste, einen Kommentar in fertige Release-Notes. Zwei dieser Workflows verdienen einen genaueren Blick, weil sie zwei Prinzipien verkörpern, die für jedes KI-System gelten.

## Erstens: der Code ist die Wahrheit, nicht die Handarbeit

Die prägende Entscheidung dieser Schicht: Für jeden nicht-trivialen Workflow ist die exportierte Konfiguration zwar die Quelle der Wahrheit, aber sie wird nicht von Hand geschrieben. Ein kleines Python-Skript *erzeugt* sie.

Warum? Weil das Hand-Editieren großer Workflow-Definitionen immer wieder dieselben Fehler produziert: falsche Knoten-IDs, kaputte Verbindungs-Arrays, Typ-Verwechslungen. Ein Generator-Skript macht diese Fehler nicht. Beide, Generator und erzeugte Konfiguration, liegen im Git. Das ist dieselbe Philosophie, die den ganzen Stack durchzieht: **Wo etwas deterministisch sein kann, soll es ein Skript sein.**

## Zweitens: ein Router, der aus menschlichen Korrekturen lernt

Der Support-Workflow ist ein selbstverbessernder Kreislauf aus zwei Teilen.

Der erste Teil fängt jede neue Support-Konversation ab und legt daraus ein Ticket an. Dann klassifiziert ein Sprachmodell das Ticket: In welche Liste gehört es? Die Klassifikation läuft als **Few-Shot-Prompt**, das Modell bekommt Beispiele vergangener Tickets mit der Liste, in die sie einsortiert wurden. Ist es sich zu mehr als 75 % sicher, verschiebt es das Ticket automatisch. Ist es unsicher, bleibt das Ticket im Eingang liegen.

Der zweite Teil schließt den Kreis: Immer wenn ein *Mensch* ein Ticket manuell aus dem Eingang verschiebt, wird genau diese Korrektur als neues Beispiel gespeichert. Die Trainingsdaten des Routers *sind* das Protokoll der menschlichen Korrekturen. Es gibt keinen separaten Labeling-Schritt. Am ersten Tag, mit leerer Beispiel-Tabelle, überspringt das System das Modell einfach und lässt alles im Eingang, und lernt ab der ersten manuellen Verschiebung.

**Die beste Trainingsquelle für Ihre KI ist die tägliche Korrektur durch Ihr Team.** Man muss sie nur einfangen.

Eine Zahl darin ist ehrliches Raten: die 75-%-Schwelle. Ich habe sie nach Gefühl gewählt, nicht durch Tuning. Bisher hat sie gehalten, ob 75 richtig ist oder nur Glück, weiß ich bis heute nicht.

Und das Ganze ist an jeder Verzweigung fehlertolerant entworfen: Schlägt die Klassifikation fehl, wurde das Ticket ja bereits im Eingang angelegt, ein sicherer Rückfall. Nichts geht verloren, nur weil das Modell mal patzt.

## Das Musterbeispiel: der Datenschutz-Filter

Jetzt zum wichtigsten Baustein, dem, den ich jedem zeige, der fragt, wie man ein Sprachmodell in Produktion sicher macht.

JUNE generiert kundensichtbare Release-Notes automatisch aus internen Tickets. Diese Notes sind **für jeden Mandanten öffentlich sichtbar**. Ein Ticket kann aber Mandantennamen, Personennamen, E-Mail-Adressen, Fall-IDs enthalten. Ein Sprachmodell, das aus so einem Ticket eine Release-Note schreibt, könnte diese Daten durchlassen. Das darf nie passieren.

Die naive Lösung wäre: dem Modell im Prompt sagen „nenne keine Namen". Ich tue das auch, der Prompt enthält ein hartes Verbot mit Beispielen. **Aber ich vertraue dem Prompt nicht.** Der Ablauf ist ein Verteidigungswall in Tiefe:

1. **Das Modell schreibt** die Release-Note, mit der Anweisung, alles zu generalisieren.
2. **Ein deterministischer Filter prüft** das Ergebnis nach: Regex-Suchen nach E-Mails, URLs, Telefonnummern, IDs. Plus eine Heuristik, die groß geschriebene Wörter außerhalb des Satzanfangs, die nicht auf einer kleinen Erlaubnisliste stehen, als wahrscheinliche Namen markiert.
3. **Ist der Filter ausgelöst, redigiert ein zweites Modell** die markierten Stellen, es soll jeden markierten Begriff entfernen oder verallgemeinern.
4. **Derselbe Filter läuft ein zweites Mal.**
5. **Löst er *immer noch* aus, verweigert der Workflow hart** und postet stattdessen einen Kommentar: „Sanitizer konnte sensible Inhalte nicht entfernen, bitte manuell umschreiben."

Der Kern in einem Satz: **Modell schreibt → Code prüft → Modell korrigiert → Code prüft erneut → im Zweifel harte Verweigerung.** Das Sprachmodell wird eingesetzt, wo es glänzt (flüssig formulieren, verallgemeinern), aber der eingezäunte Bereich ist eng, und die Grenze ist deterministischer Code, kein weiteres Modell.

Der Filter-Code ist übrigens bewusst an zwei Stellen wortgleich dupliziert, mit dem Kommentar „halte diesen Block mit dem anderen synchron". Manchmal ist Redundanz die richtige Entscheidung.

## Der rote Faden

Der Router wird aus menschlichen Korrekturen klüger; der Filter glaubt dem Modell kein einziges Wort. Diese zwei Muster sind die ganze Schicht, und genau das lässt sie die ganze Nacht ohne Menschen in der Schleife laufen.

Im nächsten Teil geht es um die Schicht darüber: den Marktplatz, der Firmenwissen in installierbare Skills verpackt, die „Apps", die Menschen *und* Bots benutzen.
