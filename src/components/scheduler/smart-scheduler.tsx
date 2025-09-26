"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  Plus, 
  Filter, 
  Search, 
  Brain, 
  AlertCircle,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Target,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedProgress } from "@/components/ui/animated-progress"
import { toast } from "sonner"

interface ScheduleItem {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  type: 'class' | 'study' | 'exam' | 'meeting' | 'break'
  priority: 'low' | 'medium' | 'high'
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  aiOptimized: boolean
  skills: string[]
  careerGoals: string[]
  reminders: number[]
}

interface AISuggestion {
  id: string
  type: 'time_slot' | 'study_break' | 'skill_alignment' | 'goal_progression'
  title: string
  description: string
  confidence: number
  impact: 'low' | 'medium' | 'high'
}

const scheduleTypes = [
  { value: 'class', label: 'Class', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
  { value: 'study', label: 'Study', color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
  { value: 'exam', label: 'Exam', color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
  { value: 'meeting', label: 'Meeting', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' },
  { value: 'break', label: 'Break', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
]

const priorityLevels = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
  { value: 'high', label: 'High', color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
]

export function SmartScheduler() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

  // Sample data
  useEffect(() => {
    const sampleSchedule: ScheduleItem[] = [
      {
        id: '1',
        title: 'Computer Science 101',
        description: 'Introduction to Programming',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '10:30',
        type: 'class',
        priority: 'high',
        status: 'scheduled',
        aiOptimized: true,
        skills: ['Programming', 'Problem Solving'],
        careerGoals: ['Software Developer'],
        reminders: [30, 15]
      },
      {
        id: '2',
        title: 'Study Session - Algorithms',
        description: 'Review sorting algorithms',
        date: '2024-01-15',
        startTime: '14:00',
        endTime: '16:00',
        type: 'study',
        priority: 'medium',
        status: 'scheduled',
        aiOptimized: true,
        skills: ['Algorithms', 'Data Structures'],
        careerGoals: ['Software Developer'],
        reminders: [60]
      },
      {
        id: '3',
        title: 'Career Planning Meeting',
        description: 'Discuss career path with advisor',
        date: '2024-01-16',
        startTime: '11:00',
        endTime: '12:00',
        type: 'meeting',
        priority: 'high',
        status: 'scheduled',
        aiOptimized: false,
        skills: ['Communication', 'Planning'],
        careerGoals: ['Team Lead'],
        reminders: [30, 15]
      }
    ]

    const sampleSuggestions: AISuggestion[] = [
      {
        id: '1',
        type: 'time_slot',
        title: 'Optimal Study Time',
        description: 'Based on your performance patterns, 2:00-4:00 PM is your most productive study time',
        confidence: 85,
        impact: 'high'
      },
      {
        id: '2',
        type: 'study_break',
        title: 'Recommended Break',
        description: 'Add a 15-minute break after your Algorithms study session for better retention',
        confidence: 92,
        impact: 'medium'
      },
      {
        id: '3',
        type: 'skill_alignment',
        title: 'Skill Development Opportunity',
        description: 'Schedule additional Python practice to align with Software Developer goals',
        confidence: 78,
        impact: 'high'
      }
    ]

    setSchedule(sampleSchedule)
    setAiSuggestions(sampleSuggestions)
  }, [])

  const filteredSchedule = schedule.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    return matchesSearch && matchesType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      case 'cancelled':
        return <X className="w-4 h-4 text-red-600 dark:text-red-400" />
      default:
        return <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400'
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const applyAISuggestion = (suggestion: AISuggestion) => {
    toast.success(`AI suggestion applied: ${suggestion.title}`)
    // In a real app, this would update the schedule based on the suggestion
  }

  const ScheduleItemCard = ({ item }: { item: ScheduleItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {getStatusIcon(item.status)}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {item.aiOptimized && (
            <Badge className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
              <Brain className="w-3 h-3 mr-1" />
              AI Optimized
            </Badge>
          )}
          <Badge className={priorityLevels.find(p => p.value === item.priority)?.color}>
            {item.priority}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{item.date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{item.startTime} - {item.endTime}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <Badge className={scheduleTypes.find(t => t.value === item.type)?.color}>
          {scheduleTypes.find(t => t.value === item.type)?.label}
        </Badge>
        {item.skills.map((skill, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {skill}
          </Badge>
        ))}
        {item.careerGoals.map((goal, index) => (
          <Badge key={index} variant="outline" className="text-xs border-green-500 text-green-700 dark:text-green-400">
            <Target className="w-2 h-2 mr-1" />
            {goal}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AnimatedProgress value={item.status === 'completed' ? 100 : item.status === 'in-progress' ? 50 : 0} className="w-20" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {item.status.replace('-', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingItem(item)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSchedule(prev => prev.filter(i => i.id !== item.id))
              toast.success('Schedule item removed')
            }}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Smart Scheduler
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    AI-powered scheduling optimized for your skills and career goals
                  </p>
                </div>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Schedule Item</DialogTitle>
                    <DialogDescription>
                      Create a new schedule item with AI optimization
                    </DialogDescription>
                  </DialogHeader>
                  {/* Add form content here */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="Enter title" />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {scheduleTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Enter description" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input id="startTime" type="time" />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input id="endTime" type="time" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddDialogOpen(false)}>
                        Add Schedule
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Items</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{schedule.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">AI Optimized</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {schedule.filter(item => item.aiOptimized).length}
                      </p>
                    </div>
                    <Brain className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {schedule.filter(item => item.status === 'completed').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">High Priority</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {schedule.filter(item => item.priority === 'high').length}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
              <Brain className="w-5 h-5" />
              AI Suggestions
            </CardTitle>
            <CardDescription className="text-purple-700 dark:text-purple-300">
              Intelligent recommendations to optimize your schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {suggestion.title}
                      </h4>
                      <Badge className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}>
                        {suggestion.confidence}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Impact: {suggestion.impact}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => applyAISuggestion(suggestion)}
                        className="text-xs bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="schedule" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search schedule items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-black border-gray-300 dark:border-gray-600"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-black border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {scheduleTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                Calendar
              </Button>
            </div>
          </div>

          {/* Schedule Items */}
          <div className="space-y-4">
            {filteredSchedule.length === 0 ? (
              <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">No schedule items found</p>
                </CardContent>
              </Card>
            ) : (
              filteredSchedule.map((item) => (
                <ScheduleItemCard key={item.id} item={item} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Schedule Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">Completion Rate</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <AnimatedProgress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">AI Optimization Rate</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <AnimatedProgress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">Goal Alignment</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <AnimatedProgress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scheduleTypes.map(type => {
                    const count = schedule.filter(item => item.type === type.value).length
                    const percentage = schedule.length > 0 ? (count / schedule.length) * 100 : 0
                    return (
                      <div key={type.value}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-300">{type.label}</span>
                          <span className="font-medium">{percentage.toFixed(0)}%</span>
                        </div>
                        <AnimatedProgress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}