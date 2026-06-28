import { Hero } from '@/components/hero'
import { EssaySection } from '@/components/essay-section'
import { Spotlight } from '@/components/spotlight'
import { TranslatorGallery } from '@/components/translator-gallery'
import { ClusterViz } from '@/components/cluster-viz'
import { Explorer } from '@/components/explorer'
import { getSpotlightPair, listAll, getTopTranslatorDocs } from '@/app/actions'
import { TRANSLATORS } from '@/lib/translator-data'
import { TranslationInset } from '@/components/translation-inset'
import { ScrollReveal } from '@/components/scroll-reveal'
import { getChapter1 } from '@/lib/chapter1-texts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function Home() {
  let spotlight1pairA = null
  let spotlight1pairB = null
  try { spotlight1pairA = await getSpotlightPair('Stephen Mitchell', 'Arthur Waley') } catch {}
  try { spotlight1pairB = await getSpotlightPair('Ursula K. Le Guin', 'D.C. Lau') } catch {}

  const [allDocs, galleryDocs] = await Promise.all([
    listAll(),
    getTopTranslatorDocs(TRANSLATORS.map((t) => t.name)),
  ])

  return (
    <main>
      <Hero />

      {/* Intro paragraph 1 */}
      <EssaySection>
        <p>
          The <em>Daodejing</em> — also romanized as <em>Tao Te Ching</em> — is an ancient Chinese
          text attributed to the sage Laozi, compiled around the fourth century BCE from the oral
          traditions of &ldquo;Laoist&rdquo; schools. Its eighty-one short chapters address the nature of the
          Tao (the Way), Te (virtue or power), and the art of governing both a kingdom and oneself.
        </p>
        <p>
          Here is it&apos;s first chapter, in English translation, by sinologist D.C. Lau:
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
        <p>
          Compare D.C. Lau&apos;s rendering with two other classics, by Arthur Waley and Wing-Tsit Chan:
        </p>
      </EssaySection>

      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <TranslationInset
            translator="D.C. Lau"
            date="1963"
            cluster="sinologist"
            text={getChapter1('D.C. Lau')?.text ?? ''}
          />
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

      {spotlight1pairA && spotlight1pairB && (
      <Spotlight
        title="Who Has the Authority?"
        pairA={spotlight1pairA}
        pairB={spotlight1pairB}
        intro={
          <>
            <p>
              In his essay &ldquo;Those Who Don&rsquo;t Know Speak,&rdquo; the sinologist Paul Goldin criticizes
              four popular translations — by Stephen Mitchell, Witter Bynner, Thomas Miles, and
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
      )}

      <div className="section-rule" aria-hidden="true" />

      <EssaySection
        pullQuote="The embeddings did not know the translators' biographies — only their words."
      >
        <p>
          In 2015, this project used word-frequency vectors to rank the 180+ translations by
          similarity to an authority baseline of established sinologists. The approach was blunt:
          each translation became a sparse vector of word presence, and cosine similarity measured
          overlap with the &ldquo;master vector&rdquo; of respected translations.
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

      <div className="section-rule" aria-hidden="true" />

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
            <em>Tao and Method</em> (1994) · Bureau of Public Secrets,{' '}
            <a
              href="https://www.bopsecrets.org/gateway/passages/tao-te-ching.htm"
              className="underline hover:text-accent transition-colors"
            >
              175+ Translations of Chapter One
            </a>
          </p>
        </div>
      </footer>
    </main>
  )
}
