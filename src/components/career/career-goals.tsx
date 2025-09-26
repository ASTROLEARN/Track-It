"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Target, 
  TrendingUp, 
  Award, 
  Plus, 
  Search, 
  Filter,
  Brain,
  Calendar,
  BarChart3,
  Star,
  Briefcase,
  Users,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  MapPin,
  Clock,
  Zap,
  BookOpen,
  Code,
  Palette
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
import { AnimatedCharts } from "@/components/ui/animated-charts"
import { toast } from "sonner"

interface CareerGoal {
  id: string
  title: string
  description: string
  category: 'technical' | 'management' | 'entrepreneurship' | 'academic' | 'creative'
  targetDate: Date
  priority: 'low' | 'medium' | 'high'
  status: 'planning' | 'in-progress' | 'achieved' | 'on-hold'
  progress: number
  requiredSkills: string[]
  currentSkills: string[]
  milestones: CareerMilestone[]
  roadmap: RoadmapStep[]
  aiInsights: AIInsight[]
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  marketDemand: 'low' | 'medium' | 'high'
  alignmentScore: number
}

interface CareerMilestone {
  id: string
  title: string
  description: string
  targetDate: Date
  completed: boolean
  completedDate?: Date
  dependencies: string[]
  skills: string[]
}

interface RoadmapStep {
  id: string
  title: string
  description: string
  duration: string
  order: number
  status: 'not-started' | 'in-progress' | 'completed'
  skills: string[]
  resources: string[]
  estimatedCost?: number
}

interface AIInsight {
  id: string
  type: 'skill_gap' | 'market_trend' | 'career_path' | 'recommendation'
  title: string
  description: string
  confidence: number
  priority: 'low' | 'medium' | 'high'
  actionable: boolean
}

interface CareerPath {
  id: string
  title: string
  description: string
  industry: string
  requiredExperience: string
  growthPotential: 'low' | 'medium' | 'high'
  averageSalary: number
  demandLevel: 'low' | 'medium' | 'high'
  keySkills: string[]
  alignmentWithGoals: number
}

