# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context

This is the **Jekyll legacy production site** for bumbleflies.de (CURRENT PRODUCTION).

**Status:** This is the live/production website. A new Astro 6.x redesign is in development in the `beta/` subdirectory (see parent CLAUDE.md for that).

**Key characteristics:**
- **Jekyll 4.x** static site generator (Ruby-based)
- **Multilingual**: German (de) and English (en) via `jekyll-multiple-languages-plugin`
- **Theme**: Agency Jekyll Theme (`jekyll-agency`)
- **Testing**: Python pytest integration tests validate built site
- **Deployment**: GitHub Actions CI/CD pipeline (build → test → stage → live)
- **Data-driven**: Navigation, team, translations, and styles managed in YAML files

## Development Commands

### Setup & Installation

```bash
# Install Ruby dependencies
bundle install

# If bundler permission error (bundler 2.4.x):
mkdir ~/.gems_cache
bundle config path ~/.gems_cache
bundle install
```

### Build & Serve

```bash
# Build the site locally
bundle exec jekyll build

# Serve locally at http://localhost:4000 (auto-rebuilds on changes)
bundle exec jekyll serve

# Build to a specific directory (used by tests)
bundle exec jekyll build -d _test_site
```

### Testing

```bash
# Install test dependencies (first time only)
pip install -r _tests/requirements.txt

# Run all integration tests
pytest _tests/

# Run a specific test file
pytest _tests/test_homepage_team.py

# Run tests with verbose output
pytest _tests/ -v

# Run a specific test function
pytest _tests/test_homepage_team.py::test_team_section_exists -v
```

**Test Details:**
- Tests validate the **built site** (`_site/` or `_test_site/`)
- Fixture automatically: builds Jekyll → runs HTTP server on :8000 → runs tests → validates all links, structure, i18n keys
- Key test modules: `test_on_every_page.py` (common), `test_homepage_team.py` (team section), `test_rich_results.py` (schema), `test_sitemap.py`, `test_redirects.py`

### CSS & Asset Optimization

```bash
# Purge unused CSS and FontAwesome icons
cd _purge
./purge.sh
```

## Architecture & Data Structure

### Directory Layout

```
bumbleflies.github.io/
├── _pages/                 # Markdown pages (in _pages/, NOT root)
├── _layouts/               # Page templates (default, standard, compose, google-form, redirect)
├── _includes/              # Reusable template components (header, footer, team.html, etc.)
├── _data/                  # YAML configuration files
│   ├── navigation.yml      # Main navigation menu (i18n keys → page namespaces)
│   ├── team.yml            # Team member data (images, names, roles)
│   ├── style.yml           # Color & image variables (background images, colors, fonts)
│   ├── footer.yml          # Footer configuration
│   ├── social.yml          # Social media links
│   ├── image.yml           # Image metadata
│   └── files.yml           # File references
├── _i18n/                  # Translation files
│   ├── de.yml              # German translations (hierarchical keys)
│   └── en.yml              # English translations
├── _sass/                  # SCSS stylesheets
│   ├── base/               # Variables, mixins, page styles
│   ├── components/         # Buttons, navbar, cards
│   └── layout/             # Masthead, services, team, contact, footer
├── assets/
│   ├── css/                # Compiled CSS (bumble.scss is the main source)
│   ├── img/                # Images (organized by section: team/, services/, etc.)
│   ├── js/                 # JavaScript
│   └── fonts/              # Font files
├── _tests/                 # Python pytest tests
├── _purge/                 # CSS/FontAwesome purge scripts
├── _config.yml             # Jekyll configuration
├── Gemfile                 # Ruby dependencies
└── README.md               # Quick reference
```

### Page Front Matter

Every markdown file in `_pages/` requires front matter:

```yaml
---
layout: <layout-name>           # e.g., standard, default, compose, google-form, redirect
namespace: <name>               # Used for URL translation with {% tl %}
permalink: <url-de>             # German URL path
permalink_en: <url-en>          # English URL path
nav_highlight: <i18n-key>       # Navigation item to highlight (from navigation.yml)
title: <i18n-key>               # Page title (resolved from i18n)
---
```

### Internationalization (i18n)

The site uses `jekyll-multiple-languages-plugin` with translations in `_i18n/en.yml` and `_i18n/de.yml`.

**Key patterns:**

- **Page-level translation**: Front matter `title:` references an i18n key. The `default` layout automatically translates it.
- **Template-level translation**: Use `{% t key.to.look.up %}` for simple variables.
- **Chaining filters**: `{% t key | filter %}` does NOT work. Use `{% capture %}` instead:
  ```liquid
  {% capture translated_content %}{% t key.to.look.up %}{% endcapture %}
  {{ translated_content | markdownify }}
  ```
- **URL translation**: Use `{% tl namespace %}` in templates to resolve the current page's localized URL.

### Styling & Design System

**Color & Image Variables** (`_data/style.yml`):
- Defines primary colors, fonts, and image paths
- Variables accessible in SCSS as `{{ site.data.style.variable-name }}`

