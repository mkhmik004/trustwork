// Client-side service storage manager using localStorage

export interface Service {
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

const STORAGE_KEY = 'trustwork_services'

// Default services data
const defaultServices: Service[] = [
  {
    id: '1',
    title: 'Full-Stack Web Application Development',
    description: 'I will create a modern, responsive web application using React, Node.js, and PostgreSQL. Includes user authentication, database design, API development, and deployment.',
    category: 'Web Development',
    price: 2.5,
    deliveryTime: 14,
    freelancerAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    createdAt: new Date('2024-01-15'),
    isActive: true
  },
  {
    id: '2',
    title: 'Mobile App UI/UX Design',
    description: 'Professional mobile app design with modern UI/UX principles. Includes wireframes, prototypes, and design system. Available for iOS and Android platforms.',
    category: 'UI/UX Design',
    price: 1.8,
    deliveryTime: 10,
    freelancerAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    createdAt: new Date('2024-01-14'),
    isActive: true
  },
  {
    id: '3',
    title: 'Smart Contract Development & Audit',
    description: 'Develop and audit secure smart contracts for DeFi, NFTs, and other blockchain applications. Includes testing, optimization, and security analysis.',
    category: 'Blockchain Development',
    price: 3.2,
    deliveryTime: 21,
    freelancerAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    createdAt: new Date('2024-01-13'),
    isActive: true
  },
  {
    id: '4',
    title: 'SEO Content Writing & Strategy',
    description: 'High-quality, SEO-optimized content writing for blogs, websites, and marketing materials. Includes keyword research and content strategy.',
    category: 'Content Writing',
    price: 0.8,
    deliveryTime: 7,
    freelancerAddress: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    createdAt: new Date('2024-01-12'),
    isActive: true
  },
  {
    id: '5',
    title: 'Data Analysis & Visualization',
    description: 'Comprehensive data analysis using Python, R, and modern visualization tools. Includes statistical analysis, machine learning models, and interactive dashboards.',
    category: 'Data Analysis',
    price: 1.5,
    deliveryTime: 12,
    freelancerAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    createdAt: new Date('2024-01-11'),
    isActive: true
  }
]

export class ServicesStorage {
  private static instance: ServicesStorage
  private services: Service[] = []

  private constructor() {
    this.loadServices()
  }

  public static getInstance(): ServicesStorage {
    if (!ServicesStorage.instance) {
      ServicesStorage.instance = new ServicesStorage()
    }
    return ServicesStorage.instance
  }

  private loadServices(): void {
    if (typeof window === 'undefined') {
      this.services = [...defaultServices]
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Convert date strings back to Date objects
        this.services = parsed.map((service: Service & { createdAt: string }) => ({
          ...service,
          createdAt: new Date(service.createdAt)
        }))
      } else {
        // First time loading, use default services
        this.services = [...defaultServices]
        this.saveServices()
      }
    } catch (error) {
      console.error('Error loading services from localStorage:', error)
      this.services = [...defaultServices]
    }
  }

  private saveServices(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.services))
      } catch (error) {
        console.error('Error saving services to localStorage:', error)
      }
    }
  }

  public getAllServices(): Service[] {
    return this.services.filter(service => service.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  public getServiceById(id: string): Service | undefined {
    return this.services.find(service => service.id === id && service.isActive)
  }

  public addService(serviceData: Omit<Service, 'id' | 'createdAt' | 'isActive'>): Service {
    const newService: Service = {
      ...serviceData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      isActive: true
    }

    this.services.push(newService)
    this.saveServices()
    return newService
  }

  public updateService(id: string, updates: Partial<Service>): Service | null {
    const index = this.services.findIndex(service => service.id === id)
    if (index === -1) return null

    this.services[index] = { ...this.services[index], ...updates }
    this.saveServices()
    return this.services[index]
  }

  public deleteService(id: string): boolean {
    const index = this.services.findIndex(service => service.id === id)
    if (index === -1) return false

    this.services[index].isActive = false
    this.saveServices()
    return true
  }

  public searchServices(query: string, category?: string): Service[] {
    let filtered = this.getAllServices()

    if (category && category !== 'All Categories') {
      filtered = filtered.filter(service => service.category === category)
    }

    if (query.trim()) {
      const searchTerm = query.toLowerCase()
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.category.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  }

  public clearStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      this.services = [...defaultServices]
      this.saveServices()
    }
  }

  // Force reload services from defaults (useful for fixing address issues)
  forceReloadDefaults(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      this.services = [...defaultServices]
      this.saveServices()
      // Force page reload to ensure clean state
      window.location.reload()
    }
  }
}

// Export singleton instance
export const servicesStorage = ServicesStorage.getInstance()