"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, GraduationCap, Users, Calendar, Camera, BarChart3, Sparkles, Zap } from "lucide-react"
import TeacherDashboard from "@/components/teacher-dashboard"
import StudentDashboard from "@/components/student-dashboard"
import { Badge } from "@/components/ui/badge"
import { ThreeDCard } from "@/components/ui/3d-card"
import { ThreeDBackground } from "@/components/ui/3d-background"
import { ThreeDAttendanceIcon } from "@/components/ui/3d-attendance-icon"
import { AnimatedStats } from "@/components/ui/animated-stats"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeToggleIcon } from "@/components/theme-toggle-icon"
import { KeyboardShortcuts } from "@/components/accessibility/keyboard-shortcuts"
import { NotificationSystem } from "@/components/notifications/notification-system"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { GlobalSearch } from "@/components/search/global-search"

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
  }

  const handleLogin = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoggedIn(true)
    setIsLoading(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setSelectedRole("")
    setEmail("")
    setName("")
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen relative">
        <ThreeDBackground />
        <nav className="relative z-10 bg-white/10 dark:bg-black/20 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile Navigation */}
              <div className="flex items-center gap-2 md:hidden">
                <MobileNav 
                  userName={name || email}
                  userRole={selectedRole === "teacher" ? "Teacher" : "Student"}
                  onLogout={handleLogout}
                />
              </div>

              <motion.div 
                className="flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3 shadow-lg"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Calendar className="w-6 h-6 text-white" />
                </motion.div>
                <motion.h1 
                  className="text-xl font-bold bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  AI Attendance System
                </motion.h1>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <GlobalSearch />
                <NotificationSystem />
                <KeyboardShortcuts />
                <motion.span 
                  className="text-sm text-gray-600 dark:text-gray-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Welcome, {name || email}
                </motion.span>
                <Badge 
                  variant="outline" 
                  className="bg-white dark:bg-black border-orange-500 text-orange-700 dark:text-orange-300 font-medium"
                >
                  {selectedRole === "teacher" ? "Teacher" : "Student"}
                </Badge>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="bg-white/10 dark:bg-black/20 border-white/20 hover:bg-white/20"
                  >
                    Logout
                  </Button>
                </motion.div>
              </div>
              
              {/* Theme Toggle - Prominent Position */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-2 md:hidden">
                <GlobalSearch />
                <NotificationSystem />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
        {selectedRole === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ThreeDBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ThemeToggleIcon />
          
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            AI Attendance System
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Revolutionize attendance tracking with 
            <span className="font-semibold text-orange-600 dark:text-orange-400"> AI-powered </span>
            facial recognition and 
            <span className="font-semibold text-cyan-600 dark:text-cyan-400"> real-time analytics</span>
          </motion.p>
          
          <motion.div 
            className="flex justify-center items-center gap-2 text-orange-600 dark:text-orange-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-lg font-medium">Next-Generation Educational Technology</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <ThreeDCard className="transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <motion.div 
                className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Camera className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                AI Recognition
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Advanced facial recognition with 99.9% accuracy for secure and seamless attendance tracking
              </p>
              <div className="mt-4 flex justify-center">
                <ThreeDAttendanceIcon type="checking" size={40} />
              </div>
            </div>
          </ThreeDCard>

          <ThreeDCard className="transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <motion.div 
                className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <BarChart3 className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Smart Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Real-time insights powered by machine learning for attendance patterns and performance analytics
              </p>
              <div className="mt-4">
                <AnimatedStats
                  title="Accuracy Rate"
                  value="94.2%"
                  change={2.3}
                  icon={<Zap className="w-6 h-6 text-green-500" />}
                />
              </div>
            </div>
          </ThreeDCard>

          <ThreeDCard className="transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <motion.div 
                className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Users className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Easy Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Intuitive interface for teachers and students with real-time updates and mobile accessibility
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                <ThreeDAttendanceIcon type="present" size={30} />
                <ThreeDAttendanceIcon type="late" size={30} />
                <ThreeDAttendanceIcon type="absent" size={30} />
              </div>
            </div>
          </ThreeDCard>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          className="max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <ThreeDCard>
            <div className="p-8">
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Select your role to get started
                </p>
              </motion.div>

              <Tabs value={selectedRole} onValueChange={handleRoleSelect} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <TabsTrigger 
                    value="student" 
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Student
                  </TabsTrigger>
                  <TabsTrigger 
                    value="teacher" 
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all"
                  >
                    <User className="w-4 h-4" />
                    Teacher
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="student" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="student-email" className="text-gray-700 dark:text-gray-300 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="student@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="student-name" className="text-gray-700 dark:text-gray-300 font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="student-name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="teacher" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="teacher-email" className="text-gray-700 dark:text-gray-300 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="teacher-email"
                      type="email"
                      placeholder="teacher@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="teacher-name" className="text-gray-700 dark:text-gray-300 font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="teacher-name"
                      placeholder="Dr. Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </motion.div>
                </TabsContent>
              </Tabs>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={handleLogin}
                  disabled={!selectedRole || !email || isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size={20} color="white" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Continue as {selectedRole}</span>
                      <Zap className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </div>
          </ThreeDCard>
        </motion.div>
      </div>
    </div>
  )
}