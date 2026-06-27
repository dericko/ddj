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

        {/* commentary is static content from translator-data.ts containing only <em> tags — safe */}
        <p
          className="font-default text-sm leading-relaxed text-ink flex-1"
          dangerouslySetInnerHTML={{ __html: meta.commentary }}
        />
      </article>
    </ScrollReveal>
  )
}
