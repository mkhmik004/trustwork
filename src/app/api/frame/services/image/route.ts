import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get latest services
    const services = await prisma.service.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        provider: {
          select: { address: true }
        }
      }
    });

    // Generate SVG image with services
    const svg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"/>
        <rect x="50" y="50" width="1100" height="530" rx="20" fill="white" fill-opacity="0.95"/>
        
        <!-- Header -->
        <text x="600" y="120" text-anchor="middle" fill="#1F2937" font-family="Arial, sans-serif" font-size="48" font-weight="bold">Available Services</text>
        
        <!-- Service 1 -->
        <rect x="100" y="180" width="320" height="120" rx="10" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="2"/>
        <text x="260" y="210" text-anchor="middle" fill="#1F2937" font-family="Arial, sans-serif" font-size="18" font-weight="bold">${services[0]?.title.substring(0, 25) || 'Web Development'}${services[0]?.title.length > 25 ? '...' : ''}</text>
        <text x="260" y="235" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="14">$${services[0]?.price || '500'}</text>
        <text x="260" y="255" text-anchor="middle" fill="#10B981" font-family="Arial, sans-serif" font-size="12">⭐ 5.0</text>
        <text x="260" y="280" text-anchor="middle" fill="#3B82F6" font-family="Arial, sans-serif" font-size="16" font-weight="bold">View Details →</text>
        
        <!-- Service 2 -->
        <rect x="440" y="180" width="320" height="120" rx="10" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="2"/>
        <text x="600" y="210" text-anchor="middle" fill="#1F2937" font-family="Arial, sans-serif" font-size="18" font-weight="bold">${services[1]?.title.substring(0, 25) || 'Mobile App Design'}${services[1]?.title.length > 25 ? '...' : ''}</text>
        <text x="600" y="235" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="14">$${services[1]?.price || '750'}</text>
        <text x="600" y="255" text-anchor="middle" fill="#10B981" font-family="Arial, sans-serif" font-size="12">⭐ 4.8</text>
        <text x="600" y="280" text-anchor="middle" fill="#3B82F6" font-family="Arial, sans-serif" font-size="16" font-weight="bold">View Details →</text>
        
        <!-- Service 3 -->
        <rect x="780" y="180" width="320" height="120" rx="10" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="2"/>
        <text x="940" y="210" text-anchor="middle" fill="#1F2937" font-family="Arial, sans-serif" font-size="18" font-weight="bold">${services[2]?.title.substring(0, 25) || 'Smart Contract Audit'}${services[2]?.title.length > 25 ? '...' : ''}</text>
        <text x="940" y="235" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="14">$${services[2]?.price || '1200'}</text>
        <text x="940" y="255" text-anchor="middle" fill="#10B981" font-family="Arial, sans-serif" font-size="12">⭐ 4.9</text>
        <text x="940" y="280" text-anchor="middle" fill="#3B82F6" font-family="Arial, sans-serif" font-size="16" font-weight="bold">View Details →</text>
        
        <!-- Footer -->
        <text x="600" y="380" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="16">🔒 Secure Escrow • 💼 Verified Freelancers • ⭐ Trusted Reviews</text>
        
        <!-- Action buttons hint -->
        <rect x="200" y="420" width="200" height="40" rx="20" fill="#3B82F6"/>
        <text x="300" y="445" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">View Service 1</text>
        
        <rect x="420" y="420" width="200" height="40" rx="20" fill="#3B82F6"/>
        <text x="520" y="445" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">View Service 2</text>
        
        <rect x="640" y="420" width="200" height="40" rx="20" fill="#10B981"/>
        <text x="740" y="445" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">More Services</text>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Frame services image error:', error);
    
    // Return fallback image
    const fallbackSvg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#3B82F6"/>
        <text x="600" y="315" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">TrustWork Services</text>
        <text x="600" y="380" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24">Loading services...</text>
      </svg>
    `;
    
    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }
}