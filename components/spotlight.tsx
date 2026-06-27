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
