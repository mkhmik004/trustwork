'use client'

import { useState, useEffect } from 'react'
import { AuthKitProvider, SignInButton, useProfile } from '@farcaster/auth-kit'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'
import { sdk } from '@farcaster/miniapp-sdk'

interface FarcasterAuthProps {
  className?: string
}

function FarcasterSignIn({ className }: FarcasterAuthProps) {
  const { isAuthenticated, profile } = useProfile()
  const { isConnected, address, connect } = useWagmiWallet()
  const [mounted, setMounted] = useState(false)
  const [isInFarcaster, setIsInFarcaster] = useState(false)
  const [autoAuthAttempted, setAutoAuthAttempted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check if running in Farcaster
    const checkFarcasterEnvironment = async () => {
      try {
        if (typeof window !== 'undefined') {
          const userAgent = window.navigator.userAgent
          const isFarcaster = userAgent.includes('Farcaster') || userAgent.includes('MiniKit')
          setIsInFarcaster(isFarcaster)
          
          // Auto-authenticate if in Farcaster and not already attempted
          if (isFarcaster && !autoAuthAttempted && !isAuthenticated) {
            setAutoAuthAttempted(true)
            // Try to get Farcaster context and auto-connect wallet
            try {
              const context = await sdk.context
              if (context?.user) {
                // Auto-connect wallet if user is authenticated in Farcaster
                await connect()
              }
            } catch (error) {
              console.log('Farcaster auto-auth not available:', error)
            }
          }
        }
      } catch (error) {
        console.log('Error checking Farcaster environment:', error)
      }
    }
    
    checkFarcasterEnvironment()
  }, [autoAuthAttempted, isAuthenticated, connect])

  if (!mounted) {
    return (
      <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-lg"></div>
    )
  }

  if (isAuthenticated && profile) {
    return (
      <div className="flex items-center space-x-2">
        {profile.pfpUrl && (
          <img 
            src={profile.pfpUrl} 
            alt={profile.displayName || profile.username}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {profile.displayName || profile.username}
          </span>
          {isConnected && address && (
            <span className="text-xs text-gray-500">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          )}
          {isInFarcaster && (
            <span className="text-xs text-purple-600">
              Via Farcaster
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <SignInButton 
      nonce={`trustwork-${Date.now()}`}
      notBefore="2024-01-01T00:00:00.000Z"
      domain="trustwork.vercel.app"
      className={className}
    />
  )
}

export function FarcasterAuth({ className = "bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors" }: FarcasterAuthProps) {
  const config = {
    rpcUrl: 'https://mainnet.optimism.io',
    domain: 'trustwork.vercel.app',
    siweUri: 'https://trustwork.vercel.app/login',
  }

  return (
    <AuthKitProvider config={config}>
      <FarcasterSignIn className={className} />
    </AuthKitProvider>
  )
}