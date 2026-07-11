---
title: "The Two Levels Everything Runs On: State and Interaction"
description: "Why an entire AI agent system coordinates through two standard SaaS tools rather than custom microservices — and what that reveals about robust agent architecture."
excerpt: "The project management tool is the storage of truth and the ignition. The team chat is the interaction and transport layer. Agents coordinate through persistent artifacts, not direct calls."
category: "Architecture"
image: "/images/blog/zwei-ebenen-zustand-und-interaktion.svg"
order: 2
date: 2026-07-12
readingTime: "8 min"
published: false
---

When you build a system of autonomous agents, the most tempting idea is to have them talk directly to each other. Bot A calls an API from Bot B, which sends a message to Service C. After a few weeks, you have a web of direct calls that nobody can keep track of, that loses state on every restart, and that you can't trace when something goes wrong at night.

We did it differently. The entire agent system of a German legal-tech company coordinates through **two foundation levels made of standard tools** — and almost no component calls another directly.

## Level A: the project management tool as the state level

The first level is ClickUp — the project management tool the company already works in. It serves two purposes: **persistent storage of truth** and **ignition** for automation.

Every work item is born as a ticket or reconciled against a ticket. And every change to a ticket is an event: a drag-and-drop status change, a new comment, a modified field. Four event types — ticket created, moved, commented, updated — trigger practically every automation in the entire stack. The principle is simply: **change → action.**

Three details from practice that show "using a ticket tool as a database" takes more discipline than it sounds:

- **The comment command bus.** Comments whose first word is a fixed control word become commands. A human can type them, a bot can post them, and both are forever logged in the ticket. The entire release pipeline is controlled through this one, auditable channel — no separate dashboard, no hidden API.

- **Sentinel comments as state.** Machine-readable markers in comments carry resumable state across session boundaries. When a bot restarts mid-way through a multi-hour rollout, it reads from these markers to know where it was. The state lives in the ticket, not in a process's memory.

- **No global "done".** A lesson that hurt: different lists use different names for completion status — sometimes "complete", sometimes "Closed", sometimes "resolved". You can't hard-check for one name. Every automation queries per list which status counts as "closed". These small things separate a demo system from one that runs for three years.

The advantage: everything is visible to humans. When an agent does something, it appears as a comment or status change in the ticket — not in a log nobody reads.

## Level B: the team chat as the interaction level

The second level is Microsoft Teams — the chat where the team already communicates. This is where autonomy meets the human.

The chat carries four loads simultaneously:

- It's the **sole trigger** for autonomous bots. No webhook — just a simple 30-second poll looking for a trigger word. That sounds primitive, but it's robust: no webhook registration that can break, no externally exposed interface.
- It's the channel where bots **report status back** — directly in the thread the human is watching.
- It's the **agent-to-agent bus**: a shared group chat where agents on different machines register, mention each other, and leave threads.
- It's a **scan source** for the personal cockpit.

## The hardest detail: identity

The most instructive part of this level is identity — and it's also the warning to anyone replicating this.

The bots post via the OAuth token of a human operator. That means: in the chat interface, bot and human share a display name. So you can **never rely on `from.user` identity** to determine whether a message came from a human or the bot. All logic must instead anchor to message IDs: "This response *I* posted, that one I didn't."

The agent-to-agent bus takes the same trick further: all agents post under *one* technical service identity, but the *logical* sender appears in the message text, and a mention like "@planner" technically points to the human hosting that agent. One identity, many logical agents — and the notification still lands with the right person.

## Why this is the right architecture

You could build all this with custom services and a message queue. We deliberately didn't — for three reasons that apply to any agent system:

1. **Resumability.** State living in a ticket comment survives every restart, every deployment, every crash. An agent can pick up wherever it left off because the state isn't in its process.

2. **Auditability.** Every coordination is a visible artifact. You don't have to guess why an agent did something at night — it's there as a comment with a timestamp.

3. **Humans and machines speak the same language.** A human, a bot, and a scheduled job use the same vocabulary: the same tickets, the same tags, the same control words. There's no "machine interface" alongside the "human interface".

This is perhaps the most important insight from a year of production operation: **coordinate agents through persistent, human-visible artifacts — not through direct calls.** The tools your team already works in are often the best coordination layer you can have. You just have to take them seriously enough to know their edges.

In the next part, we go one level higher: into the nervous system that reacts to these events — and the multi-stage filter we use to keep the language model honest.
