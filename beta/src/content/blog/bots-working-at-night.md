---
title: "Agents That Work While You Sleep: Claude Code as an Autonomous Daemon"
description: "Four autonomous agents watching a team chat, implementing code, opening pull requests, and rolling out hotfixes, and the scars that explain every single protective measure."
excerpt: "A word in the chat wakes an agent. It implements, opens a PR, reports back. Four personas from one building kit. And the night an agent burned several hundred euros in tokens."
category: "Autonomy"
image: "/images/blog/bots-die-nachts-arbeiten.svg"
order: 5
date: 2026-07-22
author: "Chris 🦋 | Founder at bumbleflies / Senior Product Manager at JUNE"
readingTime: "10 min"
published: false
lang: "EN"
---

This is the article the client quote at the start was really aiming at: *"You type in feature requests as text, and then agents go off, implement them, open pull requests?"*

Yes. That's how it works. And that's how I built it, at JUNE.

## The basic idea: an agent is Claude Code as a daemon

An "agent" is nothing more than **Claude Code running as a long-lived daemon in a container**, driven by chat messages instead of a human at a terminal. It watches a team chat channel, and as soon as a trigger word appears, it implements code changes, opens pull requests, addresses review comments, rolls out hotfixes, or tests the application in the browser, all unattended.

The most elegant decision is in the architecture: there are four personas, a developer agent, a support agent, a product management agent, a test agent, but they are **not four codebases.** They're the same runtime, specialized only through a different system prompt, a different list of installed skills, and a few environment variables.

> "A new agent is just a container with different environment variables and a different system prompt."

That's the DRY principle at the agent level. An improvement to the shared building kit reaches all four immediately.

## The trigger: no webhook, a simple poll

You'd expect such a system to be driven by webhooks. It isn't. Each agent is a **30-second poll loop.** Every 30 seconds it checks the chat: is there a new message with the trigger word? If yes, it starts the language model. If no, it keeps sleeping, without burning a single token. No webhook registration that silently breaks, no externally exposed interface. And to hide the perceived latency, there's a neat UX trick: even before the model starts, the poll posts a pre-confirmation, "I'm on it! 🐳", that updates every 15 seconds with the current work step. The human sees a reaction within a second instead of waiting two minutes for the first token.

## How it runs Claude Code headless

At its core, the bootstrap calls Claude Code in headless mode, with permission prompts skipped, the agent shouldn't ask about every file. That's exactly why one of the most important protective measures is a **hard stop via hook**: a merge to `master` or `main` is categorically refused.

> "Autonomous merging is disabled … leave the merge to a human."

The agent may push, may open pull requests, but merging into the main line remains a human decision. That's the "hand on the brake lever" the entire system is guided by. Because permissions are skipped, this stop must be a *hard* code stop. A mere prompt rule would just be advice the model might ignore in the heat of the moment.

## The scars, and why they're the most valuable part

Now to the honest part. Nearly every protective measure in this system traces back to a concrete, dated incident. That's not embarrassing, it's the method: **the system grows by pouring its own errors into code.**

**The night with several hundred euros in tokens.** An agent's chat token had expired. The poll interpreted this as "there's work" and fired the language model every 30 seconds to "solve" the supposed problem, all night long. In the morning: several hundred euros in token costs for nothing. The answer was *three* independent cost guards: a silent token refresh that first tries to solve the problem without the model; an error state machine that throttles to one attempt per hour after repeated failures; and a weekly limit marker. Since then, an expired token *never* fires the model, it simply skips the tick.

The cost guards stopped the burning, but they brought their own failure mode: a genuinely stuck agent now retries at most once an hour. When the agent is really broken, you find out slowly.

**The configuration on the network drive.** Initially, agent configuration lived on a persistent network drive. There, cloning and resetting the Git repository kept breaking, corrupting files, and the broken folder couldn't be deleted, the agent got stuck. The lesson: configuration on volatile local storage, freshly cloned on each start; only the *state* lives persistently. And never `sleep infinity` on failure, better to exit cleanly and let the container start a fresh process.

**The self-restart loop.** The agents learn: after a review comment, they write a new rule to their knowledge base and push it. Initially, the deployment automation interpreted this push as a configuration change, and restarted the agent mid-work. The restart repeated the work, learned, committed, pushed, restarted … an infinite self-restart loop. The fix: explicitly exclude knowledge base pushes from the restart logic.

**"Never rely on sender identity."** Because the agent posts via a human's token, agent and human share a display name. An incident where the agent reacted to its own status message, because it contained the trigger word, led to the rule: everything anchors to message IDs, never to the display identity.

**"Done only counts as learned when it's written down."** The test agent, which clicks through the application in the browser, maintains its own knowledge base about the product's surface. The guiding principle behind it is also perhaps the best summary of the whole approach: experience that isn't recorded anywhere is lost. So the agents write down their lessons and push them, deploy-neutral, immediately available to all.

## The self-learning pillar

That's exactly why these agents get better over months instead of staying equally bad: after every review, every correction, they write generalizable rules to a knowledge base and share them. The developer agent learns frontend conventions, the support agent learns the choreography of a rollout, the test agent learns the quirks of the surface. **The tools improve the documents that control the tools**, the same compounding pattern as in the marketplace.

## What to take from this

Autonomous agents in production aren't a magic trick. They're a very ordinary tool (Claude Code) in a very disciplined environment: a cheap poll instead of fragile webhooks, hard code boundaries around risky actions, three independent cost guards, and a culture where every incident becomes a new rule.

The hardest part isn't getting the agent to work. The hardest part is giving it the boundaries that let you sleep at night.

In the final part of the series, I turn the perspective around: away from the machines working autonomously, toward a single human, and the cockpit that orchestrates their day with ten agents.
