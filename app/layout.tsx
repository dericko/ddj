import './globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Tao Translations',
  description: 'Semantic search to compare 180+ translations of the Tao Te Ching.',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable} style={{ ['--font-noto-serif-sc' as string]: "'Noto Serif SC'" }}>
        {children}
      </body>
    </html>
  )
}
