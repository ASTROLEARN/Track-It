"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle, Clock, UserCheck } from "lucide-react"

interface ThreeDAttendanceIconProps {
  type: "present" | "absent" | "late" | "checking"
  size?: number
  className?: string
}

export function ThreeDAttendanceIcon({ 
  type, 
  size = 60, 
  className = "" 
}: ThreeDAttendanceIconProps) {
  const getIcon = () => {
    switch (type) {
      case "present":
        return <CheckCircle className="w-full h-full" />
      case "absent":
        return <XCircle className="w-full h-full" />
      case "late":
        return <Clock className="w-full h-full" />
      case "checking":
        return <UserCheck className="w-full h-full" />
      default:
        return <CheckCircle className="w-full h-full" />
    }
  }

  const getColor = () => {
    switch (type) {
      case "present":
        return "text-green-500"
      case "absent":
        return "text-red-500"
      case "late":
        return "text-yellow-500"
      case "checking":
        return "text-blue-500"
      default:
        return "text-green-500"
    }
  }

  const getGlowColor = () => {
    switch (type) {
      case "present":
        return "rgba(34, 197, 94, 0.3)"
      case "absent":
        return "rgba(239, 68, 68, 0.3)"
      case "late":
        return "rgba(245, 158, 11, 0.3)"
      case "checking":
        return "rgba(59, 130, 246, 0.3)"
      default:
        return "rgba(34, 197, 94, 0.3)"
    }
  }

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={{
        rotateY: type === "checking" ? 360 : 0,
      }}
      transition={{
        duration: type === "checking" ? 2 : 0,
        repeat: type === "checking" ? Infinity : 0,
        ease: "linear"
      }}
    >
      {/* 3D Container */}
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.1, rotateZ: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ backgroundColor: getGlowColor() }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Icon Container */}
        <motion.div
          className={`relative w-full h-full flex items-center justify-center ${getColor()}`}
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            z: [0, 20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {getIcon()}
        </motion.div>
        
        {/* Floating Particles */}
        {type === "checking" && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: Math.cos((i * 60) * Math.PI / 180) * 30,
                  y: Math.sin((i * 60) * Math.PI / 180) * 30,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  )
}