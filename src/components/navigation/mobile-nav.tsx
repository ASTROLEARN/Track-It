"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, Users, BarChart3, Settings, LogOut, Bell, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  userName?: string
  userRole?: string
  onLogout?: () => void
  notificationCount?: number
}

export function MobileNav({ 
  userName, 
  userRole, 
  onLogout, 
  notificationCount = 0 
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
      description: "Main dashboard"
    },
    {
      title: "Classes",
      icon: Users,
      href: "/classes",
      description: "Manage classes"
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      description: "View analytics"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      description: "System settings"
    }
  ]

  const handleNavClick = () => {
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
        className="w-[280px] sm:w-[350px] bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 p-0"
      >
        <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
          <SheetTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Attendance
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {userRole && (
                  <Badge variant="outline" className="text-xs">
                    {userRole}
                  </Badge>
                )}
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {userName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {userName || 'User'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {userRole || 'Guest'}
                </div>
              </div>
              {notificationCount > 0 && (
                <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">
                  {notificationCount}
                </Badge>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-12 px-4 rounded-lg",
                        "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                        "hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      onClick={handleNavClick}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                )
              })}
            </div>

            {/* Theme Switcher */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Sun className="w-4 h-4" />
                  <span className="text-xs">Light</span>
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Moon className="w-4 h-4" />
                  <span className="text-xs">Dark</span>
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('system')}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-xs">System</span>
                </Button>
              </div>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 px-4 rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => {
                onLogout?.()
                setIsOpen(false)
              }}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}