# ChaosCarnival 2027

- **Event:** ChaosCarnival, 27-28 Jan 2027, online
- **CFP:** `https://cfp.ninja/e/chaoscarnival-2027`, closes **7 Jan 2027**
- **Host:** Harness
- **Status:** open, not yet submitted
- **Cost:** zero. The event's structured data declares `OnlineEventAttendanceMode`, a virtual location, and a price of 0. No travel, no ticket.
- **Tracks:** Chaos Engineering, Load and Performance, Disaster Recovery, **AI Agent Resilience**, **Agentic Developers**, Resilience Culture

## Why it qualifies

Two of the six tracks are the subject. The strongest angle is not "agents can fail" but "agents are a new failure domain, and the recovery procedure is a design decision".

## Differentiators to check before writing

The 2026 edition already ran a talk called *Hallucination Cascades: Chaos Testing What Happens When AI Agents Lie to Each Other*. So the "agents lie" angle is taken. The uncontested ground is the overnight failure mode and the morning audit: what you can reconstruct at 9 a.m. from what a fleet did at 3 a.m., and what you deliberately made impossible.

## Pitch: "The 3 a.m. incident you did not see"

**Claim.** Unattended agents fail quietly, and quiet failures are worse than loud ones. Resilience for an agent fleet is therefore mostly about making failure audible, not about preventing it.

**Structure, 25 minutes**

1. The failure that made no noise: a sweep that announced a run it could not perform, and how long it stayed true-looking.
2. Three structural brakes: the merge hook, dry runs against live data that write nothing, and switches that are reviewed commits rather than runtime settings.
3. The recovery procedure: what the morning audit consists of when every bot commit carries a pull request number, and what it cannot tell you because five bots share one identity.
4. The undecidable backlog: 33 items with no owner, and the rule that a gap moves to a named human rather than sitting in a queue.
5. What to build first if you have one afternoon: one brake, one dry-run mode, one report that cannot lie.

**Evidence.** 291 bot pull requests, 113 tickets with automated QA records, 32 screen recordings, about 20 retired known-bug markers, zero bot merges.

## If it goes ahead

Reuse the Conf42 AI Agents abstract as the base and re-cut the middle section toward failure and recovery rather than token economics. Same recording pipeline.
