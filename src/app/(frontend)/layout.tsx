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
    default: 'Novel – Đọc truyện online',
    template: '%s | Novel',
  },
  description: 'Nền tảng đọc truyện online miễn phí',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${font.variable} light`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <Header />
          <main className="min-h-[calc(100dvh-56px-48px-225px)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
