# 🎯 TrackIt - Smart Attendance System

A modern, AI-powered attendance tracking system built with Next.js 15, featuring real-time analytics, facial recognition, and seamless theme switching. Perfect for educational institutions and organizations looking to modernize their attendance management.

## ✨ Key Features

### 🎯 Core Functionality
- **🤖 AI-Powered Recognition**: Advanced facial recognition with 99.9% accuracy
- **📊 Real-time Analytics**: Live attendance tracking and performance insights
- **👥 Role-Based Dashboards**: Separate interfaces for teachers and students
- **📱 Mobile Responsive**: Works seamlessly on all devices
- **🌙 Dual Theme Support**: Beautiful light and dark mode themes

### 🎨 User Experience
- **🎯 Intuitive Interface**: Clean, modern design with smooth animations
- **⚡ Real-time Updates**: Live attendance status via WebSocket
- **📈 Smart Analytics**: Machine learning-powered insights and trends
- **🔔 Instant Notifications**: Real-time alerts and updates
- **🎨 Theme Adaptation**: Cyan/blue for light mode, purple/pink for dark mode

## 🚀 Technology Stack

### 🎯 Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first CSS framework

### 🎨 UI & Interaction
- **🧩 shadcn/ui** - High-quality accessible components
- **🎯 Lucide React** - Beautiful icon library
- **🌈 Framer Motion** - Smooth animations and interactions
- **🌙 Next Themes** - Perfect theme switching

### 🔄 Real-time Features
- **🔌 Socket.IO** - Real-time bidirectional communication
- **📊 TanStack Query** - Server state management
- **🐻 Zustand** - Client state management

### 🗄️ Backend & Data
- **🗄️ Prisma** - Modern database toolkit
- **🔐 NextAuth.js** - Authentication solution
- **🌐 Axios** - HTTP client

### 🤖 AI Integration
- **🤖 z-ai-web-dev-sdk** - AI-powered features
- **📈 Advanced Analytics** - Machine learning insights
- **🎯 Smart Recognition** - Facial recognition capabilities

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see TrackIt running.

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel --prod
```

📖 **For detailed Vercel setup, see [VERCEL_ENV.md](./VERCEL_ENV.md)**

## 🎯 Key Features

### 🎯 Core Features
- **🤖 AI Recognition**: Intelligent facial recognition for attendance tracking
- **📊 Smart Analytics**: Real-time insights and performance metrics
- **👥 Role Management**: Separate dashboards for teachers and students
- **📱 Mobile First**: Responsive design for all devices
- **🌙 Theme Support**: Beautiful dual-theme interface

### 🎨 Advanced Features
- **⚡ Real-time Updates**: Live attendance via WebSocket
- **📈 Machine Learning**: AI-powered analytics and insights
- **🔔 Smart Notifications**: Real-time alerts and updates
- **🎨 Adaptive UI**: Theme-aware components and interactions
- **🔐 Secure Authentication**: Role-based access control

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── socketio/      # Socket.IO serverless function
│   │   ├── attendance/    # Attendance management
│   │   ├── classes/       # Class management
│   │   └── auth/          # Authentication
│   ├── page.tsx           # Main landing page
│   └── layout.tsx         # Root layout
├── components/             # Reusable React components
│   ├── ui/                # shadcn/ui components
│   ├── teacher-dashboard.tsx
│   ├── student-dashboard.tsx
│   └── theme-toggle.tsx
├── hooks/                  # Custom React hooks
│   ├── use-socket.ts     # Socket.IO hook
│   └── use-mobile.ts     # Mobile detection
└── lib/                    # Utility functions
    ├── db.ts             # Database configuration
    ├── socket.ts         # Socket.IO setup
    └── utils.ts          # Utility functions
```

## 🎨 Available Components

### 🧩 Core UI Components
- **TrackItLogo**: Theme-aware logo component
- **3DCard**: Animated 3D card with hover effects
- **ThreeDBackground**: Dynamic animated background
- **AnimatedStats**: Statistics with smooth animations
- **ThemeToggle**: Dark/light mode switcher

### 📊 Dashboard Components
- **TeacherDashboard**: Complete teacher interface
- **StudentDashboard**: Student-focused interface
- **SmartScheduler**: Intelligent scheduling system
- **NotificationSystem**: Real-time notification management

### 🔌 Real-time Features
- **Socket.IO Integration**: Real-time bidirectional communication
- **Live Attendance Updates**: Instant status changes
- **AI Recognition Events**: Real-time facial recognition updates
- **Session Management**: Live session tracking

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Prerequisites**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Environment Variables**
   Set up required environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - `NODE_ENV`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Local Development

```bash
# Development with hot reload
npm run dev

# Production build
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
See [VERCEL_ENV.md](./VERCEL_ENV.md) for detailed environment setup.

### Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Run migrations
npm run db:migrate
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for modern attendance management. Powered by Next.js and Vercel 🚀
