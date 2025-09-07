'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'
import { BookingForm } from '@/components/booking-form'
import { servicesStorage, Service } from '@/lib/services-storage'
import Link from 'next/link'

interface ExtendedService extends Service {
  freelancerName?: string
  rating?: number
  completedJobs?: number
  skills?: string[]
  requirements?: string
  portfolio?: string[]
}

export default function ServiceDetail() {
  const params = useParams()
  const { isConnected } = useWagmiWallet()
  const [service, setService] = useState<ExtendedService | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadService = () => {
      setLoading(true)
      setError(null)
      
      try {
        const serviceData = servicesStorage.getServiceById(params.id as string)
        if (serviceData) {
          // Add mock extended properties for display
          const extendedService: ExtendedService = {
            ...serviceData,
            freelancerName: 'Professional Freelancer',
            rating: 4.8,
            completedJobs: 25,
            skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
            requirements: 'Please provide detailed project requirements and any specific preferences.',
            portfolio: ['https://example.com/project1', 'https://example.com/project2']
          }
          setService(extendedService)
        } else {
          setError('Service not found')
        }
      } catch (err) {
        setError('Failed to load service details')
        console.error('Error loading service:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadService()
    }
  }, [params.id])

  const handleBookService = () => {
    if (!isConnected) {
      alert('Please connect your wallet to book this service')
      return
    }
    setShowBookingForm(true)
  }

  const handleBookingSuccess = () => {
    alert('Service booked successfully! Check your dashboard for updates.')
    setShowBookingForm(false)
  }

  const handleCloseBookingForm = () => {
    setShowBookingForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The service you are looking for does not exist.'}</p>
            <Link
              href="/app/services"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse All Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/app/services"
              className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Services
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Service Details</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Service Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                    {service.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    Listed {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {service.deliveryTime} days delivery
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Freelancer: {service.freelancerAddress ? `${service.freelancerAddress.slice(0, 6)}...${service.freelancerAddress.slice(-4)}` : 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="text-right ml-8">
                <div className="text-4xl font-bold text-gray-900 mb-2">{service.price} ETH</div>
                <button
                  onClick={handleBookService}
                  disabled={!isConnected}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  {isConnected ? 'Book This Service' : 'Connect Wallet to Book'}
                </button>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Description */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{service.description}</p>
                
                {service.requirements && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                    <p className="text-gray-700 leading-relaxed">{service.requirements}</p>
                  </div>
                )}
                
                {service.portfolio && service.portfolio.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Portfolio</h4>
                    <div className="space-y-2">
                      {service.portfolio.map((link: string, index: number) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          Project {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Category</span>
                      <p className="text-gray-900">{service.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Delivery Time</span>
                      <p className="text-gray-900">{service.deliveryTime} days</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Price</span>
                      <p className="text-gray-900 text-xl font-bold">{service.price} ETH</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Freelancer</span>
                      <p className="text-gray-900 font-mono text-sm">
                        {service.freelancerAddress ? `${service.freelancerAddress.slice(0, 6)}...${service.freelancerAddress.slice(-4)}` : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && service && (
        <BookingForm
          service={{
            id: service.id,
            title: service.title,
            description: service.description,
            price: service.price,
            freelancerAddress: service.freelancerAddress,
            category: service.category
          }}
          onClose={handleCloseBookingForm}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  )
}