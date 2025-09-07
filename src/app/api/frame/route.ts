import { NextRequest, NextResponse } from 'next/server'

// Farcaster Frame metadata
const FRAME_METADATA = {
  version: 'next',
  imageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image`,
  button: {
    title: 'Open TrustWork',
    action: {
      type: 'launch_frame',
      name: 'TrustWork',
      url: process.env.NEXT_PUBLIC_APP_URL,
      splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/splash`,
      splashBackgroundColor: '#f8fafc'
    }
  }
}

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>TrustWork - Decentralized Freelance Platform</title>
        
        <!-- Farcaster Frame Meta Tags -->
        <meta property="fc:frame" content="vNext">
        <meta property="fc:frame:image" content="${FRAME_METADATA.imageUrl}">
        <meta property="fc:frame:button:1" content="View Services">
        <meta property="fc:frame:button:1:action" content="post">
        <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame">
        <meta property="fc:frame:button:2" content="Launch App">
        <meta property="fc:frame:button:2:action" content="launch_frame">
        <meta property="fc:frame:button:2:target" content="${FRAME_METADATA.button.action.url}">
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame">
        
        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="TrustWork - Decentralized Freelance Platform">
        <meta property="og:description" content="Secure freelance services with blockchain escrow and verified reviews">
        <meta property="og:image" content="${FRAME_METADATA.imageUrl}">
        <meta property="og:url" content="${process.env.NEXT_PUBLIC_APP_URL}">
        <meta property="og:type" content="website">
        
        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="TrustWork - Decentralized Freelance Platform">
        <meta name="twitter:description" content="Secure freelance services with blockchain escrow and verified reviews">
        <meta name="twitter:image" content="${FRAME_METADATA.imageUrl}">
        
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .container {
            max-width: 600px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            font-weight: 700;
          }
          p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.9;
          }
          .cta-button {
            display: inline-block;
            background: #4f46e5;
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
          }
          .cta-button:hover {
            background: #4338ca;
            transform: translateY(-2px);
          }
          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 40px;
          }
          .feature {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .feature h3 {
            margin: 0 0 10px 0;
            font-size: 1.1rem;
          }
          .feature p {
            margin: 0;
            font-size: 0.9rem;
            opacity: 0.8;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔗 TrustWork</h1>
          <p>Decentralized freelance platform with blockchain escrow and verified reviews</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="cta-button">
            Launch App
          </a>
          
          <div class="features">
            <div class="feature">
              <h3>🔒 Secure Escrow</h3>
              <p>Smart contract-based payments</p>
            </div>
            <div class="feature">
              <h3>⭐ Verified Reviews</h3>
              <p>Only from actual clients</p>
            </div>
            <div class="feature">
              <h3>💬 Built-in Chat</h3>
              <p>Communicate seamlessly</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle Farcaster frame interactions
    if (body.untrustedData) {
      const { buttonIndex, fid, castId } = body.untrustedData
      
      // Log frame interaction
      console.log('Frame interaction:', { buttonIndex, fid, castId })
      
      // Handle different button clicks
      if (buttonIndex === 1) {
        // Show services frame
        return new NextResponse(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>TrustWork Services</title>
              
              <!-- Farcaster Frame Meta Tags -->
              <meta property="fc:frame" content="vNext">
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame/services">
              <meta property="fc:frame:button:1" content="Web Development">
              <meta property="fc:frame:button:1:action" content="post">
              <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame">
              <meta property="fc:frame:button:2" content="Design Services">
              <meta property="fc:frame:button:2:action" content="post">
              <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame">
              <meta property="fc:frame:button:3" content="Back">
              <meta property="fc:frame:button:3:action" content="post">
              <meta property="fc:frame:button:3:target" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame">
              <meta property="fc:frame:button:4" content="Launch App">
              <meta property="fc:frame:button:4:action" content="launch_frame">
              <meta property="fc:frame:button:4:target" content="${process.env.NEXT_PUBLIC_APP_URL}">
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame">
            </head>
            <body>
              <h1>TrustWork Services</h1>
              <p>Browse available freelance services</p>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' }
        })
      }
      
      // Default: return to main frame
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>TrustWork - Decentralized Freelance Platform</title>
            
            <!-- Farcaster Frame Meta Tags -->
            <meta property="fc:frame" content="vNext">
            <meta property="fc:frame:image" content="${FRAME_METADATA.imageUrl}">
            <meta property="fc:frame:button:1" content="View Services">
            <meta property="fc:frame:button:1:action" content="post">
            <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame">
            <meta property="fc:frame:button:2" content="Launch App">
            <meta property="fc:frame:button:2:action" content="launch_frame">
            <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_APP_URL}">
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame">
          </head>
          <body>
            <h1>TrustWork</h1>
            <p>Decentralized freelance platform with blockchain escrow</p>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('Frame POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}