const goalCategories = [
  { value: 'technical', label: 'Technical', icon: Code, color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
  { value: 'management', label: 'Management', icon: Users, color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
  { value: 'entrepreneurship', label: 'Entrepreneurship', icon: Briefcase, color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' },
  { value: 'academic', label: 'Academic', icon: BookOpen, color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
  { value: 'creative', label: 'Creative', icon: Palette, color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
]

const priorityLevels = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
  { value: 'high', label: 'High', color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
]

const demandLevels = [
  { value: 'low', label: 'Low Demand', color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
  { value: 'medium', label: 'Medium Demand', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
  { value: 'high', label: 'High Demand', color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
]

export function CareerGoals() {
  const [goals, setGoals] = useState<CareerGoal[]>([])
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([])
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [selectedGoal, setSelectedGoal] = useState<CareerGoal | null>(null)

  useEffect(() => {
    const sampleGoals: CareerGoal[] = [
      {
        id: '1',
        title: 'Senior Software Developer',
        description: 'Become a senior software developer at a tech company',
        category: 'technical',
        targetDate: new Date('2025-06-01'),
        priority: 'high',
        status: 'in-progress',
        progress: 65,
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'System Design', 'Team Leadership'],
        currentSkills: ['JavaScript', 'React', 'Node.js'],
        milestones: [
          {
            id: '1',
            title: 'Master Advanced JavaScript',
            description: 'Complete advanced JavaScript course and build complex projects',
            targetDate: new Date('2024-03-01'),
            completed: true,
            completedDate: new Date('2024-02-15'),
            dependencies: [],
            skills: ['JavaScript']
          },
          {
            id: '2',
            title: 'Learn System Design',
            description: 'Study system design principles and complete case studies',
            targetDate: new Date('2024-06-01'),
            completed: false,
            dependencies: ['1'],
            skills: ['System Design']
          },
          {
            id: '3',
            title: 'Gain Leadership Experience',
            description: 'Lead a project team and mentor junior developers',
            targetDate: new Date('2024-12-01'),
            completed: false,
            dependencies: ['2'],
            skills: ['Team Leadership', 'Communication']
          }
        ],
        roadmap: [
          {
            id: '1',
            title: 'Frontend Mastery',
            description: 'Master frontend technologies and frameworks',
            duration: '3 months',
            order: 1,
            status: 'completed',
            skills: ['JavaScript', 'React'],
            resources: ['Advanced React Course', 'Frontend Masters'],
            estimatedCost: 200
          },
          {
            id: '2',
            title: 'Backend Development',
            description: 'Learn backend technologies and API design',
            duration: '4 months',
            order: 2,
            status: 'in-progress',
            skills: ['Node.js', 'Database Design'],
            resources: ['Node.js Course', 'Database Design Book'],
            estimatedCost: 300
          },
          {
            id: '3',
            title: 'Architecture & Leadership',
            description: 'Study system architecture and develop leadership skills',
            duration: '6 months',
            order: 3,
            status: 'not-started',
            skills: ['System Design', 'Team Leadership'],
            resources: ['System Design Interview', 'Leadership Books'],
            estimatedCost: 150
          }
        ],
        aiInsights: [
          {
            id: '1',
            type: 'skill_gap',
            title: 'System Design Gap',
            description: 'Focus on system design as it\'s crucial for senior roles',
            confidence: 92,
            priority: 'high',
            actionable: true
          },
          {
            id: '2',
            type: 'market_trend',
            title: 'High Demand for Full Stack',
            description: 'Full stack developers are in high demand with better salary prospects',
            confidence: 88,
            priority: 'medium',
            actionable: true
          }
        ],
        salaryRange: {
          min: 80000,
          max: 120000,
          currency: 'USD'
        },
        marketDemand: 'high',
        alignmentScore: 95
      },
      {
        id: '2',
        title: 'Data Scientist',
        description: 'Transition to a data scientist role in the tech industry',
        category: 'technical',
        targetDate: new Date('2025-12-01'),
        priority: 'medium',
        status: 'planning',
        progress: 25,
        requiredSkills: ['Python', 'Statistics', 'Machine Learning', 'Data Analysis', 'SQL'],
        currentSkills: ['Python', 'Statistics'],
        milestones: [
          {
            id: '1',
            title: 'Learn Machine Learning',
            description: 'Complete machine learning course and build ML projects',
            targetDate: new Date('2024-09-01'),
            completed: false,
            dependencies: [],
            skills: ['Machine Learning']
          }
        ],
        roadmap: [
          {
            id: '1',
            title: 'Data Analysis Fundamentals',
            description: 'Master data analysis with Python and SQL',
            duration: '4 months',
            order: 1,
            status: 'in-progress',
            skills: ['Python', 'SQL'],
            resources: ['Data Analysis Course', 'SQL Tutorial'],
            estimatedCost: 250
          }
        ],
        aiInsights: [
          {
            id: '1',
            type: 'career_path',
            title: 'Growing Field',
            description: 'Data science is a rapidly growing field with excellent opportunities',
            confidence: 95,
            priority: 'high',
            actionable: true
          }
        ],
        salaryRange: {
          min: 90000,
          max: 140000,
          currency: 'USD'
        },
        marketDemand: 'high',
        alignmentScore: 78
      },
      {
        id: '3',
        title: 'Technical Team Lead',
        description: 'Lead a technical team and manage projects',
        category: 'management',
        targetDate: new Date('2026-01-01'),
        priority: 'high',
        status: 'planning',
        progress: 15,
        requiredSkills: ['Project Management', 'Team Leadership', 'Communication', 'Technical Strategy', 'Mentoring'],
        currentSkills: ['Communication'],
        milestones: [
          {
            id: '1',
            title: 'Develop Leadership Skills',
            description: 'Take on leadership roles and study management principles',
            targetDate: new Date('2024-08-01'),
            completed: false,
            dependencies: [],
            skills: ['Team Leadership', 'Project Management']
          }
        ],
        roadmap: [
          {
            id: '1',
            title: 'Leadership Foundation',
            description: 'Build foundation in leadership and management',
            duration: '6 months',
            order: 1,
            status: 'not-started',
            skills: ['Team Leadership', 'Project Management'],
            resources: ['Leadership Books', 'Management Course'],
            estimatedCost: 400
          }
        ],
        aiInsights: [
          {
            id: '1',
            type: 'recommendation',
            title: 'Start Small Projects',
            description: 'Begin by leading small projects to gain experience',
            confidence: 87,
            priority: 'high',
            actionable: true
          }
        ],
        salaryRange: {
          min: 100000,
          max: 150000,
          currency: 'USD'
        },
        marketDemand: 'high',
        alignmentScore: 82
      }
    ]

    const sampleCareerPaths: CareerPath[] = [
      {
        id: '1',
        title: 'Software Engineering Manager',
        description: 'Lead software development teams and projects',
        industry: 'Technology',
        requiredExperience: '5+ years',
        growthPotential: 'high',
        averageSalary: 130000,
        demandLevel: 'high',
        keySkills: ['Leadership', 'System Design', 'Project Management', 'Communication'],
        alignmentWithGoals: 95
      },
      {
        id: '2',
        title: 'Data Science Manager',
        description: 'Lead data science teams and analytics projects',
        industry: 'Technology',
        requiredExperience: '4+ years',
        growthPotential: 'high',
        averageSalary: 140000,
        demandLevel: 'high',
        keySkills: ['Machine Learning', 'Team Leadership', 'Statistics', 'Communication'],
        alignmentWithGoals: 88
      },
      {
        id: '3',
        title: 'Principal Software Engineer',
        description: 'Senior technical role with architectural responsibilities',
        industry: 'Technology',
        requiredExperience: '7+ years',
        growthPotential: 'medium',
        averageSalary: 160000,
        demandLevel: 'high',
        keySkills: ['System Design', 'Architecture', 'Mentoring', 'Technical Strategy'],
        alignmentWithGoals: 92
      }
    ]

    setGoals(sampleGoals)
    setCareerPaths(sampleCareerPaths)
  }, [])

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || goal.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'text-green-600 dark:text-green-400'
      case 'in-progress':
        return 'text-blue-600 dark:text-blue-400'
      case 'on-hold':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400'
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newProgress = Math.max(0, Math.min(100, progress))
        let newStatus = goal.status
        if (newProgress === 100) newStatus = 'achieved'
        else if (newProgress > 0) newStatus = 'in-progress'
        else newStatus = 'planning'
        
        return { ...goal, progress: newProgress, status: newStatus }
      }
      return goal
    }))
    toast.success('Goal progress updated!')
  }

  const completeMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          milestones: goal.milestones.map(milestone => 
            milestone.id === milestoneId 
              ? { ...milestone, completed: true, completedDate: new Date() }
              : milestone
          )
        }
      }
      return goal
    }))
    toast.success('Milestone completed! Great progress!')
  }

  const GoalCard = ({ goal }: { goal: CareerGoal }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${goalCategories.find(c => c.value === goal.category)?.color}`}>
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{goal.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{goal.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={priorityLevels.find(p => p.value === goal.priority)?.color}>
            {goal.priority}
          </Badge>
          <Badge className={getStatusColor(goal.status)}>
            {goal.status.replace('-', ' ')}
          </Badge>
          <Badge className={demandLevels.find(d => d.value === goal.marketDemand)?.color}>
            {goal.marketDemand} demand
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <AnimatedProgress value={goal.progress} className="h-3" />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Target: {goal.targetDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            <span>{goal.salaryRange.currency} {goal.salaryRange.min.toLocaleString()} - {goal.salaryRange.max.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Skills:</p>
          <div className="flex flex-wrap gap-2">
            {goal.requiredSkills.map((skill, index) => {
              const hasSkill = goal.currentSkills.includes(skill)
              return (
                <Badge 
                  key={index} 
                  variant={hasSkill ? "default" : "outline"}
                  className={hasSkill ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "text-xs"}
                >
                  {skill}
                  {hasSkill && <CheckCircle className="w-3 h-3 ml-1" />}
                </Badge>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Star className="w-4 h-4" />
            <span>{goal.alignmentScore}% alignment</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedGoal(goal)}
            >
              View Details
            </Button>
            <Button
              size="sm"
              onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 10))}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Zap className="w-4 h-4 mr-1" />
              Update Progress
            </Button>
          </div>
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
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Career Goals
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Plan and track your career progression with AI-powered insights and roadmap planning
                  </p>
                </div>
              </div>
              <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Career Goal</DialogTitle>
                    <DialogDescription>
                      Define a new career goal to work towards
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="goalTitle">Goal Title</Label>
                        <Input id="goalTitle" placeholder="e.g., Senior Software Developer" />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {goalCategories.map(category => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe your career goal" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="targetDate">Target Date</Label>
                        <Input id="targetDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityLevels.map(priority => (
                              <SelectItem key={priority.value} value={priority.value}>
                                {priority.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddGoalOpen(false)}>
                        Add Goal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Goals</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</p>
                    </div>
                    <Target className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">In Progress</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {goals.filter(g => g.status === 'in-progress').length}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Achieved</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {goals.filter(g => g.status === 'achieved').length}
                      </p>
                    </div>
                    <Award className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Avg Alignment</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.alignmentScore, 0) / goals.length) : 0}%
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="goals" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md">
            My Goals
          </TabsTrigger>
          <TabsTrigger value="career-paths" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md">
            Career Paths
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search career goals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-black border-gray-300 dark:border-gray-600"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-black border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {goalCategories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="career-paths" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerPaths.map((path) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{path.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{path.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {path.industry}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        💰 ${path.averageSalary.toLocaleString()}
                      </Badge>
                      <Badge className={demandLevels.find(d => d.value === path.demandLevel)?.color}>
                        {path.demandLevel} demand
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Experience Required</span>
                      <span className="font-medium">{path.requiredExperience}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Growth Potential</span>
                      <span className="font-medium">{path.growthPotential}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Goal Alignment</span>
                      <span className="font-medium">{path.alignmentWithGoals}%</span>
                    </div>
                    <AnimatedProgress value={path.alignmentWithGoals} className="h-2" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {path.keySkills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Explore Path
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Goal Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Goals on Track</span>
                      <span className="font-medium">
                        {goals.filter(g => g.progress >= 70).length} / {goals.length}
                      </span>
                    </div>
                    <AnimatedProgress 
                      value={goals.length > 0 ? (goals.filter(g => g.progress >= 70).length / goals.length) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Average Progress</span>
                      <span className="font-medium">
                        {goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0}%
                      </span>
                    </div>
                    <AnimatedProgress 
                      value={goals.length > 0 ? (goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">High Priority Goals</span>
                      <span className="font-medium">
                        {goals.filter(g => g.priority === 'high').length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">High Demand Goals</span>
                      <span className="font-medium">
                        {goals.filter(g => g.marketDemand === 'high').length} / {goals.length}
                      </span>
                    </div>
                    <AnimatedProgress 
                      value={goals.length > 0 ? (goals.filter(g => g.marketDemand === 'high').length / goals.length) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Average Salary Potential</span>
                      <span className="font-medium">
                        {goals.length > 0 ? `$${Math.round(goals.reduce((sum, goal) => sum + (goal.salaryRange.min + goal.salaryRange.max) / 2, 0) / goals.length).toLocaleString()}` : '$0'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Alignment Score</span>
                      <span className="font-medium">
                        {goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.alignmentScore, 0) / goals.length) : 0}%
                      </span>
                    </div>
                    <AnimatedProgress 
                      value={goals.length > 0 ? (goals.reduce((sum, goal) => sum + goal.alignmentScore, 0) / goals.length) : 0} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}