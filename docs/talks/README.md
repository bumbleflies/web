# Talks and speaking applications

Record of conference and meetup submissions for bumbleflies. One file per event, plus this index.

## Status

| Event | When | Status | Talk |
|---|---|---|---|
| [AI Festival 2027, Milan](ai-festival-2027.md) | 11-12 Feb 2027 | **Submitted** 2026-10-30, confirmation received | Bounded autonomy |
| [Conf42 DevOps 2027](conf42-devops-2027.md) | 21 Jan 2027, online | **Submitted** 2026-10-30, proposal #7999 | Bounded autonomy |
| [Conf42 AI Agents 2027](conf42-ai-agents-2027.md) | 2027, online | **Submitted** 2026-10-30, proposal #8000 | The night shift |
| [ChaosCarnival 2027](chaoscarnival-2027.md) | 27-28 Jan 2027, online | Open, CFP closes 7 Jan 2027 | Not yet written |
| Berlin Buzzwords 2027 | 13-15 Jun 2027, Berlin | CFP opens Nov 2026 | Not yet written |
| WeAreDevelopers 2027 | 14-16 Jul 2027, Berlin | CFP not open yet | Not yet written |

## The three talks

**Bounded autonomy: 291 bot pull requests, zero merges without a person.** A fleet of AI agents inside a regulated legal-tech platform, and the technical brakes that make it defensible. The merge hook, config as commit, the release ladder, the reporting contract. Emitted to Milan and Conf42 DevOps.

**The night shift: what your agents do at 3 a.m.** The same fleet, seen from the other side: unattended overnight work, sessions that terminate and revive, and the morning audit. Emitted to Conf42 AI Agents.

**Agent design rules for regulated domains.** The ruleset rather than the story, derived from failures. Written, not yet submitted; the best fit was Edinburgh, whose CFP closed before we got there.

## Selection rules

Every event here passed the same filter:

- **CFP verified open by opening the page**, not by trusting a conference listing. Two entries on the original shortlist were dead: one form pointed at a previous year's edition, one CFP had closed two months earlier.
- **Cost-neutral.** Berlin-local, online, or explicitly travel-funded. A free speaker ticket alone does not count, because travel is the real cost.
- **No pay-to-speak.** Any "support the team" tier disqualifies.

## What does not belong here

This repository is public. Keep personal contact details, colleague opinions, and internal product detail out of these files. Analysis derived from private conversations stays in the private portfolio notes.

## Registration

Conf42 and ChaosCarnival run through CFP.ninja. The CLI submits a proposal from YAML:

```bash
cfp login
cfp submit <event-slug> --file proposal.yaml
cfp proposals
```

One constraint learned the hard way: the speaker email in the proposal must match the GitHub account email, or the API rejects it with `At least one speaker email must match your account email`. On GitHub-OAuth CFP platforms, the bumbleflies identity lives in the bio, job title and company, not the contact address.

CC0-1.0
