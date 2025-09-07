import { Metadata } from 'next';

const miniAppEmbed = {
  version: "1",
  imageUrl: "https://trustwork.vercel.app/splash.svg",
  button: {
    title: "🚀 Launch TrustWork",
    action: {
      type: "launch_frame",
      name: "TrustWork",
      url: "https://trustwork.vercel.app/frame",
      splashImageUrl: "https://trustwork.vercel.app/splash.svg",
      splashBackgroundColor: "#1a1a1a"
    }
  }
};

export const metadata: Metadata = {
  title: 'TrustWork - Decentralized Freelance Platform',
  description: 'Secure freelance services with blockchain escrow protection',
  openGraph: {
    title: 'TrustWork Frame',
    description: 'Browse and book trusted freelance services',
    images: [{
      url: 'https://trustwork.vercel.app/splash.svg',
      width: 1200,
      height: 630,
    }],
  },
  other: {
    'fc:miniapp': JSON.stringify(miniAppEmbed),
    'fc:frame': JSON.stringify(miniAppEmbed), // For backward compatibility
  },
};

export default function FramePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">TrustWork</h1>
          <p className="text-gray-600 mb-6">
            Decentralized freelance platform with secure escrow and verified reviews
          </p>
          <div className="space-y-4">
            <a
              href="/app"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Open Full App
            </a>
            <p className="text-sm text-gray-500">
              This page is optimized for Farcaster Frames
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}