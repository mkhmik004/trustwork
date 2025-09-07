import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: serviceId } = await params;
    
    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        provider: {
          select: { address: true }
        }
      }
    });

    if (!service) {
      // Return 404 fallback image
      const notFoundSvg = `
        <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="1200" height="630" fill="#EF4444"/>
          <text x="600" y="315" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">Service Not Found</text>
        </svg>
      `;
      
      return new NextResponse(notFoundSvg, {
        headers: {
          'Content-Type': 'image/svg+xml',
        },
      });
    }

    // Generate SVG image with service details
    const svg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"/>
        <rect x="50" y="50" width="1100" height="530" rx="20" fill="white" fill-opacity="0.95"/>
        
        <!-- Header -->
        <text x="600" y="120" text-anchor="middle" fill="#1F2937" font-family="Arial, sans-serif" font-size="36" font-weight="bold">${service.title.substring(0, 40)}${service.title.length > 40 ? '...' : ''}</text>
        
        <!-- Price Badge -->
        <rect x="500" y="140" width="200" height="50" rx="25" fill="#10B981"/>
        <text x="600" y="170" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">$${service.price}</text>
        
        <!-- Description -->
        <text x="600" y="230" text-anchor="middle" fill="#4B5563" font-family="Arial, sans-serif" font-size="18">${service.description.substring(0, 80)}${service.description.length > 80 ? '...' : ''}</text>
        
        <!-- Service Details -->
        <rect x="150" y="270" width="900" height="200" rx="15" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="2"/>
        
        <!-- Category -->
        <text x="200" y="310" fill="#6B7280" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Category:</text>
        <text x="300" y="310" fill="#1F2937" font-family="Arial, sans-serif" font-size="16">${service.category}</text>
        
        <!-- Rating -->
        <text x="200" y="340" fill="#6B7280" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Rating:</text>
        <text x="280" y="340" fill="#10B981" font-family="Arial, sans-serif" font-size="16">⭐ 5.0</text>
        
        <!-- Provider -->
        <text x="200" y="370" fill="#6B7280" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Provider:</text>
        <text x="300" y="370" fill="#1F2937" font-family="Arial, sans-serif" font-size="14">${service.provider.address.substring(0, 6)}...${service.provider.address.substring(-4)}</text>
        
        <!-- Features -->
        <text x="200" y="410" fill="#6B7280" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Features:</text>
        <text x="200" y="435" fill="#1F2937" font-family="Arial, sans-serif" font-size="14">🔒 Secure Escrow Protection</text>
        <text x="500" y="435" fill="#1F2937" font-family="Arial, sans-serif" font-size="14">💼 Professional Service</text>
        <text x="200" y="455" fill="#1F2937" font-family="Arial, sans-serif" font-size="14">⭐ Verified Reviews</text>
        <text x="500" y="455" fill="#1F2937" font-family="Arial, sans-serif" font-size="14">💬 Direct Communication</text>
        
        <!-- Action buttons hint -->
        <rect x="150" y="500" width="180" height="40" rx="20" fill="#10B981"/>
        <text x="240" y="525" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">💰 Book Service</text>
        
        <rect x="350" y="500" width="150" height="40" rx="20" fill="#3B82F6"/>
        <text x="425" y="525" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">💬 Contact</text>
        
        <rect x="520" y="500" width="150" height="40" rx="20" fill="#8B5CF6"/>
        <text x="595" y="525" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">🔍 More Info</text>
        
        <rect x="690" y="500" width="120" height="40" rx="20" fill="#6B7280"/>
        <text x="750" y="525" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">← Back</text>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Frame service image error:', error);
    
    // Return fallback image
    const fallbackSvg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#3B82F6"/>
        <text x="600" y="315" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">TrustWork Service</text>
        <text x="600" y="380" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24">Loading service details...</text>
      </svg>
    `;
    
    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }
}