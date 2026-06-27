# DDJ Redesign: Interactive Essay & Glass UI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the two-page ddj app into a single glass-themed, parallax-scrolling interactive essay about 180+ translations of the Tao Te Ching.

**Architecture:** One giant server-component page (`app/page.tsx`) that fetches spotlight and gallery data at load time, then composes a sequence of scroll sections. Client components (hero, spotlight, explorer) receive data as props and handle all animation and interactivity. CSS custom properties carry the entire theme so dark mode is a future one-liner.

**Tech Stack:** Next.js 15, React 19, Framer Motion, Prisma + pgvector, Tailwind CSS, Noto Serif SC (via Google Fonts link), Inter (existing)

## Global Constraints

- No new Prisma schema changes — `Document` model is final (`id`, `translator`, `date`, `text`, `embedding`)
- No test framework exists — verification is visual (start dev server, observe in browser)
- `app/actions.tsx` keeps its existing exports; new exports are added, nothing removed
- All CSS tokens use `var(--token-name)` pattern; Tailwind `bg-*` classes are used only for layout utilities
- `components/list.tsx` is deleted in Task 12 — do not reference it after that
- `app/about/page.tsx` is redirected (301) to `/` in Task 12 — do not delete it before then
- Parallax is wrapped in `@media (prefers-reduced-motion: no-preference)` — fallback is static reveal
- `'use client'` only on components that use hooks or browser APIs; everything else is a server component
- framer-motion must be imported as `import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'` — no default import

---

## File Map

```
CREATED:
  lib/translator-data.ts         — static translator metadata (commentary, cluster)
  lib/theme.ts                   — CSS variable name constants
  components/scroll-reveal.tsx   — reusable Framer Motion reveal-on-scroll wrapper
  components/hero.tsx            — full-viewport Chinese text hero with parallax
  components/essay-section.tsx   — large serif text block with optional pull quote
  components/spotlight.tsx       — interactive side-by-side comparison panel
  components/translator-card.tsx — single translator card (glass panel)
  components/translator-gallery.tsx — staggered grid of 14 cards
  components/cluster-viz.tsx     — translation families cluster display
  components/explorer.tsx        — restyled live similarity tool

MODIFIED:
  app/globals.css       — CSS custom properties, theme tokens, base styles
  app/layout.tsx        — add Google Fonts link for Noto Serif SC
  app/page.tsx          — rewritten: single page composing all sections
  app/actions.tsx       — add getSpotlightPair, getTopTranslatorDocs

DELETED (Task 12):
  components/list.tsx

RETIRED (Task 12):
  app/about/page.tsx    — replaced with redirect to /
```

---

## Task 1: Foundation — CSS Tokens, Fonts, framer-motion

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `tailwind.config.js`
- Create: `lib/theme.ts`
- Shell: install framer-motion

**Interfaces:**
- Produces: CSS custom properties available globally, `--font-noto-serif-sc` CSS variable, `THEME` constant in `lib/theme.ts`

- [ ] **Step 1: Install framer-motion**

```bash
cd /Users/detc/prog/ddj && npm install framer-motion
```

Expected: `added 1 package` (or similar), no errors.

- [ ] **Step 2: Replace globals.css**

Replace entire `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg:           #F7F4EF;
  --text:         #1A1614;
  --text-muted:   #6B5E52;
  --glass-bg:     rgba(255, 255, 255, 0.4);
  --glass-border: rgba(255, 255, 255, 0.6);
  --accent:       #8B6F47;
  --jade:         #4A6741;
  --blur:         16px;
}

[data-theme="dark"] {
  --bg:           #12100E;
  --text:         #F0EDE8;
  --text-muted:   #9C8E84;
  --glass-bg:     rgba(0, 0, 0, 0.3);
  --glass-border: rgba(255, 255, 255, 0.1);
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-inter), Georgia, serif;
}

.glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(var(--blur));
  -webkit-backdrop-filter: blur(var(--blur));
}

.font-chinese {
  font-family: var(--font-noto-serif-sc), 'Noto Serif SC', serif;
}
```

- [ ] **Step 3: Add Noto Serif SC to layout.tsx**

Replace `app/layout.tsx` with:

