#!/bin/bash

# TrackIt Vercel Deployment Script
# This script helps deploy TrackIt to Vercel with proper configuration

echo "🚀 TrackIt Vercel Deployment Script"
echo "====================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in to Vercel
echo "🔍 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npm run db:generate

# Build the application
echo "🔨 Building application..."
npm run vercel-build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to set up environment variables in your Vercel dashboard:"
echo "   - DATABASE_URL"
echo "   - NEXTAUTH_SECRET"
echo "   - NEXT_PUBLIC_APP_URL"
echo "   - NODE_ENV"
echo ""
echo "📖 See VERCEL_ENV.md for detailed setup instructions."