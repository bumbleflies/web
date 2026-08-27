---
title: "Skills as Apps: A Plugin Marketplace for Company Knowledge"
description: "An internal app store for AI tooling: the marketplace is the store, each plugin is an app, each skill is a feature. And the one rule that holds it all together — model judgment plus deterministic script."
excerpt: "11 plugins, 53 skills, activated by natural language. The same code runs for the human on a laptop, the bot in a container, and the CI. How to version company knowledge instead of copying it."
category: "Platform"
image: "/images/blog/skills-als-apps-plugin-marktplatz.svg"
order: 4
date: 2026-07-18
readingTime: "8 min"
published: false
lang: "EN"
---

Every company has procedures living in individual people's heads. How to take a feature from idea to pull request. How to migrate a client from a legacy system. How to roll out a hotfix without breaking production. This knowledge is normally passed on orally, buried in outdated wiki pages, or copied from person to person — each time a little different.

We packaged it into an **internal app store** instead. The metaphor is meant literally: the marketplace is the store, each plugin is an app, and each skill within it is a feature.

## What it feels like

An employee adds the marketplace to their Claude Code once per machine and installs the plugins they need. After that, skills activate via **natural language**: you describe what you want, and Claude Code picks the matching skill based on its description. The descriptions are deliberately filled with trigger phrases in German *and* English — "deploy to prd" and "nach prd deployen" lead to the same skill. It's a legal-tech company with a German-speaking team; the language has to match.

11 plugins, 53 skills. They range from feature development (planning, building, reviewing, testing) to code review for three different tech stacks to client onboarding, support fixes, and time tracking.

## The one rule: model judgment plus deterministic script

If you remember one thing from this article, let it be this rule — it's the architectural heart of the entire system:

> Any part of a skill that can be made deterministic SHOULD be a script. The language model only composes the call.

So a skill is never "the model will figure it out". A skill is: the model makes the judgment call (which services are affected by the deployment? Is this review comment resolved or open?), and a deterministic script executes the mechanics.

The reasoning is crystal clear:

- **Determinism** — no "the model forgot step 4 this time".
- **Auditability** — you diff the script, not an AI conversation log.
- **Speed and cost** — a script runs in milliseconds and burns no tokens.
- **Reusability** — human, bot, and CI call the same script.

Every script comes in two variants: one for Linux/Mac (bot containers, CI) and one for Windows (laptops). Same arguments, same exit code, same output. This means the *same* skill works identically for a human on Windows, a bot in a Linux container, and the CI pipeline. **One definition, many runtimes.**

## An example of the sophistication: the deploy trio

Take deployment. Three skills together form a mini-compiler:

The first takes a set of changed files and maps each to its deployment target — detects new database migrations, builds a structured deploy plan. The second executes this plan against a test environment. The third always targets production, fires database migrations first as a hard gate, then services in parallel.

The clever part: the production deploy is **delivery-agnostic**. It doesn't know whether a human, a rollout script, or a bot called it. When a production approval is due, it emits a structured event — "approval needed" — and leaves it to the caller to present this to the human. This exact design is why one and the same skill can serve a human, a rollout, and an autonomous bot identically.

## Knowledge that improves itself

The most beautiful pattern in the marketplace is a learning loop. The migration playbook skill, which takes on clients from legacy systems, reads and writes a single canonical document. After each migration, a "capture learning" step appends the new insights to that exact document — and suggests changes to its own rules and effort tables.

Which means: **the tool improves the document that controls the next tool.** Each migration makes the playbook better instead of remaining a one-off case. Knowledge compounds instead of weathering.

Honest caveat: the learning loop has only run for a handful of migrations. We believe it compounds — we just haven't seen enough repetitions to prove it yet.

## Analytics as a first-class release step

A detail that shows how seriously "internal product store" is meant: every new skill *must* be registered in the usage dashboard. Without this registration, the system collects no data about which skills are actually used — and without that data, you can't prioritize what to improve. Analytics isn't an afterthought, but a mandatory step of every release.

And quality assurance? Every skill that's changed runs a **real integration check** in CI — it calls the skill end-to-end as a real subprocess and checks its structured output. No mocks. If a skill is broken, it's caught before it reaches anyone.

## What this replaces

Knowledge spreads, drifts apart, gets lost — and the usual answer is documentation nobody reads. Ours is company knowledge as installable, versioned, tested skills, usable via natural language by humans and by machines, with exactly the same code.

And this shared code is the bridge to the next part: when a human and an autonomous bot run the same skills, a bot is just a container with a different system prompt. What that looks like — and the expensive mistakes that led us there — in the next article.
