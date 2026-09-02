---
title: "The Nervous System: Event Automation, and How to Keep a Language Model Honest"
description: "How an always-on automation pillar turns support emails into classified tickets, and the multi-stage privacy filter that's the best example of 'don't trust the model, verify with code'."
excerpt: "24 workflows, nearly 700 processing steps, no human in the loop. A self-learning ticket router and a privacy filter that lets the model write, but doesn't believe a single word."
category: "Automation"
image: "/images/blog/nervensystem-n8n-automatisierung.svg"
order: 3
date: 2026-07-15
author: "Chris 🦋 | Founder at bumbleflies / Senior Product Manager at JUNE"
readingTime: "9 min"
published: false
lang: "EN"
---

If the two foundations, tickets and chat, are the skeleton of the system, then the automation pillar is the nervous system: always awake, event-driven, no human in the loop. It reacts to every change in a ticket and controls the other systems from there.

I built this pillar with n8n, an open-source automation platform, at JUNE. 24 workflows, nearly 700 processing steps. It turns a support email into a classified ticket, a call recording into a structured task list, a comment into finished release notes. Two of these workflows deserve a closer look because they embody two principles that apply to any AI system.

## First: code is the truth, not manual work

The defining decision of this pillar: for every non-trivial workflow, the exported configuration is the source of truth, but it isn't written by hand. A small Python script *generates* it.

Why? Because hand-editing large workflow definitions always produces the same errors: wrong node IDs, broken connection arrays, type mix-ups. A generator script doesn't make these mistakes. Both, generator and generated configuration, live in Git. It's the same philosophy running through the entire stack: **where something can be deterministic, it should be a script.**

## Second: a router that learns from human corrections

The support workflow is a self-improving loop of two parts.

The first part catches every new support conversation and creates a ticket from it. Then a language model classifies the ticket: which list does it belong to? The classification runs as a **few-shot prompt**, the model gets examples of past tickets with the list they were sorted into. If it's more than 75% sure, it moves the ticket automatically. If unsure, the ticket stays in the inbox.

The second part closes the loop: whenever a *human* manually moves a ticket from the inbox, that exact correction is saved as a new example. The router's training data *is* the log of human corrections. There's no separate labeling step. On day one, with an empty example table, the system simply skips the model and leaves everything in the inbox, and learns from the first manual move onward.

**The best training source for your AI is your team's daily corrections.** You just have to capture them.

One number in there is honest guesswork: the 75% confidence threshold. I picked it by feel, not by tuning. It's held up so far, whether 75 is right or just lucky, I still don't know.

And the whole thing is designed to be fault-tolerant at every branch: if classification fails, the ticket was already created in the inbox, a safe fallback. Nothing is lost just because the model makes a mistake.

## The prime example: the privacy filter

Now to the most important building block, the one I show everyone who asks how to make a language model safe in production.

JUNE generates customer-facing release notes automatically from internal tickets. These notes are **publicly visible for every client**. But a ticket can contain client names, personal names, email addresses, case IDs. A language model writing a release note from such a ticket might let these data through. That must never happen.

The naive solution would be: tell the model in the prompt "don't mention names". I do that too, the prompt contains a hard prohibition with examples. **But I don't trust the prompt.** The flow is a defense in depth:

1. **The model writes** the release note, with instructions to generalize everything.
2. **A deterministic filter checks** the result with: regex searches for emails, URLs, phone numbers, IDs. Plus a heuristic that marks capitalized words outside sentence beginnings that aren't on a small allowlist as likely names.
3. **If the filter triggered, a second model redacts** the marked spots, it should remove or generalize every marked term.
4. **The same filter runs a second time.**
5. **If it *still* triggers, the workflow refuses hard** and posts a comment instead: "Sanitizer could not remove sensitive content, please rewrite manually."

The core in one sentence: **model writes → code checks → model corrects → code checks again → hard refusal if in doubt.** The language model is used where it shines (fluent formulation, generalizing), but the fenced area is narrow, and the boundary is deterministic code, not another model.

The filter code is deliberately duplicated verbatim in two places, with the comment "keep this block in sync with the other one". Sometimes redundancy is the right decision.

## The thread

The router gets smarter from human corrections; the filter doesn't believe a single word the model writes. Those two patterns are the whole pillar, and they're what let it run all night without a human in the loop.

In the next part, I look at the pillar above: the marketplace that packages company knowledge into installable skills, the "apps" that both humans *and* agents use.
