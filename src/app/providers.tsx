'use client'

import { ReactNode } from 'react'
import { WagmiProviderWrapper } from '@/components/wagmi-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProviderWrapper>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </WagmiProviderWrapper>
  )
}