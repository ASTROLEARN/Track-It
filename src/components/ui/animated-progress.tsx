"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface AnimatedProgressProps {
  value: number
  className?: string
  color?: string
  showLabel?: boolean
  label?: string
  animated?: boolean
}

export function AnimatedProgress({ 
  value, 
  className = "", 
  color = "bg-gradient-to-r from-purple-500 to-pink-500",
  showLabel = false,
  label,
  animated = true
}: AnimatedProgressProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <motion.div
          className="flex justify-between text-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-gray-600 dark:text-gray-400">{label}</span>
          <motion.span
            className="font-semibold text-gray-900 dark:text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {value.toFixed(1)}%
          </motion.span>
        </motion.div>
      )}
      
      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ 
            duration: animated ? 1.5 : 0,
            ease: "easeOut",
            delay: 0.2
          }}
        />
        
        {/* Shimmer Effect */}
        {animated && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 0.5
            }}
          />
        )}
        
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-50 blur-sm"
          style={{
            background: `linear-gradient(90deg, transparent, ${color.includes('purple') ? 'rgba(168, 85, 247, 0.5)' : 'rgba(236, 72, 153, 0.5)'}, transparent)`
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  )
}