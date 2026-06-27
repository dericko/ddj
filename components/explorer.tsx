'use client'

import { useState } from 'react'
import { listSimilar } from '@/app/actions'
import { getChapter1 } from '@/lib/chapter1-texts'
import type { Document } from '@prisma/client'

interface ExplorerProps {
  docs: Document[]
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1 bg-black/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-jade rounded-full transition-all duration-500"
          style={{ width: `${Math.round(score * 100)}%` }}
        />
      </div>
      <span className="text-xs font-default font-semibold text-jade tabular-nums w-10 text-right">
        {(score * 100).toFixed(1)}%
      </span>
    </div>
  )
}

export function Explorer({ docs }: ExplorerProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [results, setResults] = useState<Array<Document & { similarity: number }> | null>(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSelect = async (id: string, name: string) => {
    setSelected(name)
    setExpanded(new Set())
    setLoading(true)
    try {
      const res = await listSimilar(id)
      setResults(res)
    } catch (err) {
      console.error('Failed to load similar translations:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-4">
            Explore All Translations
          </h2>
          <p className="font-default text-muted text-lg leading-relaxed">
            Select any translation to see which others are most semantically similar, ranked by cosine similarity of their embeddings.
          </p>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="max-h-96 overflow-y-auto divide-y divide-black/5">
            {docs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleSelect(doc.id, doc.translator)}
                className={`w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 transition-colors duration-150 hover:bg-[var(--glass-bg)] ${
                  selected === doc.translator ? 'bg-[var(--glass-bg)]' : ''
                }`}
              >
                <div>
                  <span className="font-default text-sm font-medium text-ink">{doc.translator}</span>
                  <span className="ml-2 text-xs text-muted">{doc.date}</span>
                </div>
                {selected === doc.translator && (
                  <div className="w-1.5 h-1.5 rounded-full bg-jade flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {(loading || results) && (
          <div className="mt-8">
            {loading && (
              <div className="text-center py-12 text-muted font-default text-sm tracking-widest uppercase animate-pulse">
                Computing similarity&hellip;
              </div>
            )}
            {!loading && results && (
              <div>
                <h3 className="font-serif text-xl font-semibold text-ink mb-6">
                  Most similar to <em>{selected}</em>
                </h3>
                <div className="space-y-3">
                  {results.slice(0, 10).map((doc) => (
                    <div key={doc.id} className="glass rounded-xl p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-default font-semibold text-ink text-sm">{doc.translator}</p>
                          <p className="text-xs text-muted font-default">{doc.date}</p>
                        </div>
                      </div>
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
