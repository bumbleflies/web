# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context

**Bumbleflies Homepage** — Static site for bumbleflies.de built with **Astro 6.x** (CURRENT PRODUCTION).

**Repository Structure:**
- `beta/` — Current production site (Astro 6.x, React, TypeScript) — **See `beta/CLAUDE.md` for detailed guidance**
- Legacy Jekyll site — Archived at archive.bumbleflies.de (maintained for reference only)

## Active Development

**For current production work, see `beta/CLAUDE.md`** which covers:
- Astro 6.x development commands (dev, build, test, type check)
- Component architecture (Astro + React)
- Content collections system
- Testing with Vitest
- Docker deployment to production

## Legacy Jekyll Site (Archived)

The original Jekyll site has been archived at archive.bumbleflies.de. If you need to work on the legacy site for maintenance or reference:

**Basic commands:**
```bash
# Build
bundle exec jekyll build

# Serve locally at http://localhost:4000
bundle exec jekyll serve

# Run tests
pytest _tests/
```

**Key directories:**
- `_pages/` — Markdown pages with i18n front matter
- `_data/` — YAML configuration (navigation, team, translations)
- `_i18n/` — German (de.yml) and English (en.yml) translations
- `_sass/` — Stylesheets
- `_tests/` — Python pytest integration tests

For detailed Jekyll documentation, see the project history or archived references. The legacy site is no longer under active development.

## References

- **Production Site Docs:** `beta/CLAUDE.md` — All development guidance for Astro
- **README:** `README.md` — Overview and quick reference
- **Project Spec:** `/home/cda/dev/infrastructure/bumbleflies/PROJECT_HANDOFF.md`
