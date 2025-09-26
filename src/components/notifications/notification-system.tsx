"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, CheckCircle, AlertCircle, Info, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useIOSocket } from "@/hooks/use-io-socket"

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

const notificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
}

const notificationColors = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400',
}

const notificationBgColors = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const socket = useIOSocket()

  useEffect(() => {
    // Simulate initial notifications
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Attendance Recorded',
        message: 'Your attendance has been successfully recorded for Computer Science 101',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
      },
      {
        id: '2',
        type: 'warning',
        title: 'Low Attendance Alert',
        message: 'Your attendance rate is below 75% for Mathematics 201',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
      },
      {
        id: '3',
        type: 'info',
        title: 'New Assignment Posted',
        message: 'A new assignment has been posted for Physics 301',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '4',
        type: 'success',
        title: 'Skill Progress Updated',
        message: 'JavaScript progress increased to 75%',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: false,
        action: {
          label: 'View Skill',
          onClick: () => {
            const skillsTab = document.querySelector('[value="skills"]') as HTMLElement
            if (skillsTab) skillsTab.click()
          }
        }
      },
      {
        id: '5',
        type: 'info',
        title: 'Schedule Reminder',
        message: 'Upcoming class: Computer Science 101 at 09:00 AM',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        action: {
          label: 'View Schedule',
          onClick: () => {
            const schedulerTab = document.querySelector('[value="scheduler"]') as HTMLElement
            if (schedulerTab) schedulerTab.click()
          }
        }
      },
      {
        id: '6',
        type: 'success',
        title: 'Career Goal Progress',
        message: 'Senior Software Developer progress: 65%',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true,
        action: {
          label: 'View Goal',
          onClick: () => {
            const careerTab = document.querySelector('[value="career"]') as HTMLElement
            if (careerTab) careerTab.click()
          }
        }
      }
    ]
    setNotifications(initialNotifications)
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('attendance_update', (data) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'success',
          title: 'Real-time Attendance Update',
          message: `${data.studentName} marked as ${data.status}`,
          timestamp: new Date(),
          read: false,
        }
        setNotifications(prev => [newNotification, ...prev])
      })

      socket.on('ai_recognition_event', (data) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: data.success ? 'success' : 'error',
          title: data.success ? 'Face Recognition Success' : 'Face Recognition Failed',
          message: data.message,
          timestamp: new Date(),
          read: false,
        }
        setNotifications(prev => [newNotification, ...prev])
      })

      // Scheduler notifications
      socket.on('schedule_reminder', (data) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'info',
          title: 'Schedule Reminder',
          message: `Upcoming ${data.type}: ${data.title} at ${data.time}`,
          timestamp: new Date(),
          read: false,
        }
        setNotifications(prev => [newNotification, ...prev])
      })

      socket.on('schedule_updated', (data) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'info',
          title: 'Schedule Updated',
          message: `Your schedule has been updated: ${data.changes}`,
          timestamp: new Date(),
          read: false,
        }
        setNotifications(prev => [newNotification, ...prev])
      })

      socket.on('ai_suggestion', (data) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'info',
          title: 'AI Suggestion',
          message: `AI recommends: ${data.suggestion}`,
          timestamp: new Date(),
          read: false,
          action: {
            label: 'View Details',
            onClick: () => {
              // Navigate to scheduler tab
              const schedulerTab = document.querySelector('[value="scheduler"]') as HTMLElement
              if (schedulerTab) schedulerTab.click()
            }
          }
        }
        setNotifications(prev => [newNotification, ...prev])
      })

      // Skill tracker notifications
      socket.on('skill_progress', (data) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'success',
          title: 'Skill Progress Updated',
          message: `${data.skillName} progress increased to ${data.level}%`,
          timestamp: new Date(),
          read: false,
          action: {
            label: 'View Skill',
            onClick: () => {
              // Navigate to skills tab
              const skillsTab = document.querySelector('[value="skills"]') as HTMLElement
              if (skillsTab) skillsTab.click()
            }
          }
        }
        setNotifications(prev => [newNotification, ...prev])
      })

      socket.on('milestone_completed', (data) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'success',
          title: 'Milestone Completed!',
          message: `Congratulations! You completed: ${data.milestoneTitle}`,
          timestamp: new Date(),
          read: false,
          action: {
            label: 'View Progress',
            onClick: () => {
              // Navigate to skills tab
              const skillsTab = document.querySelector('[value="skills"]') as HTMLElement
              if (skillsTab) skillsTab.click()
            }
          }
        }
        setNotifications(prev => [newNotification, ...prev])
      })

      socket.on('skill_recommendation', (data) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'info',
          title: 'New Skill Recommendation',
          message: `Based on your goals, consider learning: ${data.skillName}`,
          timestamp: new Date(),
          read: false,
          action: {
            label: 'Explore Skill',
            onClick: () => {
              // Navigate to skills tab
              const skillsTab = document.querySelector('[value="skills"]') as HTMLElement
              if (skillsTab) skillsTab.click()
            }
          }
        }
        setNotifications(prev => [newNotification, ...prev])
      })

      // Career goals notifications
      socket.on('goal_progress', (data) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'success',
          title: 'Career Goal Progress',
          message: `${data.goalTitle} progress: ${data.progress}%`,
          timestamp: new Date(),
          read: false,
          action: {
            label: 'View Goal',
            onClick: () => {
              // Navigate to career tab
              const careerTab = document.querySelector('[value="career"]') as HTMLElement
              if (careerTab) careerTab.click()
            }
          }
        }
        setNotifications(prev => [newNotification, ...prev])
      })

      socket.on('career_milestone', (data) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'success',
          title: 'Career Milestone Reached!',
          message: `Milestone achieved: ${data.milestoneTitle}`,
          timestamp: new Date(),
          read: false,
          action: {
            label: 'View Roadmap',
            onClick: () => {
              // Navigate to career tab
              const careerTab = document.querySelector('[value="career"]') as HTMLElement
              if (careerTab) careerTab.click()
            }
          }
        }
        setNotifications(prev => [newNotification, ...prev])
      })

      socket.on('market_insight', (data) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'info',
          title: 'Career Market Insight',
          message: `Market trend: ${data.insight}`,
          timestamp: new Date(),
          read: false,
          action: {
            label: 'View Analysis',
            onClick: () => {
              // Navigate to career tab
              const careerTab = document.querySelector('[value="career"]') as HTMLElement
              if (careerTab) careerTab.click()
            }
          }
        }
        setNotifications(prev => [newNotification, ...prev])
      })
    }

    return () => {
      if (socket) {
        socket.off('attendance_update')
        socket.off('ai_recognition_event')
        socket.off('schedule_reminder')
        socket.off('schedule_updated')
        socket.off('ai_suggestion')
        socket.off('skill_progress')
        socket.off('milestone_completed')
        socket.off('skill_recommendation')
        socket.off('goal_progress')
        socket.off('career_milestone')
        socket.off('market_insight')
      }
    }
  }, [socket])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const formatTimeAgo = (timestamp: Date) => {
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
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 top-12 w-80 max-h-96 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type]
                  return (
                    <Card
                      key={notification.id}
                      className={`m-2 ${notificationBgColors[notification.type]} ${
                        !notification.read ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 ${notificationColors[notification.type]}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            {notification.action && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  notification.action?.onClick()
                                  setIsOpen(false)
                                }}
                                className="mt-2 text-xs"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="w-6 h-6 p-0"
                              >
                                <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeNotification(notification.id)}
                              className="w-6 h-6 p-0"
                            >
                              <X className="w-3 h-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}