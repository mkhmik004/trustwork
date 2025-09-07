'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'
import Link from 'next/link'

interface ServiceFormData {
  title: string
  description: string
  category: string
  price: string
  deliveryTime: string
  requirements: string
}

const categories = [
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

export default function CreateService() {
  const { isConnected, address } = useWagmiWallet()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    category: '',
    price: '',
    deliveryTime: '',
    requirements: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    setIsSubmitting(true)

    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        deliveryTime: parseInt(formData.deliveryTime),
        freelancerAddress: address || '',
        requirements: formData.requirements
      }

      // Import the storage here to avoid SSR issues
      const { servicesStorage } = await import('@/lib/services-storage')
      const newService = servicesStorage.addService(serviceData)
      
      console.log('Service created:', newService)
      
      alert('Service created successfully!')
      router.push('/app/services')
    } catch (error) {
      console.error('Error creating service:', error)
      alert(error instanceof Error ? error.message : 'Failed to create service. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please connect your wallet to create a service.</p>
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
                <Link href="/app/services" className="text-gray-600 hover:text-gray-900">Services</Link>
                <Link href="/app/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
                <Link href="/app/escrow" className="text-gray-600 hover:text-gray-900">Escrow</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Service</h1>
            <p className="text-gray-600">List your skills and start earning with blockchain-secured payments.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., I will create a modern React website"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe your service in detail..."
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (ETH) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.001"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.1"
                />
              </div>

              {/* Delivery Time */}
              <div>
                <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time (days) *
                </label>
                <input
                  type="number"
                  id="deliveryTime"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="7"
                />
              </div>

              {/* Requirements */}
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="What do you need from the client to get started?"
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Create Service'}
                </button>
                <Link
                  href="/app/services"
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}