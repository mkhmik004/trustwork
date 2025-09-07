'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { formatEther } from '@/lib/ethers'

// Extend Window interface for ethereum
import type { Eip1193Provider } from 'ethers'

declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }
}

interface WalletBalance {
  eth: string
  zar: string
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'escrow'
  amount: string
  status: 'pending' | 'completed' | 'failed'
  timestamp: Date
  txHash?: string
}

export default function WalletPage() {
  const [balance, setBalance] = useState<WalletBalance>({ eth: '0.0', zar: '0.00' })
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string>('')
  const [loading, setLoading] = useState(false)
  // Fund amount state removed as it's not used
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState('faucet')
  
  const showToast = (title: string, description: string, type: 'success' | 'error' = 'success') => {
    // Simple toast implementation
    const toast = document.createElement('div')
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } text-white max-w-sm`
    toast.innerHTML = `
      <div class="font-semibold">${title}</div>
      <div class="text-sm opacity-90">${description}</div>
    `
    document.body.appendChild(toast)
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
  }

  // Mock transactions for demo
  useEffect(() => {
    setTransactions([
      {
        id: '1',
        type: 'deposit',
        amount: '0.5',
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000),
        txHash: '0x1234...5678'
      },
      {
        id: '2',
        type: 'escrow',
        amount: '0.2',
        status: 'pending',
        timestamp: new Date(Date.now() - 3600000)
      }
    ])
  }, [])

  const connectWallet = async () => {
    try {
      setLoading(true)
      if (typeof window.ethereum !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = await provider.getSigner()
        const userAddress = await signer.getAddress()
        
        setAddress(userAddress)
        setIsConnected(true)
        
        // Get balance
        const balance = await provider.getBalance(userAddress)
        const ethBalance = formatEther(balance)
        const zarBalance = (parseFloat(ethBalance) * 36000).toFixed(2) // Mock ETH price in ZAR
        
        setBalance({ eth: ethBalance, zar: zarBalance })
        
        showToast(
          'Wallet Connected',
          `Connected to ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
        )
      } else {
        showToast(
          'MetaMask Not Found',
          'Please install MetaMask to connect your wallet',
          'error'
        )
      }
    } catch (connectError) {
      console.error('Error connecting wallet:', connectError)
      showToast(
        'Connection Failed',
        'Failed to connect wallet. Please try again.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const refreshBalance = async () => {
    if (!isConnected) return
    
    try {
      setLoading(true)
      if (!window.ethereum) {
        throw new Error('No wallet found')
      }
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(address)
      const ethBalance = formatEther(balance)
      const zarBalance = (parseFloat(ethBalance) * 36000).toFixed(2)
      
      setBalance({ eth: ethBalance, zar: zarBalance })
      
      showToast(
        'Balance Updated',
        'Your wallet balance has been refreshed'
      )
    } catch (error) {
      console.error('Error refreshing balance:', error)
      showToast(
        'Refresh Failed',
        'Failed to refresh balance',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleFaucetRequest = async () => {
    try {
      setLoading(true)
      // Simulate faucet request
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      showToast(
        'Faucet Request Sent',
        'Test ETH will be sent to your wallet shortly'
      )
      
      // Refresh balance after a delay
      setTimeout(() => {
        refreshBalance()
      }, 3000)
    } catch {
      showToast(
        'Faucet Request Failed',
        'Please try again later',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleBridgeToBase = () => {
    window.open('https://bridge.base.org', '_blank')
  }

  const handleBuyWithCard = () => {
    window.open('https://www.coinbase.com/buy-ethereum', '_blank')
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <span className="text-green-500">↙</span>
      case 'withdrawal':
        return <span className="text-red-500">↗</span>
      case 'escrow':
        return <span className="text-blue-500">💼</span>
      default:
        return <span>💼</span>
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    } as const
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wallet</h1>
        <p className="text-gray-600">
          Manage your funds for secure escrow payments on TrustWork
        </p>
      </div>

      {!isConnected ? (
        <div className="bg-white rounded-lg border shadow-sm mb-8">
          <div className="p-6 text-center">
            <div className="h-12 w-12 mx-auto mb-4 text-gray-400 text-2xl">💼</div>
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-4">
              Connect your wallet to view balance and manage funds
            </p>
            <button 
              onClick={connectWallet} 
              disabled={loading} 
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Balance Card */}
          <div className="bg-white rounded-lg border shadow-sm mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-xl">💼</span>
                    Wallet Balance
                  </h3>
                  <p className="text-gray-600">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                </div>
                <button
                  onClick={refreshBalance}
                  disabled={loading}
                  className="border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                >
                  <span className={`inline-block ${loading ? 'animate-spin' : ''}`}>🔄</span>
                </button>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{balance.eth} ETH</div>
                <div className="text-lg text-gray-600">R{balance.zar} ZAR</div>
              </div>
            </div>
          </div>

          {/* Funding Options */}
          <div className="bg-white rounded-lg border shadow-sm mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Add Funds</h3>
              <p className="text-gray-600 mb-4">
                Choose how you&apos;d like to add funds to your wallet
              </p>
              <div className="w-full">
                <div className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1 mb-4">
                  <button 
                    onClick={() => setActiveTab('faucet')}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'faucet' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    Testnet Faucet
                  </button>
                  <button 
                    onClick={() => setActiveTab('bridge')}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'bridge' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    Bridge to Base
                  </button>
                  <button 
                    onClick={() => setActiveTab('buy')}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'buy' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    Buy with Card
                  </button>
                </div>
                
                {activeTab === 'faucet' && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      Get free test ETH for development and testing purposes
                    </div>
                    <button 
                      onClick={handleFaucetRequest} 
                      disabled={loading} 
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      {loading ? 'Requesting...' : 'Request Test ETH'}
                    </button>
                  </div>
                )}
                
                {activeTab === 'bridge' && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      Bridge ETH from Ethereum mainnet or other networks to Base
                    </div>
                    <button 
                      onClick={handleBridgeToBase} 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      Open Base Bridge
                      <span>🔗</span>
                    </button>
                  </div>
                )}
                
                {activeTab === 'buy' && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      Purchase ETH directly with your credit or debit card
                    </div>
                    <button 
                      onClick={handleBuyWithCard} 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <span>💳</span>
                      Buy ETH with Card
                      <span>🔗</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
              <p className="text-gray-600 mb-4">
                Your recent wallet activity and escrow transactions
              </p>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    No transactions yet
                  </div>
                ) : (
                  transactions.map((tx, index) => (
                    <div key={tx.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(tx.type)}
                          <div>
                            <div className="font-medium capitalize">
                              {tx.type === 'escrow' ? 'Escrow Payment' : tx.type}
                            </div>
                            <div className="text-sm text-gray-600">
                              {tx.timestamp.toLocaleDateString()} at {tx.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {tx.type === 'withdrawal' || tx.type === 'escrow' ? '-' : '+'}{tx.amount} ETH
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(tx.status)}
                            {tx.txHash && (
                              <button className="h-6 px-2 hover:bg-gray-100 rounded text-xs">
                                🔗
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {index < transactions.length - 1 && <hr className="mt-4 border-gray-200" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}