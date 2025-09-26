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
  Zap,
  Calendar,
  BarChart3,
  Star,
  BookOpen,
  Code,
  Palette,
  Users,
  Lightbulb,
  CheckCircle,
  AlertCircle
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

interface Skill {
  id: string
  name: string
  category: 'technical' | 'soft' | 'creative' | 'leadership' | 'analytical'
  level: number // 0-100
  targetLevel: number
  description: string
  tags: string[]
  relatedGoals: string[]
  lastPracticed: Date
  practiceStreak: number
  milestones: SkillMilestone[]
  aiRecommendations: AIRecommendation[]
}

interface SkillMilestone {
  id: string
  title: string
  description: string
  targetLevel: number
  completed: boolean
  completedDate?: Date
  resources: string[]
}

interface AIRecommendation {
  id: string
  type: 'practice' | 'resource' | 'milestone' | 'skill_connection'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  estimatedTime: string
  confidence: number
}

interface LearningPath {
  id: string
  title: string
  description: string
  skills: string[]
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  progress: number
  careerAlignment: number
}

const skillCategories = [
  { value: 'technical', label: 'Technical', icon: Code, color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
  { value: 'soft', label: 'Soft Skills', icon: Users, color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
  { value: 'creative', label: 'Creative', icon: Palette, color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' },
  { value: 'leadership', label: 'Leadership', icon: Star, color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
  { value: 'analytical', label: 'Analytical', icon: BarChart3, color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
]

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
]

export function SkillTracker() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  useEffect(() => {
    const sampleSkills: Skill[] = [
      {
        id: '1',
        name: 'JavaScript',
        category: 'technical',
        level: 75,
        targetLevel: 90,
        description: 'Modern JavaScript development including ES6+ features',
        tags: ['Programming', 'Web Development', 'Frontend'],
        relatedGoals: ['Software Developer', 'Full Stack Developer'],
        lastPracticed: new Date('2024-01-14'),
        practiceStreak: 12,
        milestones: [
          {
            id: '1',
            title: 'Basic Syntax',
            description: 'Master JavaScript fundamentals',
            targetLevel: 30,
            completed: true,
            completedDate: new Date('2024-01-01'),
            resources: ['MDN JavaScript Guide', 'JavaScript.info']
          },
          {
            id: '2',
            title: 'ES6+ Features',
            description: 'Learn modern JavaScript features',
            targetLevel: 60,
            completed: true,
            completedDate: new Date('2024-01-10'),
            resources: ['ES6 for Everyone', 'Modern JavaScript Tutorial']
          },
          {
            id: '3',
            title: 'Advanced Patterns',
            description: 'Master advanced JavaScript patterns and best practices',
            targetLevel: 85,
            completed: false,
            resources: ['JavaScript Design Patterns', 'Clean Code JavaScript']
          }
        ],
        aiRecommendations: [
          {
            id: '1',
            type: 'practice',
            title: 'Build a React Project',
            description: 'Apply JavaScript skills by building a React application',
            priority: 'high',
            estimatedTime: '2 weeks',
            confidence: 88
          },
          {
            id: '2',
            type: 'resource',
            title: 'Advanced JavaScript Course',
            description: 'Take an advanced JavaScript course on platforms like Udemy or Coursera',
            priority: 'medium',
            estimatedTime: '4 weeks',
            confidence: 92
          }
        ]
      },
      {
        id: '2',
        name: 'Communication',
        category: 'soft',
        level: 60,
        targetLevel: 85,
        description: 'Effective verbal and written communication skills',
        tags: ['Soft Skills', 'Teamwork', 'Presentation'],
        relatedGoals: ['Team Lead', 'Project Manager'],
        lastPracticed: new Date('2024-01-13'),
        practiceStreak: 8,
        milestones: [
          {
            id: '1',
            title: 'Public Speaking',
            description: 'Comfortably speak in front of groups',
            targetLevel: 40,
            completed: true,
            completedDate: new Date('2023-12-15'),
            resources: ['Toastmasters', 'Presentation Skills Course']
          },
          {
            id: '2',
            title: 'Written Communication',
            description: 'Write clear and concise emails and documentation',
            targetLevel: 70,
            completed: false,
            resources: ['Business Writing Course', 'Technical Writing Guide']
          }
        ],
        aiRecommendations: [
          {
            id: '1',
            type: 'practice',
            title: 'Join a Debate Club',
            description: 'Practice communication skills through structured debates',
            priority: 'medium',
            estimatedTime: '3 months',
            confidence: 75
          }
        ]
      },
      {
        id: '3',
        name: 'Data Analysis',
        category: 'analytical',
        level: 45,
        targetLevel: 80,
        description: 'Statistical analysis and data interpretation',
        tags: ['Analytics', 'Statistics', 'Data Science'],
        relatedGoals: ['Data Scientist', 'Business Analyst'],
        lastPracticed: new Date('2024-01-12'),
        practiceStreak: 5,
        milestones: [
          {
            id: '1',
            title: 'Basic Statistics',
            description: 'Understand fundamental statistical concepts',
            targetLevel: 50,
            completed: false,
            resources: ['Statistics for Beginners', 'Khan Academy Statistics']
          }
        ],
        aiRecommendations: [
          {
            id: '1',
            type: 'resource',
            title: 'Python for Data Analysis',
            description: 'Learn Python libraries like Pandas and NumPy',
            priority: 'high',
            estimatedTime: '6 weeks',
            confidence: 90
          }
        ]
      }
    ]

    const sampleLearningPaths: LearningPath[] = [
      {
        id: '1',
        title: 'Full Stack Web Development',
        description: 'Complete path to becoming a full stack developer',
        skills: ['JavaScript', 'React', 'Node.js', 'Database Design'],
        duration: '6 months',
        difficulty: 'intermediate',
        progress: 65,
        careerAlignment: 95
      },
      {
        id: '2',
        title: 'Data Science Fundamentals',
        description: 'Essential skills for data science and analytics',
        skills: ['Python', 'Statistics', 'Data Analysis', 'Machine Learning'],
        duration: '8 months',
        difficulty: 'advanced',
        progress: 30,
        careerAlignment: 88
      },
      {
        id: '3',
        title: 'Technical Leadership',
        description: 'Develop skills for technical leadership roles',
        skills: ['Communication', 'Project Management', 'System Design', 'Team Building'],
        duration: '4 months',
        difficulty: 'advanced',
        progress: 45,
        careerAlignment: 82
      }
    ]

    setSkills(sampleSkills)
    setLearningPaths(sampleLearningPaths)
  }, [])

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = filterCategory === "all" || skill.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getSkillIcon = (category: string) => {
    const categoryInfo = skillCategories.find(c => c.value === category)
    const Icon = categoryInfo?.icon || Target
    return <Icon className="w-5 h-5" />
  }

  const getLevelColor = (level: number) => {
    if (level >= 80) return 'text-green-600 dark:text-green-400'
    if (level >= 60) return 'text-yellow-600 dark:text-yellow-400'
    if (level >= 40) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400'
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const practiceSkill = (skillId: string) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === skillId) {
        const newLevel = Math.min(100, skill.level + 2)
        const newStreak = skill.practiceStreak + 1
        return {
          ...skill,
          level: newLevel,
          lastPracticed: new Date(),
          practiceStreak: newStreak
        }
      }
      return skill
    }))
    toast.success('Skill practiced! Progress updated.')
  }

  const completeMilestone = (skillId: string, milestoneId: string) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === skillId) {
        return {
          ...skill,
          milestones: skill.milestones.map(milestone => 
            milestone.id === milestoneId 
              ? { ...milestone, completed: true, completedDate: new Date() }
              : milestone
          )
        }
      }
      return skill
    }))
    toast.success('Milestone completed! Great job!')
  }

  const SkillCard = ({ skill }: { skill: Skill }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${skillCategories.find(c => c.value === skill.category)?.color}`}>
            {getSkillIcon(skill.category)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{skill.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{skill.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getLevelColor(skill.level)}>
            Level {Math.round(skill.level)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            🔥 {skill.practiceStreak} day streak
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="font-medium">{Math.round(skill.level)}% / {skill.targetLevel}%</span>
          </div>
          <div className="relative">
            <AnimatedProgress value={skill.level} className="h-3" />
            <div 
              className="absolute top-0 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-60"
              style={{ width: `${skill.targetLevel}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {skill.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>Practiced {skill.lastPracticed.toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => practiceSkill(skill.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Zap className="w-4 h-4 mr-1" />
              Practice
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedSkill(skill)}
            >
              View Details
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
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Skill Tracker
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Track your skill development with AI-powered insights and recommendations
                  </p>
                </div>
              </div>
              <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                    <DialogDescription>
                      Add a new skill to track your progress
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="skillName">Skill Name</Label>
                        <Input id="skillName" placeholder="Enter skill name" />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {skillCategories.map(category => (
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
                      <Textarea id="description" placeholder="Enter description" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddSkillOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddSkillOpen(false)}>
                        Add Skill
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
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Skills</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{skills.length}</p>
                    </div>
                    <Target className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Average Level</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {skills.length > 0 ? Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length) : 0}%
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
                      <p className="text-sm text-gray-600 dark:text-gray-300">Active Streaks</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {skills.filter(s => s.practiceStreak > 0).length}
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Milestones</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {skills.reduce((sum, skill) => sum + skill.milestones.filter(m => m.completed).length, 0)}
                      </p>
                    </div>
                    <Award className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="skills" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md">
            My Skills
          </TabsTrigger>
          <TabsTrigger value="learning-paths" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md">
            Learning Paths
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search skills..."
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
                {skillCategories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learning-paths" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
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
                      <Badge className={difficultyLevels.find(d => d.value === path.difficulty)?.color}>
                        {path.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        📅 {path.duration}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Progress</span>
                      <span className="font-medium">{path.progress}%</span>
                    </div>
                    <AnimatedProgress value={path.progress} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Career Alignment</span>
                      <span className="font-medium">{path.careerAlignment}%</span>
                    </div>
                    <AnimatedProgress value={path.careerAlignment} className="h-2" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {path.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                    Start Path
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
                  Skill Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {skillCategories.map(category => {
                    const categorySkills = skills.filter(skill => skill.category === category.value)
                    const avgLevel = categorySkills.length > 0 
                      ? categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length 
                      : 0
                    return (
                      <div key={category.value}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-300">{category.label}</span>
                          <span className="font-medium">{Math.round(avgLevel)}%</span>
                        </div>
                        <AnimatedProgress value={avgLevel} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">Skills on Track</span>
                      <span className="font-medium">
                        {skills.filter(s => s.level >= s.targetLevel * 0.8).length} / {skills.length}
                      </span>
                    </div>
                    <AnimatedProgress 
                      value={skills.length > 0 ? (skills.filter(s => s.level >= s.targetLevel * 0.8).length / skills.length) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">Milestones Completed</span>
                      <span className="font-medium">
                        {skills.reduce((sum, skill) => sum + skill.milestones.filter(m => m.completed).length, 0)} / {skills.reduce((sum, skill) => sum + skill.milestones.length, 0)}
                      </span>
                    </div>
                    <AnimatedProgress 
                      value={skills.reduce((sum, skill) => sum + skill.milestones.length, 0) > 0 
                        ? (skills.reduce((sum, skill) => sum + skill.milestones.filter(m => m.completed).length, 0) / skills.reduce((sum, skill) => sum + skill.milestones.length, 0)) * 100 
                        : 0} 
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