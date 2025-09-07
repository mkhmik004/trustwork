'use client'

import { useState, useEffect } from 'react'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'
import Link from 'next/link'
import { servicesStorage, Service } from '@/lib/services-storage'



const categories = [
  'All Categories',
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Content Writing',
  'Digital Marketing',
  'Data Analysis',
  'Blockchain Development',
  'AI/ML Development',
  'Other'
]

export default function Services() {
  const { isConnected, address } = useWagmiWallet()
  const [, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load services from localStorage
  useEffect(() => {
    const loadServices = () => {
      try {
        setIsLoading(true)
        const data = servicesStorage.getAllServices()
        setServices(data)
        setFilteredServices(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services')
        setServices([])
        setFilteredServices([])
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  // Filter services based on search and category
  useEffect(() => {
    const filtered = servicesStorage.searchServices(searchTerm, selectedCategory)
    setFilteredServices(filtered)
  }, [selectedCategory, searchTerm])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please connect your wallet to browse services.</p>
          <Link href="/" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Go Home
          </Link>
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
                <Link href="/app/services" className="text-indigo-600 font-medium">Services</Link>
                <Link href="/app/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Services</h1>
          <p className="text-gray-600">Find talented freelancers and secure your projects with blockchain escrow.</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading services</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Search */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search Services
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search by title or description..."
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or browse all categories.</p>
              </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {service.category}
                    </span>
                    <span className="text-lg font-bold text-gray-900">{service.price} ETH</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Delivery: {service.deliveryTime} days</span>
                    <span>{service.freelancerAddress ? `${service.freelancerAddress.slice(0, 6)}...${service.freelancerAddress.slice(-4)}` : 'Unknown'}</span>
                  </div>
                </div>
                
                <Link
                  href={`/app/services/${service.id}`}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-center block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
         )}
           </>
        )}
      </main>
    </div>
  )
}