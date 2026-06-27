'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const CHINESE_TEXT = `道可道，非常道。
名可名，非常名。
無名天地之始；
有名萬物之母。
故常無欲，以觀其妙；
常有欲，以觀其徼。
此兩者，同出而異名，
同謂之玄，
玄之又玄，
眾妙之門。`

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const chineseY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])
  const chineseOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* background decorative glyph */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{ y: chineseY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span className="font-chinese text-[20vw] leading-none text-ink">道</span>
      </motion.div>

      {/* main Chinese text */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        style={{ y: chineseY, opacity: chineseOpacity }}
        className="relative z-10 text-center mb-16"
      >
        <pre className="font-chinese text-xl md:text-2xl lg:text-3xl leading-loose tracking-widest text-ink whitespace-pre-wrap">
          {CHINESE_TEXT}
        </pre>
        <p className="mt-4 text-sm text-muted font-default tracking-widest uppercase">
          王弼本 · Wang Pi Commentary Text
        </p>
      </motion.div>

      {/* English title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
        style={{ y: titleY, opacity: titleOpacity }}
        className="relative z-10 text-center"
      >
        <h1 className="font-serif text-4xl md:text-6xl font-semibold text-ink tracking-tight mb-3">
          Tao Translations
        </h1>
        <p className="text-muted font-default text-lg md:text-xl max-w-md mx-auto leading-relaxed">
          180+ English translations of the Daodejing, Chapter One — explored through semantic similarity
        </p>
      </motion.div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-transparent to-muted"
        />
        <span className="text-xs tracking-widest uppercase font-default">scroll</span>
      </motion.div>
    </div>
  )
}
