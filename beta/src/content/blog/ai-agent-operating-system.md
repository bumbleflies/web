---
title: "What I Actually Built Instead of \"Adding AI\""
description: "Not 'I bought AI', but 'I translated my own operational processes into code that a language model composes'. The blueprint of a real agent system in production."
excerpt: "Four agent pillars on two foundations. Autonomous agents that open pull requests, a skill marketplace for company knowledge, a cockpit that plans the day. This is what AI looks like when it doesn't end in a demo."
category: "Overview"
image: "/images/blog/ki-agenten-betriebssystem.svg"
order: 1
date: 2026-07-10
author: "Chris 🦋 | Founder at bumbleflies / Senior Product Manager at JUNE"
readingTime: "9 min"
published: false
lang: "EN"
---

The most common question people ask me about AI goes something like this:

> "Am I right in assuming that you just type in feature requests as text, and then agents go off, implement them, open pull requests? I have this romantic notion that you've got a real treasure over there."

That's a real quote from a client inquiry. And the honest answer is: yes, I've built exactly that. Just not at bumbleflies. I built it at JUNE, a German legal-tech company where I also work, and it's been powering my day-to-day work there for over a year.

A quick note on where this sits: I split my time between JUNE, where I built and run this system, and bumbleflies, where I do AI consulting for other companies. This series is my personal account of what I built at JUNE, not a bumbleflies client project.

This article series describes that system. How it's structured, what decisions I made, and especially the scars, because nearly every protective measure traces back to a concrete incident.

## The core: no purchased AI, but compiled operational processes

The most important sentence first, because it explains everything else: I didn't *purchase* an AI solution. I **translated JUNE's operational procedures into code that a language model assembles.**

The difference runs deep. A generic AI assistant knows nothing about your deployment pipeline, your ticket conventions, your approval rules, your client landscape. It improvises, and improvises a little differently each time. A system that knows your procedures as versioned, testable code does the same thing every time. The language model makes judgment calls; deterministic scripts handle the mechanics.

From this one idea grew a multi-layered operating system.

## The architecture: two foundations, four pillars

<div class="a-arch-diagram" role="img" aria-label="Diagram: two foundations, state and interaction, carry four agent pillars: nervous system, skill marketplace, agents, cockpit" style="--diagram-dark:url('/images/blog/ai-agent-operating-system-architecture.svg');--diagram-light:url('/images/blog/ai-agent-operating-system-architecture-light.svg')"></div>

The mental model has **two perpendicular foundations** and **four agent pillars** standing on them.

**Foundation 1, the state.** The project management tool. At JUNE, that's ClickUp. Every piece of work is born as a ticket or reconciled against a ticket. A status change, a new comment, a modified field: each is an event that triggers actions. It's the persistent storage of truth *and* the ignition.

**Foundation 2, the interaction.** The team chat (Microsoft Teams). This is where autonomy meets people: where humans trigger agents, where agents report their status back, and where agents coordinate with each other.

Standing on them are the four pillars:

- **Pillar 1, the nervous system.** An automation platform (n8n) reacts to events from Foundation 1 (the state) and controls Foundation 2 (the interaction) and other systems. No human in the loop. 24 workflows, nearly 700 processing steps. This is where a support email automatically becomes a classified ticket, with duplicates merged in along the way.

- **Pillar 2, the skill marketplace.** Company knowledge as installable, versioned "apps". 11 plugins, 53 skills. Each skill is a combination of model judgment and deterministic script, and works identically for a human on a laptop, an agent in a container, and the CI pipeline.

- **Pillar 3, the autonomous agents.** Claude Code running around the clock as a daemon. This series uses "agent" as the single term for any AI process filling a role, including the ones that run with nobody in the loop. A word in the team chat wakes an agent; it implements code, opens pull requests, addresses review comments, rolls out hotfixes, and reports back. Four personas from *one* shared building kit.

- **Pillar 4, the personal cockpit.** A meta-agent that scans ten sources in parallel and plans a human's day from them. It reads both foundations, and even the AI's own conversation history to rediscover open threads.

## The connective tissue

These aren't four separate projects. It's a **network with named, load-bearing seams**, and nearly every connection runs through the two foundations. Components trigger each other via chat messages and coordinate through tickets and comments, rather than calling each other directly. The foundations *are* the shared vocabulary.

A typical daily flow:

1. A customer writes to support. The nervous system automatically creates a classified ticket. Once a pull request addresses the ticket, the two are linked.
2. Someone types a trigger word in the team chat. The agent wakes up, reviews the pull requests tied to open tickets, and triages them.
3. After explicit human approval, the agent deploys, first the database migrations, then the services.
4. The agent leaves a comment on the linked ticket; the nervous system automatically generates customer-facing release notes from it, through a multi-stage privacy filter.
5. The next morning, the entire process appears in the cockpit's daily briefing, merged with the tickets so nothing shows up twice.

Four pillars, one work process. Not a single direct call between components.

## The recurring principles

The same design principles appear across all pillars. They are the real value, and the thread running through this series:

**Don't trust the model, verify with code.** The consistent answer to "How do you make a language model safe in production?" is: draw a deterministic boundary around it. The model writes, a regex filter checks, the model corrects, the same filter checks again, and refuses hard if in doubt.

**Scars as design.** Nearly every protective measure cites a dated incident: a night when an agent burned several hundred euros in tokens, a regression in appointment booking, a broken configuration on a network drive. The systems grow by pouring their own errors into rules.

**Coordination via persistent artifacts, not RPC.** Agents and humans speak to each other through tickets, tags, statuses, and chat messages, traceable, resumable, visible to humans.

**One definition, many runtimes.** The same skill runs identically for a human on a laptop, an agent in a container, and the CI pipeline. One script, not three. No copy-paste.

**Human at the brake lever.** German-language triggers throughout, legal domain, and all truly consequential actions, approvals, merges, production deployments, are tied to explicit human confirmation. Autonomy with a hand on the lever.

None of this is a blueprint to copy. It's the current state of one running system, scars included, and there are decisions in here I'm still not sure about.

## What's coming in this series

The following articles each take on one foundation or pillar:

- **The two foundations** everything runs on, why the entire stack coordinates through two SaaS tools rather than custom services.
- **The nervous system**, event automation and the privacy filter as a prime example of "verify with code".
- **Skills as apps**, the plugin marketplace for company knowledge.
- **Agents that work at night**, Claude Code as an autonomous daemon, and the scars.
- **A cockpit for one human**, orchestrating your own day with ten agents.

This isn't a vision of the future. This is running. And everything that follows in this series is a scar log, the protective measure, and the dated incident behind it.
