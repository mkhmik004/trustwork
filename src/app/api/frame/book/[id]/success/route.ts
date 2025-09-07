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

    const serviceName = service?.title || 'Service';
    const servicePrice = service?.price || '0';

    // Generate success SVG image
    const svg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="linear-gradient(135deg, #10B981 0%, #059669 100%)"/>
        <rect x="50" y="50" width="1100" height="530" rx="20" fill="white" fill-opacity="0.95"/>
        
        <!-- Success Icon -->
        <circle cx="600" cy="200" r="60" fill="#10B981"/>
        <path d="M570 200 L590 220 L630 180" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        
        <!-- Header -->
        <text x="600" y="300" text-anchor="middle" fill="#1F2937" font-family="Arial, sans-serif" font-size="48" font-weight="bold">Booking Successful! 🎉</text>
        
        <!-- Service Details -->
        <text x="600" y="350" text-anchor="middle" fill="#4B5563" font-family="Arial, sans-serif" font-size="24">You've successfully booked:</text>
        <text x="600" y="385" text-anchor="middle" fill="#1F2937" font-family="Arial, sans-serif" font-size="28" font-weight="bold">${serviceName.substring(0, 40)}${serviceName.length > 40 ? '...' : ''}</text>
        
        <!-- Price -->
        <rect x="500" y="410" width="200" height="50" rx="25" fill="#10B981"/>
        <text x="600" y="440" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">$${servicePrice} Escrowed</text>
        
        <!-- Next Steps -->
        <text x="600" y="490" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="18">🔒 Funds are safely held in escrow until completion</text>
        <text x="600" y="520" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="18">💬 The service provider will contact you soon</text>
        
        <!-- Action buttons hint -->
        <rect x="250" y="550" width="180" height="40" rx="20" fill="#3B82F6"/>
        <text x="340" y="575" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">✅ View Booking</text>
        
        <rect x="450" y="550" width="180" height="40" rx="20" fill="#8B5CF6"/>
        <text x="540" y="575" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">🔍 Browse More</text>
        
        <rect x="650" y="550" width="120" height="40" rx="20" fill="#6B7280"/>
        <text x="710" y="575" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">🏠 Home</text>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Frame booking success image error:', error);
    
    // Return fallback success image
    const fallbackSvg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#10B981"/>
        <circle cx="600" cy="250" r="60" fill="white"/>
        <path d="M570 250 L590 270 L630 230" stroke="#10B981" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <text x="600" y="350" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">Booking Successful!</text>
        <text x="600" y="400" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24">Your service has been booked securely</text>
      </svg>
    `;
    
    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }
}