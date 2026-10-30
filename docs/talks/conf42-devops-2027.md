# Conf42 DevOps 2027

- **Event:** Conf42 DevOps 2027, 21 Jan 2027, online, pre-recorded, premieres on YouTube
- **CFP:** `https://cfp.ninja/e/conf42-devops-2027`, open until 25 Dec 2026
- **Status:** submitted 2026-10-30, proposal **#7999**
- **Talk:** Bounded autonomy: 291 bot pull requests, zero merges without a person
- **Format:** talk, 30 minutes, advanced

## Why it fits a DevOps room

The material is pipeline mechanics rather than an AI product story: a hook in the execution path, release switches as reviewed commits, dry runs against live data, a four-layer release ladder, and a reporting contract that stops a bot claiming a test it skipped.

## Abstract

> Everyone can wire an agent into a pipeline. Few can answer the question an auditor asks next: who is allowed to merge? Over three and a half months, a fleet of five AI agents opened 291 pull requests into the end-to-end test tooling that guards a regulated legal-tech platform. Not one of those merges happened without a person, and not because a policy said so: a pre-tool hook refuses the command.
>
> This talk is about the pipeline that makes that true. Dry runs against live data that write nothing. Feature switches stored as reviewed git commits instead of container environment variables. A four-layer release ladder from sandbox to production. A reporting contract that stops a bot claiming a test it silently skipped. And four failures, each with the guard that came out of it.

## Reviewer notes

Where the talk goes: the merge block (a hook outside the model's cooperation); config as commit; the release ladder; the reporting contract; the shared-identity caveat behind the numbers; then four failures with the guards they produced (a stale ticket claim that locked a run, a sweep that announced a run it could not perform, an undecidable backlog that reached 33 ownerless items, a night shift that repaired breakage nobody asked it to).

Attribution is stated on the slide: a colleague built the fleet framework; the sweeps, guard hooks, QA skills, nightly orchestration and session hub are the speaker's.

## Next step if accepted

Record 25 to 30 minutes, screen-led, 1080p, with the merge-block demo shot live rather than described. The recording doubles as the video pitch for every later application.
