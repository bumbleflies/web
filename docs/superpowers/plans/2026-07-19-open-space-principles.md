# Open Space Principles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, bilingual "Open Space Principles" page presenting the 5 principles + 1 law as a full-viewport slide sequence, reusing bumbleflies' existing mascot illustrations, discoverable only via the footer and a contextual services-page link (not top nav).

**Architecture:** Extend the existing `pages` NestedText content collection with a `principles` array field; a new `PrincipleSequence.astro` component renders the slide sequence using vanilla-JS navigation logic extracted into a small, independently-tested `sequenceNav.ts` module; two new page routes (`/open-space`, `/en/open-space`) compose the component with `Layout`/`Nav`/`CTAStrip`/`Footer` exactly as every other page does.

**Tech Stack:** Astro 7, TypeScript, Vitest (happy-dom), the project's custom NestedText content loader (`beta/lib/nestedtext.ts` + `beta/lib/astro-loaders.ts`), ImageMagick (`magick` CLI, dev-time asset prep only).

**Spec:** `docs/superpowers/specs/2026-07-19-open-space-principles-design.md`

## Global Constraints

- `.nt` content files must contain **no `|` block scalars** — every field is a single inline line (the parser has no block-scalar support; see `docs/superpowers/specs/2026-07-19-open-space-principles-design.md` background and prior incident on `ai-consulting.nt`).
- Reuse the existing `pages` content collection (`beta/lib/astro-loaders.ts` / `beta/src/content.config.ts`) — **do not** create a new Astro content collection.
- No React island, no new client-side framework — interaction is a plain `<script>` tag, matching `ThemeToggle.astro` / `LangToggle.astro`.
- Images render in a **framed card** (bordered/shadowed panel), never full-bleed — the source illustrations have white/centered compositions.
- The sequence ends clean after slide 6 (the Law) — **no CTA baked into the finale slide**; closing reveals a normal page with `CTAStrip` + `Footer`.
- **No deep-linking** to individual slides in this version.
- **Not linked from top nav.** The only entry points are the footer "Learn" column and one contextual link on the Services page.
- Use the exact copy given in the spec's content appendix — do not paraphrase titles/quotes or the footer/services link labels.

---

### Task 1: Content schema, bilingual data, and image assets

**Files:**
- Modify: `beta/lib/astro-loaders.ts` (add `principles` field to `pagesSchemaCoerced`, after the existing `steps` field, ~line 82)
- Create: `beta/src/content/pages/open-space.nt`
- Create: `beta/src/content/pages/en/open-space.nt`
- Create: `beta/public/images/open-space/de/{principle-1..5,law}.jpg`
- Create: `beta/public/images/open-space/en/{principle-1..5,law}.jpg`
- Test: `beta/tests/open-space-content.test.ts`

**Interfaces:**
- Produces: `pagesSchemaCoerced` (from `beta/lib/astro-loaders.ts`) gains an optional `principles` field: `Array<{ number: string; title: string; quote: string; image: string }>`. Later tasks read this via `getCollection('pages', ({ id }) => id === 'open-space' | 'en/open-space')` → `entry.data.principles`.

- [ ] **Step 1: Write the failing content/schema test**

