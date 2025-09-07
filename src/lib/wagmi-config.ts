'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from '@reown/appkit/networks'
import { cookieStorage, createStorage } from 'wagmi'

// Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id'

// Create the networks
const networks = [base, baseSepolia]

// Set up the Wagmi Adapter (Config)
const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

// Set up metadata
const metadata = {
  name: 'TrustWork',
  description: 'Decentralized freelance platform with escrow payments',
  url: 'https://trustwork.vercel.app', // origin must match your domain & subdomain
  icons: ['https://trustwork.vercel.app/icon.svg']
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: base,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  }
})

export { wagmiAdapter, modal }

// Export the config for use in other parts of the app
export const config = wagmiAdapter.wagmiConfig