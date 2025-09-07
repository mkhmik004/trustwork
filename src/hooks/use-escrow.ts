'use client'

import { useState, useCallback } from 'react'
import { useWagmiWallet } from './use-wagmi-wallet'
import { createEscrowContract, formatEther, parseEther } from '@/lib/ethers'

interface EscrowState {
  isLoading: boolean
  error: string | null
}

interface CreateContractParams {
  freelancerAddress: string
  milestoneAmounts: string[] // in ETH
  milestoneDescriptions: string[]
}

interface ContractDetails {
  client: string
  freelancer: string
  totalAmount: bigint
  releasedAmount: bigint
  isCompleted: boolean
  isDisputed: boolean
  createdAt: bigint
}

interface MilestoneDetails {
  amount: bigint
  description: string
  isReleased: boolean
}

export function useEscrow() {
  const { signer, isConnected } = useWagmiWallet()
  const [state, setState] = useState<EscrowState>({
    isLoading: false,
    error: null,
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  const createContract = useCallback(async (params: CreateContractParams) => {
    if (!signer || !isConnected) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    setError(null)

    try {
      const escrow = createEscrowContract(signer)
      
      // Convert amounts to wei
      const milestoneAmounts = params.milestoneAmounts.map(amount => parseEther(amount))
      const totalAmount = milestoneAmounts.reduce((sum, amount) => sum + amount, BigInt(0))
      
      const result = await escrow.createContract(
        params.freelancerAddress,
        milestoneAmounts,
        params.milestoneDescriptions,
        totalAmount
      )
      
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create contract'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [signer, isConnected, setLoading, setError])

  const releaseMilestone = useCallback(async (contractId: string, milestoneIndex: number) => {
    if (!signer || !isConnected) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    setError(null)

    try {
      const escrow = createEscrowContract(signer)
      const result = await escrow.releaseMilestone(BigInt(contractId), milestoneIndex)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to release milestone'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [signer, isConnected, setLoading, setError])

  const refundContract = useCallback(async (contractId: string) => {
    if (!signer || !isConnected) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    setError(null)

    try {
      const escrow = createEscrowContract(signer)
      const result = await escrow.refund(BigInt(contractId))
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process refund'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [signer, isConnected, setLoading, setError])

  const raiseDispute = useCallback(async (contractId: string) => {
    if (!signer || !isConnected) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    setError(null)

    try {
      const escrow = createEscrowContract(signer)
      const result = await escrow.raiseDispute(BigInt(contractId))
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to raise dispute'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [signer, isConnected, setLoading, setError])

  const getContract = useCallback(async (contractId: string): Promise<ContractDetails> => {
    if (!signer || !isConnected) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    setError(null)

    try {
      const escrow = createEscrowContract(signer)
      const result = await escrow.getContract(BigInt(contractId))
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get contract'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [signer, isConnected, setLoading, setError])

  const getMilestone = useCallback(async (contractId: string, milestoneIndex: number): Promise<MilestoneDetails> => {
    if (!signer || !isConnected) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    setError(null)

    try {
      const escrow = createEscrowContract(signer)
      const result = await escrow.getMilestone(BigInt(contractId), milestoneIndex)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get milestone'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [signer, isConnected, setLoading, setError])

  const getContractCount = useCallback(async (userAddress: string): Promise<bigint> => {
    if (!signer || !isConnected) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    setError(null)

    try {
      const escrow = createEscrowContract(signer)
      const result = await escrow.getContractCount(userAddress)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get contract count'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [signer, isConnected, setLoading, setError])

  return {
    ...state,
    createContract,
    releaseMilestone,
    refundContract,
    raiseDispute,
    getContract,
    getMilestone,
    getContractCount,
    formatEther,
    parseEther,
  }
}