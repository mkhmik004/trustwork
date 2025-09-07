import { NextRequest, NextResponse } from 'next/server'

// Mock data - TODO: Replace with Prisma database calls
const mockServices = [
  {
    id: '1',
    title: 'Smart Contract Development',
    description: 'I will develop secure and efficient smart contracts for your DeFi project using Solidity.',
    category: 'Blockchain Development',
    price: 2.5,
    deliveryTime: 7,
    freelancerAddress: '0x1234567890123456789012345678901234567890',
    requirements: 'Project specifications, token economics details',
    portfolio: ['https://github.com/example/defi-contract'],
    createdAt: new Date('2024-01-15'),
    isActive: true,
    freelancerName: 'Alex Chen',
    rating: 4.9,
    completedJobs: 23,
    skills: ['Solidity', 'Smart Contracts', 'DeFi', 'Security Auditing']
  },
  {
    id: '2',
    title: 'DApp Frontend Development',
    description: 'Professional React.js frontend development for decentralized applications with Web3 integration.',
    category: 'Frontend Development',
    price: 1.8,
    deliveryTime: 5,
    freelancerAddress: '0x2345678901234567890123456789012345678901',
    requirements: 'Design mockups, smart contract ABIs',
    portfolio: ['https://dapp-example.com'],
    createdAt: new Date('2024-01-10'),
    isActive: true,
    freelancerName: 'Sarah Johnson',
    rating: 4.8,
    completedJobs: 31,
    skills: ['React', 'Web3.js', 'TypeScript', 'UI/UX Design']
  },
  {
    id: '3',
    title: 'NFT Marketplace Development',
    description: 'Complete NFT marketplace with minting, trading, and royalty features.',
    category: 'Blockchain Development',
    price: 5.0,
    deliveryTime: 14,
    freelancerAddress: '0x3456789012345678901234567890123456789012',
    requirements: 'NFT collection details, marketplace requirements',
    portfolio: ['https://nft-marketplace-demo.com'],
    createdAt: new Date('2024-01-05'),
    isActive: true,
    freelancerName: 'Mike Rodriguez',
    rating: 4.7,
    completedJobs: 18,
    skills: ['NFTs', 'IPFS', 'Smart Contracts', 'Marketplace Development']
  }
]

// GET /api/services/[id] - Get a specific service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    
    const service = mockServices.find(s => s.id === id)
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}