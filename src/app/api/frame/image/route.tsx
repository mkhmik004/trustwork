import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'TrustWork'
    const subtitle = searchParams.get('subtitle') || 'Decentralized Freelance Platform'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 20,
              padding: 60,
              border: '2px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 72,
                marginBottom: 20,
              }}
            >
              🔗
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: 'white',
                marginBottom: 16,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: 40,
              }}
            >
              {subtitle}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 40,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: 20,
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
                <div style={{ fontSize: 16, color: 'white' }}>Secure Escrow</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: 20,
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
                <div style={{ fontSize: 16, color: 'white' }}>Verified Reviews</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: 20,
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                <div style={{ fontSize: 16, color: 'white' }}>Built-in Chat</div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating frame image:', error)
    return new NextResponse('Failed to generate image', { status: 500 })
  }
}