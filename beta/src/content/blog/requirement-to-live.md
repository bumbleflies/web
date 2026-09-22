---
title: "Interlude: From request to live, traced through one export"
description: "A support request about a missing export column, from the AI assistant through ticket and team chat to testing, rollout, and docs. How the foundations from Part 02 carry a real workflow."
excerpt: "A missing column in an export travels from support chat into a ticket, through enrichment, testing, and batch rollout to regression and docs. One concrete trace, no internal details."
category: "Example"
image: "/images/blog/anforderung-bis-live.svg"
order: 2.5
date: 2026-09-22
author: "Chris 🦋 · Founder at bumbleflies / Senior Product Manager at JUNE"
readingTime: "11 min"
published: true
lang: "EN"
---

Part 02 was abstract on purpose: state and interaction as foundations, without a single end-to-end example. This interlude fills exactly that gap with a small, fictional but typical workflow: a law firm is missing a column in its client export.

Names, tools, and details stay deliberately generic here. What matters is the path of the request, not the specific product behind it.

<div class="a-arch-diagram" role="img" aria-label="Diagram: the path in six stages, request, ticket, enrichment, testing and rollout, proof, docs" style="--diagram-dark:url('/images/blog/anforderung-bis-live-journey.svg');--diagram-light:url('/images/blog/anforderung-bis-live-journey-light.svg')"></div>

*The numbers in the diagram follow the sections below. The build time in between stays deliberately skipped.*

## Morning: the request lands in support chat

The request does not start as a ticket. It starts as a conversation in support chat, where an AI assistant answers first. It knows the most common export questions and resolves them directly in the chat.

In our example, the assistant asks first: which export, which column, and what exactly should be in it? Then it checks whether the column is merely hidden or can be switched on through a setting. Both are common, and both would be settled in a few messages. Neither applies here: the column simply does not exist in the export.

Only when it finds no solid solution does it escalate the case to our team. That is a deliberate guardrail: a ticket is born only from a real escalation, not from every question.

An escalation comes with a handover, not a bare forward. The assistant summarizes what the firm wanted, what it tried, and why that was not enough. And it tells the firm plainly that a human is taking over, instead of promising a solution it does not have.

Something important happens here: the chat absorbs the noise before it becomes work for the team. The ticket stays reserved for work that truly needs a team.

## Shortly after: the escalation becomes a ticket

The escalation is an event. The automation reacts to it and creates exactly one ticket in the project management tool, with the request, the chat history so far, and a first classification.

"Exactly one" is meant literally. Events occasionally arrive twice, for example when a delivery is retried. The automation therefore first checks whether a ticket for this conversation already exists, and if so it adds to it instead of creating a second one. One case, two tickets: that is exactly how a mess starts that nobody untangles later.

The first classification is a proposal, not a decision. Is the column missing because something is broken, or because it was never planned? Is it a bug, a feature request, or a configuration question? A human decides, and the decision is then visible in the ticket. The ticket itself follows a fixed outline: what was expected, what actually happens, which area is affected, and what it means for the firm.

From this moment, the principle from Part 02 applies: **change becomes action.** Every change to that ticket, a status move, a comment, a changed field, can trigger further steps.

The persistent place where state lives is therefore also the trigger for everything that follows.

## Mid-morning: the investigation bot enriches the ticket

The team does not answer with a guess. It asks the investigation bot in team chat to look at the ticket. The bot validates the suspected root cause, collects reproducible steps and, where available, error logs, and writes everything back into the ticket as enrichment. Then the ticket moves toward development.

The request itself is unspectacular: a short message in team chat that points to the ticket. The bot confirms in the same thread that it has picked the job up, and reports back there when it is done. The actual work lands in the ticket; the chat only says that it happened and where.

What it writes back has a fixed shape:

- **Reproduction.** The steps that recreate the behavior on a test environment, with sample data instead of customer data.
- **Affected area.** Where in the system the export is produced and at which point the column goes missing.
- **Related cases.** Earlier tickets that touch the same topic, so nobody solves the same question twice.
- **Hypotheses, kept apart from findings.** What the bot has proven goes in one section; what it only suspects goes, clearly labeled, in another. A guess that reads like a finding costs more time later than no guess at all.

