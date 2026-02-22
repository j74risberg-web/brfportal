import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

// Detta objekt styr hur appen ser ut "utifrån" (ikoner, titlar, PWA-inställningar)
export const metadata: Metadata = {
  title: 'BRF Slalomsvängen 2',
  description: 'Medlemsportal för boende i BRF Slalomsvängen 2',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Slalomsvängen 2',
    statusBarStyle: 'default',
    capable: true,
  },
  icons: {
    apple: '/icon.png', // Denna rad är kritisk för din iPhone-ikon
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="sv">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
