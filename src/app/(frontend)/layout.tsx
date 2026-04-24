import { Footer, Header, ScrollToTop } from '@/components/frontend'
import {
  Be_Vietnam_Pro,
  Crimson_Pro,
  Inconsolata,
  Lora,
  Merriweather,
  Nunito,
  Source_Serif_4,
} from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const fontSans = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const fontNunito = Nunito({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-nunito',
  display: 'swap',
})

const fontSerif = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const fontMerriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
  display: 'swap',
})

const fontCrimson = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-crimson',
  display: 'swap',
})

const fontSourceSerif = Source_Serif_4({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-source-serif',
  display: 'swap',
})

const fontMono = Inconsolata({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
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
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
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
      className={`${fontSans.variable} ${fontNunito.variable} ${fontSerif.variable} ${fontMerriweather.variable} ${fontCrimson.variable} ${fontSourceSerif.variable} ${fontMono.variable} light`}
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
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
