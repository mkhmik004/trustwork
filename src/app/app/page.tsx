'use client'

import { useEffect, useState } from 'react'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'
import { UnifiedAuth } from '@/components/unified-auth'
import { ServiceList } from '@/components/service-list'
import { EscrowDashboard } from '@/components/escrow-dashboard'
import { ReviewSection } from '@/components/review-section'
import Link from 'next/link'

export default function Dashboard() {
  const { isConnected, address } = useWagmiWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-6">Please connect your wallet to access the dashboard.</p>
          <UnifiedAuth showFarcaster={true} />
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
                <Link href="/app" className="text-indigo-600 font-medium">Dashboard</Link>
                <Link href="/app/services" className="text-gray-600 hover:text-gray-900">Services</Link>
                <Link href="/app/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
                <Link href="/app/escrow" className="text-gray-600 hover:text-gray-900">Escrow</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to TrustWork</h1>
          <p className="text-gray-600">Manage your freelance projects with blockchain-secured escrow.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/app/services/create"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Service</h3>
            <p className="text-gray-600 text-sm">List a new service for clients to book</p>
          </Link>

          <Link
            href="/app/services"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Services</h3>
            <p className="text-gray-600 text-sm">Find and book freelance services</p>
          </Link>

          <Link
            href="/app/bookings"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Bookings</h3>
            <p className="text-gray-600 text-sm">View active and completed projects</p>
          </Link>

          <Link
            href="/app/escrow"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Escrow Contracts</h3>
            <p className="text-gray-600 text-sm">Manage secure payment contracts</p>
          </Link>
        </div>

        {/* Main Service List */}
        <ServiceList />
      </main>
    </div>
  )
}