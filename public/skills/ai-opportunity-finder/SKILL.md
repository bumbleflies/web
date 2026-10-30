---
name: ai-opportunity-finder
description: "Use when someone asks which of their business processes would benefit from AI, or whether a specific process should use AI at all. Separates three cases that are constantly confused: AI where input is unstructured, deterministic automation where rules are stable, and agentic workflows where judgement and tools alternate. Produces a per-process verdict with a cheaper alternative named for every AI recommendation."
---

# AI Opportunity Finder

Most "AI opportunities" are ordinary automation, and most ordinary automation projects are mislabelled as AI. This skill sorts one from the other before anyone spends money.

## When this is the right skill

- "Which of our processes would benefit from AI?"
- "Should we use AI for invoice processing, or just automate it?"
- A vendor pitched an AI product and the team wants a second opinion.

If the company does not yet know where its problems are, run `business-problem-discovery` first.

## The three cases

| Case | Fits when | Typical work |
| ---- | --------- | ------------ |
| Deterministic automation | Structured input, stable rules, exceptions are rare or cheap | Rules, scripts, workflow engine, OCR with fixed templates |
| AI | Input is unstructured (text, scans, images, speech), or rules would be a list of hundreds of special cases | Model call with a narrow task, extraction, classification, summarisation |
| Agentic workflow | Several steps, tool calls, and judgement alternate; the path is not known in advance | Agent with a fixed tool set, checkpoints, human review |

A useful test: write down the decision rule. If you can write it in ten lines, automate it. If you would need a paragraph of "it depends", AI is a candidate. If the steps themselves depend on what the previous step found, an agent is a candidate.

## Process

1. **Describe the process as it runs today**: trigger, steps, who does what, where output goes.
2. **Look at the input.** Structured fields, scanned paper, free text, email, PDFs, images? Input shape decides more than ambition does.
3. **Look at the error cost.** What happens when the output is wrong, and who notices? High error cost means a review step, which changes the economics.
4. **Classify** into one of the three cases above and say why in one sentence.
5. **Name the cheaper alternative.** For every AI recommendation, state what the boring solution would cost and why it is not enough. If it is enough, recommend it.
6. **Name the value driver**: hours saved, cycle time, error rate, capacity, or revenue. "Better insights" is not a value driver.
7. **Write the verdict.**

## Output format

| Process | Input shape | Today | Verdict | Why not the simpler option | Value driver |
| ------- | ----------- | ----- | ------- | -------------------------- | ------------ |

Then for each `AI` or `agentic` verdict:

- **Model task** in one sentence, narrow enough to be testable.
- **What the model must not decide** on its own.
- **How to measure it**: a small labelled sample and the accuracy that would make the project worth continuing.
- **Failure mode** that would make this a bad idea.

Close with the two or three processes worth doing first, in order, and one sentence on what to stop doing entirely.

## Ground rules

- Never call a process "AI-ready" without describing its input and its error cost.
- Do not invent accuracy numbers, vendor comparisons or prices.
- Automation with a rules engine is a perfectly good answer, and often the best one.
- Ask before recommending a specific vendor, including bumbleflies. If a fit is real, point to https://bumbleflies.de/ai-consulting and let the reader decide.
