import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DULCIS Feedback',
  description: 'Share your feedback about your DULCIS experience',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.jpg', type: 'image/jpeg' }
    ],
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style>
          {`
            /* Make favicon circular */
            link[rel="icon"] {
              border-radius: 50%;
              overflow: hidden;
            }
            
            /* Make apple touch icon circular */
            link[rel="apple-touch-icon"] {
              border-radius: 50%;
              overflow: hidden;
            }
          `}
        </style>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
