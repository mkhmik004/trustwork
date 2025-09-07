import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: serviceId } = await params;
    
    // Get service details for transaction
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

    // Return transaction data for Frame
    const transactionData = {
      chainId: 'eip155:8453', // Base mainnet
      method: 'eth_sendTransaction',
      params: {
        abi: [
          {
            "inputs": [
              { "name": "_serviceProvider", "type": "address" },
              { "name": "_serviceId", "type": "string" },
              { "name": "_description", "type": "string" }
            ],
            "name": "createEscrow",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          }
        ],
        to: process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6',
        data: {
          functionName: 'createEscrow',
          args: [
            service.provider.address,
            serviceId,
            service.title
          ]
        },
        value: (BigInt(service.price) * BigInt(10**18)).toString() // Convert to wei
      }
    };

    return NextResponse.json(transactionData);
  } catch (error) {
    console.error('Frame booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking transaction' }, { status: 500 });
  }
}

// Handle transaction success callback
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: serviceId } = await params;
    const { searchParams } = new URL(req.url);
    const txHash = searchParams.get('txHash');

    if (!txHash) {
      return NextResponse.json({ error: 'Transaction hash required' }, { status: 400 });
    }

    // Create booking record
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Return success frame
    const successHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/api/frame/book/${serviceId}/success" />
          <meta property="fc:frame:button:1" content="✅ View Booking" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/app/bookings" />
          <meta property="fc:frame:button:2" content="🔍 Browse More" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:button:2:target" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/api/frame/services" />
          <meta property="fc:frame:button:3" content="🏠 Home" />
          <meta property="fc:frame:button:3:action" content="post" />
          <meta property="fc:frame:button:3:target" content="https://trustwork-hlti1mt62-markbetterdevs-projects.vercel.app/frame" />
        </head>
        <body>
          <h1>Booking Successful!</h1>
          <p>Your escrow has been created for: ${service.title}</p>
          <p>Transaction: ${txHash}</p>
        </body>
      </html>
    `;

    return new NextResponse(successHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame booking success error:', error);
    return NextResponse.json({ error: 'Failed to process booking success' }, { status: 500 });
  }
}