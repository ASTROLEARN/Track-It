"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, Plus, Camera, CheckCircle, XCircle, AlertCircle, Wifi, WifiOff, Sparkles, Zap, Target, TrendingUp, BookOpen } from "lucide-react"
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
import { ThemeToggle } from "@/components/theme-toggle"

interface Class {
  id: string
  name: string
  description?: string
  startTime: string
  endTime: string
  daysOfWeek: string[]
  studentCount: number
}

interface Student {
  id: string
  name: string
  email: string
  attendanceStatus: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
}

interface AttendanceSession {
  id: string
  date: string
  isActive: boolean
  presentCount: number
  totalCount: number
}

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [sessions, setSessions] = useState<AttendanceSession[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false)
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false)
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    daysOfWeek: [] as string[]
  })

  const { 
    isConnected, 
    attendanceUpdates, 
    sessionUpdates, 
    joinClass, 
    joinSession,
    sendSessionUpdate,
    clearUpdates 
  } = useSocket()

  // Mock data for demonstration
  useEffect(() => {
    setClasses([
      {
        id: "1",
        name: "Computer Science 101",
        description: "Introduction to Programming",
        startTime: "09:00",
        endTime: "10:30",
        daysOfWeek: ["Monday", "Wednesday", "Friday"],
        studentCount: 25
      },
      {
        id: "2",
        name: "Mathematics 201",
        description: "Advanced Calculus",
        startTime: "11:00",
        endTime: "12:30",
        daysOfWeek: ["Tuesday", "Thursday"],
        studentCount: 18
      }
    ])

    setSessions([
      {
        id: "1",
        date: new Date().toISOString(),
        isActive: true,
        presentCount: 22,
        totalCount: 25
      },
      {
        id: "2",
        date: new Date(Date.now() - 86400000).toISOString(),
        isActive: false,
        presentCount: 20,
        totalCount: 25
      }
    ])
  }, [])

  useEffect(() => {
    if (selectedClass) {
      // Join class room for real-time updates
      joinClass(selectedClass)
      
      // Mock students data
      setStudents([
        { id: "1", name: "Alice Johnson", email: "alice@school.edu", attendanceStatus: "PRESENT" },
        { id: "2", name: "Bob Smith", email: "bob@school.edu", attendanceStatus: "ABSENT" },
        { id: "3", name: "Carol Williams", email: "carol@school.edu", attendanceStatus: "LATE" },
        { id: "4", name: "David Brown", email: "david@school.edu", attendanceStatus: "PRESENT" },
        { id: "5", name: "Eva Davis", email: "eva@school.edu", attendanceStatus: "EXCUSED" }
      ])
    }
  }, [selectedClass, joinClass])

  // Handle real-time updates
  useEffect(() => {
    if (attendanceUpdates.length > 0) {
      const latestUpdate = attendanceUpdates[attendanceUpdates.length - 1]
      // Update student status in real-time
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.id === latestUpdate.studentId
            ? { ...student, attendanceStatus: latestUpdate.status as any }
            : student
        )
      )
    }

    if (sessionUpdates.length > 0) {
      const latestUpdate = sessionUpdates[sessionUpdates.length - 1]
      // Update session counts in real-time
      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === latestUpdate.sessionId
            ? { 
                ...session, 
                presentCount: latestUpdate.presentCount,
                totalCount: latestUpdate.totalCount,
                isActive: latestUpdate.isActive
              }
            : session
        )
      )
    }
  }, [attendanceUpdates, sessionUpdates])

  const handleCreateClass = () => {
    const classData: Class = {
      id: Date.now().toString(),
      ...newClass,
      studentCount: 0
    }
    setClasses([...classes, classData])
    setNewClass({ name: "", description: "", startTime: "", endTime: "", daysOfWeek: [] })
    setIsCreateClassOpen(false)
  }

  const startAttendanceSession = () => {
    const newSession: AttendanceSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isActive: true,
      presentCount: 0,
      totalCount: students.length
    }
    setSessions([newSession, ...sessions])
    setIsAttendanceOpen(true)
    
    // Join session room for real-time updates
    joinSession(newSession.id)
    
    // Send session update via WebSocket
    sendSessionUpdate({
      sessionId: newSession.id,
      presentCount: 0,
      totalCount: students.length,
      isActive: true
    })
  }

  const updateAttendanceStatus = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, attendanceStatus: status } : student
    ))
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

  // Chart data
  const attendanceData = [
    { name: "Present", value: 87, color: "#10b981" },
    { name: "Late", value: 8, color: "#f59e0b" },
    { name: "Absent", value: 5, color: "#ef4444" }
  ]

  const weeklyData = [
    { name: "Mon", value: 92, color: "#8b5cf6" },
    { name: "Tue", value: 88, color: "#ec4899" },
    { name: "Wed", value: 95, color: "#06b6d4" },
    { name: "Thu", value: 85, color: "#10b981" },
    { name: "Fri", value: 90, color: "#f59e0b" }
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
            ) : (
              <><WifiOff className="w-4 h-4 text-red-500" /><span className="text-sm text-red-600 font-medium">Offline</span></>
            )}
            {attendanceUpdates.length > 0 && (
              <Badge variant="outline" className="ml-2 bg-orange-500/20 text-orange-700 border-orange-500/30">
                {attendanceUpdates.length} updates
              </Badge>
            )}
          </div>
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
              className="w-12 h-12 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Target className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 bg-clip-text text-transparent">
                Teacher Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Manage classes and track attendance with AI</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <AnimatedStats
            title="Total Students"
            value="43"
            change={5.2}
            icon={<Users className="w-6 h-6 text-orange-500" />}
          />
          <AnimatedStats
            title="Average Attendance"
            value="87.5%"
            change={2.1}
            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
          />
          <AnimatedStats
            title="Active Classes"
            value="3"
            change={0}
            icon={<Calendar className="w-6 h-6 text-blue-500" />}
          />
          <AnimatedStats
            title="AI Accuracy"
            value="94.2%"
            change={1.8}
            icon={<Zap className="w-6 h-6 text-yellow-500" />}
          />
        </motion.div>

        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="classes" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all">
              <Calendar className="w-4 h-4" />
              Classes
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all">
              <Camera className="w-4 h-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all">
              <Users className="w-4 h-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all">
              <Clock className="w-4 h-4" />
              Scheduler
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md transition-all">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-6">
            <motion.div 
              className="flex justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Classes</h2>
              <Dialog open={isCreateClassOpen} onOpenChange={setIsCreateClassOpen}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white font-semibold shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Class
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Create New Class</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                      Add a new class to your teaching schedule
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="class-name" className="text-gray-700 dark:text-gray-300 font-medium">Class Name</Label>
                      <Input
                        id="class-name"
                        value={newClass.name}
                        onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                        placeholder="Computer Science 101"
                        className="mt-2 bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="class-description" className="text-gray-700 dark:text-gray-300 font-medium">Description</Label>
                      <Textarea
                        id="class-description"
                        value={newClass.description}
                        onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                        placeholder="Introduction to Programming"
                        className="mt-2 bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-time" className="text-gray-700 dark:text-gray-300 font-medium">Start Time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={newClass.startTime}
                          onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
                          className="mt-2 bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-time" className="text-gray-700 dark:text-gray-300 font-medium">End Time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={newClass.endTime}
                          onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}
                          className="mt-2 bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button onClick={handleCreateClass} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg">
                        Create Class
                      </Button>
                    </motion.div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <ThreeDCard className="cursor-pointer">
                    <div className="text-center">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{classItem.name}</h3>
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-700 border-purple-500/30">
                          {classItem.studentCount} students
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">{classItem.description}</p>
                      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4" />
                          {classItem.startTime} - {classItem.endTime}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {classItem.daysOfWeek.join(", ")}
                        </div>
                      </div>
                      <motion.div 
                        className="mt-6"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg"
                          onClick={() => setSelectedClass(classItem.id)}
                        >
                          Manage Class
                        </Button>
                      </motion.div>
                    </div>
                  </ThreeDCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <motion.div 
              className="flex justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Sessions</h2>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={startAttendanceSession} 
                  disabled={!selectedClass}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Attendance
                </Button>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <GlassCard>
                    <div className="text-center">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {format(new Date(session.date), "MMM dd, yyyy")}
                        </h3>
                        {session.isActive && (
                          <Badge className="bg-green-500/20 text-green-700 border-green-500/30 animate-pulse">
                            Live
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">Attendance Session</p>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Present:</span>
                          <span className="font-semibold text-green-600">{session.presentCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Total:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{session.totalCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                          <span className="font-semibold text-purple-600">
                            {((session.presentCount / session.totalCount) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <AnimatedProgress
                        value={(session.presentCount / session.totalCount) * 100}
                        className="mt-4"
                        color="bg-gradient-to-r from-green-500 to-emerald-500"
                        showLabel
                        label="Attendance Rate"
                      />
                      <motion.div 
                        className="mt-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          className={`w-full font-semibold shadow-lg ${
                            session.isActive 
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white" 
                              : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
                          }`}
                        >
                          {session.isActive ? "View Live" : "View Details"}
                        </Button>
                      </motion.div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <motion.div 
              className="flex justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h2>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-64 bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {selectedClass ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard>
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Student List</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Manage attendance for {classes.find(c => c.id === selectedClass)?.name}
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Name</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Email</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Status</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student, index) => (
                            <motion.tr
                              key={student.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border-b border-gray-200 dark:border-gray-700"
                            >
                              <TableCell className="font-medium text-gray-900 dark:text-white py-4">
                                <div className="flex items-center gap-3">
                                  <ThreeDAttendanceIcon 
                                    type={student.attendanceStatus.toLowerCase() as any} 
                                    size={24} 
                                  />
                                  {student.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-600 dark:text-gray-400 py-4">{student.email}</TableCell>
                              <TableCell className="py-4">{getStatusBadge(student.attendanceStatus)}</TableCell>
                              <TableCell className="py-4">
                                <Select 
                                  value={student.attendanceStatus} 
                                  onValueChange={(value: any) => updateAttendanceStatus(student.id, value)}
                                >
                                  <SelectTrigger className="w-32 bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PRESENT">Present</SelectItem>
                                    <SelectItem value="ABSENT">Absent</SelectItem>
                                    <SelectItem value="LATE">Late</SelectItem>
                                    <SelectItem value="EXCUSED">Excused</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500 text-lg">Select a class to view students</p>
                    </div>
                  </CardContent>
                </GlassCard>
              </motion.div>
            )}
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

          <TabsContent value="analytics" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Attendance Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatedCharts
                  data={weeklyData}
                  title="Weekly Attendance Trends"
                  type="line"
                  icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
                />
                
                <AnimatedDonutChart
                  data={attendanceData}
                  title="Attendance Distribution"
                  size={200}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <GlassCard>
                  <div className="text-center p-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">94.2%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">AI Recognition Accuracy</div>
                    <AnimatedProgress value={94.2} className="mt-4" color="bg-gradient-to-r from-purple-500 to-pink-500" />
                  </div>
                </GlassCard>
                
                <GlassCard>
                  <div className="text-center p-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">87.5%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Attendance Rate</div>
                    <AnimatedProgress value={87.5} className="mt-4" color="bg-gradient-to-r from-green-500 to-emerald-500" />
                  </div>
                </GlassCard>
                
                <GlassCard>
                  <div className="text-center p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">98.7%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Student Satisfaction</div>
                    <AnimatedProgress value={98.7} className="mt-4" color="bg-gradient-to-r from-blue-500 to-cyan-500" />
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