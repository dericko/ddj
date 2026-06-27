# Essay Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the ddj main page essay to weave full Chapter 1 translation displays into the narrative, add four new translators to the gallery/clusterviz, and fix line-break display throughout.

**Architecture:** `lib/chapter1-texts.ts` (already generated) provides formatted translation text via `getChapter1(name)`. A new `TranslationInset` component renders individual translations. `page.tsx` is restructured to split the intro paragraphs and replace the numbered tension sections with headed sections containing blurbs and live translation pairs. `Spotlight` and `Explorer` are updated to use `getChapter1()` for formatted text.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion. No test framework — verification is TypeScript check + visual inspection in dev server.

## Global Constraints

- `lib/chapter1-texts.ts` already exists and is committed — do not regenerate it
- All translator names passed to `getChapter1()` must exactly match the `name` field in `CHAPTER1_TRANSLATIONS` (straight apostrophes, exact spelling)
- Follow existing Tailwind class patterns: `font-serif`, `font-default`, `text-ink`, `text-muted`, `text-accent`, `glass rounded-2xl`, `border-jade/40 text-jade`
- `ScrollReveal` wraps content with framer-motion animation — use it for new content blocks
- Working directory is the git worktree: `/Users/detc/prog/ddj/.claude/worktrees/lucky-dazzling-unicorn`
- Dev server command: `npm run dev` (from the project root `/Users/detc/prog/ddj`, not the worktree — or set `SKIP_ENV_VALIDATION=1` if env vars are missing)

---

### Task 1: TranslationInset component

**Files:**
- Create: `components/translation-inset.tsx`

**Interfaces:**
- Consumes: `ScrollReveal` from `@/components/scroll-reveal`, `ClusterName` from `@/lib/translator-data`
- Produces: `TranslationInset({ translator, date, cluster, text, paired? })` — used in Tasks 3

- [ ] **Step 1: Create the component**

Create `components/translation-inset.tsx`:

