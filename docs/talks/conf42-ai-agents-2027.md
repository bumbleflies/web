# Conf42 AI Agents 2027

- **Event:** Conf42 AI Agents 2027, online-only, pre-recorded, streamed on YouTube
- **CFP:** `https://cfp.ninja/e/conf42-agents-2027`, open until 26 Aug 2027
- **Status:** submitted 2026-10-30, proposal **#8000**
- **Talk:** The night shift: what your agents do at 3 a.m.
- **Format:** talk, 30 minutes, advanced

## Why this talk exists

The DevOps submission is about the brake. This one is about the room after everyone leaves. Same fleet, different claim: the design problem of unattended work is not making the model smarter, it is making the morning readable.

## Abstract

> Most agent demos happen while someone is watching. The interesting work happens after everyone logs off. In this talk I take apart an unattended overnight pipeline: developers prepare the backlog in the afternoon, a fleet of five agents works through idle windows in the night, and by morning there are pull requests, test evidence and a report that either holds up or does not.
>
> What makes it usable is not smarter models, it is boring engineering. Sessions end when their job ends and are revived from a narrow state file, which cut token spend by 30 to 40 percent. Every bot commit carries a pull request number, so the morning audit is a search rather than an interview. A reporting contract forbids claiming a test that was skipped. A pre-tool hook blocks every merge form, so nothing lands without a person.
>
> The numbers: 291 bot pull requests merged into the test tooling that guards a regulated legal-tech platform, 113 tickets with automated QA records, 32 screen recordings, about 20 retired known-bug markers, zero bot merges. Four failures, each with the guard it produced, and the one metric that matters: escaped defects per bot pull request, not pull request count.

## Reviewer notes

Six beats: the claim, the setup (afternoon backlog, idle windows, terminate and revive), the audit trail (PR numbers, qa records, evidence folders, shared bot identity), the contract (a UI case that cannot run is posted as outstanding, never as passed), the four failures, and the close on the honest metric.

## Provenance

Built from a session recording of an internal tech exchange on 7 Oct 2026, where the overnight setup, the token economics and the review problem were discussed at length. The recording also contains a genuine disagreement about whether agent loops are deterministic state machines that multiply errors or produce emergent behaviour. That disagreement is good material for the talk; it is not quoted, because it belongs to the people who made it.
