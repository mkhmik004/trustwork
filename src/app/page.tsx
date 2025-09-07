'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UnifiedAuth } from '@/components/unified-auth'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'
import { sdk } from '@farcaster/miniapp-sdk'

export default function Home() {
  const { isConnected, address } = useWagmiWallet()
  const [mounted, setMounted] = useState(false)
  const [isInFarcaster, setIsInFarcaster] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if running in Farcaster webview
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent
      setIsInFarcaster(userAgent.includes('Farcaster') || userAgent.includes('MiniKit'))
      
      // Initialize Farcaster Mini App SDK - call ready() after app is loaded
      sdk.actions.ready().catch((error) => {
        console.log('Farcaster SDK not available:', error)
      })
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <p className="text-gray-600">Loading TrustWork...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TrustWork</span>
          </div>
          <div className="flex items-center space-x-4">
            {isInFarcaster && (
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                🟣 Farcaster
              </div>
            )}
            {isConnected ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Link
                  href="/app"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <UnifiedAuth showFarcaster={true} />
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Empowering South Africa&apos;s
            <span className="text-indigo-600"> Freelance Economy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Break free from overpriced corporate services. TrustWork connects you directly with
            talented South African freelancers at fair prices, while blockchain escrow ensures
            you never lose money to unscrupulous contractors again.
          </p>
          
          {/* Problem Statement Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 mb-8 text-left max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold text-orange-800 mb-3">The Problem We&apos;re Solving</h2>
            <p className="text-orange-700 leading-relaxed">
              In South Africa, many people struggle to access high-quality, affordable services. 
               Large companies often charge premium rates, putting skilled services out of reach for 
               everyday clients. Meanwhile, talented local freelancers lack visibility, and unscrupulous 
               contractors sometimes take upfront payments without delivering work.
            </p>
          </div>
          
          {!isConnected ? (
            <UnifiedAuth 
              className="space-y-4 max-w-md mx-auto"
              showFarcaster={true}
            />
          ) : (
            <div className="space-y-4">
              <Link
                href="/app"
                className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </Link>
              <p className="text-sm text-gray-500">
                Welcome back! Ready to work?
              </p>
            </div>
          )}
        </div>

        {/* Why Choose TrustWork */}
        <div className="bg-white rounded-2xl p-8 mt-16 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why TrustWork is Perfect for South Africa</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fair Pricing</h3>
              <p className="text-gray-600 text-sm">
                Pay 50-70% less than big agencies while supporting local talent
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero Risk</h3>
              <p className="text-gray-600 text-sm">
                Blockchain escrow means no more upfront payments to dodgy contractors
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Talent</h3>
              <p className="text-gray-600 text-sm">
                Connect with skilled South African freelancers in your timezone
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Payments</h3>
              <p className="text-gray-600 text-sm">
                Freelancers get paid in ZAR immediately when milestones are approved
              </p>
            </div>
          </div>
        </div>
        
        {/* Technical Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Contract Escrow</h3>
            <p className="text-gray-600">
              Payments are locked in blockchain until work is completed and approved by both parties.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Farcaster Integration</h3>
            <p className="text-gray-600">
              Built as a Farcaster Mini App with seamless social verification and networking.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Milestone-Based</h3>
            <p className="text-gray-600">
              Break projects into milestones with individual payments for better project management.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 TrustWork. Built on Base blockchain with Farcaster.</p>
        </div>
      </footer>
    </div>
  )
}
