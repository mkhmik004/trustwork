import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'
import { DebugUtils } from '@/components/debug-utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrustWork - Decentralized Freelance Platform',
  description: 'Secure freelance services with blockchain escrow and verified reviews',
  keywords: ['freelance', 'blockchain', 'escrow', 'farcaster', 'web3', 'minikit'],
  authors: [{ name: 'TrustWork Team' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'TrustWork - Decentralized Freelance Platform',
    description: 'Secure freelance services with blockchain escrow and verified reviews',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    images: [
      {
        url: '/api/frame/image',
        width: 1200,
        height: 630,
        alt: 'TrustWork - Decentralized Freelance Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrustWork - Decentralized Freelance Platform',
    description: 'Secure freelance services with blockchain escrow and verified reviews',
    images: ['/api/frame/image'],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: "1",
      imageUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/frame/image`,
      button: {
        title: "Launch TrustWork",
        action: {
          type: "launch_miniapp",
          name: "TrustWork",
          url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/splash.svg`,
          splashBackgroundColor: "#f8fafc"
        }
      }
    }),
    // Keep frame for backward compatibility
    'fc:frame': JSON.stringify({
      version: "1",
      imageUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/frame/image`,
      button: {
        title: "Launch TrustWork",
        action: {
          type: "launch_frame",
          name: "TrustWork",
          url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/splash.svg`,
          splashBackgroundColor: "#f8fafc"
        }
      }
    }),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            {children}
          </div>
          <Toaster />
          <DebugUtils />
        </Providers>
      </body>
    </html>
  )
}
