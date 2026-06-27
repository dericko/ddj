# Essay Restructure Design

**Date:** 2026-06-27  
**Project:** ddj (Daodejing translations)

## Overview

Restructure the main page essay to weave full Chapter 1 translation displays directly into the narrative. Replace the three numbered prose-only tension sections with headed sections containing a short intro blurb and live translation examples. Add four new translators to the gallery and clusterviz. Fix line-break display in Spotlight and Explorer.

---

## 1. New `TranslationInset` Component

**File:** `components/translation-inset.tsx`

Props:
```ts
interface TranslationInsetProps {
  translator: string
  date: string
  cluster: ClusterName        // drives badge label
  text: string                // full chapter 1 text, whitespace-pre-line
  paired?: boolean            // true when rendered inside a paired layout
}
```

Layout:
- Wrapped in `ScrollReveal`
- Cluster badge (top-right, same style as TranslatorCard)
- Translator name (font-serif, semibold) + date (font-default, muted, small)
- Translation text: `font-serif text-lg leading-relaxed whitespace-pre-line text-ink`
- Single inset: `max-w-2xl mx-auto`, full-width card with glass styling
- Paired insets: caller wraps two in a `grid grid-cols-1 md:grid-cols-2 gap-6`

---

## 2. Chapter 1 Translation Text

All text sourced from bopsecrets.org/gateway/passages/tao-te-ching.htm. Stored as a new `chapter1` field in `translator-data.ts` for featured translators only.

### D.C. Lau (1963)
```
The way that can be spoken of
Is not the constant way;
The name that can be named
Is not the constant name.
The nameless was the beginning of heaven and earth;
The named was the mother of the myriad creatures.
Hence always rid yourself of desires in order to observe its secrets;
But always allow yourself to have desires in order to observe its manifestations.
These two are the same
But diverge in name as they issue forth.
Being the same they are called mysteries,
Mystery upon mystery —
The gateway of the manifold secrets.
```

### Arthur Waley (1934)
```
The Way that can be told of is not an Unvarying Way;
The names that can be named are not unvarying names.
It was from the Nameless that Heaven and Earth sprang;
The named is but the mother that rears the ten thousand creatures, each after its kind.
Truly, "Only he that rids himself forever of desire can see the Secret Essences";
He that has never rid himself of desire can see only the Outcomes.
These two things issued from the same mould, but nevertheless are different in name.
This "same mould" we can but call the Mystery,
Or rather the "Darker than any Mystery,"
The Doorway whence issued all Secret Essences.
```

### Wing-Tsit Chan (1963)
```
The Tao that can be told of is not the eternal Tao;
The name that can be named is not the eternal name.
The Nameless is the origin of Heaven and Earth;
The Named is the mother of all things.

Therefore let there always be non-being, so we may see their subtlety,
And let there always be being, so we may see their outcome.
The two are the same,
But after they are produced, they have different names.
They both may be called deep and profound.
Deeper and more profound,
The door of all subtleties.
```

### Robert Henricks (1989)
```
As for the Way, the Way that can be spoken of is not the constant Way;
As for names, the name that can be named is not the constant name.
The nameless is the beginning of the ten thousand things;
The named is the mother of the ten thousand things.

Therefore, those constantly without desires, by this means will perceive its subtlety.
Those constantly with desires by this means will see only that which they yearn for and seek.

These two together emerge;
They have different names yet they're called the same;
That which is even more profound than the profound —
The gateway of all subtleties.
```

### Stephen Mitchell (1988)
```
The tao that can be told
is not the eternal Tao
The name that can be named
is not the eternal Name.

The unnamable is the eternally real.
Naming is the origin
of all particular things.

Free from desire, you realize the mystery.
Caught in desire, you see only the manifestations.

Yet mystery and manifestations
arise from the same source.
This source is called darkness.

Darkness within darkness.
The gateway to all understanding.
```

### J.J.L. Duyvendak (1954)
```
The Way that may truly be regarded as the Way is other than a permanent way.
The terms that may truly be regarded as terms are other than permanent terms.
The term Non-being indicates the beginning of heaven and earth; the term Being indicates the mother of the ten thousand things.
For, indeed, it is through the constant alteration between Non-being and Being that the wonder of the one and the limitation of the other will be seen.
These two, having a common origin, are named with different terms.
What they have in common is called the Mystery, The Mystery of Mysteries, the Gate of all Wonders.
```

