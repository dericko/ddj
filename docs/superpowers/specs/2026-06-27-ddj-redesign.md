# DDJ Redesign: Interactive Essay & Glass UI

**Date:** 2026-06-27  
**Project:** daodejing-translations (ddj)  
**Status:** Approved, pending implementation plan

---

## Overview

Transform the current ddj app (two-page list + about) into a single, giant scrolling page that functions as an interactive essay exploring 180+ English translations of Chapter 1 of the Tao Te Ching. The experience should feel design-oriented: glass panels on warm parchment, large editorial typography, parallax scroll effects, and curated interactive comparison moments woven into the narrative.

---

## Visual Design System

### Theme Tokens (CSS Custom Properties)

All color and surface values live in `:root` and `[data-theme="dark"]` so dark mode is a single attribute toggle. No dark mode implementation required now — just structured to support it.

```css
:root {
  --bg:           #F7F4EF;   /* warm cream / washi paper */
  --text:         #1A1614;   /* near-black sumi ink */
  --text-muted:   #6B5E52;   /* warm mid-tone */
  --glass-bg:     rgba(255, 255, 255, 0.4);
  --glass-border: rgba(255, 255, 255, 0.6);
  --accent:       #8B6F47;   /* warm ink-brown */
  --jade:         #4A6741;   /* muted jade — similarity scores */
  --blur:         16px;
}

[data-theme="dark"] {
  --bg:           #12100E;
  --text:         #F0EDE8;
  --text-muted:   #9C8E84;
  --glass-bg:     rgba(0, 0, 0, 0.3);
  --glass-border: rgba(255, 255, 255, 0.1);
  /* accent and jade carry over unchanged */
}
```

### Typography

- **Essay body:** Georgia or Lora (serif), `text-2xl` to `text-4xl`. Large, breathable lines force scrolling even for short content.
- **UI chrome:** Inter (existing).
- **Chinese characters:** Noto Serif SC. Large in hero, small as accent glyphs in section dividers.

### Parallax Motion Vocabulary (Framer Motion)

| Name | Mechanic | Used for |
|------|----------|----------|
| Drift | slow `y` offset via `useTransform` | bg layers, decorative CJK glyphs |
| Reveal | `opacity` + `y` entrance on viewport enter | essay paragraphs, cards |
| Slide-in | `x` entrance on button press | comparison panels |
| Sticky text | normal scroll; background at 0.3× speed | essay sections |

---

## Page Structure (top to bottom)

### 1. Hero
- Full viewport height.
- Chinese text of Chapter 1 centered, large (Noto Serif SC, `text-5xl` to `text-8xl`).
- Drifts upward slowly as user scrolls.
- English title "Tao Translations" and subtitle fade in below at a slightly different parallax rate.
- Scroll-down indicator pulses.
- Background: pure `--bg` color, no glass panel — maximum breathing room.

### 2. Essay Part 1: The Text & Its Translations
- Draws from original essay background section.
- Covers: Daodejing origins (~300 BC), Wang Pi vs. Ma-wang-tui source texts, 250+ Western translations, influence in China (opposition to Confucian system) and the West (academic + popular).
- Pull quote drifts at parallax offset: *"The most translated text besides the Bible."*
- Large serif text, `max-w-2xl`, centered column.

### 3. Essay Part 2: The Problem of Translation
- The three tradeoffs from LaFargue & Pas:
  1. Word-for-word accuracy vs. clarity
  2. Historical context vs. contemporary application
  3. Ideas vs. style and feeling
- Large numbered callouts (decorative `01` `02` `03`) with a short paragraph each.
- Animate in on scroll (Reveal).

### 4. Spotlight 1: Who Has the Authority?
- Introduces the Goldin critique: four translators (Mitchell, Bynner, Le Guin, Miles) who do not speak Chinese but published popular adaptations.
- **Interactive button:** "Compare Mitchell & Waley" → side-by-side panel slides in showing both Chapter 1 texts with a similarity score badge.
- **Second button:** "Compare Le Guin & D.C. Lau" → same mechanic.
- Glass panel treatment (`--glass-bg`, `backdrop-blur`, `--glass-border`).
- Similarity score displayed as a jade-colored badge.

### 5. Essay Part 3: What Embeddings Reveal
- Short section bridging the 2015 methodology and the current approach.
- Narrative arc: "In 2015 I used word frequency vectors. With embeddings, the picture is much richer."
- Explains cosine similarity in plain language. Segues into the gallery.

### 6. Translator Gallery
- 14 cards, one per top translator (from `constants.tsx`).
- Staggered entrance animation (each card reveals with a slight delay).
- Each card contains:
  - Translator name + dates active
  - ~150-word historical commentary (drafted in `translator-data.ts`)
  - One short excerpt line from their Chapter 1 translation
  - Similarity-to-authority-cluster badge
- Grid layout: 2 columns on desktop, 1 on mobile.

**Translators and commentary stubs (to be fully drafted in `translator-data.ts`):**

