---
name: sync-agent-content
description: "Use after any page, content collection, or navigation change to keep llms.txt, llms-full.txt, agents.txt, and robots.txt in sync with the actual site."
---

# Sync Agent Content

Keep machine-readable files accurate whenever pages or content change.

## Trigger

Run this skill after:
- Adding/removing/modifying pages in `src/pages/`
- Adding/removing case studies, blog posts, or team members
- Changing navigation structure
- Updating page descriptions or content

## Files to Maintain

| File | Purpose | Location |
|------|---------|----------|
| `llms.txt` | Curated site summary for LLMs | `public/llms.txt` |
| `llms-full.txt` | Full content descriptions for RAG | `public/llms-full.txt` |
| `agents.txt` | Machine-readable page directory | `public/agents.txt` |
| `robots.txt` | Crawler access rules | `public/robots.txt` |

## Process

### 1. Scan Current State

```bash
# Find all static pages (exclude dynamic routes like [slug])
find src/pages -name '*.astro' -not -path '*\[*' | sort

# Find case studies
ls src/content/case-studies/*.md 2>/dev/null

# Find team members
ls src/content/team/*.md 2>/dev/null

# Find blog posts (check which are published)
grep -l 'published: true' src/content/blog/*.md 2>/dev/null
```

### 2. Build Page Map

Create a map of every page with:
- URL path (from file location)
- Page title (from frontmatter or hardcoded)
- Description (from Layout props or page content)
- Language (DE if in `src/pages/`, EN if in `src/pages/en/`)
- Category (services, how-we-work, case-studies, blog, legal, etc.)

### 3. Update `agents.txt`

Simple, flat format. One entry per line: `Label: https://bumbleflies.de/path/`

Structure:
```
# Site
Homepage: ...
About: ...
Services: ...

# Case Studies
Case Studies: ...
[each case study]: ...

# Blog
Blog: ...

# Legal
Impressum: ...
Datenschutz: ...

# English
EN Home: ...
EN About: ...
[repeat all pages under /en/]

# Machine-Readable Files
llms.txt: ...
llms-full.txt: ...
facts.json: ...
Agent Card: ...
robots.txt: ...
Sitemap: ...
RSS (DE): ...
RSS (EN): ...
```

Update the `# Updated:` date on line 3.

### 4. Update `llms.txt`

Markdown format with sections. Each page gets a link + one-line description.

Structure:
```markdown
<!-- agent greeting comment -->

# bumbleflies

> Tagline

## Services
- [Name](url): Description

## How We Work
- [Name](url): Description

## Case Studies
- [Company — Outcome](url): Summary

## Team
- [Name](url) — Role. Description

## About
- [About](url): Description

## Pages
- [Name](url): Description

## English Pages
- [Name (EN)](url): Description

## Contact
- Email, LinkedIn, GitHub, Social

## For Agents
- Welcome page, agents.txt, facts.json, Agent Card
```

### 5. Update `llms-full.txt`

Extended version of llms.txt with fuller descriptions for each page. Same structure but each entry gets 2-4 sentences instead of one.

Include:
- Full service descriptions
- Case study summaries (what we did, outcome)
- Team bios
- "Why We Exist" integrated model description
- "English Pages" section linking all /en/ pages

### 6. Update `robots.txt`

For each AI crawler (GPTBot, ClaudeBot, PerplexityBot, etc.), ensure these paths are explicitly `Allow:`ed:
- `/`
- `/llms.txt`
- `/llms-full.txt`
- `/agents.txt`
- `/facts.json`
- `/.well-known/agent-card.json`

Keep standard search engines (Googlebot, Bingbot) with just `Allow: /`.
Keep aggressive scraper blocks (Bytespider, DotBot).

Add a comment block at the bottom listing all machine-readable files.

### 7. Verify

```bash
npm run build
# Check sitemap includes all pages
grep -oP '(?<=<loc>https://bumbleflies.de)[^<]+' dist/sitemap-0.xml | sort
```

## Page Description Guidelines

- One line in `llms.txt`, 2-4 sentences in `llms-full.txt`
- Lead with the value, not the feature
- Include concrete outcomes for case studies
- Use plain language, no marketing speak
- Mention Munich/DACH region where relevant

## When Pages Change

| Event | Action |
|-------|--------|
| New page added | Add to all 3 files (DE or EN section) |
| Page removed | Remove from all 3 files |
| Page renamed | Update URL in all 3 files |
| Description changed | Update description in llms.txt + llms-full.txt |
| New case study | Add to Case Studies section in all 3 files |
| Blog post published | Add to Blog section (only if `published: true`) — full checklist: `src/content/blog/AGENTS.md` |
| Team member added | Add to Team section in all 3 files |
| Navigation changed | Verify llms.txt section order matches site nav |
