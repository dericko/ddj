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
            Eighteen of the most significant voices to render the Daodejing into English — each bringing a distinct tradition, method, and interpretive frame.
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
