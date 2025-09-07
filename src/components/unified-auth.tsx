'use client'

import { useState, useEffect } from 'react'
import { MultiWalletConnect } from './multi-wallet-connect'
import { FarcasterAuth } from './farcaster-auth'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'
import { useProfile } from '@farcaster/auth-kit'
import { sdk } from '@farcaster/miniapp-sdk'

interface UnifiedAuthProps {
  className?: string
  showFarcaster?: boolean
}

export function UnifiedAuth({ 
  className = "space-y-4", 
  showFarcaster = true 
}: UnifiedAuthProps) {
  const { isConnected, address } = useWagmiWallet()
  const { isAuthenticated, profile } = useProfile()
  const [mounted, setMounted] = useState(false)
  const [authMethod, setAuthMethod] = useState<'wallet' | 'farcaster'>('wallet')
  const [isInFarcaster, setIsInFarcaster] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Auto-detect Farcaster environment and set appropriate auth method
    const detectFarcasterEnvironment = async () => {
      if (typeof window !== 'undefined') {
        const userAgent = window.navigator.userAgent
        const isFarcaster = userAgent.includes('Farcaster') || userAgent.includes('MiniKit')
        setIsInFarcaster(isFarcaster)
        
        if (isFarcaster && showFarcaster) {
          setAuthMethod('farcaster')
          
          // Try to get Farcaster context for enhanced UX
          try {
            const context = await sdk.context
            if (context?.user) {
              console.log('Farcaster user detected:', context.user.username)
            }
          } catch (error) {
            console.log('Farcaster context not available:', error)
          }
        }
      }
    }
    
    detectFarcasterEnvironment()
  }, [showFarcaster])

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-lg"></div>
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <div className={className}>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">
                Wallet Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
            <MultiWalletConnect className="text-sm text-red-600 hover:text-red-700" />
          </div>
          
          {isAuthenticated && profile && (
            <div className="flex items-center space-x-2 pt-2 border-t border-green-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-purple-800">
                Farcaster: {profile.displayName || profile.username}
              </span>
              {isInFarcaster && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  Native App
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {showFarcaster && (
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setAuthMethod('wallet')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              authMethod === 'wallet'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💳 Wallet
          </button>
          <button
            onClick={() => setAuthMethod('farcaster')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
              authMethod === 'farcaster'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🟣 Farcaster
            {isInFarcaster && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      )}
      
      {authMethod === 'wallet' ? (
        <MultiWalletConnect className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors w-full" />
      ) : (
        <FarcasterAuth className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors w-full" />
      )}
      
      <p className="text-sm text-gray-500 text-center">
        {authMethod === 'wallet' 
          ? 'Connect with MetaMask, Coinbase Wallet, or WalletConnect'
          : 'Sign in with your Farcaster account'
        }
      </p>
    </div>
  )
}