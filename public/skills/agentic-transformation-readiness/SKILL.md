---
name: agentic-transformation-readiness
description: "Use when someone asks whether their company could replace parts of its operations with autonomous AI agents, or how ready it is for agent-based workflows. Assesses process determinism, data and tool access, review capacity, failure tolerance, privacy and ownership, then names the first agent-shaped slice and what would break it."
---

# Agentic Transformation Readiness

An agent is not a better chatbot. It is a process that runs without someone driving every step. That only works where the surrounding conditions allow it, and those conditions are mostly organisational, not technical.

## When this is the right skill

- "Could we replace parts of our operations with autonomous agents?"
- A proof of concept worked and someone now wants it in production.
- Leadership wants an "agent strategy" before knowing which process an agent would run.

Do not use this skill to sell agents. A readiness result of "not yet" that saves a failed rollout is a success.

## Dimensions to assess

Score each 1 to 5 and attach the evidence: a quote, a document, or an observation. A score without evidence is an opinion.

| Dimension | Question | Low score looks like |
| --------- | -------- | -------------------- |
| Process stability | Does the process look the same every week? | Exceptions handled by one person's judgement |
| State access | Can an agent read and write the real state (tickets, CRM, files)? | Knowledge lives in mailboxes and heads |
| Tool surface | Are there APIs, or only UIs meant for humans? | Screenshot automation as the only path |
| Review capacity | Is there someone to check output, and time budgeted for it? | "Nobody will have time to review it" |
| Failure tolerance | What does one wrong action cost? | Actions are irreversible or customer-visible |
| Data rules | Is it clear what may leave the company, and where it may run? | No answer, or "we'll figure that out later" |
| Ownership | Who is accountable when the agent is wrong? | Ownership sits with "the AI team" |

The weakest dimension sets the readiness, not the average.

## Process

1. Pick one process, not the company. Readiness is per process.
2. Score the seven dimensions with evidence.
3. Name **the first agent-shaped slice**: the smallest piece that is repetitive, reversible and observable. Typically a draft, a classification, or an internal action with a human approval step.
4. Name **what would break it**: the first realistic failure and how a human would catch it.
5. Decide the operating mode: assistant (human acts), supervised agent (agent acts, human approves), or autonomous (agent acts, humans sample). Be explicit about which one the evidence supports.
6. Write the assessment.

## Output format

A one-line verdict followed by the score table with evidence, then:

- **First slice**: what the agent would do, on which system, with which approval step.
- **Guardrails needed before the slice runs**: three to five concrete ones (permissions, dry-run mode, audit log, kill switch, escalation path).
- **What would make us stop**: the observation that would end the project.

## Ground rules

- Do not confuse a working demo with a working process. A demo has curated input and no consequences.
- Never invent tool availability. If there is no API, say the first project is the API.
- Autonomy is earned by evidence, not declared in a strategy deck.
- If the conclusion is "hire an ops person before buying agents", say that.
