---
title: "Interlude: From request to live, traced through one export"
description: "A support request about a missing export column, from the AI assistant through ticket and team chat to testing, rollout, and docs. How the foundations from Part 02 carry a real workflow."
excerpt: "A missing column in an export travels from support chat into a ticket, through enrichment, testing, and batch rollout to regression and docs. One concrete trace, no internal details."
category: "Example"
order: 2.5
date: 2026-09-22
author: "Chris 🦋 · Founder at bumbleflies / Senior Product Manager at JUNE"
readingTime: "7 min"
published: false
lang: "EN"
---

Part 02 was abstract on purpose: state and interaction as foundations, without a single end to end example. This interlude fills exactly that gap with a small, fictional, but typical workflow: a law firm is missing a column in its client export.

Names, tools, and details stay deliberately generic here. What matters is the path of the request, not the specific product behind it.

## Morning: the request lands in support chat

The request does not start as a ticket. It starts as a conversation in support chat, where an AI assistant answers first. It knows the most common export questions and resolves them directly in the chat.

Only when it finds no solid solution does it escalate the case to our team. That is a deliberate guardrail: a ticket is born only from a real escalation, not from every question.

What you see here: filter before state exists. The chat absorbs the noise, the ticket stays reserved for work that truly needs a team.

## Shortly after: the escalation becomes a ticket

The escalation is an event. The automation pillar reacts to it and creates exactly one ticket in the project management tool, with the request, the chat history so far, and a first classification.

From this moment, the principle from Part 02 applies: **change becomes action.** Every change to that ticket, a status move, a comment, a changed field, can trigger further steps.

What you see here: foundation 1. The persistent place where state lives is also the trigger for everything that follows.

## Mid-morning: the investigate bot enriches the ticket

The team does not answer with a guess. It asks the investigate bot in team chat to look at the ticket. The bot validates the suspected root cause, collects reproducible steps and, where available, error logs, and writes everything back into the ticket as enrichment. Then the ticket moves toward development.

Human and bot use the same language for this: the same ticket, the same comments, the same markers. There is no separate machine interface next to the human interface.

What you see here: foundation 2. Team chat as the place where autonomy meets humans. Triggering, reporting status back, all in the same thread.

## Midday: build time (deliberately skipped)

How developers work on the fix with their AI tooling is left out here. That deserves its own series and would blow up this example. What matters is only the handoff: the ticket counts as ready for testing once the fix is ready for it.

## Afternoon: test bot and human test together

A status change hands the ticket to testing. The test bot starts its run together with a human and reports its findings in a sub-ticket, so the main ticket stays readable.

Individual tickets do not go live one by one. When all tickets of a batch are done, the whole batch rolls out together.

What you see here: coordination through persistent artifacts. Anyone asking at night why something was tested or held back finds the answer as a timestamped comment, not in a log nobody reads.

## After rollout: proof, gaps, docs

After the rollout, three things start in parallel:

1. **Proof.** The full regression run executes and confirms everything works as expected.
2. **Gap analysis.** An analysis agent compares which tests were missing and files them as backlog items. During quiet hours, a nightly bot extends the test suite from them.
3. **Docs.** Further bots update the documentation, record a short demo video, and store screenshots for the docs.

What you see here: nobody calls anybody directly. Ticket comments and status changes drive everything, visible to humans, resumable after a restart.

## The thread

Resumability, traceability, one shared language. Exactly the three reasons from Part 02, this time told along one workflow: from support chat through ticket and team chat to testing, batch rollout, regression, and docs.

The terms are defined in Part 02. How the automation pillar reacts to these events while keeping the language model honest is the subject of the next part.
