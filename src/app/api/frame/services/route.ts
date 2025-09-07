import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Get services from database
    const services = await prisma.service.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        provider: {
          select: { address: true }
        }
      }
    });

    // Create frame response with services
    const frameHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/api/frame/services/image" />
          <meta property="fc:frame:button:1" content="View Service 1" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:button:1:target" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/api/frame/service/${services[0]?.id || '1'}" />
          <meta property="fc:frame:button:2" content="View Service 2" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:button:2:target" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/api/frame/service/${services[1]?.id || '2'}" />
          <meta property="fc:frame:button:3" content="More Services" />
          <meta property="fc:frame:button:3:action" content="link" />
          <meta property="fc:frame:button:3:target" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/app" />
          <meta property="fc:frame:button:4" content="← Back" />
          <meta property="fc:frame:button:4:action" content="post" />
          <meta property="fc:frame:button:4:target" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/frame" />
        </head>
        <body>
          <h1>TrustWork Services</h1>
        </body>
      </html>
    `;

    return new NextResponse(frameHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame services error:', error);
    return NextResponse.json({ error: 'Failed to load services' }, { status: 500 });
  }
}