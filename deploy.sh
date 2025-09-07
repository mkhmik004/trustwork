#!/bin/bash

# TrustWork Deployment Script
# This script helps deploy TrustWork to Vercel with proper configuration

set -e

echo "🚀 TrustWork Deployment Script"
echo "=============================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Build the project locally first to check for errors
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Local build successful!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."

# Check if this is production deployment
read -p "Deploy to production? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to production..."
    vercel --prod
else
    echo "🧪 Deploying to preview..."
    vercel
fi

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure your domain (if production)"
echo "3. Test the Farcaster frame integration"
echo "4. Deploy your smart contracts to Base testnet"
echo ""
echo "🔗 Useful links:"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Farcaster Frames: https://docs.farcaster.xyz/reference/frames/spec"
echo "- Base Testnet: https://docs.base.org/using-base"