```typescript
// beta/tests/open-space-content.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parseNestedText } from '../lib/nestedtext';
import { pagesSchemaCoerced } from '../lib/astro-loaders';

const ROOT = process.cwd();

function loadPrinciples(relPath: string) {
  const raw = readFileSync(join(ROOT, relPath), 'utf-8');
  const { data } = parseNestedText(raw);
  const parsed = pagesSchemaCoerced.parse(data);
  if (!parsed.principles) {
    throw new Error(`${relPath}: parsed data has no "principles" field`);
  }
  return parsed.principles;
}

describe('Open Space principles content', () => {
  it('DE content has 6 principles with all required fields', () => {
    const principles = loadPrinciples('src/content/pages/open-space.nt');
    expect(principles).toHaveLength(6);
    principles.forEach((p) => {
      expect(p.number).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.quote).toBeTruthy();
      expect(p.image).toMatch(/^\/images\/open-space\/de\//);
    });
  });

  it('EN content has 6 principles with all required fields', () => {
    const principles = loadPrinciples('src/content/pages/en/open-space.nt');
    expect(principles).toHaveLength(6);
    principles.forEach((p) => {
      expect(p.number).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.quote).toBeTruthy();
      expect(p.image).toMatch(/^\/images\/open-space\/en\//);
    });
  });

  it('DE and EN list the same 6 principle numbers in the same order', () => {
    const de = loadPrinciples('src/content/pages/open-space.nt');
    const en = loadPrinciples('src/content/pages/en/open-space.nt');
    expect(de.map((p) => p.number)).toEqual(en.map((p) => p.number));
  });

  it('every referenced image file exists in public/', () => {
    const all = [
      ...loadPrinciples('src/content/pages/open-space.nt'),
      ...loadPrinciples('src/content/pages/en/open-space.nt'),
    ];
    const missing = all
      .map((p) => p.image)
      .filter((imagePath) => !existsSync(join(ROOT, 'public', imagePath)));
    expect(missing).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run (from `beta/`): `npx vitest run tests/open-space-content.test.ts`
Expected: FAIL — `open-space.nt` does not exist yet (`ENOENT`).

- [ ] **Step 3: Add the `principles` field to the schema**

In `beta/lib/astro-loaders.ts`, immediately after the existing `steps` field (the block ending `.optional(),` around line 82), add:

```typescript
  // For the Open Space principles sequence page
  principles: z
    .array(
      z.object({
        number: z.string(),
        title: z.string(),
        quote: z.string(),
        image: z.string(),
      }),
    )
    .optional(),
```

- [ ] **Step 4: Prepare the image assets**

Run from the repo root (`web/`):

```bash
mkdir -p beta/public/images/open-space/de beta/public/images/open-space/en

# DE source images are very high-resolution (8324x5886) — resize to match
# the EN set's width and re-compress; EN images are already reasonably sized
# but pass through the same pipeline for consistent quality/encoding.
declare -A DE_SRC=( [1]="OS - Prinzip 1.jpg" [2]="OS - Prinzip 2.jpg" [3]="OS - Prinzip 3.jpg" [4]="OS - Prinzip 4.jpg" [5]="OS - Prinzip 5.jpg" )
for n in 1 2 3 4 5; do
  magick "assets/img/os/de/${DE_SRC[$n]}" -resize 1189x -quality 82 \
    "beta/public/images/open-space/de/principle-${n}.jpg"
done
magick "assets/img/os/de/OS - Gesetz.jpg" -resize 1189x -quality 82 \
  "beta/public/images/open-space/de/law.jpg"

declare -A EN_SRC=( [1]="OS - Principle 1.jpg" [2]="OS - Principle 2.jpg" [3]="OS - Principle 3.jpg" [4]="OS - Principle 4.jpg" [5]="OS - Principle 5.jpg" )
for n in 1 2 3 4 5; do
  magick "assets/img/os/en/${EN_SRC[$n]}" -resize 1189x -quality 82 \
    "beta/public/images/open-space/en/principle-${n}.jpg"
done
magick "assets/img/os/en/OS - Law.jpg" -resize 1189x -quality 82 \
  "beta/public/images/open-space/en/law.jpg"

