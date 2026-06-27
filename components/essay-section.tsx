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
