import './globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Tao Translate',
  description:
    'Semantic search to compare 180+ translations of the Tao Te Ching.',
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
      </body>
    </html>
  )
}