ls -la beta/public/images/open-space/de beta/public/images/open-space/en
```

Expected: 6 files in each of `beta/public/images/open-space/de/` and `.../en/`, each well under 200KB.

- [ ] **Step 5: Create the DE content file**

```
# beta/src/content/pages/open-space.nt
title: Open Space Prinzipien
published: true
eyebrow: Open Space
heading: 5 Prinzipien und ein Gesetz
principles:
  - number: 01
    title: Prinzip 1
    quote: Wer auch immer kommt, es sind die richtigen
    image: /images/open-space/de/principle-1.jpg
  - number: 02
    title: Prinzip 2
    quote: Was auch immer passiert, ist das einzige was passieren konnte
    image: /images/open-space/de/principle-2.jpg
  - number: 03
    title: Prinzip 3
    quote: Es beginnt, wenn die Zeit reif ist
    image: /images/open-space/de/principle-3.jpg
  - number: 04
    title: Prinzip 4
    quote: Es ist vorbei, wenn es vorbei ist
    image: /images/open-space/de/principle-4.jpg
  - number: 05
    title: Prinzip 5
    quote: Wo auch immer es passiert, ist der richtige Ort
    image: /images/open-space/de/principle-5.jpg
  - number: 06
    title: Gesetz der Mobilität
    quote: Wann immer du dich an einem Ort befindest, an dem du weder lernst noch etwas beitragen kannst, bewege dich dorthin, wo du das kannst
    image: /images/open-space/de/law.jpg

---

## Open Space Prinzipien

Die Philosophie hinter jeder Open Space Facilitation von bumbleflies.
```

- [ ] **Step 6: Create the EN content file**

```
# beta/src/content/pages/en/open-space.nt
title: Open Space Principles
published: true
eyebrow: Open Space
heading: 5 principles and 1 law
principles:
  - number: 01
    title: Principle 1
    quote: Whoever comes are the right people
    image: /images/open-space/en/principle-1.jpg
  - number: 02
    title: Principle 2
    quote: Whatever happens is the only thing that could have
    image: /images/open-space/en/principle-2.jpg
  - number: 03
    title: Principle 3
    quote: Whenever it starts is the right time
    image: /images/open-space/en/principle-3.jpg
  - number: 04
    title: Principle 4
    quote: When it is over, it is over
    image: /images/open-space/en/principle-4.jpg
  - number: 05
    title: Principle 5
    quote: Wherever it happens is the right place
    image: /images/open-space/en/principle-5.jpg
  - number: 06
    title: Law of Mobility
    quote: If at any time you find yourself in any situation where you are neither learning nor contributing: go someplace else.
    image: /images/open-space/en/law.jpg

---

## Open Space Principles

The philosophy behind every Open Space bumbleflies facilitates.
```

- [ ] **Step 7: Run the test to verify it passes**

Run (from `beta/`): `npx vitest run tests/open-space-content.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 8: Commit**

```bash
git add beta/lib/astro-loaders.ts beta/src/content/pages/open-space.nt beta/src/content/pages/en/open-space.nt beta/public/images/open-space beta/tests/open-space-content.test.ts
git commit -m "feat: add Open Space principles content, schema, and assets"
```

---

### Task 2: Sequence navigation logic (`sequenceNav.ts`)

**Files:**
- Create: `beta/src/lib/sequenceNav.ts`
- Test: `beta/tests/sequenceNav.test.ts`

**Interfaces:**
- Produces: `clampIndex(index: number, length: number): number`, `nextIndex(current: number, length: number): number`, `prevIndex(current: number, length: number): number`, `resolveSwipe(deltaX: number, threshold?: number): 'next' | 'prev' | null`. Task 3's component script imports all four from `../lib/sequenceNav`.

- [ ] **Step 1: Write the failing tests**

```typescript
// beta/tests/sequenceNav.test.ts
import { describe, it, expect } from 'vitest';
import { clampIndex, nextIndex, prevIndex, resolveSwipe } from '../src/lib/sequenceNav';

describe('sequenceNav', () => {
  it('clamps an index below zero to zero', () => {
    expect(clampIndex(-1, 6)).toBe(0);
  });

  it('clamps an index past the end to the last valid index', () => {
    expect(clampIndex(9, 6)).toBe(5);
  });

  it('returns 0 for a zero-length sequence', () => {
    expect(clampIndex(3, 0)).toBe(0);
  });

  it('nextIndex advances by one', () => {
    expect(nextIndex(2, 6)).toBe(3);
  });

  it('nextIndex does not advance past the last slide', () => {
    expect(nextIndex(5, 6)).toBe(5);
  });

  it('prevIndex goes back by one', () => {
    expect(prevIndex(2, 6)).toBe(1);
  });

  it('prevIndex does not go below the first slide', () => {
    expect(prevIndex(0, 6)).toBe(0);
  });

  it('resolveSwipe detects a left swipe as next', () => {
    expect(resolveSwipe(-50)).toBe('next');
  });

  it('resolveSwipe detects a right swipe as prev', () => {
    expect(resolveSwipe(50)).toBe('prev');
  });

  it('resolveSwipe ignores small movements below the threshold', () => {
    expect(resolveSwipe(10)).toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run (from `beta/`): `npx vitest run tests/sequenceNav.test.ts`
Expected: FAIL — `../src/lib/sequenceNav` does not exist yet.

- [ ] **Step 3: Implement `sequenceNav.ts`**

```typescript
// beta/src/lib/sequenceNav.ts