| Translator | Era | Context |
|------------|-----|---------|
| Arthur Waley | 1934 | Literary sinologist, first major English translation, influenced decades of scholarship |
| Ch'u Ta-Kao | 1937 | Early Chinese-born translator working in England |
| Lin Yutang | 1948 | Chinese-American writer, bilingual, emphasized the philosophical |
| J.J.L. Duyvendak | 1954 | Dutch sinologist, scholarly critical apparatus |
| John C.H. Wu | 1961 | Catholic convert, brought Christian mystical lens |
| Wing-Tsit Chan | 1963 | Historian of Chinese philosophy, authoritative academic edition |
| D.C. Lau | 1963 | Penguin Classics, most widely read scholarly translation |
| Gia-fu Feng & Jane English | 1972 | Counterculture era, paired with photography, deeply influential in the West |
| Richard Wilhelm | 1978 (English) | German sinologist, translated via German, influenced Jung |
| Ellen M. Chen | 1989 | Feminist reading, emphasized the feminine in Daoist cosmology |
| Michael LaFargue | 1992 | Academic, systematic methodology, basis of this study's authority list |
| Stephen Addiss & Stanley Lombardo | 1993 | Minimalist poetic rendering, calligrapher + poet collaboration |
| Robert Henricks | 1989 | Based on Ma-wang-tui manuscripts, philological rigor |
| Victor H. Mair | 1990 | Comparative literature, restored archaic pronunciation context |

### 7. Spotlight 2: Translation Families
- Shows three translation clusters as a visual motif:
  - **The Sinologists** (Waley, D.C. Lau, Duyvendak, Wing-Tsit Chan) — high similarity to each other
  - **The Literary Adapters** (Gia-fu Feng, Addiss & Lombardo, LaFargue) — mid cluster
  - **The Spiritual/New Age** (Mitchell, Le Guin, Bynner) — lower similarity to sinologist cluster
- Each cluster displayed as a glass card group with a header label and member names.
- Similarity scores shown as horizontal bars or badges.
- Brief annotation on what the clustering means about interpretive choices.

### 8. Explorer (Live Tool)
- Restyled version of the current `List` / `listSimilar` functionality.
- Translator picker: scrollable list of all 180+ translations.
- Select one → ranked similarity results load from DB via `listSimilar`.
- Results displayed as styled cards with similarity score badge.
- Header: "Explore All Translations."

### 9. Footer
- Sources (bibliography from original essay).
- Byline: detc.cc / GitHub link.
- "Originally a 2015 computational linguistics study. Updated 2024 with embeddings."

---

## Component Architecture

```
app/
  page.tsx                ← single page, composes all sections in order
  actions.tsx             ← unchanged (listAll, listSimilar)
  globals.css             ← CSS custom properties, theme tokens, base styles
  layout.tsx              ← add Noto Serif SC font alongside Inter

components/
  hero.tsx                ← Chinese text hero, parallax drift
  essay-section.tsx       ← large-text essay block, optional pull quote prop
  spotlight.tsx           ← curated side-by-side comparison panel with button trigger
  translator-card.tsx     ← single translator card (name, commentary, excerpt, score)
  translator-gallery.tsx  ← staggered grid of 14 translator-card components
  cluster-viz.tsx         ← Spotlight 2, three-cluster similarity display
  explorer.tsx            ← restyled live tool (replaces list.tsx — list.tsx should be deleted)
  scroll-reveal.tsx       ← reusable Framer Motion wrapper for reveal-on-scroll

lib/
  translator-data.ts      ← static: commentary (~150w each), excerpts, cluster labels
  theme.ts                ← CSS variable name constants (type-safe references)
```

### Data Flow

- **Static content** (essay text, translator commentary, curated comparisons): hardcoded in `translator-data.ts` and component files. No DB.
- **Explorer** (live similarity): client component calls `listSimilar` server action, same as today.
- **Spotlight comparisons**: static text + similarity scores fetched once at page load via a dedicated server action (`getSpotlightPairs`), not hardcoded. This keeps scores accurate if the DB is re-seeded.

---

## Dependencies to Add

| Package | Purpose |
|---------|---------|
| `framer-motion` | Parallax, scroll reveals, slide-in panels |
| `@next/font` (already available) | Noto Serif SC for Chinese text |

No other new dependencies. Keep the footprint small.

---

## Out of Scope

- Dark mode implementation (CSS variables stub it, but no toggle UI)
- Mobile-specific parallax (parallax disabled on `prefers-reduced-motion`)
- Chapter 2+ translations (Chapter 1 only, as today)
- Any backend changes to Prisma schema or DB

---

## Sources

- Paul Goldin. *After Confucius*. University of Hawai'i Press, 2005.
- Livia Kohn and Michael LaFargue. *Lao-tzu and the Tao-te-ching*. SUNY Press, 1998.
- Michael LaFargue. *Tao and Method*. SUNY Press, 1994.
- Tao Hyun Kim. "Other Laozi Parallels in the Hanfeizi." *Sino-Platonic Papers*, 199. 2010.
- 182 Translations of Chapter One. Bopsecrets.org. Accessed December 2015.
