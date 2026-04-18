'use client'

import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <NextTopLoader color="#F8AD89" showSpinner={false} height={3} />
      {children}
    </ThemeProvider>
  )
}
