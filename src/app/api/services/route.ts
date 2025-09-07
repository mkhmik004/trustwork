import { NextRequest, NextResponse } from 'next/server'

// Service interface
interface Service {
  id: string
  title: string
  description: string
  category: string
  price: number
  deliveryTime: number
  freelancerAddress: string
  createdAt: Date
  isActive: boolean
}

// Utility functions for localStorage persistence
function getServicesFromStorage(): Service[] {
  if (typeof window === 'undefined') {
    // Server-side: return default services
    return [
      {
        id: '1',
        title: 'Modern React Website Development',
        description: 'I will create a responsive, modern website using React and TailwindCSS with clean code and best practices.',
        category: 'Web Development',
        price: 0.5,
        deliveryTime: 7,
        freelancerAddress: '0x1234567890123456789012345678901234567890',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        isActive: true
      },
      {
        id: '2',
        title: 'Smart Contract Development & Audit',
        description: 'Professional Solidity smart contract development with security audit and gas optimization.',
        category: 'Blockchain Development',
        price: 1.2,
        deliveryTime: 14,
        freelancerAddress: '0x2345678901234567890123456789012345678901',
        createdAt: new Date('2024-01-14T15:30:00Z'),
        isActive: true
      },
      {
        id: '3',
        title: 'UI/UX Design for Web3 Applications',
        description: 'Complete UI/UX design for decentralized applications with user-friendly Web3 interactions.',
        category: 'UI/UX Design',
        price: 0.8,
        deliveryTime: 10,
        freelancerAddress: '0x3456789012345678901234567890123456789012',
        createdAt: new Date('2024-01-13T09:15:00Z'),
        isActive: true
      }
    ]
  }
  
  try {
    const stored = localStorage.getItem('trustwork_services')
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert date strings back to Date objects
      return parsed.map((service: Service & { createdAt: string }) => ({
        ...service,
        createdAt: new Date(service.createdAt)
      }))
    }
  } catch (error) {
    console.error('Error loading services from localStorage:', error)
  }
  
  // Return default services if nothing in storage
  return [
    {
      id: '1',
      title: 'Modern React Website Development',
      description: 'I will create a responsive, modern website using React and TailwindCSS with clean code and best practices.',
      category: 'Web Development',
      price: 0.5,
      deliveryTime: 7,
      freelancerAddress: '0x1234567890123456789012345678901234567890',
      createdAt: new Date('2024-01-15T10:00:00Z'),
      isActive: true
    },
    {
      id: '2',
      title: 'Smart Contract Development & Audit',
      description: 'Professional Solidity smart contract development with security audit and gas optimization.',
      category: 'Blockchain Development',
      price: 1.2,
      deliveryTime: 14,
      freelancerAddress: '0x2345678901234567890123456789012345678901',
      createdAt: new Date('2024-01-14T15:30:00Z'),
      isActive: true
    },
    {
      id: '3',
      title: 'UI/UX Design for Web3 Applications',
      description: 'Complete UI/UX design for decentralized applications with user-friendly Web3 interactions.',
      category: 'UI/UX Design',
      price: 0.8,
      deliveryTime: 10,
      freelancerAddress: '0x3456789012345678901234567890123456789012',
      createdAt: new Date('2024-01-13T09:15:00Z'),
      isActive: true
    }
  ]
}

function saveServicesToStorage(services: Service[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('trustwork_services', JSON.stringify(services))
    } catch (error) {
      console.error('Error saving services to localStorage:', error)
    }
  }
}

// Initialize services from storage
const services: Service[] = getServicesFromStorage()

// GET /api/services - Get all services with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    let filteredServices = services.filter(service => service.isActive)
    
    // Filter by category
    if (category && category !== 'All Categories') {
      filteredServices = filteredServices.filter(service => 
        service.category === category
      )
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      filteredServices = filteredServices.filter(service =>
        service.title.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Sort by creation date (newest first)
    filteredServices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json(filteredServices)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'price', 'deliveryTime', 'freelancerAddress']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Validate data types
    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }
    
    if (typeof body.deliveryTime !== 'number' || body.deliveryTime <= 0) {
      return NextResponse.json(
        { error: 'Delivery time must be a positive number' },
        { status: 400 }
      )
    }
    
    // Create new service
    const newService = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      category: body.category,
      price: parseFloat(body.price),
      deliveryTime: parseInt(body.deliveryTime),
      freelancerAddress: body.freelancerAddress,
      createdAt: new Date(),
      isActive: true
    }
    
    // Add to services and save to localStorage
    services.push(newService)
    saveServicesToStorage(services)
    
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}