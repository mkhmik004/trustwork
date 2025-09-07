import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
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
            background: '#f8fafc',
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
              background: 'white',
              borderRadius: 20,
              padding: 60,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 96,
                marginBottom: 20,
              }}
            >
              🔗
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: 16,
              }}
            >
              TrustWork
            </div>
            <div
              style={{
                fontSize: 24,
                color: '#6b7280',
                marginBottom: 40,
              }}
            >
              Loading your decentralized workspace...
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#4f46e5',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#4f46e5',
                  animation: 'pulse 1.5s ease-in-out infinite 0.2s',
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#4f46e5',
                  animation: 'pulse 1.5s ease-in-out infinite 0.4s',
                }}
              />
            </div>
          </div>
        </div>
      ),
      {
        width: 400,
        height: 400,
      }
    )
  } catch (error) {
    console.error('Error generating splash image:', error)
    return new NextResponse('Failed to generate splash image', { status: 500 })
  }
}