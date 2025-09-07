'use client'

import { useState, useEffect } from 'react'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'

interface Review {
  id: string
  jobId: string
  clientAddress: string
  freelancerAddress: string
  rating: number
  comment: string
  createdAt: Date
}

interface CompletedJob {
  id: string
  title: string
  freelancerAddress: string
  clientAddress: string
  totalAmount: number
  isCompleted: boolean
  hasReview: boolean
}

export function ReviewSection() {
  const { address, isConnected } = useWagmiWallet()
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingReview, setSubmittingReview] = useState<string | null>(null)
  const [reviewForm, setReviewForm] = useState<{
    jobId: string
    rating: number
    comment: string
  } | null>(null)

  // Mock data - replace with actual API calls
  useEffect(() => {
    if (!isConnected || !address) return

    const fetchData = async () => {
      setLoading(true)
      try {
        // Mock completed jobs where user is client
        const mockCompletedJobs: CompletedJob[] = [
          {
            id: '1',
            title: 'Smart Contract Development',
            freelancerAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c',
            clientAddress: address,
            totalAmount: 2.5,
            isCompleted: true,
            hasReview: false,
          },
          {
            id: '2',
            title: 'Frontend React Development',
            freelancerAddress: '0x8ba1f109551bD432803012645Hac136c22C177e9',
            clientAddress: address,
            totalAmount: 1.8,
            isCompleted: true,
            hasReview: true,
          },
        ]

        // Mock existing reviews
        const mockReviews: Review[] = [
          {
            id: '1',
            jobId: '2',
            clientAddress: address,
            freelancerAddress: '0x8ba1f109551bD432803012645Hac136c22C177e9',
            rating: 5,
            comment: 'Excellent work! Delivered on time and exceeded expectations.',
            createdAt: new Date('2024-01-15'),
          },
        ]

        setCompletedJobs(mockCompletedJobs)
        setReviews(mockReviews)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [address, isConnected])

  const handleSubmitReview = async (jobId: string, rating: number, comment: string) => {
    if (!address) return

    setSubmittingReview(jobId)
    try {
      // Mock API call - replace with actual Prisma call
      const newReview: Review = {
        id: Date.now().toString(),
        jobId,
        clientAddress: address,
        freelancerAddress: completedJobs.find(job => job.id === jobId)?.freelancerAddress || '',
        rating,
        comment,
        createdAt: new Date(),
      }

      // Update local state
      setReviews(prev => [...prev, newReview])
      setCompletedJobs(prev => 
        prev.map(job => 
          job.id === jobId ? { ...job, hasReview: true } : job
        )
      )
      setReviewForm(null)
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setSubmittingReview(null)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`text-2xl ${
              interactive ? 'cursor-pointer hover:text-yellow-400' : 'cursor-default'
            } ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <p className="text-gray-600">Please connect your wallet to view and submit reviews.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  const jobsNeedingReview = completedJobs.filter(job => !job.hasReview)
  const existingReviews = reviews.filter(review => 
    completedJobs.some(job => job.id === review.jobId)
  )

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Reviews</h2>

      {/* Jobs needing review */}
      {jobsNeedingReview.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-orange-600">Jobs Awaiting Review</h3>
          <div className="space-y-4">
            {jobsNeedingReview.map((job) => (
              <div key={job.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-gray-600">
                      Freelancer: {job.freelancerAddress ? `${job.freelancerAddress.slice(0, 6)}...${job.freelancerAddress.slice(-4)}` : 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">Amount: {job.totalAmount} ETH</p>
                  </div>
                  <button
                    onClick={() => setReviewForm({ jobId: job.id, rating: 5, comment: '' })}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                  >
                    Leave Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review form modal */}
      {reviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                {renderStars(reviewForm.rating, true, (rating) => 
                  setReviewForm(prev => prev ? { ...prev, rating } : null)
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => prev ? { ...prev, comment: e.target.value } : null)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Share your experience working with this freelancer..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleSubmitReview(reviewForm.jobId, reviewForm.rating, reviewForm.comment)}
                  disabled={submittingReview === reviewForm.jobId || !reviewForm.comment.trim()}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors disabled:bg-gray-300"
                >
                  {submittingReview === reviewForm.jobId ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  onClick={() => setReviewForm(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing reviews */}
      {existingReviews.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4 text-green-600">Your Reviews</h3>
          <div className="space-y-4">
            {existingReviews.map((review) => {
              const job = completedJobs.find(j => j.id === review.jobId)
              return (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{job?.title}</h4>
                      <p className="text-sm text-gray-600">
                        Freelancer: {review.freelancerAddress.slice(0, 6)}...{review.freelancerAddress.slice(-4)}
                      </p>
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <p className="text-xs text-gray-500 mt-1">
                        {review.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {jobsNeedingReview.length === 0 && existingReviews.length === 0 && (
        <p className="text-gray-600 text-center py-8">
          No completed jobs to review yet. Complete some jobs to leave reviews!
        </p>
      )}
    </div>
  )
}