'use client'

import { useState, useEffect } from 'react'
import { useWagmiWallet } from '@/hooks/use-wagmi-wallet'
import { useEscrow } from '@/hooks/use-escrow'

interface Milestone {
  id: number
  description: string
  amount: number
  completed: boolean
  released: boolean
}

interface EscrowJob {
  id: string
  contractAddress: string
  title: string
  client: string
  contractor: string
  totalAmount: number
  milestones: Milestone[]
  status: 'active' | 'completed' | 'refunded'
  createdAt: string
}

// Mock data - in production this would come from Prisma DB + blockchain
const mockJobs: EscrowJob[] = [
  {
    id: '1',
    contractAddress: '0x1234567890123456789012345678901234567890',
    title: 'Web Development Project',
    client: '0x1111111111111111111111111111111111111111',
    contractor: '0x2222222222222222222222222222222222222222',
    totalAmount: 1000,
    status: 'active',
    createdAt: '2024-01-15',
    milestones: [
      { id: 0, description: 'Project Setup & Planning', amount: 300, completed: true, released: true },
      { id: 1, description: 'Frontend Development', amount: 400, completed: true, released: false },
      { id: 2, description: 'Backend Integration', amount: 300, completed: false, released: false }
    ]
  },
  {
    id: '2',
    contractAddress: '0x9876543210987654321098765432109876543210',
    title: 'Smart Contract Audit',
    client: '0x3333333333333333333333333333333333333333',
    contractor: '0x2222222222222222222222222222222222222222',
    totalAmount: 800,
    status: 'active',
    createdAt: '2024-01-20',
    milestones: [
      { id: 0, description: 'Initial Code Review', amount: 400, completed: false, released: false },
      { id: 1, description: 'Security Analysis & Report', amount: 400, completed: false, released: false }
    ]
  }
]

export function EscrowDashboard() {
  const { address, isConnected } = useWagmiWallet()
  const { releaseMilestone, refundContract, isLoading } = useEscrow()
  const [jobs, setJobs] = useState<EscrowJob[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)

  useEffect(() => {
    // Simulate fetching jobs from database
    const fetchJobs = async () => {
      setLoadingJobs(true)
      // In production: fetch jobs where user is client or contractor
      await new Promise(resolve => setTimeout(resolve, 1000))
      const userJobs = mockJobs.filter(job => 
        job.client.toLowerCase() === address?.toLowerCase() || 
        job.contractor.toLowerCase() === address?.toLowerCase()
      )
      setJobs(userJobs)
      setLoadingJobs(false)
    }

    if (isConnected && address) {
      fetchJobs()
    }
  }, [address, isConnected])

  const handleMarkMilestoneComplete = async (jobId: string, milestoneId: number) => {
    // In production: update milestone status in database
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId 
          ? {
              ...job,
              milestones: job.milestones.map(milestone => 
                milestone.id === milestoneId 
                  ? { ...milestone, completed: true }
                  : milestone
              )
            }
          : job
      )
    )
    alert('Milestone marked as completed! Client can now release payment.')
  }

  const handleReleaseMilestone = async (contractAddress: string, milestoneId: number) => {
    try {
      await releaseMilestone(contractAddress, milestoneId)
      
      // Update local state
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.contractAddress === contractAddress 
            ? {
                ...job,
                milestones: job.milestones.map(milestone => 
                  milestone.id === milestoneId 
                    ? { ...milestone, released: true }
                    : milestone
                )
              }
            : job
        )
      )
      alert('Milestone payment released successfully!')
    } catch (error) {
      console.error('Failed to release milestone:', error)
      alert('Failed to release milestone payment')
    }
  }

  const handleRefundJob = async (contractAddress: string, jobId: string) => {
    if (!confirm('Are you sure you want to refund this job? This action cannot be undone.')) {
      return
    }

    try {
      await refundContract(contractAddress)
      
      // Update local state
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId 
            ? { ...job, status: 'refunded' as const }
            : job
        )
      )
      alert('Job refunded successfully!')
    } catch (error) {
      console.error('Failed to refund job:', error)
      alert('Failed to refund job')
    }
  }

  const isClient = (job: EscrowJob) => job.client.toLowerCase() === address?.toLowerCase()
  const isContractor = (job: EscrowJob) => job.contractor.toLowerCase() === address?.toLowerCase()

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Escrow Dashboard</h2>
        <p className="text-gray-500">Please connect your wallet to view your escrow contracts.</p>
      </div>
    )
  }

  if (loadingJobs) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Escrow Dashboard</h2>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Escrow Dashboard</h2>
      
      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No active escrow contracts found.</p>
      ) : (
        <div className="space-y-6">
          {jobs.map(job => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Contract: {job.contractAddress.slice(0, 10)}...{job.contractAddress.slice(-8)}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>Client: {job.client.slice(0, 6)}...{job.client.slice(-4)}</span>
                    <span>Contractor: {job.contractor.slice(0, 6)}...{job.contractor.slice(-4)}</span>
                    <span>Total: R{(parseFloat(job.totalAmount.toString()) * 18).toFixed(2)} ZAR</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' :
                    job.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                  {isClient(job) && job.status === 'active' && (
                    <button
                      onClick={() => handleRefundJob(job.contractAddress, job.id)}
                      disabled={isLoading}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors disabled:bg-gray-300"
                    >
                      {isLoading ? 'Processing...' : 'Refund Job'}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Milestones:</h4>
                {job.milestones.map(milestone => (
                  <div key={milestone.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{milestone.description}</span>
                        <span className="text-sm text-gray-600">R{(parseFloat(milestone.amount.toString()) * 18).toFixed(2)} ZAR</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          milestone.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {milestone.completed ? 'Completed' : 'In Progress'}
                        </span>
                        {milestone.released && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            Payment Released
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isContractor(job) && !milestone.completed && job.status === 'active' && (
                        <button
                          onClick={() => handleMarkMilestoneComplete(job.id, milestone.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                      {isClient(job) && milestone.completed && !milestone.released && job.status === 'active' && (
                        <button
                          onClick={() => handleReleaseMilestone(job.contractAddress, milestone.id)}
                          disabled={isLoading}
                          className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 transition-colors disabled:bg-gray-300"
                        >
                          {isLoading ? 'Releasing...' : 'Release Payment'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}