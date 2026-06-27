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