**SCSS Processing** (`assets/css/bumble.scss`):
- Must have YAML front matter (`---`) for Jekyll to process it
- Imports SCSS variables from `_data/style.yml`
- Organizes styles into: base (variables, mixins), components (buttons, navbar), and layout (pages, sections)

**Adding Background Images:**
1. Add YAML entry to `_data/style.yml`: `new-page-image: "/assets/img/new.webp"`
2. Import as SCSS variable in `bumble.scss`: `$new-page-image: "{{ site.data.style.new-page-image }}";`
3. Create style rule in `_sass/_header_images.scss`:
   ```scss
   &.new-page-image {
     background-image: url("#{$new-page-image}");
   }
   ```
4. (Optional) Add preload link to `_includes/head.html` for performance
5. Use CSS class in page YAML: `header: image-class: new-page-image`

### Jekyll Configuration (`_config.yml`)

Key settings:

```yaml
languages: ["de", "en"]           # Supported languages
default_locale_in_subfolder: false # Don't use /de/, /en/ subfolders
locale: "de-DE"                    # Default locale
exclude_from_localizations: [...]  # Assets not to translate
plugins:
  - jekyll-multiple-languages-plugin
  - jekyll-github-metadata
  - jekyll-redirect-from
  - jekyll-agency
```

## Common Workflows

### Adding a New Page

1. Create markdown file in `_pages/` (e.g., `_pages/services/consulting.md`)
2. Add front matter with `layout`, `namespace`, `permalink`, `permalink_en`, `nav_highlight`, `title`
3. Add translation keys to both `_i18n/en.yml` and `_i18n/de.yml` (hierarchy: `pages.section.key`)
4. Update `_data/navigation.yml` if it should appear in nav
5. Add background image (if needed) following the image workflow above
6. Test locally: `bundle exec jekyll serve`
7. Validate: `pytest _tests/`

### Updating Translations

1. Edit `_i18n/en.yml` (English) and `_i18n/de.yml` (German)
2. Use hierarchical keys: `pages.section.key` for pages, `nav.item` for navigation
3. Rebuild to see changes: `bundle exec jekyll build`

### Modifying Navigation

1. Edit `_data/navigation.yml`
2. Navigation items reference i18n keys (for labels) and page namespaces (for URLs)
3. Update both German and English keys if adding new items

### Updating Team Data

1. Edit `_data/team.yml` with member details
2. Add team member images to `assets/img/team/`
3. The `_includes/team.html` template renders this data

## CI/CD & Deployment

### GitHub Actions Pipeline

**Workflow:** `build-deploy.yml` (orchestrator)
- **Part 1 (build-test.yml)**: Builds Jekyll, uploads artifacts, runs pytest
- **Part 2 (deploy-stage.yml)**: Deploys to staging environment
- **Part 3 (deploy-live.yml)**: Deploys to production

**Trigger:** Push to `main` branch (legacy site) or `feature/bumbleflies-redesign` (new features)

## Notes & Quirks

### Page & File Organization
- **Page location**: Pages go in `_pages/`, NOT the root directory
- **Site directory**: Built site outputs to `_site/` (or `_test_site/` during tests)
- **CSS processing**: `bumble.scss` must have YAML front matter (`---`) for Jekyll to process it
- **Font Awesome**: New FA icons must be added to `_purge/purge-fa.py` before running purge script

### i18n Patterns
- **i18n Chaining**: `{% t key | filter %}` does NOT work; use `{% capture %}` instead
- **Missing keys**: Test suite validates all i18n keys; both `_i18n/en.yml` and `_i18n/de.yml` must have matching hierarchies

### Bundler Permissions
- Modern Ruby/Bundler may require user-writable gems cache
- If permission error: `mkdir ~/.gems_cache && bundle config path ~/.gems_cache`

### Link Validation
- Test suite validates all links; broken redirects or missing translations will fail CI/CD

## Troubleshooting

**Build fails with permission error:**
```bash
mkdir ~/.gems_cache
bundle config path ~/.gems_cache
bundle install
```

**Tests fail:**
- Ensure `bundle exec jekyll build` succeeded first
- If markup changed, verify `_includes/` and `_layouts/` are correct
- Check both `_i18n/en.yml` and `_i18n/de.yml` have matching keys

**Styles not updating:**
```bash
rm -rf _site
bundle exec jekyll build
```

**i18n keys missing:**
- Check both `_i18n/en.yml` and `_i18n/de.yml` have the same key hierarchy
- Use `pytest _tests/ -v` to see which keys are missing

## References

- **Quick Start:** See `README.md` in this directory
- **Astro Beta Site:** See parent directory `CLAUDE.md` for new redesign docs
- **Project Status:** See `../PHASE_1_SUMMARY.md`
- **Full Spec:** `/home/cda/dev/infrastructure/bumbleflies/PROJECT_HANDOFF.md`
