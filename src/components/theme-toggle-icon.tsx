"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggleIcon() {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const isDark = theme === 'dark'

  return (
    <motion.div 
      className="relative w-32 h-32 mx-auto mb-8 cursor-pointer"
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ 
        rotateY: 360,
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <motion.div 
        className="absolute inset-0 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300"
        animate={{
          background: isDark 
            ? "linear-gradient(135deg, #7c3aed, #a855f7)" 
            : "linear-gradient(135deg, #06b6d4, #0891b2)"
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {isDark ? (
            <Moon className="w-16 h-16 text-yellow-300" />
          ) : (
            <Sun className="w-16 h-16 text-white" />
          )}
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 rounded-full opacity-60 blur-xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{
          background: isDark 
            ? "linear-gradient(135deg, #fbbf24, #f59e0b)" 
            : "linear-gradient(135deg, #06b6d4, #0891b2)"
        }}
      />
    </motion.div>
  )
}