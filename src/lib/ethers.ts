import { ethers } from 'ethers'
import { EscrowABI } from './escrow-abi'

// Contract address will be set after deployment
const ESCROW_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export class EscrowContract {
  private contract: ethers.Contract
  private signer: ethers.JsonRpcSigner

  constructor(signer: ethers.JsonRpcSigner) {
    this.signer = signer
    
    if (!ESCROW_CONTRACT_ADDRESS || ESCROW_CONTRACT_ADDRESS === '') {
      throw new Error('Escrow contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS environment variable.')
    }
    
    this.contract = new ethers.Contract(ESCROW_CONTRACT_ADDRESS, EscrowABI, signer)
  }

  // Create a new escrow contract
  async createContract(
    freelancer: string,
    milestoneAmounts: bigint[],
    milestoneDescriptions: string[],
    totalAmount: bigint
  ) {
    try {
      // Validate freelancer address
      if (!ethers.isAddress(freelancer)) {
        throw new Error(`Invalid freelancer address: ${freelancer}`)
      }
      
      // Get checksummed address
      const checksummedAddress = ethers.getAddress(freelancer)
      
      const tx = await this.contract.createContract(
        checksummedAddress,
        milestoneAmounts,
        milestoneDescriptions,
        { value: totalAmount }
      )
      const receipt = await tx.wait()
      
      // Extract contract ID from events
      const event = receipt.logs.find((log: ethers.Log) => {
        try {
          const parsed = this.contract.interface.parseLog(log)
          return parsed?.name === 'ContractCreated'
        } catch {
          return false
        }
      })
      
      if (event) {
        const parsed = this.contract.interface.parseLog(event)
        return {
          contractId: parsed?.args[0],
          txHash: receipt.hash,
          blockNumber: receipt.blockNumber
        }
      }
      
      throw new Error('Contract creation event not found')
    } catch (error) {
      console.error('Error creating escrow contract:', error)
      throw error
    }
  }

  // Release a milestone payment
  async releaseMilestone(contractId: bigint, milestoneIndex: number) {
    try {
      const tx = await this.contract.releaseMilestone(contractId, milestoneIndex)
      const receipt = await tx.wait()
      return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      }
    } catch (error) {
      console.error('Error releasing milestone:', error)
      throw error
    }
  }

  // Refund the contract (client only)
  async refund(contractId: bigint) {
    try {
      const tx = await this.contract.refund(contractId)
      const receipt = await tx.wait()
      return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      }
    } catch (error) {
      console.error('Error processing refund:', error)
      throw error
    }
  }

  // Raise a dispute
  async raiseDispute(contractId: bigint) {
    try {
      const tx = await this.contract.raiseDispute(contractId)
      const receipt = await tx.wait()
      return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      }
    } catch (error) {
      console.error('Error raising dispute:', error)
      throw error
    }
  }

  // Get contract details
  async getContract(contractId: bigint) {
    try {
      const contract = await this.contract.getContract(contractId)
      return {
        client: contract[0],
        freelancer: contract[1],
        totalAmount: contract[2],
        releasedAmount: contract[3],
        isCompleted: contract[4],
        isDisputed: contract[5],
        createdAt: contract[6]
      }
    } catch (error) {
      console.error('Error getting contract:', error)
      throw error
    }
  }

  // Get milestone details
  async getMilestone(contractId: bigint, milestoneIndex: number) {
    try {
      const milestone = await this.contract.getMilestone(contractId, milestoneIndex)
      return {
        amount: milestone[0],
        description: milestone[1],
        isReleased: milestone[2]
      }
    } catch (error) {
      console.error('Error getting milestone:', error)
      throw error
    }
  }

  // Get contract count for a user
  async getContractCount(userAddress: string) {
    try {
      return await this.contract.contractCount(userAddress)
    } catch (error) {
      console.error('Error getting contract count:', error)
      throw error
    }
  }

  // Listen to contract events
  onContractCreated(callback: (contractId: bigint, client: string, freelancer: string) => void) {
    this.contract.on('ContractCreated', callback)
  }

  onMilestoneReleased(callback: (contractId: bigint, milestoneIndex: number, amount: bigint) => void) {
    this.contract.on('MilestoneReleased', callback)
  }

  onContractCompleted(callback: (contractId: bigint) => void) {
    this.contract.on('ContractCompleted', callback)
  }

  onRefundProcessed(callback: (contractId: bigint, amount: bigint) => void) {
    this.contract.on('RefundProcessed', callback)
  }

  onDisputeRaised(callback: (contractId: bigint, raisedBy: string) => void) {
    this.contract.on('DisputeRaised', callback)
  }

  // Remove all listeners
  removeAllListeners() {
    this.contract.removeAllListeners()
  }
}

// Utility functions
export function formatEther(value: bigint): string {
  return ethers.formatEther(value)
}

export function parseEther(value: string): bigint {
  return ethers.parseEther(value)
}

export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address)
}

// Create contract instance
export function createEscrowContract(signer: ethers.JsonRpcSigner): EscrowContract {
  return new EscrowContract(signer)
}