/** Clamps `index` into the valid range [0, length - 1]; returns 0 for an empty sequence. */
export function clampIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

/** Next slide index, clamped so it never advances past the last slide. */
export function nextIndex(current: number, length: number): number {
  return clampIndex(current + 1, length);
}

/** Previous slide index, clamped so it never goes below the first slide. */
export function prevIndex(current: number, length: number): number {
  return clampIndex(current - 1, length);
}

export type SwipeDirection = 'next' | 'prev' | null;

/** Classifies a horizontal touch delta as a next/prev swipe, or null below the threshold. */
export function resolveSwipe(deltaX: number, threshold = 40): SwipeDirection {
  if (deltaX <= -threshold) return 'next';
  if (deltaX >= threshold) return 'prev';
  return null;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run (from `beta/`): `npx vitest run tests/sequenceNav.test.ts`
Expected: PASS (10 tests).

- [ ] **Step 5: Commit**

```bash
git add beta/src/lib/sequenceNav.ts beta/tests/sequenceNav.test.ts
git commit -m "feat: add pure sequence-navigation logic for the principle sequence"
```

---

### Task 3: `PrincipleSequence.astro` component

**Files:**
- Create: `beta/src/components/PrincipleSequence.astro`

**Interfaces:**
- Consumes: `clampIndex`, `nextIndex`, `prevIndex`, `resolveSwipe` from `../lib/sequenceNav` (Task 2).
- Produces: `<PrincipleSequence principles={...} exitHref={string} lang={'DE'|'EN'} />` — a default export Astro component. `principles` items match the `{ number, title, quote, image }` shape from Task 1. Consumed by Task 4/5's pages.

- [ ] **Step 1: Create the component**

```astro
---
// beta/src/components/PrincipleSequence.astro
interface Principle {
  number: string;
  title: string;
  quote: string;
  image: string;
}

interface Props {
  principles: Principle[];
  exitHref: string;
  lang?: 'DE' | 'EN';
}

const { principles, exitHref, lang = 'DE' } = Astro.props;
const eyebrowLabel = lang === 'DE' ? 'OPEN SPACE PRINZIPIEN' : 'OPEN SPACE PRINCIPLES';
const total = principles.length;
const prevLabel = lang === 'DE' ? 'Vorheriges Prinzip' : 'Previous principle';
const nextLabel = lang === 'DE' ? 'Nächstes Prinzip' : 'Next principle';
const exitLabel = lang === 'DE' ? 'Sequenz schließen' : 'Close sequence';
---

<section class="bf-principle-sequence" data-total={total}>
  <div class="bf-principle-sequence__viewport">
    {principles.map((p, index) => (
      <div class={`bf-principle-sequence__slide${index === 0 ? ' is-active' : ''}`} data-index={index}>
        <div class="bf-principle-sequence__eyebrow">
          {eyebrowLabel} · {p.title} · {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
        <div class="bf-principle-sequence__frame">
          <img src={p.image} alt={p.quote} loading={index === 0 ? 'eager' : 'lazy'} />
        </div>
      </div>
    ))}

    <button type="button" class="bf-principle-sequence__prev" aria-label={prevLabel}>‹</button>
    <button type="button" class="bf-principle-sequence__next" aria-label={nextLabel}>›</button>
    <a href={exitHref} class="bf-principle-sequence__exit" aria-label={exitLabel}>✕</a>

    <div class="bf-principle-sequence__dots" role="tablist">
      {principles.map((p, index) => (
        <button
          type="button"
          class="bf-principle-sequence__dot"
          data-index={index}
          aria-label={p.title}
          aria-current={index === 0 ? 'true' : 'false'}
        />
      ))}
    </div>
  </div>
</section>

<style>
  .bf-principle-sequence__viewport {
    position: relative;
    min-height: 100vh;
    background: var(--bg);
    overflow: hidden;
  }

  .bf-principle-sequence__slide {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-lg);
    padding: var(--space-2xl);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .bf-principle-sequence__slide.is-active {
    opacity: 1;
    pointer-events: auto;
  }

  .bf-principle-sequence__eyebrow {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: var(--ls-widest);
    text-transform: uppercase;
    color: var(--accent);
    text-align: center;
  }

  .bf-principle-sequence__frame {
    background: #f5f1e8;
    padding: var(--space-sm);
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(26, 23, 20, 0.15);
    max-width: min(420px, 80vw);
  }

  .bf-principle-sequence__frame img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 2px;
  }

  .bf-principle-sequence__prev,
  .bf-principle-sequence__next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 2rem;
    line-height: 1;
    color: var(--ink-soft);
    cursor: pointer;
    padding: var(--space-md);
    z-index: 2;
  }

  .bf-principle-sequence__prev { left: var(--space-md); }
  .bf-principle-sequence__next { right: var(--space-md); }

  .bf-principle-sequence__prev:hover,
  .bf-principle-sequence__next:hover {
    color: var(--accent);
  }

  .bf-principle-sequence__exit {
    position: absolute;
    top: var(--space-lg);
    right: var(--space-lg);
    font-family: var(--font-mono);
    font-size: var(--text-base);
    color: var(--ink-soft);
    text-decoration: none;
    z-index: 2;
  }

  .bf-principle-sequence__exit:hover {
    color: var(--accent);
  }

  .bf-principle-sequence__dots {
    position: absolute;
    bottom: var(--space-lg);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: var(--space-xs);
    z-index: 2;
  }

  .bf-principle-sequence__dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    border: none;
    background: var(--rule);
    cursor: pointer;
    padding: 0;
  }

  .bf-principle-sequence__dot[aria-current="true"] {
    background: var(--accent);
  }

  @media (max-width: 768px) {
    .bf-principle-sequence__frame {
      max-width: 90vw;
    }
  }
</style>

<script>
  import { clampIndex, nextIndex, prevIndex, resolveSwipe } from '../lib/sequenceNav';

  const root = document.querySelector<HTMLElement>('.bf-principle-sequence');

  if (root) {
    const total = Number(root.dataset.total ?? '0');
    const viewport = root.querySelector<HTMLElement>('.bf-principle-sequence__viewport');
    const slides = Array.from(root.querySelectorAll<HTMLElement>('.bf-principle-sequence__slide'));
    const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('.bf-principle-sequence__dot'));
    const prevBtn = root.querySelector<HTMLButtonElement>('.bf-principle-sequence__prev');
    const nextBtn = root.querySelector<HTMLButtonElement>('.bf-principle-sequence__next');

    let current = 0;

    function goTo(index: number) {
      current = clampIndex(index, total);
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
      dots.forEach((dot, i) => dot.setAttribute('aria-current', i === current ? 'true' : 'false'));
    }

    prevBtn?.addEventListener('click', () => goTo(prevIndex(current, total)));
    nextBtn?.addEventListener('click', () => goTo(nextIndex(current, total)));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') goTo(nextIndex(current, total));
      if (e.key === 'ArrowLeft') goTo(prevIndex(current, total));
    });

    let touchStartX = 0;
    viewport?.addEventListener('touchstart', (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    viewport?.addEventListener('touchend', (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const direction = resolveSwipe(deltaX);
      if (direction === 'next') goTo(nextIndex(current, total));
      if (direction === 'prev') goTo(prevIndex(current, total));
    }, { passive: true });
  }
</script>
```

- [ ] **Step 2: Type-check**

Run (from `beta/`): `npx astro check`
Expected: no errors related to `PrincipleSequence.astro`.

- [ ] **Step 3: Commit**

```bash
git add beta/src/components/PrincipleSequence.astro
git commit -m "feat: add PrincipleSequence full-viewport slide component"
```

---

### Task 4: DE page — `/open-space`

**Files:**
- Create: `beta/src/pages/open-space.astro`

**Interfaces:**
- Consumes: `PrincipleSequence` (Task 3); `pages` collection entry `id === 'open-space'` (Task 1).

- [ ] **Step 1: Create the page**

```astro
---
// beta/src/pages/open-space.astro
import Layout from '../components/Layout.astro';
import Nav from '../components/Nav.astro';
import PrincipleSequence from '../components/PrincipleSequence.astro';
import CTAStrip from '../components/CTAStrip.astro';
import Footer from '../components/Footer.astro';
import { getCollection } from 'astro:content';

const pageContent = await getCollection('pages', ({ id }) => id === 'open-space');
const page = pageContent[0];

if (!page) {
  throw new Error('Open Space principles content not found in collection');
}

const principles = page.data.principles ?? [];
const currentLang: 'DE' | 'EN' = 'DE';
---

<Layout
  title="Open Space Prinzipien — bumbleflies"
  description="Die 5 Prinzipien und das Gesetz der Mobilität von Open Space Technology — die Philosophie hinter jeder Open Space Facilitation von bumbleflies."
  canonical="https://bumbleflies.de/open-space"
  lang={currentLang}
  dePath="/open-space"
  enPath="/en/open-space"
>
  <Nav slot="nav" lang={currentLang} />

  <PrincipleSequence principles={principles} exitHref="#open-space-end" lang={currentLang} />

  <div id="open-space-end">
    <CTAStrip
      heading="Bereit für"
      headingEm="euren Open Space?"
      body="Schreib uns zwei Sätze. Wir antworten innerhalb von 24h mit dem Vorschlag, der zu eurem Anliegen passt."
      ctaText="Erstes Gespräch vereinbaren"
      lang={currentLang}
    />
  </div>

  <Footer slot="footer" lang={currentLang} />
</Layout>
```

- [ ] **Step 2: Build and verify the route exists**

Run (from `beta/`): `npm run build`
Expected: build succeeds; `dist/open-space/index.html` exists (check with `ls dist/open-space/index.html`).

- [ ] **Step 3: Commit**

```bash
git add beta/src/pages/open-space.astro
git commit -m "feat: add DE Open Space principles page"
```

---

### Task 5: EN page — `/en/open-space`

**Files:**
- Create: `beta/src/pages/en/open-space.astro`

**Interfaces:**
- Consumes: `PrincipleSequence` (Task 3); `pages` collection entry `id === 'en/open-space'` (Task 1).

- [ ] **Step 1: Create the page**

```astro
---
// beta/src/pages/en/open-space.astro
import Layout from '../../components/Layout.astro';
import Nav from '../../components/Nav.astro';
import PrincipleSequence from '../../components/PrincipleSequence.astro';
import CTAStrip from '../../components/CTAStrip.astro';
import Footer from '../../components/Footer.astro';
import { getCollection } from 'astro:content';

const pageContent = await getCollection('pages', ({ id }) => id === 'en/open-space');
const page = pageContent[0];

if (!page) {
  throw new Error('EN Open Space principles content not found in collection');
}

const principles = page.data.principles ?? [];
const currentLang: 'DE' | 'EN' = 'EN';
---

<Layout
  title="Open Space Principles — bumbleflies"
  description="The 5 principles and the Law of Mobility of Open Space Technology — the philosophy behind every Open Space bumbleflies facilitates."
  canonical="https://bumbleflies.de/en/open-space"
  lang={currentLang}
  dePath="/open-space"
  enPath="/en/open-space"
>
  <Nav slot="nav" lang={currentLang} />

  <PrincipleSequence principles={principles} exitHref="#open-space-end" lang={currentLang} />

  <div id="open-space-end">
    <CTAStrip
      heading="Ready for"
      headingEm="your Open Space?"
      body="Send us two sentences. We respond within 24h with the proposal that fits."
      ctaText="Book a first call"
      lang={currentLang}
    />
  </div>

  <Footer slot="footer" lang={currentLang} />
</Layout>
```

- [ ] **Step 2: Build and verify the route exists**

Run (from `beta/`): `npm run build`
Expected: build succeeds; `dist/en/open-space/index.html` exists.

- [ ] **Step 3: Commit**

```bash
git add beta/src/pages/en/open-space.astro
git commit -m "feat: add EN Open Space principles page"
```

---

### Task 6: Discovery — footer "Learn" entry and Services contextual link

**Files:**
- Modify: `beta/src/lib/footerContent.ts:44-52` (DE `learn.items`) and `:68-76` (EN `learn.items`)
- Modify: `beta/tests/Footer.test.ts`
- Modify: `beta/src/components/ServiceCard.astro`
- Modify: `beta/src/pages/services.astro:184-196` (the `ServiceCard` map)
- Modify: `beta/src/pages/en/services.astro:115-125` (the `ServiceCard` map)

**Interfaces:**
- Produces: `ServiceCard` gains an optional prop `footnoteLink?: { label: string; href: string }`, rendered as a small link under the bullet list.

- [ ] **Step 1: Write the failing footer test**

Add to `beta/tests/Footer.test.ts` (inside the existing `describe('Footer Component Logic', ...)` block, after the `Contact Links` describe block):

```typescript
  describe('Learn Links', () => {
    it('should link to the Open Space principles page (DE)', () => {
      const item = getFooterContent('DE').learn.items.find(
        (i) => i.label === 'Open Space Prinzipien',
      );
      expect(item?.href).toBe('/open-space');
    });

    it('should link to the Open Space principles page (EN)', () => {
      const item = getFooterContent('EN').learn.items.find(
        (i) => i.label === 'Open Space Principles',
      );
      expect(item?.href).toBe('/en/open-space');
    });
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run (from `beta/`): `npx vitest run tests/Footer.test.ts`
Expected: FAIL — no entry with that label exists yet.

- [ ] **Step 3: Add the footer entries**

In `beta/src/lib/footerContent.ts`, DE `learn.items` (currently):

```typescript
        learn: {
          title: 'Lernen',
          items: [
            { label: 'FaST-Training', href: servicesHref },
            { label: 'Field Notes (KI-Serie)', href: '/blog' },
            { label: 'AI-Literacy', href: servicesHref },
            { label: 'Open Space Checkliste', href: servicesHref },
          ],
        },
```

becomes:

```typescript
        learn: {
          title: 'Lernen',
          items: [
            { label: 'FaST-Training', href: servicesHref },
            { label: 'Field Notes (KI-Serie)', href: '/blog' },
            { label: 'AI-Literacy', href: servicesHref },
            { label: 'Open Space Prinzipien', href: '/open-space' },
            { label: 'Open Space Checkliste', href: servicesHref },
          ],
        },
```

And EN `learn.items` (currently):

```typescript
        learn: {
          title: 'Learn',
          items: [
            { label: 'FaST Training', href: servicesHref },
            { label: 'Field Notes (AI series)', href: '/en/blog' },
            { label: 'AI Literacy', href: servicesHref },
            { label: 'Open Space Checklist', href: servicesHref },
          ],
        },
```

becomes:

```typescript
        learn: {
          title: 'Learn',
          items: [
            { label: 'FaST Training', href: servicesHref },
            { label: 'Field Notes (AI series)', href: '/en/blog' },
            { label: 'AI Literacy', href: servicesHref },
            { label: 'Open Space Principles', href: '/en/open-space' },
            { label: 'Open Space Checklist', href: servicesHref },
          ],
        },
```

- [ ] **Step 4: Run the test to verify it passes**

Run (from `beta/`): `npx vitest run tests/Footer.test.ts`
Expected: PASS.

- [ ] **Step 5: Add `footnoteLink` support to `ServiceCard.astro`**

In `beta/src/components/ServiceCard.astro`, update the `Props` interface and destructuring:

```typescript
interface Props {
  number: string;
  title: string;
  tag: string;
  description: string;
  bullets: string[];
  href?: string;
  ctaLabel?: string;
  footnoteLink?: { label: string; href: string };
}

const { number, title, tag, description, bullets, href, ctaLabel, footnoteLink } = Astro.props;
```

Add the link markup right after the `<ul class="a-service-card__bullets">` block:

```astro
  {footnoteLink && (
    <a href={footnoteLink.href} class="a-service-card__footnote-link">
      {footnoteLink.label}
    </a>
  )}
```

Add the accompanying style (next to `.a-service-card__cta` rules):

```css
  .a-service-card__footnote-link {
    position: relative;
    z-index: 2;
    font-size: 0.85rem;
    color: var(--accent);
    text-decoration: none;
  }

  .a-service-card__footnote-link:hover {
    text-decoration: underline;
  }
```

- [ ] **Step 6: Wire the link into the DE Services page**

In `beta/src/pages/services.astro`, update the `<ServiceCard>` call inside `deContent.services.map(...)`:

```astro
          {deContent.services.map((service, index) => (
            <ServiceCard
              number={service.number}
              title={service.title}
              tag={service.tag}
              description={service.description}
              bullets={service.bullets}
              href={service.number === '02' ? '/ai-consulting' : undefined}
              ctaLabel="Mehr erfahren"
              footnoteLink={service.number === '01' ? { label: 'Die Philosophie dahinter →', href: '/open-space' } : undefined}
              data-service-id={index}
            />
          ))}
```

- [ ] **Step 7: Wire the link into the EN Services page**

In `beta/src/pages/en/services.astro`, update the `<ServiceCard>` call:

```astro
          {content.services.map((service, index) => (
            <ServiceCard
              number={service.number}
              title={service.title}
              tag={service.tag}
              description={service.description}
              bullets={service.bullets}
              href={service.number === '02' ? '/en/ai-consulting' : undefined}
              ctaLabel="Learn more"
              footnoteLink={service.number === '01' ? { label: 'See the philosophy →', href: '/en/open-space' } : undefined}
            />
          ))}
```

- [ ] **Step 8: Run the full test suite and build**

Run (from `beta/`): `npm run test && npm run build`
Expected: all tests pass, including `tests/dead-links.test.ts` (validates the new `/open-space` and `/en/open-space` hrefs now resolve); build succeeds.

- [ ] **Step 9: Commit**

```bash
git add beta/src/lib/footerContent.ts beta/tests/Footer.test.ts beta/src/components/ServiceCard.astro beta/src/pages/services.astro beta/src/pages/en/services.astro
git commit -m "feat: link Open Space principles from footer Learn column and Services page"
```

---

### Task 7: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Type-check, full test suite, full build**

Run (from `beta/`):

```bash
npx astro check
npm run test
npm run build
```

Expected: no type errors; all tests pass; build succeeds with `dist/open-space/index.html` and `dist/en/open-space/index.html` present.

- [ ] **Step 2: Manual browser walkthrough**

```bash
npm run preview
```

Visit `/open-space` and `/en/open-space` and confirm:
- All 6 slides render in order; the first slide is visible on load.
- Prev/next buttons, dot navigation, left/right arrow keys, and touch swipe all move between slides.
- The ✕ control scrolls to the CTA/Footer section (`#open-space-end`) below the sequence.
- Toggling dark mode: images stay inside their cream-colored framed card (never full-bleed) in both themes.
- Footer "Learn" column shows "Open Space Prinzipien"/"Open Space Principles" linking correctly.
- The Services page ("Talk" card) shows "Die Philosophie dahinter →"/"See the philosophy →" linking correctly.
- `/open-space` and `/en/open-space` do **not** appear in the top navigation.