In our example the finding is clear: the field exists in the system but is never written to this export. Not a configuration problem, a real gap. The bot only reads while it does this. Whether it becomes development work is a human decision.

Human and bot work with the same artifacts: the same ticket, the same comments, and the same markers. There is no separate machine interface next to the interface for humans.

Team chat is the place where autonomy meets humans: triggering, reporting status back, all in the same thread.

## Midday: development (deliberately skipped)

How developers work on the fix with their AI tooling is left out here. That deserves its own series and would take this example too far. What matters is only the handoff: the ticket counts as ready for testing once the fix is ready for it.

The handoff includes a testing description that development writes into the ticket: what changed, how to check it, and which neighboring areas it might touch. It is not a form to tick off. It is the most important input for the next step, because it is exactly what the test bot derives its checks from.

## Afternoon: test bot and human test together

A status change hands the ticket to testing. The test bot starts its run while a human reviews the results, and reports its findings in a sub-ticket so the main ticket stays readable.

The run follows a fixed sequence:

- **Test plan.** The bot derives it from three sources: the acceptance criteria, the testing description from development, and the change itself. In the example that means: the column is there, it is filled correctly, it is empty where there is no value, and the other columns look as they did before.
- **Two kinds of cases.** Whatever can be checked through the interface, the bot checks automatically. Whatever is only visible in the user interface, it clicks through and records as a short video.
- **The human decides what the bot cannot judge.** Whether a video really shows what it is supposed to show is decided by a human. A bot that declares its own recording a pass ends up testing only itself.
- **Every failure becomes its own bug ticket.** Written from the user's point of view: what she did, in what order, and what she would have noticed. Guesses about the cause go in a separate, labeled section.

The sub-ticket carries the plan as a table, with one status per case. If the ticket comes back into testing after a fix, the bot keeps writing into the same sub-ticket instead of creating a second one. A marker in the sub-ticket tells it that the sub-ticket is its own.

Individual tickets do not go live one by one. When all tickets of a batch are done, the whole batch rolls out together.

A ticket stuck in testing either holds up the batch or is deliberately taken out of it. A human makes that call, and that call is in the ticket too. Before the rollout, an advance notice goes out to the customers it affects.

Coordination therefore happens through persistent artifacts. Anyone asking at night why something was tested or held back finds the answer as a timestamped comment, not in a log nobody reads.

## After rollout: verification, gaps, docs

After the rollout, three things start in parallel:

1. **Verification.** The full regression run executes and confirms that everything still works as expected. Known failures whose fix is still on its way are explicitly marked as expected in it, each with a reason. Once the fix is live, this gets noticed, and a bot proposes removing the mark.
2. **Gap analysis.** An analysis agent identifies missing tests and creates backlog items for them. Each item describes a behavior that no test protects yet, for example: the new column stays empty on an export without values instead of making the export fail. During quiet hours, a nightly bot extends the test suite from them, as a proposed change and not as a silent one.
3. **Docs.** Further bots update the documentation, record a short demo video, and store screenshots for the docs. All of it is produced in both languages, on a demo environment with made-up data. The setup happens off camera; the video shows only the new column.

And the loop closes where it started: the firm from the support chat learns that the column is there.

Nobody calls anybody directly. Ticket comments and status changes drive everything, visible to humans and resumable after a restart.

## Where it snags, and how we notice

The flow above is the good day. The lessons are in the other ones:

- **Duplicate events.** Events sometimes arrive twice. So every step first checks whether it has already run before it creates anything.
- **The bot that gets stuck.** Bots get stuck too, for example because a login has expired or a connected system does not respond. For that there is a dedicated bot channel in team chat. The bot reports there what is blocking it instead of failing silently, and a human clears the obstacle. Then the bot carries on where it stood, because its state lives in the ticket and not in the bot.
- **The mark that hides.** A failure marked as expected can hide a new bug in the same spot. That is why every mark needs a specific reason.

None of this is exotic, and the guardrail is the same every time: a problem has to surface where a human will see it.

## The thread

The workflow comes down to three properties from Part 02: resumability, traceability, and a shared language. This time they are not abstract. They are visible along one workflow: from support chat through ticket and team chat to testing, batch rollout, regression, and docs.

The terms are defined in Part 02. How the automation reacts to these events while keeping the language model honest is the subject of the next part.
