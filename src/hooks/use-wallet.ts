'use client'

import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import type { WindowWithEthereum } from '@/types/ethereum'

interface WalletState {
  isConnected: boolean
  isConnecting: boolean
  address: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
}

const initialState: WalletState = {
  isConnected: false,
  isConnecting: false,
  address: null,
  provider: null,
  signer: null,
}

export function useWallet() {
  const [state, setState] = useState<WalletState>(initialState)

  const checkConnection = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && (window as WindowWithEthereum).ethereum) {
        const provider = new ethers.BrowserProvider((window as WindowWithEthereum).ethereum!)
        const accounts = await provider.listAccounts()
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          
          setState({
            isConnected: true,
            isConnecting: false,
            address,
            provider,
            signer,
          })
        }
      }
    } catch (error: unknown) {
      console.error('Error checking wallet connection:', error)
    }
  }, [])

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !(window as WindowWithEthereum).ethereum) {
      throw new Error('MetaMask is not installed')
    }

    setState(prev => ({ ...prev, isConnecting: true }))

    try {
      // Request account access
      await (window as WindowWithEthereum).ethereum!.request({ method: 'eth_requestAccounts' })
      
      const provider = new ethers.BrowserProvider((window as WindowWithEthereum).ethereum!)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      // Check if we're on the correct network (Base)
      const network = await provider.getNetwork()
      const baseChainId = 8453 // Base mainnet
      const baseTestnetChainId = 84532 // Base testnet
      
      if (network.chainId !== BigInt(baseChainId) && network.chainId !== BigInt(baseTestnetChainId)) {
        // Try to switch to Base network
        try {
          await (window as WindowWithEthereum).ethereum!.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2105' }], // Base mainnet
          })
        } catch (switchError: unknown) {
          // If the network doesn't exist, add it
          if ((switchError as { code: number }).code === 4902) {
            await (window as WindowWithEthereum).ethereum!.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x2105',
                  chainName: 'Base',
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://mainnet.base.org'],
                  blockExplorerUrls: ['https://basescan.org'],
                },
              ],
            })
          } else {
            throw switchError
          }
        }
      }
      
      setState({
        isConnected: true,
        isConnecting: false,
        address,
        provider,
        signer,
      })
    } catch (error) {
      setState(prev => ({ ...prev, isConnecting: false }))
      throw error
    }
  }, [])

  const disconnect = useCallback(async () => {
    setState(initialState)
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as WindowWithEthereum).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setState(initialState)
        } else {
          checkConnection()
        }
      }

      const handleChainChanged = () => {
        checkConnection()
      }

      // Store event handlers for proper cleanup
      const accountsHandler = (...args: unknown[]) => {
        handleAccountsChanged(args[0] as string[])
      }
      
      ;(window as WindowWithEthereum).ethereum!.on('accountsChanged', accountsHandler)
      ;(window as WindowWithEthereum).ethereum!.on('chainChanged', handleChainChanged)

      return () => {
        ;(window as WindowWithEthereum).ethereum!.removeListener('accountsChanged', accountsHandler)
        ;(window as WindowWithEthereum).ethereum!.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [checkConnection])

  return {
    ...state,
    connect,
    disconnect,
  }
}