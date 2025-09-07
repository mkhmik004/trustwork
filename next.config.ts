import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  images: {
    domains: ['localhost'],
  },
}

export default nextConfig
