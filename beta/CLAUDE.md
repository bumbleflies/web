# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bumbleflies Homepage** is a modern static site built with **Astro 6.x**, **React 19**, and **TypeScript**. It features:
- Component-based architecture (Astro + React)
- Type-safe content collections for case studies, testimonials, and team
- Bilingual support (German/English)
- Static site generation with zero JavaScript by default
- Docker deployment to nginx

The legacy Jekyll site is archived at archive.bumbleflies.de. This Astro build is the current production site.

## Development Commands

### Setup
```bash
cd beta
npm install
```

### Development
```bash
npm run dev
```
Runs local dev server at `http://localhost:3000` with hot module reloading and Astro's view transitions.

### Building
```bash
npm run build
```
Generates optimized static site in `beta/dist/`. This is what gets containerized for production.

### Preview Production Build
```bash
npm run preview
```
Serves the built site locally to verify production output before deployment.

### Testing
```bash
npm run test
```
Runs Vitest suite with React Testing Library. Tests live in `beta/tests/` (e.g., `Nav.test.ts`).

### Type Checking
```bash
astro check
```
Validates TypeScript and Astro component types. Uses Astro's strict tsconfig.

## Project Architecture

### Directory Structure

```
beta/
├── src/
│   ├── pages/                 # Route-based pages (file = URL)
│   │   ├── index.astro       # Homepage (/)
│   │   ├── about.astro       # About page
│   │   ├── services.astro    # Services page
│   │   ├── case-studies.astro  # Case studies listing
│   │   ├── case-studies/     # Dynamic case study routes
│   │   │   └── [slug].astro  # Route: /case-studies/:slug
│   │   └── en/               # English versions (prefix URLs with /en/)
│   ├── components/           # Reusable Astro & React components
│   │   ├── Layout.astro      # Main page wrapper (nav, footer, layout)
│   │   ├── Nav.astro         # Navigation (with language toggle)
│   │   ├── Hero.astro        # Hero sections
│   │   ├── CaseStudyCard.astro
│   │   ├── ServicePillar.astro
│   │   ├── TeamCard.astro
│   │   └── ...               # Other feature components
│   ├── content/              # Type-safe content collections
│   │   ├── case-studies/     # Markdown case study files
│   │   ├── testimonials/     # Markdown testimonial files
│   │   ├── team/             # Markdown team member files
│   │   ├── pages/            # Markdown page content (home, etc.)
│   │   └── config.ts         # Zod schemas for collections
│   ├── styles/               # Global CSS
│   ├── layouts/              # Reusable page layouts (if needed)
│   └── lib/
│       ├── astro-loaders.ts  # Custom content loaders
│       └── nestedtext.ts     # NestedText format support
├── public/                   # Static assets (images, fonts)
├── tests/                    # Vitest test files
├── astro.config.mjs          # Astro configuration
├── vitest.config.ts          # Vitest configuration
├── tsconfig.json             # TypeScript config (extends astro/strict)
├── package.json              # Dependencies
├── Dockerfile                # Production container image
└── nginx.conf                # nginx configuration for container
```

### Key Technologies

| Technology | Purpose |
|-----------|---------|
| **Astro** | Static site generation, component framework |
| **React** | Interactive components (islands architecture) |
| **TypeScript** | Type safety across codebase |
| **Astro Content Collections** | Type-safe structured content (case studies, testimonials) |
| **Vitest** | Unit testing with happy-dom environment |
| **React Testing Library** | Component testing utilities |
| **Docker** | Production containerization |
| **nginx** | Production web server |

## Content Collections

Content collections are defined in `src/content.config.ts` and provide type-safe access to structured data.

### Case Studies
- **Location:** `src/content/case-studies/*.md`
- **Schema:** title, service, company, duration, outcome, quote, image, etc.
- **Usage:** 
  ```astro
  import { getCollection } from 'astro:content';
  const caseStudies = await getCollection('case-studies');
  ```
- **Dynamic Routes:** `src/pages/case-studies/[slug].astro` maps Markdown files to URLs

