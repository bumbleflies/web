# Bumbleflies Homepage

Modern static site built with:
- [Astro 6.x](https://astro.build/)
- [React 19](https://react.dev/) components
- [TypeScript](https://www.typescriptlang.org/)

**Note:** The legacy Jekyll site is archived at [archive.bumbleflies.de](https://archive.bumbleflies.de).

## Quick Start

### Install dependencies

```bash
cd beta
npm install
```

### Development server

```bash
npm run dev
```

Runs at `http://localhost:3000` with hot module reloading.

### Build for production

```bash
npm run build
```

Outputs static site to `beta/dist/`.

### Preview production build locally

```bash
npm run preview
```

## Project Structure

```
beta/
├── src/
│   ├── components/          # Reusable Astro & React components
│   │   ├── Layout.astro    # Main page layout wrapper
│   │   ├── Nav.astro       # Navigation bar
│   │   ├── Footer.astro    # Footer
│   │   ├── Hero.astro      # Hero sections
│   │   ├── ServicePillar.astro
│   │   ├── TeamCard.astro
│   │   ├── CaseStudyCard.astro
│   │   └── ...             # Other feature components
│   ├── pages/              # Route-based pages
│   │   ├── index.astro     # Homepage
│   │   ├── [slug].astro    # Dynamic routes
│   │   └── ...
│   ├── content/            # Content collections (structured data)
│   │   ├── case-studies/   # Case study content & metadata
│   │   └── config.ts       # Content collection schemas
│   ├── styles/             # Global CSS and component styles
│   └── layouts/            # Reusable page layouts
├── public/                 # Static assets (images, fonts, etc.)
├── astro.config.mjs        # Astro configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & scripts
```

## Development Workflow

### Creating a New Page

1. Create a file in `src/pages/` (e.g., `src/pages/about.astro`)
2. Use the `Layout` component to wrap content:
   ```astro
   ---
   import Layout from '../components/Layout.astro';
   ---

   <Layout title="About Us">
     <h1>About Bumbleflies</h1>
     <!-- Page content -->
   </Layout>
   ```

### Creating Components

Components go in `src/components/`. They can be:
- **Astro components** (`.astro`) — Server-side rendered, zero JavaScript by default
- **React components** (`.tsx`) — Interactive client-side components

```astro
// src/components/MyComponent.astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="component">
  <h2>{title}</h2>
  <slot />
</div>

<style>
  .component {
    padding: 1rem;
  }
</style>
```

### Content Collections

Case studies and other content are managed as **Astro Content Collections** for type-safe structured data.

**Case Studies:**
- Location: `src/content/case-studies/`
- Schema defined in: `src/content/config.ts`
- Access in components via `getCollection()`:

```astro
---
import { getCollection } from 'astro:content';

const caseStudies = await getCollection('case-studies');
---

{caseStudies.map(study => (
  <CaseStudyCard study={study} />
))}
```

## Testing

Run tests with:

```bash
npm run test
```

Tests use [Vitest](https://vitest.dev/) with React Testing Library for component testing.

## Styling

- Global styles: `src/styles/`
- Component-scoped styles: Use `<style>` blocks in `.astro` and `.tsx` files
- Responsive design: Mobile-first approach with Astro's built-in viewport control

## Deployment

The site is deployed to production via GitHub Actions when changes are pushed to `main`.

See `.github/workflows/` for deployment configuration.

## Performance

- **Zero JavaScript by default** — Astro components are server-rendered
- **Partial hydration** — Only interactive React components ship JavaScript
- **Image optimization** — Use Astro's `<Image>` component for automatic optimization
- **Static generation** — All pages pre-rendered for instant load times

## Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |

## Learn More

- [Astro Documentation](https://docs.astro.build/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/)
