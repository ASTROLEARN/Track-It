"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: number
  color?: string
  text?: string
}

export function LoadingSpinner({ size = 40, color = "#8b5cf6", text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{ borderTopColor: color }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Middle Ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-3 border-transparent"
          style={{ borderRightColor: color }}
          animate={{ 
            opacity: [0.3, 1, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 1.2, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.2
          }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: color }}
          animate={{ 
            opacity: [0.3, 1, 0.3],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 0.9, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.4
          }}
        />
        
        {/* Center Dot */}
        <motion.div
          className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ 
            scale: [0.5, 1.5, 0.5],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.6
          }}
        />
      </motion.div>
      
      {text && (
        <motion.p
          className="text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}