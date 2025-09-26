"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Camera, CheckCircle, XCircle, AlertCircle, TrendingUp, Wifi, WifiOff, Sparkles, Zap, Target, Award, BookOpen, Brain, Clock as SchedulerIcon } from "lucide-react"
import { format } from "date-fns"
import { useSocket } from "@/hooks/use-socket"
import { ThreeDCard } from "@/components/ui/3d-card"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedStats } from "@/components/ui/animated-stats"
import { AnimatedProgress } from "@/components/ui/animated-progress"
import { AnimatedCharts, AnimatedDonutChart } from "@/components/ui/animated-charts"
import { ThreeDAttendanceIcon } from "@/components/ui/3d-attendance-icon"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SmartScheduler } from "@/components/scheduler/smart-scheduler"
import { SkillTracker } from "@/components/skills/skill-tracker"
import { CareerGoals } from "@/components/career/career-goals"
import { ThemeToggle } from "@/components/theme-toggle"

interface Class {
  id: string
  name: string
  description?: string
  teacher: string
  startTime: string
  endTime: string
  daysOfWeek: string[]
  nextClass?: string
}

interface AttendanceRecord {
  id: string
  className: string
  date: string
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
  method: "MANUAL" | "FACIAL_RECOGNITION" | "QR_CODE" | "BIOMETRIC"
  checkInTime?: string
}

interface AttendanceStats {
  totalClasses: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
  attendanceRate: number
}

