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
