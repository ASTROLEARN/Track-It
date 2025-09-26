"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, X, Clock, User, Calendar, BookOpen, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  type: 'student' | 'class' | 'attendance' | 'assignment'
  title: string
  description: string
  timestamp?: Date
  metadata?: {
    studentName?: string
    className?: string
    status?: 'present' | 'late' | 'absent'
    date?: string
  }
}

interface SearchFilters {
  type: 'all' | 'student' | 'class' | 'attendance' | 'assignment'
  dateRange: {
    start: string
    end: string
  }
  status?: 'all' | 'present' | 'late' | 'absent'
  class?: string
}

const searchTypeOptions = [
  { value: 'all', label: 'All Types', icon: Search },
  { value: 'student', label: 'Students', icon: User },
  { value: 'class', label: 'Classes', icon: BookOpen },
  { value: 'attendance', label: 'Attendance', icon: Calendar },
  { value: 'assignment', label: 'Assignments', icon: BookOpen },
]

const statusOptions = [
  { value: 'all', label: 'All Status', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' },
  { value: 'present', label: 'Present', color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
  { value: 'late', label: 'Late', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
  { value: 'absent', label: 'Absent', color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
]

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    dateRange: { start: '', end: '' }
  })
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // Sample data for demonstration
  const sampleData: SearchResult[] = [
    {
      id: '1',
      type: 'student',
      title: 'John Doe',
      description: 'Computer Science - Year 3',
      metadata: { studentName: 'John Doe' }
    },
    {
      id: '2',
      type: 'class',
      title: 'Computer Science 101',
      description: 'Introduction to Programming',
      metadata: { className: 'Computer Science 101' }
    },
    {
      id: '3',
      type: 'attendance',
      title: 'Attendance Record',
      description: 'John Doe - Computer Science 101',
      timestamp: new Date('2024-01-15T09:00:00'),
      metadata: { 
        studentName: 'John Doe', 
        className: 'Computer Science 101', 
        status: 'present',
        date: '2024-01-15'
      }
    },
    {
      id: '4',
      type: 'assignment',
      title: 'Programming Assignment 1',
      description: 'Create a simple calculator program',
      metadata: { className: 'Computer Science 101' }
    },
    {
      id: '5',
      type: 'attendance',
      title: 'Attendance Record',
      description: 'Jane Smith - Mathematics 201',
      timestamp: new Date('2024-01-15T10:00:00'),
      metadata: { 
        studentName: 'Jane Smith', 
        className: 'Mathematics 201', 
        status: 'late',
        date: '2024-01-15'
      }
    },
  ]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true)
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      
      searchTimeoutRef.current = setTimeout(() => {
        performSearch()
      }, 300)
    } else {
      setResults([])
      setIsLoading(false)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query, filters])

  const performSearch = () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      let filteredResults = sampleData.filter(item => {
        const matchesQuery = !query || 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.metadata?.studentName?.toLowerCase().includes(query.toLowerCase()) ||
          item.metadata?.className?.toLowerCase().includes(query.toLowerCase())

        const matchesType = filters.type === 'all' || item.type === filters.type
        const matchesStatus = !filters.status || filters.status === 'all' || 
          item.metadata?.status === filters.status

        return matchesQuery && matchesType && matchesStatus
      })

      setResults(filteredResults)
      setIsLoading(false)
    }, 500)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setFilters({ type: 'all', dateRange: { start: '', end: '' } })
  }

  const getTypeIcon = (type: string) => {
    const option = searchTypeOptions.find(opt => opt.value === type)
    return option?.icon || Search
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null
    const statusOption = statusOptions.find(opt => opt.value === status)
    if (!statusOption) return null
    
    return (
      <Badge className={cn("text-xs", statusOption.color)}>
        {statusOption.label}
      </Badge>
    )
  }

  const formatTimeAgo = (timestamp?: Date) => {
    if (!timestamp) return ''
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <>
      {/* Search Trigger */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white/10 dark:bg-black/20 border-white/20"
      >
        <Search className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
          ⌘K
        </kbd>
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-white dark:bg-black border-gray-200 dark:border-gray-800 p-0">
          <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
            <DialogTitle className="flex items-center gap-3">
              <Search className="w-5 h-5" />
              Global Search
            </DialogTitle>
          </DialogHeader>

          {/* Search Input */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search students, classes, attendance, assignments..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger className="w-40 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {searchTypeOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              {filters.type === 'attendance' && (
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger className="w-32 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto max-h-96">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Searching...</span>
              </div>
            ) : query && results.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
                <Search className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No results found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : !query ? (
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Access
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {searchTypeOptions.slice(1).map((option) => {
                    const Icon = option.icon
                    const count = sampleData.filter(item => item.type === option.value).length
                    
                    return (
                      <Card
                        key={option.value}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setFilters(prev => ({ ...prev, type: option.value as any }))
                          inputRef.current?.focus()
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {option.label}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {count} items
                                </div>
                              </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </div>
                <div className="space-y-2">
                  {results.map((result) => {
                    const Icon = getTypeIcon(result.type)
                    return (
                      <Card
                        key={result.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                  {result.title}
                                </h4>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {getStatusBadge(result.metadata?.status)}
                                  {result.timestamp && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                      <Clock className="w-3 h-3" />
                                      {formatTimeAgo(result.timestamp)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                {result.description}
                              </p>
                              {result.metadata?.date && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                  Date: {result.metadata.date}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div>
                Press <kbd className="px-1 py-0.5 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded">
                  Esc
                </kbd> to close
              </div>
              <div>
                Press <kbd className="px-1 py-0.5 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded">
                  ⌘K
                </kbd> to search
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}