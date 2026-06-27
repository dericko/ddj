import { Hero } from '@/components/hero'
import { EssaySection } from '@/components/essay-section'
import { Spotlight } from '@/components/spotlight'
import { TranslatorGallery } from '@/components/translator-gallery'
import { ClusterViz } from '@/components/cluster-viz'
import { Explorer } from '@/components/explorer'
import { getSpotlightPair, listAll, getTopTranslatorDocs } from '@/app/actions'
import { TRANSLATORS } from '@/lib/translator-data'

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

      <EssaySection
        pullQuote="The most translated text besides the Bible"
      >
        <p>
          The <em>Daodejing</em> — also romanized as <em>Tao Te Ching</em> — is an ancient Chinese
          text attributed to the sage Laozi, compiled around the fourth century BCE from the oral
          traditions of &ldquo;Laoist&rdquo; schools. Its eighty-one short chapters address the nature of the
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

      <div className="section-rule" aria-hidden="true" />

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
            <em>Tao and Method</em> (1994) · 182 Translations of Chapter One, Bopsecrets.org
          </p>
        </div>
      </footer>
    </main>
  )
}
