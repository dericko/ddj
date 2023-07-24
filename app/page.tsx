import { List } from '@/components/list'
import Link from 'next/link'

// Prisma does not support Edge without the Data Proxy currently
export const runtime = 'nodejs' // default
export const preferredRegion = 'home'
export const dynamic = 'force-dynamic'


export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Link className="pt-4 w-full p-10 text-right" href="/about">About</Link>
      <h1 className="pt-2 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Tao Translations
      </h1>
      <div className="bg-white/30 p-6 lg:p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">
              Browse translations of the Tao Te Ching.
            </h2>
            <p className="text-sm text-gray-500 leading-5">
              Related translations are sorted by cosine similarity. Choose a translation to get started.
            </p>
          </div>
        </div>
        <div className="divide-y divide-gray-900/5 min-h-screen">
          <List />
        </div>
        <p>Sources:{' '}
          <a className="text-blue-600" href="https://www.bopsecrets.org/gateway/passages/tao-te-ching.htm">text</a>
          {' / '}
          <a className="text-blue-600" href="https://github.com/dericko/">code</a>
          {' / '}
          <a className="text-blue-600" href="https://detc.cc">detc.cc</a>
        </p>
      </div>
    </main>
  )
}
