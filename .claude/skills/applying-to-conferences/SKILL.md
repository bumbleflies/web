---
name: applying-to-conferences
description: "Use when looking for speaking opportunities, vetting a conference CFP, submitting a talk proposal, or keeping the talks record up to date in docs/talks/. Covers the cost-neutral filter, CFP verification, the CFP.ninja CLI, dossier production, and the submission traps that silently waste an application."
---

# Applying to conferences

A speaking application is only worth writing if the CFP is genuinely open, the event costs nothing to attend, and someone can actually receive the proposal. Two of eight candidates on the first run failed one of those tests, and one submission was rejected by an API rule that no page mentions.

## Trigger

- "find me conferences to speak at", "where can I apply", "is this CFP open"
- preparing a talk proposal or speaker dossier
- updating `docs/talks/README.md`
- a deadline in the ledger below is approaching

## The three hard filters

Apply all three. A candidate that fails any one is out, regardless of prestige.

1. **CFP open, verified by opening the page.** Never trust a conference listing site, a "2027 edition" landing page, or your own earlier note. See the failure catalogue below.
2. **Cost-neutral.** One of: the event is in Berlin, the event is online, or the organisers explicitly cover travel and accommodation. A free speaker ticket does **not** count, because travel is the real cost.
3. **No pay-to-speak.** Any tier where a speaking slot depends on "supporting the team", sponsorship, or a paid package disqualifies the event.

## Verification procedure

Run these checks in order. Each one has caught a real dead end.

1. **Open the CFP page and read the event name and year in the form itself.** A form headed "Summit 2026" on a site advertising 2027 means the link was never updated.
2. **Check whether the programme is already published.** A speaker line-up with names on it usually means the CFP is closed even if a page still says "open".
3. **Read the deadline off the platform, not the marketing copy.** On CFP.ninja this is the "Call for Proposals" panel: opens, closes, and status.
4. **Confirm the attendance mode.** Look for `schema.org` structured data in the page source: `eventAttendanceMode`, `location.VirtualLocation`, and `offers.price`. This is faster and more reliable than reading marketing prose, and it settles the travel-cost question in seconds.
5. **Look at last year's talk titles.** If the exact angle you planned already ran, you need a different angle, not a better abstract.

## Finding candidates

Query the directory instead of guessing:

```bash
cfp events                        # everything with an open CFP
cfp events -q agent               # keyword search
cfp events -q ml
cfp events --status all           # include closed, for planning
cfp events conf42-agents-2027     # full detail incl. deadline and tracks
```

Also worth checking directly, because they are not always in the directory: Berlin meetup circuits, barcamps (no formal CFP, won by asking the organiser), and company-run events such as Harness's ChaosCarnival.

## Submitting

### Via the CLI (preferred)

```bash
cfp login
cfp submit <event-slug> --file proposal.yaml --dry-run
cfp submit <event-slug> --file proposal.yaml
cfp proposals
```

The YAML shape is shown on each event page under "SUBMIT VIA CLI", and the web form renders the same content as YAML once filled. Fields: `title`, `abstract`, `format`, `duration`, `level`, `speaker_notes`, `speakers[]` with `name`, `email`, `bio`, `job_title`, `company`, `linkedin`, `primary`.

**The trap that costs a round trip:** the speaker email must match the GitHub account email, or the API returns `At least one speaker email must match your account email`. On GitHub-OAuth platforms the bumbleflies identity therefore lives in the bio, job title and company fields, never in the contact address. Do not spend time crafting a branded alias for that field.

### Via a web form

Two known blockers:

- **Cloudflare Turnstile** renders at zero height in an automated browser and never issues a token. The POST comes back as a generic error with no field-level validation errors. Hand the form to a human in a normal browser window and require the confirmation message before closing the tab.
- **Google Forms behind sign-in** bounce to `accounts.google.com` re-verification. Ask the person to complete the sign-in; never type credentials.

## Producing the dossier

For an in-person conference, attach a PDF; for online events, usually not required.

1. Author one HTML file with `@page` rules, a cover, and a run of show. Keep it print-ready: `print-color-adjust: exact`.
2. Render with headless Chrome: `google-chrome --headless --incognito --no-pdf-header-footer --print-to-pdf=out.pdf file://$PWD/talk.html`
3. Count pages: `d['/Type /Page'] - d['/Type /Pages']` on the raw PDF bytes. Aim for five.
4. Inspect: `pdftoppm -png -r 70 out.pdf page` then read the images.
5. Set `break-inside: avoid` on callout boxes; a note that splits across a page leaves an orphan paragraph and looks like a bug.

Two content rules that reviewers check: state the **authorship boundary** explicitly (which parts of the work are the speaker's and which belong to colleagues), and give every number a **what it counts** and **how it is verified** column.

## Keeping the record

`docs/talks/` in this repo:

- `README.md` holds the status table and the selection rules. Update it in the same change as any new submission.
- one file per event, named `<event>-<year>.md`, containing: event, CFP URL, status and reference number, talk, format, the submitted abstract, and any follow-up.
- the repo is public. No email addresses, no phone numbers, no colleague names, no internal product detail beyond what the proposal itself already states publicly. Analysis derived from private conversations stays in the private portfolio notes.

## Failure catalogue

| Pattern | How it looks | Signal |
|---|---|---|
| Stale form | Landing page says 2027, the form header says 2026 | Read the form title, not the page title |
| Pay to speak | "Are you looking for a free speaking opportunity? / Yes, I'm willing to support the team" | Any question linking a slot to money |
| Closed but still advertised | "CFP open" widget, published speaker line-up | Check the programme page |
| Invite-only | "The 2027 series is invite-only; HQ selects speakers" | No public submission route at all |
| Dormant meetup | Chapter page with a last event months old | Check the most recent event date |
| Deadline already passed | Event three months out, CFP closed two months ago | Read the platform deadline |

## Current ledger

| Event | Date | Status |
|---|---|---|
| AI Festival, Milan | 11-12 Feb 2027 | submitted |
| Conf42 DevOps | 21 Jan 2027 | submitted, #7999 |
| Conf42 AI Agents | 2027 | submitted, #8000 |
| ChaosCarnival | 27-28 Jan 2027 | open, CFP closes 7 Jan 2027 |
| Berlin Buzzwords | 13-15 Jun 2027 | CFP opens Nov 2026 |
| WeAreDevelopers | 14-16 Jul 2027 | CFP not open yet |

Maintain this table here and in `docs/talks/README.md` together.