### Ursula K. Le Guin (1997)
```
The way you can go
isn't the real way.
The name you can say
isn't the real name.

Heaven and earth
begin in the unnamed:
name's the mother
of the ten thousand things.

So the unwanting soul
sees what's hidden,
and the ever-wanting soul
sees only what it wants.

Two things, one origin,
but different in name,
whose identity is mystery.
Mystery of all mysteries!
The door to the hidden.
```

### Gia-fu Feng and Jane English (1972)
```
The Tao that can be told is not the eternal Tao.
The name that can be named is not the eternal name.
The nameless is the beginning of heaven and earth.
The named is the mother of ten thousand things.
Ever desireless, one can see the mystery.
Ever desiring, one can see the manifestations.
These two spring from the same source but differ in name;
     this appears as darkness.
Darkness within darkness.
The gate to all mystery.
```

### Aleister Crowley (1918)
```
The Tao-Path is not the All-Tao. The Name is not the Thing named.

Unmanifested, it is the Secret Father of Heaven and Earth; manifested, it is their Mother.

To understand this Mystery, one must be fulfilling one's will, and if one is not thus free, one will but gain a smattering of it.

The Tao is one, and the Teh but a phase thereof. The abyss of this Mystery is the Portal of Serpent-Wonder.
```

### Stephen Addiss and Stanley Lombardo (1993)
```
TAO called Tao is not TAO.

Names can name no lasting name.

Nameless: the origin of heaven and earth.
Naming: the mother of the ten thousand things.

Empty of desire, perceive mystery.
Filled with desire, perceive manifestations.

These have the same source, but different names.
     Call them both deep —
          Deep and again deep:

The gateway to all mystery.
```

### Witter Bynner (1944)
```
Existence is beyond the power of words
To define:
Terms may be used
But are none of them absolute.
In the beginning of heaven and earth there were no words,
Words came out of the womb of matter;
And whether a man dispassionately
Sees to the core of life
Or passionately
Sees the surface,
The core and the surface
Are essentially the same,
Words making them seem different
Only to express appearance.
If name be needed, wonder names them both:
From wonder into wonder
Existence opens.
```

---

## 3. New Essay Structure (page.tsx)

```
Hero
EssaySection (intro para 1)
TranslationInset — D.C. Lau [single, max-w-2xl centered]
EssaySection (intro para 2)
[paired grid] TranslationInset — Arthur Waley + Wing-Tsit Chan
EssaySection (intro para 3)
section-rule

TensionSection — "Literal vs paraphrased"
  blurb: "Henricks follows the Ma-wang-tui manuscripts closely enough that his opening
  splits into two declarative sentences where most translators write one. Mitchell, who
  reads no classical Chinese, worked from existing versions to produce a philosophical
  poem. Notice how the shift from 'the constant Way' to 'the eternal Tao' changes what
  the reader is being asked to imagine — and how much the line breaks alone can shift
  the feeling of a passage."
  [paired grid] TranslationInset — Robert Henricks + Stephen Mitchell

TensionSection — "Historical vs contemporary"
  blurb: "Duyvendak's dense, formal prose keeps the text at a scholarly distance —
  'Non-being' and 'Being' signal a political philosophy from the Warring States, not a
  personal guide. Le Guin's short lines and second-person address make the same ideas
  feel immediate. Both are working from the same source; what changes is the implied
  reader and what the translator thinks the text is for."
  [paired grid] TranslationInset — J.J.L. Duyvendak + Ursula K. Le Guin

TensionSection — "Lyrical adaptations"
  blurb: "These three translators came to the text from outside the scholarly tradition —
  counterculture spirituality, occult philosophy, and minimalist poetry — and each
  produced something no sinologist would have written. Read them less for accuracy than
  for what each reveals about the imaginative range the original makes possible."
  [three-col on lg, two-col on md, one-col on sm]
  TranslationInset — Gia-fu Feng & Jane English + Aleister Crowley + Addiss & Lombardo

section-rule
Spotlight (unchanged except line-break fix)
section-rule
EssaySection (embeddings methodology)
section-rule
TranslatorGallery
ClusterViz
Explorer (with expandable full text)
Footer
```

`TensionSection` is not a new component — it's an inline layout in `page.tsx` with a heading, blurb paragraph, and translation grid.

---

## 4. New Translators in translator-data.ts

Add four entries with commentary and assign to CLUSTERS.