```tsx
import './globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Tao Translations',
  description: 'Semantic search to compare 180+ translations of the Tao Te Ching.',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable} style={{ ['--font-noto-serif-sc' as string]: "'Noto Serif SC'" }}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Extend tailwind.config.js to expose CSS vars**

Replace `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        default: ["var(--font-inter)"],
        serif: ["Lora", "Georgia", "serif"],
        chinese: ["var(--font-noto-serif-sc)", "'Noto Serif SC'", "serif"],
      },
      colors: {
        ink: "var(--text)",
        muted: "var(--text-muted)",
        accent: "var(--accent)",
        jade: "var(--jade)",
        canvas: "var(--bg)",
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Create lib/theme.ts**

```typescript
export const THEME = {
  bg: 'var(--bg)',
  text: 'var(--text)',
  textMuted: 'var(--text-muted)',
  glassBg: 'var(--glass-bg)',
  glassBorder: 'var(--glass-border)',
  accent: 'var(--accent)',
  jade: 'var(--jade)',
  blur: 'var(--blur)',
} as const
```

- [ ] **Step 6: Start dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000`. The page background should be warm cream `#F7F4EF`, text near-black. The existing list should still function. No console errors about framer-motion.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css app/layout.tsx tailwind.config.js lib/theme.ts package.json package-lock.json
git commit -m "feat: add theme tokens, Noto Serif SC, framer-motion"
```

---

## Task 2: Static Translator Data

**Files:**
- Create: `lib/translator-data.ts`

**Interfaces:**
- Produces: `TRANSLATORS: TranslatorMeta[]`, `TranslatorMeta` type, `CLUSTERS: ClusterGroup[]`

- [ ] **Step 1: Create lib/translator-data.ts**

```typescript
export type ClusterName = 'sinologist' | 'literary' | 'spiritual'

export interface TranslatorMeta {
  name: string          // must match Document.translator in DB exactly
  dates: string         // e.g. "1889–1966"
  cluster: ClusterName
  commentary: string    // ~150 words
}

export interface ClusterGroup {
  name: ClusterName
  label: string
  description: string
  members: string[]     // translator names
}

export const TRANSLATORS: TranslatorMeta[] = [
  {
    name: "Arthur Waley",
    dates: "1889–1966",
    cluster: "sinologist",
    commentary: `Arthur Waley's 1934 translation, published as <em>The Way and Its Power</em>, was the first major English rendering of the Daodejing to achieve both scholarly and literary acclaim. A Cambridge-educated sinologist who also translated classical Japanese poetry, Waley brought unusual philological precision alongside genuine literary sensibility. He resisted the mystical romanticization common in Western reception, preferring to emphasize the text's political and philosophical dimensions over its spiritual ones. His opening line — "The Way that can be told of is not an Unvarying Way" — prioritizes grammatical accuracy over poetry. Waley was openly skeptical of later Daoist religious traditions, treating the Daodejing primarily as a text of the Warring States philosophical debates. His choices set a template that later translators either built on or explicitly reacted against, making his 1934 version an indispensable reference point in the English translation tradition.`,
  },
  {
    name: "Ch'u Ta-Kao",
    dates: "1892–1971",
    cluster: "sinologist",
    commentary: `Ch'u Ta-Kao produced one of the earliest English translations by a Chinese-born scholar, published through the Theosophical Society in London in 1937. Working at a moment when Daoist studies were still nascent in the West, Ch'u brought an insider's familiarity with Chinese philosophical tradition alongside the theosophical interpretive lens of his publishers, which colored some of his rendering choices. His translation is notable for its directness and relatively literal approach compared to later Western adaptations. Ch'u was among the first to make the Daodejing accessible to English readers without the dense scholarly apparatus of European sinology. His work reflects the early twentieth-century cultural moment when Daoism was being introduced to Western audiences who were simultaneously fascinated and uncertain about classical Chinese thought. The text holds a quiet authority that comes from a translator deeply at home in both languages.`,
  },
  {
    name: "Lin Yutang",
    dates: "1895–1976",
    cluster: "literary",
    commentary: `Lin Yutang was a Chinese-American writer, intellectual, and inventor whose prolific career was devoted to bridging Chinese and Western literary cultures. His translation of the Daodejing, appearing in <em>The Wisdom of Laotse</em> (1948), is notable for weaving together passages from the Daodejing with relevant sections from Zhuangzi, creating a synthetic philosophical text. Lin brought bilingual authority and a humanist literary sensibility to the translation, emphasizing practical wisdom and aesthetic beauty over scholarly precision. Unlike academic translators, Lin was primarily a writer, and his version reflects a lifelong project of making Chinese literary culture comprehensible and appealing to Western readers. His rendering is often described as capturing the "flavor" of the original in a way more literal versions miss. Lin's work occupies a unique middle space between popular and scholarly, grounded in genuine linguistic competence but addressed to the general reader.`,
  },
  {
    name: "J.J.L. Duyvendak",
    dates: "1889–1954",
    cluster: "sinologist",
    commentary: `Jan Julius Lodewijk Duyvendak was one of the foremost European sinologists of the mid-twentieth century, holding the chair of Chinese at Leiden University. His 1954 translation <em>Tao Te Ching: The Book of the Way and Its Virtue</em> is distinguished by exhaustive scholarly apparatus and careful attention to textual variants. Duyvendak was deeply engaged with philological problems of the text — questions of composition date, the reliability of the Wang Pi commentary, and ambiguities in classical Chinese syntax — representing the Germanic European tradition of rigorous sinology that prioritized accuracy over literary quality. His translation is less readable than Waley's but more transparently scholarly, showing its interpretive work in extensive footnotes. Although the Ma-wang-tui manuscripts had not yet been discovered, Duyvendak's attention to variant readings anticipated the textual debates those discoveries would later ignite. His work remains an important reference for scholars comparing interpretive traditions.`,
  },
  {
    name: "John C.H. Wu",
    dates: "1899–1986",
    cluster: "spiritual",
    commentary: `John C.H. Wu was a Chinese Catholic jurist, legal scholar, and writer whose translation of the Daodejing is unique for its explicit Christian theological framing. A convert who corresponded with Thomas Merton and later produced an acclaimed translation of the New Testament into classical Chinese, Wu read the Tao through the lens of mystical Christianity, hearing resonances between the Gospel of John's opening ("In the beginning was the Word") and the Daodejing's first line. His translation, published by St. John's University Press in 1961, is notable for lyrical beauty and for making the text accessible to readers from a Christian background. Scholars have noted both the interpretive richness this cross-traditional lens brings and its distortions: Wu's Tao sometimes sounds more like the Christian Logos than the classical Chinese concept. His work is a fascinating document of mid-century cross-cultural theological encounter, and a reminder that all translation involves a frame.`,
  },
  {
    name: "Wing-Tsit Chan",
    dates: "1901–1994",
    cluster: "sinologist",
    commentary: `Wing-Tsit Chan was one of the most influential scholars of Chinese philosophy in the twentieth-century American academy. His <em>A Source Book in Chinese Philosophy</em> (1963) became the standard reference text in university courses on Asian philosophy for decades, and his translation of the Daodejing within it is among the most widely assigned academic versions. Chan's approach is rigorously scholarly: he attends carefully to the philosophical vocabulary of classical Chinese, situates the text within Chinese intellectual history, and provides detailed annotations contextualizing Daoist concepts in relation to Confucian and Neo-Confucian traditions. His translation is less literary than Waley's but more philosophically precise. Chan was particularly attentive to how Daoist categories relate to broader patterns in Chinese thought, treating the Daodejing not as an isolated mystical text but as a participant in ongoing philosophical conversation. His work shaped how multiple generations of Western students first encountered Chinese philosophy.`,
  },
  {
    name: "D.C. Lau",
    dates: "1921–2010",
    cluster: "sinologist",
    commentary: `Dim Cheuk Lau's Penguin Classics translation has arguably been the most widely read English version of the Daodejing in the English-speaking world. A scholar at the School of Oriental and African Studies in London, Lau combined philological rigor with genuine literary care, producing a translation remarkable for clarity and accessibility without sacrificing scholarly accuracy. His 1963 Penguin Classics edition remains in print and is the standard assignment in undergraduate courses worldwide. Lau also produced a separate translation based on the Ma-wang-tui manuscripts in 1982, making him one of the few translators to have produced authoritative versions of both the Wang Pi and Ma-wang-tui texts. His approach is methodical and conservative — he avoids interpretive flourishes and lets the text speak clearly. Lau's influence on the popular reception of the Daodejing in the West is difficult to overstate; for many readers outside academia, his Penguin version simply is the Daodejing.`,
  },
  {
    name: "Gia-fu Feng and Jane English",
    dates: "1919–1985 / b. 1942",
    cluster: "spiritual",
    commentary: `This collaboration between Chinese-born Tai Chi teacher Gia-fu Feng and photographer Jane English produced one of the most beloved and culturally influential translations of the counterculture era. Published by Vintage Books in 1972, the edition pairs Feng's free-flowing translation with English's striking black-and-white nature photography and Feng's Chinese calligraphy, creating a total aesthetic experience that made the text a touchstone for Western practitioners of Tai Chi, yoga, and contemplative traditions. Feng, who had studied at Peking University before immigrating to the United States, brought authentic Chinese cultural sensibility alongside the spiritual openness of the human potential movement. The translation is notably free in places, prioritizing meditative and experiential dimensions over scholarly precision. Though less philologically rigorous than academic versions, it captured something genuinely elusive in the text — the Tao's quality of immediate, wordless presence — that more accurate translations sometimes lose in their precision.`,
  },
  {
    name: "Richard Wilhelm",
    dates: "1873–1930",
    cluster: "literary",
    commentary: `Richard Wilhelm was a German missionary and sinologist who spent decades in China and became one of the most important conduits of classical Chinese thought into Western culture. His German translations of the I Ching (1924) and the Daodejing (1910) introduced these texts to thinkers including Carl Jung, who wrote a celebrated foreword to Wilhelm's I Ching. Wilhelm's approach blended scholarly sinology with genuine cultural immersion — he studied with Chinese teachers and approached the texts with unusual empathy for his era. His Daodejing was later rendered into English, introducing an additional translation layer, but retaining the distinctive quality that comes from a translator who had lived inside Chinese thought rather than merely studied it. Wilhelm saw the Tao in relation to his broader understanding of Chinese cosmology and its resonances with Jungian concepts of the unconscious, giving his rendering a depth that purely academic translations sometimes lack.`,
  },
  {
    name: "Ellen M. Chen",
    dates: "b. 1934",
    cluster: "literary",
    commentary: `Ellen Marie Chen's translation and commentary, published as <em>The Tao Te Ching: A New Translation with Commentary</em> (1989), is notable for its systematic feminist philosophical interpretation. A professor at St. John's University, Chen argued that the Daodejing contains a proto-feminist cosmology centered on the feminine as the primal, creative ground of being. She emphasized recurring feminine imagery in the text — the valley, the mother, yielding water — as philosophically central rather than merely metaphorical, and her translation makes these dimensions explicit throughout. Her commentary situates the text in relation to feminist philosophy and ecofeminism. Chen's work represents an important strand of late twentieth-century Daoist scholarship seeking to recover suppressed feminine and ecological dimensions of the tradition. Her translation is both rigorous scholarship and philosophical intervention, and it opened interpretive possibilities that earlier male translators had largely left unexplored.`,
  },
  {
    name: "Michael LaFargue",
    dates: "b. 1942",
    cluster: "sinologist",
    commentary: `Michael LaFargue's <em>The Tao of the Tao Te Ching</em> (1992) is one of the most methodologically rigorous English translations, distinguished by its sustained attention to the interpretive assumptions that inevitably shape any rendering. A scholar at the University of Massachusetts, LaFargue developed an explicit methodology: he examined each passage's internal logic, potential compositional contexts, and range of possible meanings before committing to translation choices. His translation is deliberately non-poetic, prioritizing semantic content over literary effect. LaFargue's work directly informs this study: his list of reputable translations formed the authority baseline against which all 180+ versions were evaluated. He was also deeply engaged with questions about the Daodejing's compositional history and its relationship to early Chinese oral traditions — treating the text not as a single authored work but as an anthology of sayings that accreted over time. His methodological transparency makes his choices unusually easy to evaluate and critique.`,
  },
  {
    name: "Stephen Addiss and Stanley Lombardo",
    dates: "b. 1935 / b. 1943",
    cluster: "literary",
    commentary: `This collaboration between art historian Stephen Addiss and poet-translator Stanley Lombardo produced one of the most spare and minimalist English translations of the Daodejing. Addiss brought expertise in East Asian art and calligraphy; Lombardo had previously translated Homer and Virgil with a distinctive contemporary poetic voice. Together they created a version remarkable for its economy of language — often using fewer words than the Chinese original, stripping away conjunctions, articles, and explanatory additions to achieve a kind of semantic transparency. Their Chapter 1 is among the most tightly compressed in the English translation tradition. The translation has been praised for capturing the laconic quality of classical Chinese, though critics note it sometimes sacrifices philosophical nuance for poetic effect. Published in 1993 by Hackett, it remains influential among readers who prefer the Daodejing as poetry rather than as philosophy, and among those who see compression itself as a form of fidelity.`,
  },
  {
    name: "Robert Henricks",
    dates: "b. 1943",
    cluster: "sinologist",
    commentary: `Robert Henricks's <em>Lao-Tzu: Te-Tao Ching</em> (1989) is distinctive as the first major English translation based on the Ma-wang-tui silk manuscripts, discovered in a Han dynasty tomb at Mawangdui, Hunan, in 1973. These manuscripts, dating to approximately 200 BCE, predate the Wang Pi commentary text by several centuries and contain significant textual differences. Most notably, the Ma-wang-tui version reverses the order of the two parts: the "Te" section comes before the "Tao" section — hence Henricks's title <em>Te-Tao Ching</em> rather than <em>Tao Te Ching</em>. Henricks, a professor at Dartmouth, brought rigorous philological scholarship to comparing the two textual traditions. His work opened new questions about the original composition of the text and challenged assumptions based solely on the Wang Pi commentary. For scholars, Henricks's translation is essential for understanding how the Daodejing was transmitted and transformed across the centuries before it reached its standard received form.`,
  },
  {
    name: "Victor H. Mair",
    dates: "b. 1943",
    cluster: "sinologist",
    commentary: `Victor Mair's translation, published as <em>Tao Te Ching: The Classic Book of Integrity and the Way</em> (1990), draws on wide comparative linguistic and historical scholarship to situate the Daodejing in its broadest possible context. Mair, a professor at the University of Pennsylvania, was particularly interested in connections between early Daoist thought and Central Asian and Indo-European traditions, arguing that some Daoist concepts may have entered China through contact with steppe peoples. His translation is notable for rendering "Tao" as "Way" and "Te" as "Integrity" — choices reflecting his commitment to stripping away centuries of accumulated interpretation and returning to a more etymologically grounded reading. Mair also drew on early manuscript traditions and brought comparative mythology and linguistics to bear on difficult passages. His work remains controversial among specialists but represents one of the most adventurous and far-reaching scholarly approaches to the text, consistently asking what the words originally meant before tradition calcified around them.`,
  },
]

export const CLUSTERS: ClusterGroup[] = [
  {
    name: "sinologist",
    label: "The Sinologists",
    description: "Trained scholars of classical Chinese — translating from the original, with philological apparatus. These cluster tightly in semantic space.",
    members: ["Arthur Waley", "Ch'u Ta-Kao", "J.J.L. Duyvendak", "Wing-Tsit Chan", "D.C. Lau", "Michael LaFargue", "Robert Henricks", "Victor H. Mair"],
  },
  {
    name: "literary",
    label: "The Literary Adapters",
    description: "Translators who balanced scholarly grounding with literary ambition — seeking style and feeling alongside accuracy.",
    members: ["Lin Yutang", "Richard Wilhelm", "Ellen M. Chen", "Stephen Addiss and Stanley Lombardo", "Gia-fu Feng and Jane English"],
  },
  {
    name: "spiritual",
    label: "The Spiritual Interpreters",
    description: "Translations driven by spiritual or theological frames — prioritizing the contemplative and experiential over the philological.",
    members: ["John C.H. Wu", "Gia-fu Feng and Jane English"],
  },
]
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/detc/prog/ddj && npx tsc --noEmit
```

Expected: no errors (or only pre-existing errors unrelated to this file).

- [ ] **Step 3: Commit**

```bash
git add lib/translator-data.ts
git commit -m "feat: add static translator metadata and cluster definitions"
```

---

## Task 3: New Server Actions

**Files:**
- Modify: `app/actions.tsx`

**Interfaces:**
- Produces:
  - `getSpotlightPair(nameA: string, nameB: string): Promise<SpotlightPair>`
  - `getTopTranslatorDocs(names: string[]): Promise<Document[]>`
  - `SpotlightPair` type exported

- [ ] **Step 1: Add new actions to app/actions.tsx**

Append to the existing `app/actions.tsx` (keep `listAll` and `listSimilar` untouched):

```typescript
export interface SpotlightPair {
  docA: Document
  docB: Document
  similarity: number
}

export async function getSpotlightPair(nameA: string, nameB: string): Promise<SpotlightPair> {
  try {
    const [docA, docB] = await Promise.all([
      prisma.document.findFirst({ where: { translator: nameA } }),
      prisma.document.findFirst({ where: { translator: nameB } }),
    ])
    if (!docA || !docB) throw new Error(`Translator not found: ${!docA ? nameA : nameB}`)

    const result: Array<{ similarity: number }> = await prisma.$queryRaw`
      SELECT 1 - (
        (SELECT embedding FROM document WHERE id = ${docA.id})
        <=>
        (SELECT embedding FROM document WHERE id = ${docB.id})
      ) as similarity
    `
    return { docA, docB, similarity: result[0].similarity }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getTopTranslatorDocs(names: string[]): Promise<Array<Document>> {
  try {
    const docs = await prisma.document.findMany({
      where: { translator: { in: names } },
    })
    return docs
  } catch (error) {
    console.error(error)
    throw error
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/actions.tsx
git commit -m "feat: add getSpotlightPair and getTopTranslatorDocs server actions"
```

---

## Task 4: ScrollReveal Wrapper Component

**Files:**
- Create: `components/scroll-reveal.tsx`

**Interfaces:**
- Produces: `<ScrollReveal delay? direction? className?>` client component that wraps children with a Framer Motion reveal-on-scroll effect

- [ ] **Step 1: Create components/scroll-reveal.tsx**

```tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const initial = {
    opacity: 0,
    y: direction === 'up' ? 32 : 0,
    x: direction === 'left' ? -32 : direction === 'right' ? 32 : 0,
  }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      style={
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? { opacity: 1, transform: 'none' }
          : undefined
      }
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/scroll-reveal.tsx
git commit -m "feat: add ScrollReveal framer-motion wrapper"
```

---

## Task 5: Hero Component

**Files:**
- Create: `components/hero.tsx`

**Interfaces:**
- Consumes: nothing (self-contained, uses `useScroll` and `useTransform` internally)
- Produces: `<Hero />` client component, full viewport height

- [ ] **Step 1: Create components/hero.tsx**

```tsx
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const CHINESE_TEXT = `道可道，非常道。
名可名，非常名。
無名天地之始；
有名萬物之母。
故常無欲，以觀其妙；
常有欲，以觀其徼。
此兩者，同出而異名，
同謂之玄，
玄之又玄，
眾妙之門。`

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const chineseY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])
  const chineseOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* background decorative glyph */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{ y: chineseY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span className="font-chinese text-[20vw] leading-none text-ink">道</span>
      </motion.div>

      {/* main Chinese text */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        style={{ y: chineseY, opacity: chineseOpacity }}
        className="relative z-10 text-center mb-16"
      >
        <pre className="font-chinese text-xl md:text-2xl lg:text-3xl leading-loose tracking-widest text-ink whitespace-pre-wrap">
          {CHINESE_TEXT}
        </pre>
        <p className="mt-4 text-sm text-muted font-default tracking-widest uppercase">
          王弼本 · Wang Pi Commentary Text
        </p>
      </motion.div>

      {/* English title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
        style={{ y: titleY, opacity: titleOpacity }}
        className="relative z-10 text-center"
      >
        <h1 className="font-serif text-4xl md:text-6xl font-semibold text-ink tracking-tight mb-3">
          Tao Translations
        </h1>
        <p className="text-muted font-default text-lg md:text-xl max-w-md mx-auto leading-relaxed">
          180+ English translations of the Daodejing, Chapter One — explored through semantic similarity
        </p>
      </motion.div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-transparent to-muted"
        />
        <span className="text-xs tracking-widest uppercase font-default">scroll</span>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Wire Hero into app/page.tsx temporarily to verify**

Temporarily replace `app/page.tsx` content with:

```tsx
import { Hero } from '@/components/hero'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  )
}
```

- [ ] **Step 3: Start dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:3000`. You should see:
- Warm cream background
- Large decorative 道 character (very faint) in background
- Chinese Chapter 1 text centered, with Wang Pi attribution below
- English title and subtitle below it
- Animated scroll indicator at bottom
- On scroll: Chinese text and title drift upward at different speeds and fade out

- [ ] **Step 4: Commit**

```bash
git add components/hero.tsx app/page.tsx
git commit -m "feat: add Hero component with parallax drift"
```

---

## Task 6: Essay Section Component

**Files:**
- Create: `components/essay-section.tsx`

**Interfaces:**
- Consumes: `ScrollReveal` from `components/scroll-reveal.tsx`
- Produces: `<EssaySection>` server component. Props:
  - `children: React.ReactNode`
  - `pullQuote?: string`
  - `pullQuoteAttribution?: string`
  - `className?: string`

- [ ] **Step 1: Create components/essay-section.tsx**

```tsx
import { ScrollReveal } from '@/components/scroll-reveal'

interface EssaySection {
  children: React.ReactNode
  pullQuote?: string
  pullQuoteAttribution?: string
  className?: string
}

export function EssaySection({ children, pullQuote, pullQuoteAttribution, className }: EssaySection) {
  return (
    <section className={`relative py-24 px-6 ${className ?? ''}`}>
      <div className="max-w-2xl mx-auto">
        <ScrollReveal>
          <div className="font-serif text-2xl md:text-3xl leading-relaxed text-ink space-y-8">
            {children}
          </div>
        </ScrollReveal>

        {pullQuote && (
          <ScrollReveal delay={0.15} direction="left">
            <blockquote className="mt-16 ml-0 md:-ml-8 pl-6 border-l-2 border-accent">
              <p className="font-serif text-3xl md:text-4xl italic text-ink leading-snug">
                &ldquo;{pullQuote}&rdquo;
              </p>
              {pullQuoteAttribution && (
                <cite className="mt-3 block text-sm text-muted font-default not-italic tracking-wide">
                  — {pullQuoteAttribution}
                </cite>
              )}
            </blockquote>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/essay-section.tsx
git commit -m "feat: add EssaySection component"
```

---

## Task 7: Spotlight Component

**Files:**
- Create: `components/spotlight.tsx`

**Interfaces:**
- Consumes: `SpotlightPair` from `app/actions.tsx`
- Produces: `<Spotlight>` client component. Props:
  - `pairA: SpotlightPair`
  - `pairB: SpotlightPair`
  - `title: string`
  - `intro: React.ReactNode`

- [ ] **Step 1: Create components/spotlight.tsx**

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { SpotlightPair } from '@/app/actions'

interface SpotlightProps {
  pairA: SpotlightPair
  pairB: SpotlightPair
  title: string
  intro: React.ReactNode
}

function SimilarityBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass">
      <div className="w-2 h-2 rounded-full bg-jade" />
      <span className="text-xs font-default font-semibold tracking-widest text-jade uppercase">
        {pct}% similarity
      </span>
    </div>
  )
}

function ComparisonPanel({ pair }: { pair: SpotlightPair }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-8"
    >
      <div className="flex justify-end mb-4">
        <SimilarityBadge score={pair.similarity} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[pair.docA, pair.docB].map((doc) => (
          <div key={doc.id} className="glass rounded-xl p-6">
            <div className="mb-3">
              <p className="font-default font-semibold text-ink text-sm">{doc.translator}</p>
              <p className="font-default text-xs text-muted">{doc.date}</p>
            </div>
            <p className="font-serif text-base leading-relaxed text-ink">{doc.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function Spotlight({ pairA, pairB, title, intro }: SpotlightProps) {
  const [active, setActive] = useState<'A' | 'B' | null>(null)

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-6">{title}</h2>
          <div className="font-serif text-xl md:text-2xl leading-relaxed text-ink space-y-5 mb-10">
            {intro}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-wrap gap-3"
        >
          <button
            onClick={() => setActive(active === 'A' ? null : 'A')}
            className={`px-5 py-2.5 rounded-full font-default text-sm font-medium transition-all duration-300 border ${
              active === 'A'
                ? 'bg-ink text-canvas border-ink'
                : 'glass text-ink hover:border-accent'
            }`}
          >
            {pairA.docA.translator} vs {pairA.docB.translator}
          </button>
          <button
            onClick={() => setActive(active === 'B' ? null : 'B')}
            className={`px-5 py-2.5 rounded-full font-default text-sm font-medium transition-all duration-300 border ${
              active === 'B'
                ? 'bg-ink text-canvas border-ink'
                : 'glass text-ink hover:border-accent'
            }`}
          >
            {pairB.docA.translator} vs {pairB.docB.translator}
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {active === 'A' && <ComparisonPanel key="A" pair={pairA} />}
          {active === 'B' && <ComparisonPanel key="B" pair={pairB} />}
        </AnimatePresence>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/spotlight.tsx
git commit -m "feat: add Spotlight interactive comparison component"
```

---

## Task 8: Translator Card & Gallery

**Files:**
- Create: `components/translator-card.tsx`
- Create: `components/translator-gallery.tsx`

**Interfaces:**
- Consumes: `TranslatorMeta` from `lib/translator-data.ts`, `Document` from `@prisma/client`
- Produces:
  - `<TranslatorCard meta={TranslatorMeta} doc={Document | undefined} />`
  - `<TranslatorGallery docs={Document[]} />` — server component

- [ ] **Step 1: Create components/translator-card.tsx**

```tsx
import { ScrollReveal } from '@/components/scroll-reveal'
import type { TranslatorMeta } from '@/lib/translator-data'
import type { Document } from '@prisma/client'

const CLUSTER_LABELS: Record<string, string> = {
  sinologist: 'Sinologist',
  literary: 'Literary',
  spiritual: 'Spiritual',
}

interface TranslatorCardProps {
  meta: TranslatorMeta
  doc: Document | undefined
  index: number
}

export function TranslatorCard({ meta, doc, index }: TranslatorCardProps) {
  return (
    <ScrollReveal delay={index * 0.05} direction="up">
      <article className="glass rounded-2xl p-6 md:p-8 h-full flex flex-col gap-4">
        <header>
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="font-serif text-xl font-semibold text-ink leading-tight">{meta.name}</h3>
            <span className="shrink-0 text-xs font-default font-medium px-2.5 py-1 rounded-full border border-jade/40 text-jade">
              {CLUSTER_LABELS[meta.cluster]}
            </span>
          </div>
          <p className="text-sm text-muted font-default">{meta.dates}</p>
        </header>

        {doc && (
          <blockquote className="pl-4 border-l border-accent/40">
            <p className="font-serif text-sm italic text-muted leading-relaxed line-clamp-3">
              &ldquo;{doc.text.slice(0, 160)}&hellip;&rdquo;
            </p>
          </blockquote>
        )}

        <p
          className="font-default text-sm leading-relaxed text-ink flex-1"
          dangerouslySetInnerHTML={{ __html: meta.commentary }}
        />
      </article>
    </ScrollReveal>
  )
}
```

- [ ] **Step 2: Create components/translator-gallery.tsx**

```tsx
import { TranslatorCard } from '@/components/translator-card'
import { TRANSLATORS } from '@/lib/translator-data'
import type { Document } from '@prisma/client'

interface TranslatorGalleryProps {
  docs: Document[]
}

export function TranslatorGallery({ docs }: TranslatorGalleryProps) {
  const docsByName = new Map(docs.map((d) => [d.translator, d]))

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-4">
            The Translators
          </h2>
          <p className="font-serif text-xl text-muted leading-relaxed">
            Fourteen of the most significant voices to render the Daodejing into English — each bringing a distinct tradition, method, and interpretive frame.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TRANSLATORS.map((meta, i) => (
            <TranslatorCard
              key={meta.name}
              meta={meta}
              doc={docsByName.get(meta.name)}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/translator-card.tsx components/translator-gallery.tsx
git commit -m "feat: add TranslatorCard and TranslatorGallery components"
```

---

## Task 9: Cluster Visualization Component

**Files:**
- Create: `components/cluster-viz.tsx`

**Interfaces:**
- Consumes: `CLUSTERS` from `lib/translator-data.ts`
- Produces: `<ClusterViz />` server component

- [ ] **Step 1: Create components/cluster-viz.tsx**

```tsx
import { ScrollReveal } from '@/components/scroll-reveal'
import { CLUSTERS } from '@/lib/translator-data'

const CLUSTER_ICONS: Record<string, string> = {
  sinologist: '学',
  literary: '文',
  spiritual: '道',
}

export function ClusterViz() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-transparent via-white/20 to-transparent">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="max-w-2xl mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-4">
              Translation Families
            </h2>
            <p className="font-serif text-xl text-muted leading-relaxed">
              When we compute cosine similarity across all 180+ translations, three interpretive
              traditions emerge — not by declaration, but by the words each translator chose.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CLUSTERS.map((cluster, i) => (
            <ScrollReveal key={cluster.name} delay={i * 0.1} direction="up">
              <div className="glass rounded-2xl p-6 h-full flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-chinese text-3xl text-accent opacity-70" aria-hidden>
                    {CLUSTER_ICONS[cluster.name]}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-ink">{cluster.label}</h3>
                </div>
                <p className="font-default text-sm text-muted leading-relaxed">{cluster.description}</p>
                <ul className="mt-auto space-y-1.5">
                  {cluster.members.map((name) => (
                    <li key={name} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-jade flex-shrink-0" />
                      <span className="font-default text-sm text-ink">{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <p className="mt-12 font-serif text-lg text-muted leading-relaxed max-w-2xl mx-auto text-center">
            Scholars who read classical Chinese cluster together. Poets find each other. Mystics
            drift toward one another. The embeddings did not know these translators&rsquo; biographies
            — only their words.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/cluster-viz.tsx
git commit -m "feat: add ClusterViz translation families component"
```

---

## Task 10: Explorer Component

**Files:**
- Create: `components/explorer.tsx`

**Interfaces:**
- Consumes: `listAll`, `listSimilar` from `app/actions.tsx`; initial `docs: Document[]` as prop
- Produces: `<Explorer docs={Document[]} />` client component

- [ ] **Step 1: Create components/explorer.tsx**

```tsx
'use client'

import { useState } from 'react'
import { listSimilar } from '@/app/actions'
import type { Document } from '@prisma/client'

interface ExplorerProps {
  docs: Document[]
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1 bg-black/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-jade rounded-full transition-all duration-500"
          style={{ width: `${Math.round(score * 100)}%` }}
        />
      </div>
      <span className="text-xs font-default font-semibold text-jade tabular-nums w-10 text-right">
        {(score * 100).toFixed(1)}%
      </span>
    </div>
  )
}

export function Explorer({ docs }: ExplorerProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [results, setResults] = useState<Array<Document & { similarity: number }> | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelect = async (id: string, name: string) => {
    setSelected(name)
    setLoading(true)
    const res = await listSimilar(id)
    setResults(res)
    setLoading(false)
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-4">
            Explore All Translations
          </h2>
          <p className="font-default text-muted text-lg leading-relaxed">
            Select any translation to see which others are most semantically similar, ranked by cosine similarity of their embeddings.
          </p>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="max-h-96 overflow-y-auto divide-y divide-black/5">
            {docs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleSelect(doc.id, doc.translator)}
                className={`w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 transition-colors duration-150 hover:bg-white/50 ${
                  selected === doc.translator ? 'bg-white/60' : ''
                }`}
              >
                <div>
                  <span className="font-default text-sm font-medium text-ink">{doc.translator}</span>
                  <span className="ml-2 text-xs text-muted">{doc.date}</span>
                </div>
                {selected === doc.translator && (
                  <div className="w-1.5 h-1.5 rounded-full bg-jade flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {(loading || results) && (
          <div className="mt-8">
            {loading && (
              <div className="text-center py-12 text-muted font-default text-sm tracking-widest uppercase animate-pulse">
                Computing similarity&hellip;
              </div>
            )}
            {!loading && results && (
              <div>
                <h3 className="font-serif text-xl font-semibold text-ink mb-6">
                  Most similar to <em>{selected}</em>
                </h3>
                <div className="space-y-3">
                  {results.slice(0, 10).map((doc) => (
                    <div key={doc.id} className="glass rounded-xl p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-default font-semibold text-ink text-sm">{doc.translator}</p>
                          <p className="text-xs text-muted font-default">{doc.date}</p>
                        </div>
                      </div>
                      <ScoreBar score={doc.similarity} />
                      <p className="mt-3 font-serif text-sm text-muted leading-relaxed line-clamp-2">
                        {doc.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/explorer.tsx
git commit -m "feat: add Explorer live similarity tool component"
```

---

## Task 11: Page Assembly & Cleanup

**Files:**
- Rewrite: `app/page.tsx`
- Modify: `app/about/page.tsx` (redirect)
- Delete: `components/list.tsx`

**Interfaces:**
- Consumes: all components built in Tasks 4–10; `getSpotlightPair`, `getTopTranslatorDocs`, `listAll` from `app/actions.tsx`

- [ ] **Step 1: Rewrite app/page.tsx**

```tsx
import { Hero } from '@/components/hero'
import { EssaySection } from '@/components/essay-section'
import { Spotlight } from '@/components/spotlight'
import { TranslatorGallery } from '@/components/translator-gallery'
import { ClusterViz } from '@/components/cluster-viz'
import { Explorer } from '@/components/explorer'
import { getSpotlightPair, listAll } from '@/app/actions'
import { TRANSLATORS } from '@/lib/translator-data'
import { getTopTranslatorDocs } from '@/app/actions'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function Home() {
  const [
    spotlight1pairA,
    spotlight1pairB,
    allDocs,
    galleryDocs,
  ] = await Promise.all([
    getSpotlightPair('Stephan Mitchell', 'Arthur Waley'),
    getSpotlightPair('Ursula K. Le Guin', 'D.C. Lau'),
    listAll(),
    getTopTranslatorDocs(TRANSLATORS.map((t) => t.name)),
  ])

  return (
    <main>
      <Hero />

      <EssaySection
        pullQuote="The most translated text besides the Bible"
      >
        <p>
          The <em>Daodejing</em> — also romanized as <em>Tao Te Ching</em> — is an ancient Chinese
          text attributed to the sage Laozi, compiled around the fourth century BCE from the oral
          traditions of "Laoist" schools. Its eighty-one short chapters address the nature of the
          Tao (the Way), Te (virtue or power), and the art of governing both a kingdom and oneself.
        </p>
        <p>
          What makes it unusual in world literature is the sheer proliferation of its translations.
          By current count, there are over 250 English versions alone — an astonishing number for a
          text of fewer than six thousand Chinese characters. Each translation is also, inevitably,
          an interpretation: the ancient Chinese admits ambiguity that no English rendering can fully
          honor.
        </p>
        <p>
          The standard text used by most translators descends from the commentary of Wang Pi
          (226–249 CE). More recently, the discovery of the Ma-wang-tui silk manuscripts in 1973 —
          two versions buried around 200 BCE, predating Wang Pi by four centuries — opened new
          philological questions that some translators have taken as their starting point.
        </p>
      </EssaySection>

      <EssaySection>
        <div className="space-y-12">
          <div>
            <p className="font-default text-sm font-semibold text-accent uppercase tracking-widest mb-4">01</p>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-ink mb-4">
              Word for word, or clear in meaning?
            </h3>
            <p className="font-serif text-xl leading-relaxed text-ink">
              Ancient Chinese is uninflected and permits radical syntactic ambiguity. A fully
              literal translation would preserve word order at the cost of coherence; a freely
              interpretive one risks substituting the translator&rsquo;s philosophy for Laozi&rsquo;s.
              The most respected translations find a balance — literal enough to be accountable,
              free enough to be readable.
            </p>
          </div>
          <div>
            <p className="font-default text-sm font-semibold text-accent uppercase tracking-widest mb-4">02</p>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-ink mb-4">
              Historical context, or contemporary meaning?
            </h3>
            <p className="font-serif text-xl leading-relaxed text-ink">
              The Daodejing emerged as a political text — a meditation on rulership in the Warring
              States period. Popular translations often strip this context, presenting the text as
              timeless personal wisdom. Academic translations restore the historical frame, sometimes
              at the cost of accessibility.
            </p>
          </div>
          <div>
            <p className="font-default text-sm font-semibold text-accent uppercase tracking-widest mb-4">03</p>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-ink mb-4">
              Ideas, or style and feeling?
            </h3>
            <p className="font-serif text-xl leading-relaxed text-ink">
              The tone of the Daodejing is often described as playful, even paradoxical — a great
              deal of its meaning rides in its music. A translation that conveys every philosophical
              proposition while losing the lightness of the original has, in some important sense,
              failed. The best translators succeed at both, and it is largely their work and
              accomplishment to recreate ideas, style, and mood in another tongue.
            </p>
          </div>
        </div>
      </EssaySection>

      <Spotlight
        title="Who Has the Authority?"
        pairA={spotlight1pairA}
        pairB={spotlight1pairB}
        intro={
          <>
            <p>
              In his essay "Those Who Don&rsquo;t Know Speak," the sinologist Paul Goldin criticizes
              four popular translations — by Stephan Mitchell, Witter Bynner, Thomas Miles, and
              Ursula K. Le Guin — produced by Americans who do not read classical Chinese. These
              translators worked from existing English versions, recasting them into their own verse.
            </p>
            <p>
              Goldin&rsquo;s argument is not merely snobbery. He contends that such versions
              appropriate the palatable parts of a difficult text while quietly discarding the rest —
              setting a double standard for a classic that Western texts would never receive. The
              embeddings bear him out, at least in part.
            </p>
          </>
        }
      />

      <EssaySection
        pullQuote="The embeddings did not know the translators' biographies — only their words."
      >
        <p>
          In 2015, this project used word-frequency vectors to rank the 180+ translations by
          similarity to an authority baseline of established sinologists. The approach was blunt:
          each translation became a sparse vector of word presence, and cosine similarity measured
          overlap with the "master vector" of respected translations.
        </p>
        <p>
          With modern text embeddings, the picture is richer. Rather than counting shared words,
          embeddings capture semantic meaning — the <em>sense</em> of what a passage is saying, not
          just its surface vocabulary. Two translations can share few words and still cluster
          together because they convey the same philosophical understanding. Two translations can
          share many words and still diverge because they mean different things by them.
        </p>
        <p>
          The result is a map of the translation tradition that reflects its genuine intellectual
          contours. And the contours, it turns out, follow the fault lines of interpretation —
          who read the Chinese, who read the mystics, who read the poets.
        </p>
      </EssaySection>

      <TranslatorGallery docs={galleryDocs} />

      <ClusterViz />

      <Explorer docs={allDocs} />

      <footer className="py-16 px-6 border-t border-black/10">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="font-default text-sm text-muted leading-relaxed">
            Originally a 2015 computational linguistics study for EALC 301. Updated with text
            embeddings.{' '}
            <a href="https://github.com/dericko/ddj" className="underline hover:text-accent transition-colors">
              Source
            </a>
            {' / '}
            <a href="https://detc.cc" className="underline hover:text-accent transition-colors">
              detc.cc
            </a>
          </p>
          <p className="font-default text-xs text-muted leading-relaxed">
            Sources: Paul Goldin, <em>After Confucius</em> (2005) · Livia Kohn &amp; Michael
            LaFargue, <em>Lao-tzu and the Tao-te-ching</em> (1998) · Michael LaFargue,{' '}
            <em>Tao and Method</em> (1994) · 182 Translations of Chapter One, Bopsecrets.org
          </p>
        </div>
      </footer>
    </main>
  )
}
```

- [ ] **Step 2: Retire app/about/page.tsx with a redirect**

Replace `app/about/page.tsx` with:

```tsx
import { redirect } from 'next/navigation'

export default function About() {
  redirect('/')
}
```

- [ ] **Step 3: Delete components/list.tsx**

```bash
rm /Users/detc/prog/ddj/components/list.tsx
```

- [ ] **Step 4: Start dev server and do a full visual walkthrough**

```bash
npm run dev
```

Open `http://localhost:3000`. Walk through the full page:
- Hero loads with Chinese text, parallax drift on scroll ✓
- Essay Part 1 text reveals on scroll ✓
- Essay Part 2 numbered tradeoffs reveal ✓
- Spotlight: clicking "Mitchell vs Waley" button reveals side-by-side panel with similarity badge ✓
- Clicking again dismisses panel ✓
- Essay Part 3 text reveals ✓
- Translator Gallery: 14 cards load with staggered entrance, each has name, dates, cluster badge, excerpt, commentary ✓
- Cluster Viz: three groups display ✓
- Explorer: all 180+ translations listed, clicking one loads ranked similarity results ✓
- Footer visible ✓
- No console errors ✓

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/about/page.tsx
git rm components/list.tsx
git commit -m "feat: assemble single-page interactive essay, retire list.tsx and about page"
```

---

## Task 12: Polish — Translator Name Matching & Section Dividers

**Files:**
- Modify: `app/page.tsx` — fix translator names if DB names differ from `translator-data.ts`
- Modify: `lib/translator-data.ts` — align names to DB if needed

**Note:** The DB `translator` field was populated from the original seed JSON. If any gallery cards show no excerpt (because `docsByName.get(meta.name)` returns `undefined`), the `meta.name` strings in `translator-data.ts` don't match the DB exactly. Fix by inspecting DB values.

- [ ] **Step 1: Check DB translator names**

```bash
cd /Users/detc/prog/ddj && node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.document.findMany({ select: { translator: true }, distinct: ['translator'], orderBy: { translator: 'asc' } })
  .then(r => { r.forEach(d => console.log(JSON.stringify(d.translator))); prisma.\$disconnect(); })
"
```

Compare the output to the `name` fields in `lib/translator-data.ts`. Any mismatches need to be corrected in `translator-data.ts`.

- [ ] **Step 2: Fix any mismatched names in lib/translator-data.ts**

For each mismatched name, update the `name` field in the relevant `TRANSLATORS` entry to match the DB exactly. Also update `CLUSTERS.members` arrays for the same names.

- [ ] **Step 3: Add a thin section divider between major sections**

Add this utility class to `app/globals.css`:

```css
.section-rule {
  width: 3rem;
  height: 1px;
  background: var(--accent);
  opacity: 0.4;
  margin: 0 auto;
}
```

Add a divider `<div className="section-rule" />` between the three essay sections in `app/page.tsx` to give visual breathing room:

In `app/page.tsx`, between `</EssaySection>` blocks and before `<Spotlight>`, add:
```tsx
<div className="section-rule" aria-hidden />
```

- [ ] **Step 4: Final visual pass**

```bash
npm run dev
```

Confirm: all 14 translator cards show excerpts (not empty blockquotes). Section dividers appear. No layout breaks on mobile (resize browser to ~375px width).

- [ ] **Step 5: Final commit**

```bash
git add app/page.tsx app/globals.css lib/translator-data.ts
git commit -m "polish: fix translator name matching, add section dividers"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Hero with Chinese text + parallax — Task 5
- ✅ Essay Part 1 (background) — Task 11 page assembly
- ✅ Essay Part 2 (three tradeoffs) — Task 11 page assembly
- ✅ Spotlight 1 (Mitchell vs Waley, Le Guin vs D.C. Lau) — Tasks 7, 11
- ✅ Essay Part 3 (embeddings) — Task 11 page assembly
- ✅ Translator Gallery (14 cards, ~150w commentary, staggered) — Tasks 8, 11
- ✅ Spotlight 2 (cluster viz) — Task 9
- ✅ Explorer (live tool) — Task 10
- ✅ Footer — Task 11
- ✅ CSS custom properties with dark mode stub — Task 1
- ✅ Noto Serif SC + Lora fonts — Task 1
- ✅ Framer Motion parallax — Tasks 4, 5, 7
- ✅ prefers-reduced-motion — Task 4 (ScrollReveal)
- ✅ list.tsx deleted — Task 11
- ✅ about/page.tsx redirected — Task 11
- ✅ getSpotlightPair server action — Task 3
- ✅ getTopTranslatorDocs server action — Task 3

**Potential issue:** Spotlight component in Task 11 hardcodes `'Stephan Mitchell'` and `'Ursula K. Le Guin'` — these names must match the DB exactly. Task 12 addresses name matching but the spotlight names also need checking. Add a note: if `getSpotlightPair` throws "Translator not found," inspect DB names and update the hardcoded spotlight names in `app/page.tsx`.
