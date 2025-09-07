'use client'

import { useState, useEffect } from 'react'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'
import { BookingForm } from './booking-form'
import { ServiceDetailModal } from '@/components/service-detail-modal'

interface Service {
  id: string
  title: string
  description: string
  price: number
  category: string
  provider: string
  rating: number
  reviewCount: number
  freelancerAddress: string
}

interface Review {
  id: string
  serviceId: string
  userId: string
  userName: string
  rating: number
  comment: string
  photos?: string[]
  createdAt: string
  verified: boolean
}

// Mock data - in production this would come from Prisma DB
const mockServices: Service[] = [
  {
    id: '1',
    title: 'Web Development',
    description: 'Full-stack web application development using React and Node.js',
    price: 9000, // ZAR equivalent
    category: 'Development',
    provider: '0x1234...5678',
    rating: 4.8,
    reviewCount: 12,
    freelancerAddress: '0x1234...5678'
  },
  {
    id: '2',
    title: 'Smart Contract Audit',
    description: 'Professional security audit for Solidity smart contracts',
    price: 14400, // ZAR equivalent
    category: 'Blockchain',
    provider: '0x9876...4321',
    rating: 4.9,
    reviewCount: 8,
    freelancerAddress: '0x9876...4321'
  },
  {
    id: '3',
    title: 'UI/UX Design',
    description: 'Modern and responsive user interface design for web applications',
    price: 5400, // ZAR equivalent
    category: 'Design',
    provider: '0x5555...7777',
    rating: 4.7,
    reviewCount: 15,
    freelancerAddress: '0x5555...7777'
  }
]

const mockReviews: Review[] = [
  {
    id: '1',
    serviceId: '1',
    userId: '0xabc...def',
    userName: 'John D.',
    rating: 5,
    comment: 'Excellent work! The website was delivered on time and exceeded expectations.',
    createdAt: '2024-01-15',
    verified: true
  },
  {
    id: '2',
    serviceId: '1',
    userId: '0x123...456',
    userName: 'Sarah M.',
    rating: 4,
    comment: 'Great developer, very professional and responsive.',
    createdAt: '2024-01-10',
    verified: true
  },
  {
    id: '3',
    serviceId: '2',
    userId: '0x789...012',
    userName: 'Mike R.',
    rating: 5,
    comment: 'Thorough audit with detailed report. Highly recommended!',
    createdAt: '2024-01-12',
    verified: true
  }
]

export function ServiceList() {
  const { isConnected } = useWagmiWallet()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showServiceDetail, setShowServiceDetail] = useState(false)
  const [serviceReviews, setServiceReviews] = useState<Review[]>([])

  useEffect(() => {
    // Simulate API call to fetch services from Prisma DB
    const fetchServices = async () => {
      setLoading(true)
      // In production: const response = await fetch('/api/services')
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      setServices(mockServices)
      setLoading(false)
    }

    fetchServices()
  }, [])

  const categories = ['all', 'Development', 'Blockchain', 'Design', 'Marketing']
  
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory)

  const handleViewService = (service: Service) => {
    setSelectedService(service)
    // Get reviews for this service
    const reviews = mockReviews.filter(review => review.serviceId === service.id)
    setServiceReviews(reviews)
    setShowServiceDetail(true)
  }

  const handleBookService = (service: Service) => {
    if (!isConnected) {
      alert('Please connect your wallet to book a service')
      return
    }
    setSelectedService(service)
    setShowBookingForm(true)
  }

  const handleBookingSuccess = () => {
    // Refresh services or show success message
    alert('Service booked successfully! Check your dashboard for updates.')
  }

  const handleCloseBookingForm = () => {
    setShowBookingForm(false)
    setSelectedService(null)
  }

  const handleCloseServiceDetail = () => {
    setShowServiceDetail(false)
    setSelectedService(null)
    setServiceReviews([])
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Services</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No services found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div 
              key={service.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleViewService(service)}
            >
              <div className="p-6">
                {/* Header with category badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                    {service.category}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      R{service.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">ZAR</div>
                  </div>
                </div>

                {/* Service title and description */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Rating and provider */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(service.rating) 
                              ? 'text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                    <span className="text-sm text-gray-500">({service.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Provider: {service.provider}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBookService(service)
                    }}
                    disabled={!isConnected}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {isConnected ? 'Book Service' : 'Connect Wallet'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedService && (
        <BookingForm
          service={selectedService}
          onClose={handleCloseBookingForm}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Service Detail Modal */}
      {showServiceDetail && selectedService && (
        <ServiceDetailModal
          service={selectedService}
          reviews={serviceReviews}
          onClose={handleCloseServiceDetail}
          onBook={() => {
            setShowServiceDetail(false)
            handleBookService(selectedService)
          }}
          isConnected={isConnected}
        />
      )}
    </div>
  )
}