import { Footer, Header } from '@/components/frontend'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const font = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Tiralix – Đọc truyện online',
    template: '%s | Tiralix',
  },
  description: 'Nền tảng đọc truyện online miễn phí',
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Tiralix',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="vi"
      className={`${font.variable} light`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <Header />
          <main className="min-h-[calc(100dvh-56px-48px-225px)]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