export default function StudentDashboard() {
  const [classes, setClasses] = useState<Class[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats>({
    totalClasses: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    excusedCount: 0,
    attendanceRate: 0
  })
  const [isCheckingIn, setIsCheckingIn] = useState(false)

  const { 
    isConnected, 
    connectionError,
    aiUpdates, 
    joinClass, 
    sendAIRecognitionStart,
    sendAIRecognitionComplete 
  } = useSocket()

  useEffect(() => {
    // Mock classes data
    const mockClasses = [
      {
        id: "1",
        name: "Computer Science 101",
        description: "Introduction to Programming",
        teacher: "Dr. Smith",
        startTime: "09:00",
        endTime: "10:30",
        daysOfWeek: ["Monday", "Wednesday", "Friday"],
        nextClass: new Date(Date.now() + 86400000).toISOString()
      },
      {
        id: "2",
        name: "Mathematics 201",
        description: "Advanced Calculus",
        teacher: "Prof. Johnson",
        startTime: "11:00",
        endTime: "12:30",
        daysOfWeek: ["Tuesday", "Thursday"],
        nextClass: new Date(Date.now() + 172800000).toISOString()
      }
    ]
    setClasses(mockClasses)

    // Mock attendance data
    const attendanceData: AttendanceRecord[] = [
      {
        id: "1",
        className: "Computer Science 101",
        date: new Date().toISOString(),
        status: "PRESENT",
        method: "FACIAL_RECOGNITION",
        checkInTime: "09:05"
      },
      {
        id: "2",
        className: "Mathematics 201",
        date: new Date(Date.now() - 86400000).toISOString(),
        status: "LATE",
        method: "MANUAL",
        checkInTime: "11:15"
      },
      {
        id: "3",
        className: "Computer Science 101",
        date: new Date(Date.now() - 172800000).toISOString(),
        status: "PRESENT",
        method: "FACIAL_RECOGNITION",
        checkInTime: "09:02"
      },
      {
        id: "4",
        className: "Mathematics 201",
        date: new Date(Date.now() - 259200000).toISOString(),
        status: "ABSENT",
        method: "MANUAL"
      }
    ]
    setAttendance(attendanceData)

    // Calculate stats
    const totalClasses = attendanceData.length
    const presentCount = attendanceData.filter(a => a.status === "PRESENT").length
    const absentCount = attendanceData.filter(a => a.status === "ABSENT").length
    const lateCount = attendanceData.filter(a => a.status === "LATE").length
    const excusedCount = attendanceData.filter(a => a.status === "EXCUSED").length
    const attendanceRate = totalClasses > 0 ? ((presentCount + excusedCount) / totalClasses) * 100 : 0

    setStats({
      totalClasses,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      attendanceRate
    })
  }, [])

  // Join classes when WebSocket connection is established
  useEffect(() => {
    if (isConnected && classes.length > 0) {
      classes.forEach(classItem => {
        joinClass(classItem.id)
      })
    }
  }, [isConnected, classes, joinClass])

  // Handle real-time AI recognition updates
  useEffect(() => {
    if (aiUpdates.length > 0) {
      const latestUpdate = aiUpdates[aiUpdates.length - 1]
      if (latestUpdate.success) {
        // Add new attendance record for successful AI recognition
        const newRecord: AttendanceRecord = {
          id: Date.now().toString(),
          className: "Computer Science 101",
          date: new Date().toISOString(),
          status: "PRESENT",
          method: "FACIAL_RECOGNITION",
          checkInTime: new Date().toLocaleTimeString()
        }
        
        setAttendance(prev => [newRecord, ...prev])
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalClasses: prev.totalClasses + 1,
          presentCount: prev.presentCount + 1,
          attendanceRate: ((prev.presentCount + 1) / (prev.totalClasses + 1)) * 100
        }))
      }
    }
  }, [aiUpdates])

  const handleCheckIn = async () => {
    setIsCheckingIn(true)
    
    try {
      // Send AI recognition start event
      sendAIRecognitionStart({
        sessionId: "demo-session",
        studentId: "demo-student"
      })
      
      // Simulate AI facial recognition process
      setTimeout(() => {
        // Send AI recognition complete event
        sendAIRecognitionComplete({
          sessionId: "demo-session",
          studentId: "demo-student",
          success: true,
          confidence: 94.2
        })
        
        setIsCheckingIn(false)
      }, 2000)
    } catch (error) {
      console.error('Error during check-in:', error)
      // Even if WebSocket fails, simulate the check-in for demo purposes
      setTimeout(() => {
        // Add new attendance record manually
        const newRecord: AttendanceRecord = {
          id: Date.now().toString(),
          className: "Computer Science 101",
          date: new Date().toISOString(),
          status: "PRESENT",
          method: "FACIAL_RECOGNITION",
          checkInTime: new Date().toLocaleTimeString()
        }
        
        setAttendance(prev => [newRecord, ...prev])
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalClasses: prev.totalClasses + 1,
          presentCount: prev.presentCount + 1,
          attendanceRate: ((prev.presentCount + 1) / (prev.totalClasses + 1)) * 100
        }))
        
        setIsCheckingIn(false)
      }, 2000)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Present</Badge>
      case "ABSENT":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Absent</Badge>
      case "LATE":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Late</Badge>
      case "EXCUSED":
        return <Badge className="bg-blue-100 text-blue-800"><AlertCircle className="w-3 h-3 mr-1" />Excused</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "FACIAL_RECOGNITION":
        return <Badge variant="outline"><Camera className="w-3 h-3 mr-1" />AI Recognition</Badge>
      case "MANUAL":
        return <Badge variant="outline">Manual</Badge>
      case "QR_CODE":
        return <Badge variant="outline">QR Code</Badge>
      case "BIOMETRIC":
        return <Badge variant="outline">Biometric</Badge>
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  const getNextClass = () => {
    return classes.find(c => c.nextClass)
  }

  const nextClass = getNextClass()

  // Chart data
  const attendanceData = [
    { name: "Present", value: stats.presentCount, color: "#10b981" },
    { name: "Absent", value: stats.absentCount, color: "#ef4444" },
    { name: "Late", value: stats.lateCount, color: "#f59e0b" },
    { name: "Excused", value: stats.excusedCount, color: "#3b82f6" }
  ]

  const monthlyData = [
    { name: "Week 1", value: 85, color: "#8b5cf6" },
    { name: "Week 2", value: 92, color: "#ec4899" },
    { name: "Week 3", value: 88, color: "#06b6d4" },
    { name: "Week 4", value: 95, color: "#10b981" }
  ]

  return (
    <div className="min-h-screen relative">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-20 z-50">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-white/20 dark:border-gray-700">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Connection Status */}
      <div className="fixed top-4 right-4 z-50">
        <GlassCard className="p-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <><Wifi className="w-4 h-4 text-green-500" /><span className="text-sm text-green-600 font-medium">Live</span></>
            ) : connectionError ? (
              <><WifiOff className="w-4 h-4 text-red-500" /><span className="text-sm text-red-600 font-medium">Error</span></>
            ) : (
              <><WifiOff className="w-4 h-4 text-yellow-500" /><span className="text-sm text-yellow-600 font-medium">Connecting...</span></>
            )}
            {aiUpdates.length > 0 && (
              <Badge variant="outline" className="ml-2 bg-blue-500/20 text-blue-700 border-blue-500/30">
                {aiUpdates.length} AI events
              </Badge>
            )}
          </div>
          {connectionError && (
            <div className="text-xs text-red-600 mt-1 max-w-xs truncate">
              {connectionError}
            </div>
          )}
        </GlassCard>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Award className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Track your attendance and academic progress</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <ThreeDCard>
              <div className="text-center">
                <div className="mb-6">
                  <ThreeDAttendanceIcon type="checking" size={60} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Quick Check-in
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Use AI facial recognition to mark your attendance instantly
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={handleCheckIn} 
                    disabled={isCheckingIn}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingIn ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoadingSpinner size={16} color="white" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Camera className="w-4 h-4" />
                        <span>Check In Now</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </div>
            </ThreeDCard>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <ThreeDCard>
              <div className="text-center">
                <div className="mb-6">
                  <ThreeDAttendanceIcon type="present" size={60} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Next Class
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {nextClass ? "Your upcoming class schedule" : "No classes scheduled"}
                </p>
                {nextClass ? (
                  <div className="space-y-2 text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {nextClass.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      📅 {format(new Date(nextClass.nextClass!), "MMM dd, yyyy")}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      🕐 {nextClass.startTime} - {nextClass.endTime}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      👨‍🏫 {nextClass.teacher}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No upcoming classes</p>
                )}
              </div>
            </ThreeDCard>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <ThreeDCard>
              <div className="text-center">
                <div className="mb-6">
                  <motion.div 
                    className="w-16 h-16 mx-auto"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  >
                    <TrendingUp className="w-full h-full text-purple-500" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Attendance Rate
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Your overall attendance performance this semester
                </p>
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.attendanceRate.toFixed(1)}%
                  </div>
                  <AnimatedProgress 
                    value={stats.attendanceRate} 
                    color="bg-gradient-to-r from-purple-500 to-pink-500"
                    showLabel
                  />
                </div>
              </div>
            </ThreeDCard>
          </motion.div>
        </motion.div>

        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="classes" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all">
              <BookOpen className="w-4 h-4" />
              My Classes
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all">
              <Calendar className="w-4 h-4" />
              Attendance History
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all">
              <SchedulerIcon className="w-4 h-4" />
              Scheduler
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all">
              <Brain className="w-4 h-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="career" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all">
              <Target className="w-4 h-4" />
              Career
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all">
              <TrendingUp className="w-4 h-4" />
              My Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Classes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classes.map((classItem, index) => (
                  <motion.div
                    key={classItem.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <GlassCard>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{classItem.name}</h3>
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-700 border-blue-500/30">
                            Active
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{classItem.description}</p>
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {classItem.startTime} - {classItem.endTime}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {classItem.daysOfWeek.join(", ")}
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            {classItem.teacher}
                          </div>
                          {classItem.nextClass && (
                            <div className="flex items-center gap-2 text-blue-600 font-medium">
                              <Sparkles className="w-4 h-4" />
                              Next: {format(new Date(classItem.nextClass), "MMM dd, yyyy")}
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Attendance History</h2>
              <GlassCard>
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Recent Attendance</h3>
                    <p className="text-gray-600 dark:text-gray-400">Your attendance records for all classes</p>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Class</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Date</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Status</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Method</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Check-in Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendance.map((record, index) => (
                          <motion.tr
                            key={record.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-200 dark:border-gray-700"
                          >
                            <TableCell className="font-medium text-gray-900 dark:text-white py-4">
                              <div className="flex items-center gap-3">
                                <ThreeDAttendanceIcon 
                                  type={record.status.toLowerCase() as any} 
                                  size={20} 
                                />
                                {record.className}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                              {format(new Date(record.date), "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell className="py-4">{getStatusBadge(record.status)}</TableCell>
                            <TableCell className="py-4">{getMethodBadge(record.method)}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                              {record.checkInTime || "-"}
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </TabsContent>

          <TabsContent value="scheduler" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SmartScheduler />
            </motion.div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SkillTracker />
            </motion.div>
          </TabsContent>

          <TabsContent value="career" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CareerGoals />
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Analytics</h2>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AnimatedStats
                  title="Total Classes"
                  value={stats.totalClasses.toString()}
                  change={3.2}
                  icon={<BookOpen className="w-6 h-6 text-blue-500" />}
                />
                <AnimatedStats
                  title="Present"
                  value={stats.presentCount.toString()}
                  change={1.5}
                  icon={<CheckCircle className="w-6 h-6 text-green-500" />}
                />
                <AnimatedStats
                  title="Late"
                  value={stats.lateCount.toString()}
                  change={-0.8}
                  icon={<AlertCircle className="w-6 h-6 text-yellow-500" />}
                />
                <AnimatedStats
                  title="Absent"
                  value={stats.absentCount.toString()}
                  change={-2.1}
                  icon={<XCircle className="w-6 h-6 text-red-500" />}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <AnimatedDonutChart
                  data={attendanceData}
                  title="Attendance Distribution"
                  size={200}
                />
                <AnimatedCharts
                  data={monthlyData}
                  title="Monthly Progress"
                  type="bar"
                  icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
                />
              </div>

              {/* Progress Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard>
                  <div className="text-center p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {stats.attendanceRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Overall Attendance Rate
                    </div>
                    <AnimatedProgress 
                      value={stats.attendanceRate} 
                      color="bg-gradient-to-r from-blue-500 to-cyan-500"
                    />
                  </div>
                </GlassCard>
                
                <GlassCard>
                  <div className="text-center p-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {attendance.filter(a => a.method === "FACIAL_RECOGNITION").length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      AI Recognition Usage
                    </div>
                    <div className="flex justify-center">
                      <ThreeDAttendanceIcon type="checking" size={40} />
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard>
                  <div className="text-center p-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {classes.find(c => c.name === "Computer Science 101")?.name || "CS 101"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Most Attended Class
                    </div>
                    <div className="flex justify-center">
                      <Award className="w-10 h-10 text-purple-500" />
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}