'use client'

import { useState } from 'react'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'
import { useEscrow } from '@/hooks/use-escrow'

interface BookingFormProps {
  service: {
    id: string
    title: string
    description: string
    price: number
    freelancerAddress: string
    category: string
  }
  onClose: () => void
  onSuccess: () => void
}

interface Milestone {
  description: string
  amount: string
  percentage: number
}

export function BookingForm({ service, onClose, onSuccess }: BookingFormProps) {
  const { address, isConnected } = useWagmiWallet()
  const { createContract, isLoading, error } = useEscrow()
  const [formData, setFormData] = useState({
    projectDescription: '',
    deadline: '',
    additionalNotes: '',
  })
  const [milestones, setMilestones] = useState<Milestone[]>([
    { description: 'Project completion', amount: service.price.toString(), percentage: 100 }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddMilestone = () => {
    if (milestones.length < 5) {
      setMilestones([...milestones, { description: '', amount: '0', percentage: 0 }])
    }
  }

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index))
    }
  }

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string | number) => {
    const updated = milestones.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    )
    setMilestones(updated)
  }

  const calculateTotalAmount = () => {
    return milestones.reduce((total, milestone) => total + parseFloat(milestone.amount || '0'), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    if (milestones.some(m => !m.description.trim() || parseFloat(m.amount) <= 0)) {
      alert('Please fill in all milestone details')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Prepare contract parameters
      const milestoneAmounts = milestones.map(m => m.amount)
      const milestoneDescriptions = milestones.map(m => m.description)
      
      // Create escrow contract
      const contractResult = await createContract({
        freelancerAddress: service.freelancerAddress,
        milestoneAmounts,
        milestoneDescriptions,
      })

      // Mock API call to save job in Prisma DB
      // In a real app, this would be an API route
      const jobData = {
        serviceId: service.id,
        clientAddress: address,
        freelancerAddress: service.freelancerAddress,
        title: service.title,
        description: formData.projectDescription,
        totalAmount: calculateTotalAmount(),
        deadline: formData.deadline,
        additionalNotes: formData.additionalNotes,
        milestones: milestones.map((milestone, index) => ({
          index,
          description: milestone.description,
          amount: parseFloat(milestone.amount),
          isCompleted: false,
          isReleased: false,
        })),
        contractId: contractResult?.contractId || 'pending',
        status: 'active',
        createdAt: new Date().toISOString(),
      }

      // Simulate API call
      console.log('Saving job to database:', jobData)
      
      // In a real implementation, you would call:
      // const response = await fetch('/api/jobs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(jobData)
      // })
      
      alert('Job created successfully! Check your dashboard for updates.')
      onSuccess()
      onClose()
      
    } catch (error) {
      console.error('Error creating job:', error)
      alert('Failed to create job. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Service</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Service Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg">{service.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{service.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Freelancer: {service.freelancerAddress ? `${service.freelancerAddress.slice(0, 6)}...${service.freelancerAddress.slice(-4)}` : 'Unknown'}
              </span>
              <span className="font-semibold text-indigo-600">{service.price} ETH</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="Describe your project requirements in detail..."
                required
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Milestones */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Milestones *
                </label>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  disabled={milestones.length >= 5}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:text-gray-400"
                >
                  + Add Milestone
                </button>
              </div>
              
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Milestone {index + 1}
                      </span>
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={milestone.description}
                          onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Milestone description"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Amount (ETH)
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          value={milestone.amount}
                          onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="0.0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 text-right">
                <span className="text-sm font-medium text-gray-700">
                  Total Amount: {calculateTotalAmount().toFixed(3)} ETH
                </span>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Any additional requirements or notes..."
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting || isLoading || !isConnected}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-300"
              >
                {isSubmitting || isLoading ? 'Creating Job...' : `Create Job (${calculateTotalAmount().toFixed(3)} ETH)`}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}