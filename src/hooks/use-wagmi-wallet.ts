'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { useWalletClient } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { useEffect, useState } from 'react'

export function useWagmiWallet() {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: walletClient } = useWalletClient()
  const { open } = useAppKit()
  const [provider, setProvider] = useState<any>(null)
  const [signer, setSigner] = useState<any>(null)

  useEffect(() => {
    if (walletClient) {
      setProvider(walletClient)
      setSigner(walletClient)
    } else {
      setProvider(null)
      setSigner(null)
    }
  }, [walletClient])

  const connect = async () => {
    try {
      open()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  return {
    isConnected,
    address,
    chain,
    provider,
    signer,
    connect,
    disconnect,
  }
}