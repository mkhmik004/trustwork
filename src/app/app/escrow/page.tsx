'use client'

import { useState, useEffect } from 'react'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'
import Link from 'next/link'

interface EscrowContract {
  id: string
  address: string
  serviceId: string
  serviceTitle: string
  client: string
  freelancer: string
  amount: number
  status: 'created' | 'funded' | 'work_delivered' | 'completed' | 'disputed' | 'refunded'
  createdAt: Date
  fundedAt?: Date
  completedAt?: Date
}

// Mock escrow data
const mockEscrows: EscrowContract[] = [
  {
    id: '1',
    address: '0x3456789012345678901234567890123456789012',
    serviceId: '1',
    serviceTitle: 'Modern React Website Development',
    client: '0x1234567890123456789012345678901234567890',
    freelancer: '0x2345678901234567890123456789012345678901',
    amount: 0.5,
    status: 'funded',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    fundedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    address: '0x4567890123456789012345678901234567890123',
    serviceId: '2',
    serviceTitle: 'Smart Contract Development & Audit',
    client: '0x1234567890123456789012345678901234567890',
    freelancer: '0x5678901234567890123456789012345678901234',
    amount: 1.2,
    status: 'created',
    createdAt: new Date('2024-01-14T15:30:00Z')
  }
]

const statusColors = {
  created: 'bg-gray-100 text-gray-800',
  funded: 'bg-blue-100 text-blue-800',
  work_delivered: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  disputed: 'bg-red-100 text-red-800',
  refunded: 'bg-orange-100 text-orange-800'
}

const statusDescriptions = {
  created: 'Escrow contract created, waiting for funding',
  funded: 'Funds deposited, work can begin',
  work_delivered: 'Work submitted, awaiting client approval',
  completed: 'Work approved and funds released',
  disputed: 'Dispute raised, requires resolution',
  refunded: 'Funds returned to client'
}

export default function Escrow() {
  const { isConnected, address } = useWagmiWallet()
  const [escrows, setEscrows] = useState<EscrowContract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'client' | 'freelancer'>('all')

  useEffect(() => {
    // Simulate API call
    const fetchEscrows = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/escrow')
        // const data = await response.json()
        
        // For now, use mock data
        setEscrows(mockEscrows)
      } catch (error) {
        console.error('Error fetching escrows:', error)
        setEscrows(mockEscrows)
      } finally {
        setIsLoading(false)
      }
    }

    if (isConnected) {
      fetchEscrows()
    } else {
      setIsLoading(false)
    }
  }, [isConnected])

  const filteredEscrows = escrows.filter(escrow => {
    if (filter === 'client') {
      return escrow.client.toLowerCase() === address?.toLowerCase()
    }
    if (filter === 'freelancer') {
      return escrow.freelancer.toLowerCase() === address?.toLowerCase()
    }
    return escrow.client.toLowerCase() === address?.toLowerCase() || 
           escrow.freelancer.toLowerCase() === address?.toLowerCase()
  })

  const handleAction = (escrow: EscrowContract, action: string) => {
    // TODO: Implement blockchain interactions
    console.log(`Performing ${action} on escrow ${escrow.address}`)
    alert(`${action} functionality will be implemented with smart contract integration`)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to manage escrow contracts.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-xl font-bold text-gray-900">TrustWork</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/app" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link href="/app/services" className="text-gray-600 hover:text-gray-900">Services</Link>
                <Link href="/app/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
                <Link href="/app/escrow" className="text-indigo-600 font-medium">Escrow</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/app/services/create"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Service
              </Link>
              <span className="text-sm text-gray-600">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escrow Management</h1>
          <p className="text-gray-600">Manage your escrow contracts and secure transactions.</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Escrows
            </button>
            <button
              onClick={() => setFilter('client')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'client'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              As Client
            </button>
            <button
              onClick={() => setFilter('freelancer')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'freelancer'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              As Freelancer
            </button>
          </div>
        </div>

        {/* Escrow List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading escrow contracts...</p>
          </div>
        ) : filteredEscrows.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No escrow contracts found</h3>
            <p className="text-gray-600 mb-4">You don&apos;t have any active escrow contracts.</p>
            <Link
              href="/app/services"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEscrows.map(escrow => {
              const isClient = escrow.client.toLowerCase() === address?.toLowerCase()
              const isFreelancer = escrow.freelancer.toLowerCase() === address?.toLowerCase()
              
              return (
                <div key={escrow.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{escrow.serviceTitle}</h3>
                      <p className="text-sm text-gray-600">
                        Contract: {escrow.address.slice(0, 6)}...{escrow.address.slice(-4)}
                      </p>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[escrow.status]}`}>
                      {escrow.status.replace('_', ' ').charAt(0).toUpperCase() + escrow.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{statusDescriptions[escrow.status]}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Client</p>
                      <p className="text-sm font-mono">
                        {escrow.client.slice(0, 6)}...{escrow.client.slice(-4)}
                        {isClient && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Freelancer</p>
                      <p className="text-sm font-mono">
                        {escrow.freelancer.slice(0, 6)}...{escrow.freelancer.slice(-4)}
                        {isFreelancer && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">You</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Amount</p>
                      <p className="text-lg font-semibold text-gray-900">{escrow.amount} ETH</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Created</p>
                      <p className="text-sm">{escrow.createdAt.toLocaleDateString()}</p>
                    </div>
                    {escrow.fundedAt && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Funded</p>
                        <p className="text-sm">{escrow.fundedAt.toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/app/services/${escrow.serviceId}`}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View Service
                    </Link>
                    
                    {isClient && escrow.status === 'created' && (
                      <button
                        onClick={() => handleAction(escrow, 'Fund Escrow')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      >
                        Fund Escrow
                      </button>
                    )}
                    
                    {isClient && escrow.status === 'work_delivered' && (
                      <>
                        <button
                          onClick={() => handleAction(escrow, 'Approve Work')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Approve & Release
                        </button>
                        <button
                          onClick={() => handleAction(escrow, 'Dispute')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Raise Dispute
                        </button>
                      </>
                    )}
                    
                    {isFreelancer && escrow.status === 'funded' && (
                      <button
                        onClick={() => handleAction(escrow, 'Submit Work')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Submit Work
                      </button>
                    )}
                    
                    {(isClient || isFreelancer) && escrow.status === 'disputed' && (
                      <button
                        onClick={() => handleAction(escrow, 'Resolve Dispute')}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        Resolve Dispute
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}