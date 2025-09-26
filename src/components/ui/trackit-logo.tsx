"use client"

import { motion } from "framer-motion"
import { Target } from "lucide-react"
import { useTheme } from "next-themes"

interface TrackItLogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
  showText?: boolean
}

export default function TrackItLogo({ size = "md", className = "", showText = true }: TrackItLogoProps) {
  const { theme } = useTheme()
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  }
  
  const iconSizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7"
  }
  
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  }

  return (
    <div className={`flex items-center ${className}`}>
      <motion.div 
        className={`${sizeClasses[size]} bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-purple-500 dark:to-pink-500 rounded-xl flex items-center justify-center shadow-lg`}
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <Target className={`${iconSizeClasses[size]} text-white`} />
      </motion.div>
      {showText && (
        <motion.h1 
          className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-purple-500 dark:to-pink-500 bg-clip-text text-transparent ml-3`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          TrackIt
        </motion.h1>
      )}
    </div>
  )
}