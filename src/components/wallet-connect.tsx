'use client'

import { useState } from 'react'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'

interface WalletConnectProps {
  className?: string
}

export function WalletConnect({ className = "bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors" }: WalletConnectProps) {
  const { connect, disconnect, isConnected, address } = useWagmiWallet()
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    try {
      setError(null)
      await connect()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    }
  }

  const handleDisconnect = async () => {
    try {
      setError(null)
      await disconnect()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet')
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={handleDisconnect}
          className="text-sm text-red-600 hover:text-red-700 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleConnect}
        disabled={false}
        className={className}
      >
        {'Connect Wallet'}
      </button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}