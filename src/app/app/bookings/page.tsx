'use client'

import { useState, useEffect } from 'react'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'
import Link from 'next/link'

interface Booking {
  id: string
  serviceId: string
  serviceTitle: string
  clientAddress: string
  freelancerAddress: string
  amount: number
  status: 'pending' | 'active' | 'completed' | 'disputed' | 'cancelled'
  createdAt: Date
  escrowAddress?: string
}

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: '1',
    serviceId: '1',
    serviceTitle: 'Modern React Website Development',
    clientAddress: '0x1234567890123456789012345678901234567890',
    freelancerAddress: '0x2345678901234567890123456789012345678901',
    amount: 0.5,
    status: 'active',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    escrowAddress: '0x3456789012345678901234567890123456789012'
  },
  {
    id: '2',
    serviceId: '2',
    serviceTitle: 'Smart Contract Development & Audit',
    clientAddress: '0x1234567890123456789012345678901234567890',
    freelancerAddress: '0x4567890123456789012345678901234567890123',
    amount: 1.2,
    status: 'pending',
    createdAt: new Date('2024-01-14T15:30:00Z')
  }
]

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  disputed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800'
}

export default function Bookings() {
  const { isConnected, address } = useWagmiWallet()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'client' | 'freelancer'>('all')

  useEffect(() => {
    // Simulate API call
    const fetchBookings = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/bookings')
        // const data = await response.json()
        
        // For now, use mock data
        setBookings(mockBookings)
      } catch (error) {
        console.error('Error fetching bookings:', error)
        setBookings(mockBookings)
      } finally {
        setIsLoading(false)
      }
    }

    if (isConnected) {
      fetchBookings()
    } else {
      setIsLoading(false)
    }
  }, [isConnected])

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'client') {
      return booking.clientAddress.toLowerCase() === address?.toLowerCase()
    }
    if (filter === 'freelancer') {
      return booking.freelancerAddress.toLowerCase() === address?.toLowerCase()
    }
    return booking.clientAddress.toLowerCase() === address?.toLowerCase() || 
           booking.freelancerAddress.toLowerCase() === address?.toLowerCase()
  })

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view your bookings.</p>
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
                <Link href="/app/bookings" className="text-indigo-600 font-medium">Bookings</Link>
                <Link href="/app/escrow" className="text-gray-600 hover:text-gray-900">Escrow</Link>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your service bookings and escrow transactions.</p>
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
              All Bookings
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

        {/* Bookings List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">You don&apos;t have any bookings yet.</p>
            <Link
              href="/app/services"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{booking.serviceTitle}</h3>
                    <p className="text-sm text-gray-600">
                      Booking ID: {booking.id}
                    </p>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status]}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Client</p>
                    <p className="text-sm font-mono">
                      {booking.clientAddress.slice(0, 6)}...{booking.clientAddress.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Freelancer</p>
                    <p className="text-sm font-mono">
                      {booking.freelancerAddress.slice(0, 6)}...{booking.freelancerAddress.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                    <p className="text-sm font-semibold">{booking.amount} ETH</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Created</p>
                    <p className="text-sm">{booking.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>

                {booking.escrowAddress && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Escrow Contract</p>
                    <p className="text-sm font-mono">
                      {booking.escrowAddress.slice(0, 6)}...{booking.escrowAddress.slice(-4)}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Link
                    href={`/app/services/${booking.serviceId}`}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    View Service
                  </Link>
                  {booking.escrowAddress && (
                    <Link
                      href={`/app/escrow/${booking.escrowAddress}`}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Manage Escrow
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}