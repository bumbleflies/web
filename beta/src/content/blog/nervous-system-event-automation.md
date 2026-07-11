---
title: "The Nervous System: Event Automation — and How to Keep a Language Model Honest"
description: "How an always-on automation layer turns support emails into classified tickets, and the multi-stage privacy filter that's the best example of 'don't trust the model, verify with code'."
excerpt: "24 workflows, nearly 700 processing steps, no human in the loop. A self-learning ticket router and a privacy filter that lets the model write — but doesn't believe a single word."
category: "Automation"
image: "/images/blog/nervensystem-n8n-automatisierung.svg"
order: 3
date: 2026-07-15
readingTime: "9 min"
published: false
---

If the two foundation levels — tickets and chat — are the skeleton of the system, then the automation layer is the nervous system: always awake, event-driven, no human in the loop. It reacts to every change in a ticket and controls the other systems from there.

We built this layer with n8n, an open-source automation platform. 24 workflows, nearly 700 processing steps. It turns a support email into a classified ticket, a call recording into a structured task list, a comment into finished release notes. Two of these workflows deserve a closer look because they embody two principles that apply to any AI system.

## First: code is the truth, not manual work

The defining decision of this layer: for every non-trivial workflow, the exported configuration is the source of truth — but it isn't written by hand. A small Python script *generates* it.

Why? Because hand-editing large workflow definitions always produces the same errors: wrong node IDs, broken connection arrays, type mix-ups. A generator script doesn't make these mistakes. Both — generator and generated configuration — live in Git. It's the same philosophy running through the entire stack: **where something can be deterministic, it should be a script.**

## Second: a router that learns from human corrections

The support workflow is a self-improving loop of two parts.

The first part catches every new support conversation and creates a ticket from it. Then a language model classifies the ticket: which list does it belong to? The classification runs as a **few-shot prompt** — the model gets examples of past tickets with the list they were sorted into. If it's more than 75% sure, it moves the ticket automatically. If unsure, the ticket stays in the inbox.

The second part closes the loop: whenever a *human* manually moves a ticket from the inbox, that exact correction is saved as a new example. The router's training data *is* the log of human corrections. There's no separate labeling step. On day one, with an empty example table, the system simply skips the model and leaves everything in the inbox — and learns from the first manual move onward.

This is a pattern that generalizes: **the best training source for your AI is your team's daily corrections.** You just have to capture them.

And the whole thing is designed to be fault-tolerant at every branch: if classification fails, the ticket was already created in the inbox — a safe fallback. Nothing is lost just because the model makes a mistake.

## The prime example: the privacy filter

Now to the most important building block — the one we show everyone who asks how to make a language model safe in production.

The company generates customer-facing release notes automatically from internal tickets. These notes are **publicly visible for every client**. But a ticket can contain client names, personal names, email addresses, case IDs. A language model writing a release note from such a ticket might let these data through. That must never happen.

The naive solution would be: tell the model in the prompt "don't mention names". We do that too — the prompt contains a hard prohibition with examples. **But we don't trust the prompt.** The flow is a defense in depth:

1. **The model writes** the release note — with instructions to generalize everything.
2. **A deterministic filter checks** the result with: regex searches for emails, URLs, phone numbers, IDs. Plus a heuristic that marks capitalized words outside sentence beginnings that aren't on a small allowlist as likely names.
3. **If the filter triggered, a second model redacts** the marked spots — it should remove or generalize every marked term.
4. **The same filter runs a second time.**
5. **If it *still* triggers, the workflow refuses hard** and posts a comment instead: "Sanitizer could not remove sensitive content — please rewrite manually."

The core in one sentence: **model writes → code checks → model corrects → code checks again → hard refusal if in doubt.** The language model is used where it shines (fluent formulation, generalizing), but the fenced area is narrow, and the boundary is deterministic code, not another model.

The filter code is deliberately duplicated verbatim in two places — with the comment "keep this block in sync with the other one". Sometimes redundancy is the right decision.

## The thread

If you take one thing from this layer, let it be this: the value of an AI system in production isn't trusting the model more. It's **knowing precisely where the model may decide — and where a deterministic fence stands.**

The nervous system shows both patterns: a router that gets smarter from human corrections, and a filter that doesn't believe a single word from the model. Together, they make a system you can trust at night.

In the next part, we look at the layer above: the marketplace that packages company knowledge into installable skills — the "apps" that both humans *and* bots use.
