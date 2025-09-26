# TrackIt - Environment Variables

## Required Environment Variables for Vercel Deployment

### Database Configuration
```bash
# Prisma Database URL
DATABASE_URL="file:./dev.db"  # For SQLite (development)
# For production, use a proper database URL:
# DATABASE_URL="postgresql://user:password@host:port/database"
```

### Application Configuration
```bash
# Next.js Configuration
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="https://your-app.vercel.app"

# Application URL
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"

# Node Environment
NODE_ENV="production"
```

### AI SDK Configuration (if using z-ai-web-dev-sdk)
```bash
# AI SDK Configuration
Z_AI_API_KEY="your-z-ai-api-key"
Z_AI_BASE_URL="https://api.z-ai.com"
```

### Optional Environment Variables

### Socket.IO Configuration
```bash
# Socket.IO Configuration (for production WebSocket services)
# For Vercel, Socket.IO is handled through serverless functions
SOCKET_IO_PATH="/api/socketio"
```

### Analytics and Monitoring
```bash
# Vercel Analytics (automatically configured by Vercel)
# Optional: Add your own analytics keys
GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"
```

### Security Headers
```bash
# Content Security Policy (CSP)
# Configure CSP headers for additional security
NEXT_PUBLIC_CSP_ENABLED="true"
```

## Vercel Deployment Setup

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

### 4. Set Environment Variables in Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add the required environment variables listed above
4. Redeploy the application

## Development vs Production

### Development (Local)
```bash
# Use the development script
npm run dev

# Database: SQLite (dev.db)
# Socket.IO: Local server with WebSocket support
# Hot reloading enabled
```

### Production (Vercel)
```bash
# Build command
npm run vercel-build

# Database: Configure based on your needs
# Socket.IO: Serverless functions
# Optimized for production
```

## Build Commands

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm install
npm run vercel-build
npm start
```

### Vercel Deployment
```bash
npm install
vercel --prod
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure all dependencies are properly installed
   - Check TypeScript errors
   - Verify Prisma schema and migrations

2. **Socket.IO Connection Issues**
   - Verify the Socket.IO path configuration
   - Check CORS settings
   - Ensure serverless functions are properly deployed

3. **Database Connection Issues**
   - Verify DATABASE_URL configuration
   - Check Prisma migrations
   - Ensure database is accessible

4. **Environment Variables**
   - Double-check variable names and values
   - Ensure sensitive data is properly secured
   - Verify production vs development configurations

## Additional Configuration

### Custom Domain
1. Configure your custom domain in Vercel dashboard
2. Update NEXTAUTH_URL and NEXT_PUBLIC_APP_URL
3. Set up SSL certificates (handled automatically by Vercel)

### Monitoring
- Vercel Analytics: Built-in monitoring
- Error tracking: Consider integrating with Sentry or similar services
- Performance monitoring: Use Vercel's built-in performance metrics

### Security
- Regular dependency updates
- Environment variable encryption
- CORS configuration
- Rate limiting considerations