```tsx
import { ScrollReveal } from '@/components/scroll-reveal'
import type { ClusterName } from '@/lib/translator-data'

const CLUSTER_LABELS: Record<ClusterName, string> = {
  sinologist: 'Sinologist',
  literary: 'Literary',
  spiritual: 'Spiritual',
}

interface TranslationInsetProps {
  translator: string
  date: string
  cluster: ClusterName
  text: string
  paired?: boolean
}

export function TranslationInset({ translator, date, cluster, text, paired }: TranslationInsetProps) {
  return (
    <ScrollReveal>
      <div className={`glass rounded-2xl p-6 md:p-8${paired ? '' : ' max-w-2xl mx-auto'}`}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="font-serif text-lg font-semibold text-ink">{translator}</p>
            <p className="font-default text-sm text-muted">{date}</p>
          </div>
          <span className="shrink-0 text-xs font-default font-medium px-2.5 py-1 rounded-full border border-jade/40 text-jade">
            {CLUSTER_LABELS[cluster]}
          </span>
        </div>
        <p className="font-serif text-lg leading-relaxed whitespace-pre-line text-ink">{text}</p>
      </div>
    </ScrollReveal>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/detc/prog/ddj && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors (or only pre-existing errors unrelated to this file).

- [ ] **Step 3: Commit**

```bash
git add components/translation-inset.tsx
git commit -m "feat: add TranslationInset component"
```

---

### Task 2: Add four translators to translator-data.ts

**Files:**
- Modify: `lib/translator-data.ts`

**Interfaces:**
- Produces: Four new `TranslatorMeta` entries in `TRANSLATORS`; four names added to `CLUSTERS[].members`
- Consumed by: `TranslatorGallery` (iterates `TRANSLATORS`), `ClusterViz` (iterates `CLUSTERS`), `page.tsx` (`getTopTranslatorDocs(TRANSLATORS.map(t => t.name))`)

- [ ] **Step 1: Add four entries to the TRANSLATORS array**

Open `lib/translator-data.ts`. After the last entry (`Victor H. Mair`), add:

```ts
  {
    name: "Stephen Mitchell",
    dates: "b. 1943",
    cluster: "spiritual",
    commentary: `Stephen Mitchell is an American poet and translator whose 1988 rendering of the Daodejing became one of the bestselling English versions ever published. Mitchell reads no classical Chinese; his translation was assembled from comparison of existing English versions and consultation with scholars. The sinologist Paul Goldin singled out Mitchell's version for criticism in his essay "Those Who Don't Know Speak," arguing that working without access to the original allows a translator to select the palatable and discard the difficult. Mitchell's defense — that fidelity to the spirit matters more than fidelity to the letter — is a position with its own long history in translation theory. Whatever its philological standing, his version is widely credited with introducing the Daodejing to a generation of Western readers who would never have sought out an academic translation. The embeddings place it far from the sinologist cluster.`,
  },
  {
    name: "Ursula K. Le Guin",
    dates: "1929–2018",
    cluster: "literary",
    commentary: `Ursula K. Le Guin was one of the most celebrated American fiction writers of the twentieth century, whose science fiction and fantasy drew deeply on Daoist thought — particularly the concepts of wu wei, cyclical change, and yielding as strength. Her 1997 rendering, subtitled "A Book about the Way and the Power of the Way," was explicitly a writer's translation rather than a scholar's: she worked from existing versions with the help of J.P. Seaton, a sinologist, but made no claim to translate from the Chinese directly. Her introduction is a small classic of translation theory, arguing for the Daodejing as a "feminist" and "anarchist" text. Her version is notable for its spare contemporary diction, its short lines, and its avoidance of mystifying terminology. Goldin included her among the American non-readers he criticized; her embeddings cluster with the literary adapters.`,
  },
  {
    name: "Witter Bynner",
    dates: "1881–1968",
    cluster: "literary",
    commentary: `Witter Bynner was an American poet who produced a translation of the Daodejing in 1944 in collaboration with Kiang Kang-hu, a Chinese scholar who provided literal cribs that Bynner then rendered into English verse. The collaboration was genuinely cross-cultural in its method, though Bynner himself could not read Chinese. His version, published as <em>The Way of Life According to Laotzu</em>, is notable for its loose, ruminative quality — closest in spirit to a paraphrase, furthest in letter from the Chinese. Paul Goldin cited Bynner among the non-readers whose versions he criticized. The opening lines are striking: Bynner replaces "Tao" entirely with "Existence," a choice that cuts against the philosophical specificity the term carries and signals his primary allegiance to accessibility over fidelity. His version was widely read in the mid-twentieth century and influenced later literary adapters.`,
  },
  {
    name: "Aleister Crowley",
    dates: "1875–1947",
    cluster: "literary",
    commentary: `Aleister Crowley — occultist, poet, and provocateur — produced a translation of the Daodejing in 1918 as part of his broader project of synthesizing Western occultism with Eastern philosophy. He titled it the "Tao Teh King" and read it through the lens of his own magical system, Thelema, most visibly in Chapter 1: where other translators see "desire" as an epistemological stance, Crowley hears "fulfilling one's will" — the central imperative of Thelema. The result is a translation that says something genuinely different from any other version, not because the Chinese permits it but because Crowley's interpretive frame was entirely his own. It is among the most eccentric texts in the English translation tradition and has found a devoted readership in occult circles. As a data point, it is a near-perfect illustration of how a translator's prior commitments shape what they find in the text.`,
  },
```

- [ ] **Step 2: Add the four names to CLUSTERS**

In the `CLUSTERS` array, update the `members` arrays:

`sinologist` cluster — no change (none of the four are sinologists).

`literary` cluster — add `"Ursula K. Le Guin"`, `"Witter Bynner"`, `"Aleister Crowley"`:

```ts
  {
    name: "literary",
    label: "The Literary Adapters",
    description: "Translators who balanced scholarly grounding with literary ambition — seeking style and feeling alongside accuracy.",
    members: ["Lin Yutang", "Richard Wilhelm", "Ellen M. Chen", "Stephen Addiss and Stanley Lombardo", "Gia-fu Feng and Jane English", "Ursula K. Le Guin", "Witter Bynner", "Aleister Crowley"],
  },
```

`spiritual` cluster — add `"Stephen Mitchell"`:

```ts
  {
    name: "spiritual",
    label: "The Spiritual Interpreters",
    description: "Translations driven by spiritual or theological frames — prioritizing the contemplative and experiential over the philological.",
    members: ["John C.H. Wu", "Gia-fu Feng and Jane English", "Stephen Mitchell"],
  },
