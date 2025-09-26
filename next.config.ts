import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel-specific configuration
  typescript: {
    ignoreBuildErrors: false, // Set to false for production builds
  },
  reactStrictMode: true, // Enable for production
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  },

  // Replit host configuration
  ...(process.env.NODE_ENV === 'development' && {
    async rewrites() {
      return []
    },
    async redirects() {
      return []
    },
  }),
  
  // Images configuration for Vercel
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },

  // Replit environment configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      }
    ]
  },
  
  // Compression
  compress: true,
  
  // Environment variables that should be available to the client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Optimization for production builds
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime.js': 'react/jsx-runtime.js',
        'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime.js',
      });
    }
    
    return config;
  },
  
  // ESLint configuration for builds
  eslint: {
    ignoreDuringBuilds: false, // Set to false for production builds
  },
};

export default nextConfig;
