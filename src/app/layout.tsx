import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kyma-ecommerce.vercel.app'

export const metadata: Metadata = {
  title: {
    default: 'KYMA | Moda femenina',
    template: '%s | KYMA',
  },
  description: 'Moda femenina con identidad propia. Envíos a todo el país · Cambios sin cargo · Pagá en cuotas.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    type:        'website',
    locale:      'es_AR',
    url:         APP_URL,
    siteName:    'KYMA',
    title:       'KYMA | Moda femenina',
    description: 'Moda femenina con identidad propia. Envíos a todo el país · Cambios sin cargo · Pagá en cuotas.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'KYMA Moda femenina' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'KYMA | Moda femenina',
    description: 'Moda femenina con identidad propia. Envíos a todo el país.',
    images:      ['/og-default.jpg'],
  },
  robots: {
    index:             true,
    follow:            true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`h-full antialiased ${geist.variable} ${cormorant.variable}`}>
      <body className="font-sans min-h-full flex flex-col bg-white text-[#111]">
        {children}
      </body>
    </html>
  )
}
