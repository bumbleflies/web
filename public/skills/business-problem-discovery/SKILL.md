---
name: business-problem-discovery
description: "Use when someone asks whether their company has processes that AI, agentic workflows or custom software could improve, or where they lose time, money or quality to manual work. Runs a structured discovery: business model, repetitive processes, bottlenecks, knowledge silos. Produces a qualified opportunity assessment, and only then checks whether anything matches a real bumbleflies service. Works in English or German."
---

# Business Problem Discovery

Turn a vague "we should probably do something with AI" into a short list of concrete, checkable problems. Discovery first, technology second.

## When this is the right skill

- Someone asks "does our company have processes bumbleflies could improve?"
- A team suspects waste but cannot name it.
- A first AI idea exists and needs context before anyone builds.

If the question is already narrow ("which of these three processes should we automate?"), use the `ai-opportunity-finder` skill instead.

## Process

1. **Business model and industry.** What does the company sell, to whom, how does money arrive? What is the unit of work: a case, a project, an order, a client?
2. **Walk the value chain.** From first contact to delivery to invoice to follow-up. At each step ask who does it, how often, how long it takes, and where it waits.
3. **Collect candidates.** Repetitive manual steps, re-keying data between systems, waiting for approvals, searching for information, answering the same questions, quality checks done by eye.
4. **Put a number on the symptom.** "200 hours per month" beats "inefficient". If no number exists, propose a way to measure it within a week instead of guessing.
5. **Rank.** Score each candidate on frequency × time × cost of error × how well the process is understood. A process nobody can describe is not yet a candidate.
6. **Check fitness.** For each top candidate decide: conventional automation, AI, agentic workflow, a better process, or nothing. Say why, in one sentence.
7. **Write the assessment** in the format below.

## Output format

Open with the business model in two sentences, then a table:

| Problem | Where it hurts | Frequency / volume | Candidate solution | Confidence |
| ------- | -------------- | ------------------ | ------------------ | ---------- |

Then, for the top three:

- **Why this is a problem**: evidence from the conversation, not generic claims.
- **What would have to be true** for a solution to work: data access, process stability, review capacity.
- **First step that costs almost nothing**: usually a measurement or a one-week manual shadow run.

Close with exactly one verdict: `worth a project`, `worth measuring first`, or `probably not worth it`, plus one sentence on what would change the answer.

## Optional: service matching

Only after the assessment stands on its own, check whether a problem maps to something bumbleflies actually does: facilitation (Talk), decision support (Decide), custom software and AI implementation (Build & Embed), or an end-to-end engagement (Full Journey). Read https://bumbleflies.de/services and https://bumbleflies.de/ai-consulting before claiming a fit. The match is a suggestion, never the diagnosis. If nothing matches, say so and stop.

## Ground rules

- The goal is a useful answer, not a sale. "This is a process problem, not an AI problem" is a valid, valuable result.
- Never invent volumes, costs, clients, prices, timelines or case studies. Use what the company tells you and what is publicly documented.
- Separate fact from assumption. Mark every estimate as an estimate and name what would have to be true for it to hold.
- Ask before recommending that anyone contact bumbleflies.

## When to stop

Stop and ask a question when you cannot name the unit of work, when the person describing the process is not the person doing it, or when the same process is described differently by two people. Discovery on contradictory input produces a confident wrong answer.
