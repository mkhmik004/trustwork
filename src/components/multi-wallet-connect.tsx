'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { Button } from '@/components/ui/button'

interface MultiWalletConnectProps {
  className?: string
}

export function MultiWalletConnect({ className }: MultiWalletConnectProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()

  const handleConnect = () => {
    open()
  }

  const handleDisconnect = () => {
    disconnect()
  }

  if (isConnected && address) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <span className="text-sm text-gray-600">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <Button 
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button 
      onClick={handleConnect}
      className={className}
    >
      Connect Wallet
    </Button>
  )
}