### Testimonials
- **Location:** `src/content/testimonials/*.md`
- **Schema:** author, role, company, quote, image
- **Filtered by:** `published: true` (default)

### Team
- **Location:** `src/content/team/*.md`
- **Schema:** name, role, bio, image, order
- **Note:** Images must exist in `public/` directory

### Pages
- **Location:** `src/content/pages/`
- **Purpose:** Content data for main pages (home, services, etc.)
- **Custom Loader:** Uses NestedText format (see `lib/nestedtext.ts`)

## Component Guidelines

### Astro Components (`.astro`)
- Server-rendered only (zero JavaScript by default)
- Use for static layout and structure
- Example: `Layout.astro`, `Nav.astro`, `Hero.astro`
- File-scoped styles with `<style>` blocks

### React Components (`.tsx`)
- Client-interactive components
- Only ship JavaScript when necessary
- Use `client:` directives to control hydration:
  ```astro
  <ThemeToggle client:load />  <!-- Hydrate immediately -->
  <Modal client:visible />     <!-- Hydrate when visible -->
  ```
- Props must be serializable

### Patterns
- **Props Interface:** Define `interface Props` in component script
- **Slots:** Use `<slot />` for content projection
- **Type Safety:** All components use TypeScript strict mode

## Page Routing & Languages

- **Base URL structure:** Pages in `src/pages/` route directly to URLs
- **English variants:** Place English pages in `src/pages/en/` subdirectory
- **Dynamic routes:** Use `[slug]` pattern (e.g., `[slug].astro`)
- **i18n:** Language switching handled via `LangToggle` component (hardcoded language context for now)

## Testing

- **Test files:** `beta/tests/*.test.ts` or `*.spec.ts`
- **Framework:** Vitest with happy-dom (lightweight DOM simulation)
- **Utilities:** React Testing Library for component testing
- **Example:**
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { render, screen } from '@testing-library/react';
  import Nav from '../src/components/Nav.astro';
  ```

## Deployment

### Build Process
1. Push to `master` branch with changes in `beta/` directory
2. GitHub Actions workflow: `.github/workflows/build-www.yml` triggers
3. Docker image built from `beta/Dockerfile` 
4. Image tagged as `bumblecode/web:www` and pushed to Docker registry

### Production Container
- **Base:** nginx:alpine
- **Process:** Multi-stage build (Node.js builder → nginx runtime)
- **Health Check:** HTTP GET to `/` every 30 seconds
- **Port:** 80
- **Static Files:** Served from `dist/` directory

### Pre-deployment Verification
- Run `npm run test` to validate tests
- Run `npm run build` to verify production build
- Run `npm run preview` to test containerized output locally

## Performance Considerations

- **Zero JavaScript by default:** Astro server-renders components
- **Partial hydration:** Only interactive React components ship JavaScript
- **Image optimization:** Use `<Image>` component for automatic optimization
- **Static generation:** All pages pre-rendered, instant load times
- **Docker caching:** GitHub Actions uses GHA cache for faster builds

## TypeScript & Type Safety

- **Config:** `tsconfig.json` extends `astro/tsconfigs/strict`
- **Content Types:** Collection schemas auto-generate TypeScript types
- **Component Props:** Define `interface Props` for type-safe component APIs
- **View Transitions:** Astro's type-safe router with `getCollection()`

## Git & Branching

- **Main branch:** `master` (production)
- **Feature branches:** Create from `master`, prefix with feature type (e.g., `feat/new-page`, `fix/nav-bug`)
- **Automation:** Changes in `beta/` trigger Docker build workflow

## Notes & Quirks

### Content Collections
- NestedText loader (`lib/nestedtext.ts`) supports custom page content format
- Always run `astro check` before committing to catch type errors early

### Language Support
- Currently hardcoded to German (`currentLang: 'DE'`) in pages
- English versions exist in `src/pages/en/` but language switching needs completion

### Docker Image
- Built from `beta/` directory only (not the legacy Jekyll site)
- nginx serves all files from `dist/` with health checks

## Useful References

- [Astro Docs](https://docs.astro.build/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
