'use client'

import { useState } from 'react'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'

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

interface ServiceDetailModalProps {
  service: Service
  reviews: Review[]
  onClose: () => void
  onBook: () => void
  isConnected: boolean
}

export function ServiceDetailModal({ service, reviews, onClose, onBook, isConnected }: ServiceDetailModalProps) {
  const { address } = useWagmiWallet()
  const [showAddReview, setShowAddReview] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  
  // Check if user has booked this service (mock check - in production this would be from DB)
  const hasBookedService = false // This would be determined by checking if user has active/completed bookings
  const canAddReview = isConnected && hasBookedService

  const handleAddReview = () => {
    // In production, this would make an API call to add the review
    console.log('Adding review:', newReview)
    setShowAddReview(false)
    setNewReview({ rating: 5, comment: '' })
    // Show success message or refresh reviews
  }

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`${starSize} ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Service Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                  {service.category}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Provider:</span>
                  <span className="text-sm font-medium text-gray-900">{service.provider}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Rating:</span>
                  <div className="flex items-center space-x-2">
                    {renderStars(service.rating)}
                    <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                    <span className="text-sm text-gray-500">({service.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  R{service.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">ZAR</div>
              </div>
              
              <button
                onClick={onBook}
                disabled={!isConnected}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                {isConnected ? 'Book This Service' : 'Connect Wallet to Book'}
              </button>
              
              {canAddReview && (
                <button
                  onClick={() => setShowAddReview(true)}
                  className="w-full mt-3 border border-indigo-600 text-indigo-600 py-2 px-6 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                >
                  Add Review
                </button>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Reviews ({reviews.length})</h3>
              {!canAddReview && isConnected && (
                <p className="text-sm text-gray-500">You can only review services you&apos;ve booked</p>
              )}
            </div>
            
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to book and review this service!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium text-sm">
                            {review.userName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{review.userName}</span>
                            {review.verified && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500">{review.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex space-x-2 mt-3">
                        {review.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Review Modal */}
        {showAddReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Review</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                      className={`w-8 h-8 ${
                        rating <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Share your experience with this service..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddReview(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReview}
                  disabled={!newReview.comment.trim()}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}