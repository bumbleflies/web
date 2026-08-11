---
title: "A Cockpit for One Human: Orchestrating Your Day with Ten Agents"
description: "Ten parallel scanners turning email, chat, tickets, calendar, and even your own AI history into a prioritized daily plan — with two promises: nothing gets lost, nothing gets stuck."
excerpt: "The personal side of the stack. A meta-agent that scans ten sources, reconciles every loose thread against tickets, and makes every task one message away from being done."
category: "Productivity"
image: "/images/blog/cockpit-tag-mit-zehn-agenten.svg"
order: 6
date: 2026-07-25
readingTime: "8 min"
published: false
lang: "EN"
---

The previous articles were about systems that work for many: the nervous system, the marketplace, the autonomous bots. This final part turns the perspective around. It's about a single human and the question every knowledge worker has every morning: *what's actually important today — and what did I forget?*

The answer is a personal meta-agent we call the "cockpit". It pulls together every work context — email, chat, tickets, video calls, support inbox, calendar, activity log, local directories, the agent bus — and turns it into a prioritized daily plan and *one* next action.

## Two promises carry the entire design

Everything about the cockpit follows from two commitments:

1. **Nothing gets lost.** Every loose thread from every source is reconciled against tickets — and if it's not captured anywhere, routed to an inbox ticket.
2. **Nothing gets stuck.** Every surfaced task comes with a ready-to-paste continuation command, so it's "one message away from being done".

These two sentences sound simple. Their implementation is the actual engineering art.

## Ten scanners, parallel, that never fail

The heart is a fan of ten **scanners** — one per source, all started simultaneously. Each scanner gets the same assignment and must return a strictly structured JSON result.

The most important rule: a scanner **never fails.** If a source is unreachable, it doesn't return an error but a clean "not available, reason: …". This way a dead source can never abort the entire run. It's the same fault tolerance philosophy as in the nervous system: the system degrades gracefully instead of crashing.

And because the structured result is strictly validated before anything trusts it, a single scanner that hallucinates or delivers garbage can't poison the plan. **Don't trust the model — verify with code**, here too.

## The scanner that reads its own AI history

One detail sets the cockpit apart. One of the ten scanners reads the **conversation history of Claude Code itself** — the logs of the human's AI sessions. Why? Because commitments live there that you've made orally to the AI ("I'll do X later"), open questions, started work steps. The scanner brings these in-progress commitments back to the surface so they don't sink in the session history.

An agent reflecting on a human's work with other agents — that's perhaps the most unexpected, but logical, consequence of a system where human and AI constantly collaborate.

## "Read doesn't mean done"

My favorite rule in the cockpit, like so much in the system, comes from a real incident. The email scanner lists not just unread but also *read* emails. Because: **read doesn't mean done.** A read email where the other party last wrote and that contains a request or a delivery is still open work.

Behind it is a concrete regression: a sample email, read on a Monday, but only manually noticed two days later — because "read" was wrongly treated as "done". The rule is the scar of those two lost days. Exactly such rules make the difference between an assistant that impresses and one you trust.

## Blocked, waiting, next

The cockpit cleanly distinguishes three states that most people mix up in their heads:

- **Blocked** — missing access, data, or a prerequisite. May be high priority, but can never be "next" up.
- **Waiting** — we still owe follow-up, but someone else must act first.
- **Next action** — the single highest-scored thread that is *neither* blocked *nor* waiting.

This distinction is why the "next action" is always genuinely doable. A blocked point doesn't push itself up as a to-do you can't tackle anyway.

## DRY, even here

The cockpit also follows the "one definition, many runtimes" principle. It shares a configuration and a common store with a lighter sibling skill available in every project. And its scanners call the same communication skills from the marketplace that the bots use. The cockpit isn't a solo piece — it sits on the same foundation as the rest of the system and reads the same two levels.

## The circle closes

This closes the circle of this series. We started with the two foundation levels, went through the nervous system and the skill marketplace to the autonomous bots — and land on a single human whose day is orchestrated by ten agents, all speaking the same language.

That's the actual point: it's *one* system. A human, a bot, and a scheduled job use the same vocabulary, the same tickets, the same skills. Not because it looks elegant, but because only that turns individual AI tricks into an operating system that carries.

And that's exactly what we're building. Not the demo that impresses. The system that runs — day and night, with a hand on the brake lever. If you have the romantic notion that there's a treasure out there: you're right. Let's talk about what it looks like in your company.
