import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Create frame response with service details
    const frameHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/api/frame/service/${serviceId}/image" />
          <meta property="fc:frame:button:1" content="💰 Book Service" />
          <meta property="fc:frame:button:1:action" content="tx" />
          <meta property="fc:frame:button:1:target" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/api/frame/book/${serviceId}" />
          <meta property="fc:frame:button:2" content="💬 Contact" />
          <meta property="fc:frame:button:2:action" content="link" />
          <meta property="fc:frame:button:2:target" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/app/chat/${service.providerId}" />
          <meta property="fc:frame:button:3" content="🔍 More Info" />
          <meta property="fc:frame:button:3:action" content="link" />
          <meta property="fc:frame:button:3:target" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/app/services/${serviceId}" />
          <meta property="fc:frame:button:4" content="← Back" />
          <meta property="fc:frame:button:4:action" content="post" />
          <meta property="fc:frame:button:4:target" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/api/frame/services" />
        </head>
        <body>
          <h1>${service.title}</h1>
          <p>${service.description}</p>
          <p>Price: $${service.price}</p>
        </body>
      </html>
    `;

    return new NextResponse(frameHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame service error:', error);
    return NextResponse.json({ error: 'Failed to load service' }, { status: 500 });
  }
}