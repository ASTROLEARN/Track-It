"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        className="relative bg-white dark:bg-black border-gray-300 dark:border-gray-600 shadow-sm"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] text-gray-900 dark:text-gray-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = theme === 'dark'
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className="relative bg-white dark:bg-black border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-cyan-600 dark:to-emerald-600"
        initial={false}
        animate={{ 
          x: isDark ? "100%" : "-100%",
          opacity: isDark ? 0.1 : 0.15
        }}
        transition={{ 
          duration: 0.6, 
          ease: "easeInOut",
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        style={{ width: "200%" }}
      />
      
      {/* Icons with rotation animation */}
      <div className="relative flex items-center justify-center w-full h-full">
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ 
            rotate: isDark ? -180 : 0,
            opacity: 0,
            scale: 0.8
          }}
          animate={{ 
            rotate: 0, 
            opacity: 1,
            scale: 1
          }}
          transition={{ 
            duration: 0.4, 
            ease: "easeInOut",
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="absolute"
        >
          {isDark ? (
            <Moon className="h-[1.2rem] w-[1.2rem] text-gray-900 dark:text-gray-100" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem] text-gray-900 dark:text-gray-100" />
          )}
        </motion.div>
      </div>
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}