```

- [ ] **Step 3: Update gallery description count**

In `components/translator-gallery.tsx`, change the subtitle from:

```tsx
Fourteen of the most significant voices to render the Daodejing into English — each bringing a distinct tradition, method, and interpretive frame.
```

To:

```tsx
Eighteen of the most significant voices to render the Daodejing into English — each bringing a distinct tradition, method, and interpretive frame.
```

- [ ] **Step 4: Type-check**

```bash
cd /Users/detc/prog/ddj && npx tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add lib/translator-data.ts components/translator-gallery.tsx
git commit -m "feat: add Mitchell, Le Guin, Bynner, Crowley to translator gallery and clusterviz"
```

---

### Task 3: Restructure page.tsx essay

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `TranslationInset` from `@/components/translation-inset`, `getChapter1` from `@/lib/chapter1-texts`, `ScrollReveal` from `@/components/scroll-reveal`
- The three original intro paragraphs remain verbatim — only their grouping changes

- [ ] **Step 1: Add new imports**

At the top of `app/page.tsx`, add three imports after the existing ones:

```tsx
import { TranslationInset } from '@/components/translation-inset'
import { ScrollReveal } from '@/components/scroll-reveal'
import { getChapter1 } from '@/lib/chapter1-texts'
```

- [ ] **Step 2: Replace the essay body (Hero through second section-rule)**

Replace the entire JSX from `<Hero />` through the second `<div className="section-rule" />` (i.e., the intro EssaySection and the numbered tensions EssaySection) with the new structure below. The Spotlight and everything after it remain unchanged.

The current block to replace starts at `<Hero />` and ends just before `{spotlight1pairA && spotlight1pairB && (`.

Replace it with:

```tsx
      <Hero />

      {/* Intro paragraph 1 */}
      <EssaySection
        pullQuote="The most translated text besides the Bible"
      >
        <p>
          The <em>Daodejing</em> — also romanized as <em>Tao Te Ching</em> — is an ancient Chinese
          text attributed to the sage Laozi, compiled around the fourth century BCE from the oral
          traditions of &ldquo;Laoist&rdquo; schools. Its eighty-one short chapters address the nature of the
          Tao (the Way), Te (virtue or power), and the art of governing both a kingdom and oneself.
        </p>
      </EssaySection>

      <section className="py-12 px-6">
        <TranslationInset
          translator="D.C. Lau"
          date="1963"
          cluster="sinologist"
          text={getChapter1('D.C. Lau')?.text ?? ''}
        />
      </section>

      {/* Intro paragraph 2 */}
      <EssaySection>
        <p>
          What makes it unusual in world literature is the sheer proliferation of its translations.
          By current count, there are over 250 English versions alone — an astonishing number for a
          text of fewer than six thousand Chinese characters. Each translation is also, inevitably,
          an interpretation: the ancient Chinese admits ambiguity that no English rendering can fully
          honor.
        </p>
      </EssaySection>

      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <TranslationInset
            translator="Arthur Waley"
            date="1934"
            cluster="sinologist"
            text={getChapter1('Arthur Waley')?.text ?? ''}
            paired
          />
          <TranslationInset
            translator="Wing-Tsit Chan"
            date="1963"
            cluster="sinologist"
            text={getChapter1('Wing-Tsit Chan')?.text ?? ''}
            paired
          />
        </div>
      </section>

      {/* Intro paragraph 3 */}
      <EssaySection>
        <p>
          The standard text used by most translators descends from the commentary of Wang Pi
          (226–249 CE). More recently, the discovery of the Ma-wang-tui silk manuscripts in 1973 —
          two versions buried around 200 BCE, predating Wang Pi by four centuries — opened new
          philological questions that some translators have taken as their starting point.
        </p>
      </EssaySection>

      <div className="section-rule" aria-hidden="true" />

      {/* Tension 1: Literal vs paraphrased */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-6">
              Literal vs paraphrased
            </h2>
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-ink mb-10">
              Henricks follows the Ma-wang-tui manuscripts closely enough that his opening splits
              into two declarative sentences where most translators write one. Mitchell, who reads
              no classical Chinese, worked from existing versions to produce a philosophical poem.
              Notice how the shift from &ldquo;the constant Way&rdquo; to &ldquo;the eternal Tao&rdquo; changes what
              the reader is being asked to imagine — and how much the line breaks alone can shift
              the feeling of a passage.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TranslationInset
              translator="Robert Henricks"
              date="1989"
              cluster="sinologist"
              text={getChapter1('Robert Henricks')?.text ?? ''}
              paired
            />
            <TranslationInset
              translator="Stephen Mitchell"
              date="1988"
              cluster="spiritual"
              text={getChapter1('Stephen Mitchell')?.text ?? ''}
              paired
            />
          </div>
        </div>
      </section>

      {/* Tension 2: Historical vs contemporary */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-6">
              Historical vs contemporary
            </h2>
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-ink mb-10">
              Duyvendak&rsquo;s dense, formal prose keeps the text at a scholarly distance —
              &ldquo;Non-being&rdquo; and &ldquo;Being&rdquo; signal a political philosophy from the Warring States, not a
              personal guide. Le Guin&rsquo;s short lines and second-person address make the same ideas
              feel immediate. Both are working from the same source; what changes is the implied
              reader and what the translator thinks the text is for.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TranslationInset
              translator="J.J.L. Duyvendak"
              date="1954"
              cluster="sinologist"
              text={getChapter1('J.J.L. Duyvendak')?.text ?? ''}
              paired
            />
            <TranslationInset
              translator="Ursula K. Le Guin"
              date="1997"
              cluster="literary"
              text={getChapter1('Ursula K. Le Guin')?.text ?? ''}
              paired
            />
          </div>
        </div>
      </section>

      {/* Tension 3: Lyrical adaptations */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-6">
              Lyrical adaptations
            </h2>
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-ink mb-10">
              These three translators came to the text from outside the scholarly tradition —
              counterculture spirituality, occult philosophy, and minimalist poetry — and each
              produced something no sinologist would have written. Read them less for accuracy
              than for what each reveals about the imaginative range the original makes possible.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TranslationInset
              translator="Gia-fu Feng and Jane English"
              date="1972"
              cluster="spiritual"
              text={getChapter1('Gia-fu Feng and Jane English')?.text ?? ''}
              paired
            />
            <TranslationInset
              translator="Aleister Crowley"
              date="1918"
              cluster="literary"
              text={getChapter1('Aleister Crowley')?.text ?? ''}
              paired
            />
            <TranslationInset
              translator="Stephen Addiss and Stanley Lombardo"
              date="1993"
              cluster="literary"
              text={getChapter1('Stephen Addiss and Stanley Lombardo')?.text ?? ''}
              paired
            />
          </div>
        </div>
      </section>

      <div className="section-rule" aria-hidden="true" />

```

- [ ] **Step 3: Update the footer citation**

Find the footer's sources `<p>` element. Replace it with:

```tsx
          <p className="font-default text-xs text-muted leading-relaxed">
            Sources: Paul Goldin, <em>After Confucius</em> (2005) · Livia Kohn &amp; Michael
            LaFargue, <em>Lao-tzu and the Tao-te-ching</em> (1998) · Michael LaFargue,{' '}
            <em>Tao and Method</em> (1994) · Bureau of Public Secrets,{' '}
            <a
              href="https://www.bopsecrets.org/gateway/passages/tao-te-ching.htm"
              className="underline hover:text-accent transition-colors"
            >
              175+ Translations of Chapter One
            </a>
          </p>
```

- [ ] **Step 4: Type-check**

```bash
cd /Users/detc/prog/ddj && npx tsc --noEmit 2>&1 | head -40
```

Expected: no new errors.

- [ ] **Step 5: Visual verification**

```bash
cd /Users/detc/prog/ddj && npm run dev
```

Open `http://localhost:3000` and verify:
- Para 1 → D.C. Lau inset (single, centered, line breaks preserved)
- Para 2 → Waley + Chan side by side
- Para 3 → section rule → three tension sections with blurbs and translation pairs
- "Lyrical adaptations" shows three columns on wide screens
- Footer has bopsecrets link

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat: restructure essay with translation insets and tension sections"
```

---

### Task 4: Spotlight line-break fix

**Files:**
- Modify: `components/spotlight.tsx`

**Interfaces:**
- Consumes: `getChapter1` from `@/lib/chapter1-texts`

- [ ] **Step 1: Add import and fix rendering**

In `components/spotlight.tsx`, add the import after the existing imports:

```tsx
import { getChapter1 } from '@/lib/chapter1-texts'
```

In the `ComparisonPanel` function, replace:

```tsx
            <p className="font-serif text-base leading-relaxed text-ink">{doc.text}</p>
```

With:

```tsx
            <p className="font-serif text-base leading-relaxed text-ink whitespace-pre-line">
              {getChapter1(doc.translator)?.text ?? doc.text}
            </p>
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/detc/prog/ddj && npx tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Visual verification**

Open `http://localhost:3000` (dev server should still be running), scroll to the "Who Has the Authority?" section. Click each comparison button and verify that translation text shows line breaks rather than one continuous paragraph.

- [ ] **Step 4: Commit**

```bash
git add components/spotlight.tsx
git commit -m "fix: preserve line breaks in Spotlight translation display"
```

---

### Task 5: Explorer expandable full text

**Files:**
- Modify: `components/explorer.tsx`

**Interfaces:**
- Consumes: `getChapter1` from `@/lib/chapter1-texts`

- [ ] **Step 1: Add import and expand/collapse state**

In `components/explorer.tsx`, add the import after the existing imports:

```tsx
import { getChapter1 } from '@/lib/chapter1-texts'
```

Inside the `Explorer` function, add a new state variable after the existing ones:

```tsx
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
```

- [ ] **Step 2: Replace the result card text section**

Find the result card text block (currently `line-clamp-2`). Replace:

```tsx
                      <ScoreBar score={doc.similarity} />
                      <p className="mt-3 font-serif text-sm text-muted leading-relaxed line-clamp-2">
                        {doc.text}
                      </p>
```

With:

```tsx
                      <ScoreBar score={doc.similarity} />
                      <p className={`mt-3 font-serif text-sm text-muted leading-relaxed whitespace-pre-line ${expanded.has(doc.id) ? '' : 'line-clamp-2'}`}>
                        {expanded.has(doc.id)
                          ? (getChapter1(doc.translator)?.text ?? doc.text)
                          : doc.text}
                      </p>
                      <button
                        onClick={() => toggleExpanded(doc.id)}
                        className="mt-2 text-xs font-default text-accent hover:underline"
                      >
                        {expanded.has(doc.id) ? 'Collapse' : 'Show full translation'}
                      </button>
```

- [ ] **Step 3: Type-check**

```bash
cd /Users/detc/prog/ddj && npx tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 4: Visual verification**

In `http://localhost:3000`, scroll to "Explore All Translations". Select a translator, wait for results, then click "Show full translation" on a result card. Verify:
- Translation expands with line breaks preserved
- "Show full translation" changes to "Collapse"
- Clicking "Collapse" restores the truncated view
- Other cards are unaffected (expansion is per-card)

- [ ] **Step 5: Commit**

```bash
git add components/explorer.tsx
git commit -m "feat: add expandable full translation text to Explorer results"
```

---

## Self-Review

**Spec coverage:**
- ✅ `TranslationInset` component — Task 1
- ✅ 185 translations in `lib/chapter1-texts.ts` — already done (pre-committed)
- ✅ 4 new translators in `translator-data.ts` + CLUSTERS — Task 2
- ✅ Gallery description count update — Task 2 Step 3
- ✅ Para 1 → D.C. Lau inset — Task 3
- ✅ Para 2 → Waley + Chan paired — Task 3
- ✅ "Literal vs paraphrased" section with Henricks + Mitchell — Task 3
- ✅ "Historical vs contemporary" with Duyvendak + Le Guin — Task 3
- ✅ "Lyrical adaptations" with Feng/Crowley/Addiss — Task 3
- ✅ Bopsecrets footer citation — Task 3
- ✅ Spotlight line-break fix via `getChapter1()` — Task 4
- ✅ Explorer expandable full text — Task 5

**Placeholder scan:** No TBDs or incomplete steps found.

**Type consistency:**
- `TranslationInset` props use `ClusterName` — defined in Task 1, consumed in Task 3 ✅
- `getChapter1(name)` returns `Chapter1Entry | undefined` — `?.text ?? ''` fallback used consistently ✅
- `paired` prop is optional boolean — callers in Task 3 pass it for all non-single uses ✅
- `expanded` is `Set<string>` keyed by `doc.id` — consistent in Task 5 ✅

**One name to verify at runtime:** `'Ursula K. Le Guin'` — bopsecrets entry was dated 1998 but the spec says 1997 (publication year of the book vs. the bopsecrets entry date). `getChapter1('Ursula K. Le Guin')` will still find her text since name matching doesn't use the date.
