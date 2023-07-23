import './globals.css'
import { Inter } from 'next/font/google'
import { HotToaster } from '../components/hot-toaster'

export const metadata = {
  title: 'Translations Comparison',
  description:
    'Semantic search to compare translations of the Tao Te Ching.',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
        <HotToaster />
      </body>
    </html>
  )
}