| Name | Dates | Cluster |
|---|---|---|
| Stephen Mitchell | b. 1943 | spiritual |
| Ursula K. Le Guin | 1929–2018 | literary |
| Witter Bynner | 1881–1968 | literary |
| Aleister Crowley | 1875–1947 | literary |

Add all four to `CLUSTERS[].members` under their respective cluster.

### Commentary

**Stephen Mitchell**
Stephen Mitchell is an American poet and translator whose 1988 rendering of the Daodejing became one of the bestselling English versions ever published. Mitchell reads no classical Chinese; his translation was assembled from comparison of existing English versions and consultation with scholars. The sinologist Paul Goldin singled out Mitchell's version for criticism in his essay "Those Who Don't Know Speak," arguing that working without access to the original allows a translator to select the palatable and discard the difficult. Mitchell's defense — that fidelity to the spirit matters more than fidelity to the letter — is a position with its own long history in translation theory. Whatever its philological standing, his version is widely credited with introducing the Daodejing to a generation of Western readers who would never have sought out an academic translation. The embeddings place it far from the sinologist cluster.

**Ursula K. Le Guin**
Ursula K. Le Guin was one of the most celebrated American fiction writers of the twentieth century, whose science fiction and fantasy drew deeply on Daoist thought — particularly the concepts of wu wei, cyclical change, and yielding as strength. Her 1997 rendering, subtitled "A Book about the Way and the Power of the Way," was explicitly a writer's translation rather than a scholar's: she worked from existing versions with the help of J.P. Seaton, a sinologist, but made no claim to translate from the Chinese directly. Her introduction is a small classic of translation theory, arguing for the Daodejing as a "feminist" and "anarchist" text. Her version is notable for its spare contemporary diction, its short lines, and its avoidance of mystifying terminology. Goldin included her among the American non-readers he criticized; her embeddings cluster with the literary adapters.

**Witter Bynner**
Witter Bynner was an American poet who produced a translation of the Daodejing in 1944 in collaboration with Kiang Kang-hu, a Chinese scholar who provided literal cribs that Bynner then rendered into English verse. The collaboration was genuinely cross-cultural in its method, though Bynner himself could not read Chinese. His version, published as "The Way of Life According to Laotzu," is notable for its loose, ruminative quality — closest in spirit to a paraphrase, furthest in letter from the Chinese. Paul Goldin cited Bynner among the non-readers whose versions he criticized. The opening lines are striking: Bynner replaces "Tao" entirely with "Existence," a choice that cuts against the philosophical specificity the term carries and signals his primary allegiance to accessibility over fidelity. His version was widely read in the mid-twentieth century and influenced later literary adapters.

**Aleister Crowley**
Aleister Crowley — occultist, poet, and provocateur — produced a translation of the Daodejing in 1918 as part of his broader project of synthesizing Western occultism with Eastern philosophy. He titled it the "Tao Teh King" and read it through the lens of his own magical system, Thelema, most visibly in Chapter 1: where other translators see "desire" as an epistemological stance, Crowley hears "fulfilling one's will" — the central imperative of Thelema. The result is a translation that says something genuinely different from any other version, not because the Chinese permits it but because Crowley's interpretive frame was entirely his own. It is among the most eccentric texts in the English translation tradition and has found a devoted readership in occult circles. As a data point, it is a near-perfect illustration of how a translator's prior commitments shape what they find in the text.

---

## 5. Spotlight Line-Break Fix

In `components/spotlight.tsx`, `ComparisonPanel`:

Change:
```tsx
<p className="font-serif text-base leading-relaxed text-ink">{doc.text}</p>
```
To:
```tsx
<p className="font-serif text-base leading-relaxed text-ink whitespace-pre-line">{doc.text}</p>
```

---

## 6. Explorer Expandable Full Text

In `components/explorer.tsx`, the results list currently shows `line-clamp-2`. Add per-card expand/collapse state:

- Default: truncated (2 lines), "Show full translation" link below
- Expanded: full `whitespace-pre-line` text, "Collapse" link
- Expansion state is local to each result card (not shared)

---

## Summary of Files Changed

| File | Change |
|---|---|
| `components/translation-inset.tsx` | New component |
| `lib/translator-data.ts` | Add 4 translators + `chapter1` field for featured translators |
| `app/page.tsx` | Restructure essay with TranslationInsets + TensionSections |
| `components/spotlight.tsx` | Add `whitespace-pre-line` to translation text |
| `components/explorer.tsx` | Add expandable full-text to result cards |
