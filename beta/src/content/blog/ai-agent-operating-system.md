---
title: "What I Actually Built Instead of \"Adding AI\""
description: "Not 'I bought AI', but 'I translated my own operational processes into code that a language model composes'. Here's the architecture behind it."
excerpt: "Several agent pillars on shared foundations. Autonomous agents that open pull requests, a skill marketplace for company knowledge, a cockpit that plans the day. This is what AI looks like when it doesn't end in a demo."
category: "Overview"
image: "/images/blog/ki-agenten-betriebssystem.svg"
order: 1
date: 2026-09-08
author: "Chris 🦋 · Founder at bumbleflies / Senior Product Manager at JUNE"
readingTime: "9 min"
published: true
lang: "EN"
---

The most common question people ask me about AI goes something like this:

> "Am I right in assuming that you just type in feature requests as text, and then agents go off, implement them, open pull requests? I have this romantic notion that you've got a real treasure over there."

That's a real quote from a client inquiry. And the honest answer is: yes, we built exactly that, my colleagues and I at JUNE, a German legal-tech company where I still run it day-to-day. At bumbleflies, I do AI consulting for other companies. This series is therefore my personal account from JUNE, not a bumbleflies client project.

This article series describes the system: how it's structured, what decisions I made, and especially the lessons. Nearly every guardrail traces back to a concrete experience in day-to-day operation.

## The core: no purchased AI, but compiled operational processes

I didn't *purchase* an AI solution. I **translated JUNE's operational procedures into code that a language model assembles.**

The difference runs deep. A generic AI assistant doesn't automatically know your deployment pipeline, ticket conventions, or approval rules. It has to infer them from context. A system that knows these procedures as versioned, testable code can execute them deterministically. The language model makes the judgment calls; deterministic scripts handle the mechanics.

That gave rise to the system that carries my day-to-day work today.

## The architecture: foundations and pillars

<div class="a-arch-diagram" role="img" aria-label="Diagram: the foundations state and interaction carry the agent pillars nervous system, skill marketplace, agents, cockpit" style="--diagram-dark:url('/images/blog/ai-agent-operating-system-architecture.svg');--diagram-light:url('/images/blog/ai-agent-operating-system-architecture-light.svg')"></div>

The mental model consists of **foundations** and the **pillars** standing on them.

**Foundation 1, the state.** The project management tool. At JUNE, that's ClickUp. Every piece of work is born as a ticket or reconciled against a ticket. A status change, a new comment, a modified field: each is an event that triggers actions. The ticket is therefore both the persistent state and the trigger for further action.

**Foundation 2, the interaction.** The team chat (Microsoft Teams). This is where autonomy meets people: where humans trigger agents, where agents report their status back, and where agents coordinate with each other.

Standing on them are the pillars:

- **Pillar 1, the nervous system.** An automation platform (n8n) reacts to events from Foundation 1 (the state) and controls Foundation 2 (the interaction) and other systems. No human in the loop. Many workflows, a lot of processing steps. This is where a support email automatically becomes a classified ticket, with duplicates merged in along the way.

- **Pillar 2, the skill marketplace.** Company knowledge as installable, versioned "apps". Many plugins, even more skills. Each skill is a combination of model judgment and deterministic script, and works identically for a human on a laptop, an agent in a container, and the CI pipeline.

- **Pillar 3, the autonomous agents.** Claude Code running around the clock as a daemon. This series uses "agent" as the single term for any AI process filling a role, including the ones that run with nobody in the loop. A word in the team chat wakes an agent; it implements code, opens pull requests, addresses review comments, rolls out hotfixes, and reports back. Several personas from *one* shared building kit.

- **Pillar 4, the personal cockpit.** A meta-agent that scans many sources in parallel and plans a human's day from them. It reads both foundations and even the AI's own conversation history to rediscover open threads.

## How the components work together

These aren't separate projects. They coordinate through the foundations: chat messages trigger actions, tickets and comments carry state and context. The components therefore don't need to call each other directly.

A typical daily flow:

1. A customer writes to support. The nervous system automatically creates a classified ticket. Once a pull request addresses the ticket, the two are linked.
2. Someone types a trigger word in the team chat. The agent wakes up, reviews the pull requests tied to open tickets, and triages them.
3. After explicit human approval, the agent deploys, first the database migrations, then the services.
4. The agent leaves a comment on the linked ticket; the nervous system automatically generates customer-facing release notes from it, through a multi-stage privacy filter.
5. The next morning, the entire process appears in the cockpit's daily briefing, merged with the tickets so nothing shows up twice.

Several pillars, one work process. Not a single direct call between components.

## The recurring principles

The same design principles appear across all pillars:

**Don't trust the model, verify with code.** The consistent answer to "How do you make a language model safe in production?" is: draw a deterministic boundary around it. The model writes, a regex filter checks, the model corrects, the same filter checks again, and blocks if in doubt.

**Lessons as design.** Nearly every guardrail traces back to a concrete experience: a night when an agent burned tokens in an idle loop, a regression in appointment booking, a broken configuration on a network drive. The systems grow by pouring their own errors into rules.

**Coordination via persistent artifacts, not RPC.** Agents and humans speak to each other through tickets, tags, statuses, and chat messages, traceable, resumable, visible to humans.

**One definition, many runtimes.** The same skill runs identically for a human on a laptop, an agent in a container, and the CI pipeline. One script, not three. No copy-paste.

**Human at the brake lever.** German-language triggers, a legal domain, and above all: every truly consequential action (approvals, merges, production deployments) requires explicit human confirmation. Autonomy with a hand on the lever.

All of it is the current state of one running system, with every lesson that's baked into it, and there are decisions in here I'm still not sure about.

## What's coming in this series

The next articles each take a closer look at one foundation or pillar:

- **The foundations**: why I coordinate the stack through standard SaaS tools instead of custom services.
- **The nervous system**: event automation and the privacy filter.
- **Skills as apps**: how company knowledge works as installable skills.
- **The agents**: Claude Code as an autonomous daemon, and what went wrong.
- **The cockpit**: how a whole fan of agents summarizes my workday.

This isn't a vision of the future. This is running. Every article that follows therefore shows not just one component, but also the guardrails behind it and the experience that led to them.
