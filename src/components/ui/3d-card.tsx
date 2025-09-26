"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface ThreeDCardProps {
  children: React.ReactNode
  className?: string
  glareColor?: string
}

export function ThreeDCard({ children, className = "", glareColor = "rgba(255,255,255,0.1)" }: ThreeDCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 15
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 15
    
    setRotateX(rotateX)
    setRotateY(rotateY)
    
    const glareX = ((e.clientX - rect.left) / rect.width) * 100
    const glareY = ((e.clientY - rect.top) / rect.height) * 100
    setGlarePosition({ x: glareX, y: glareY })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      className={`relative perspective-1000 ${className}`}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <Card 
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 dark:via-purple-900 border border-cyan-500/20 dark:border-purple-500/20 shadow-2xl"
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Glare Effect */}
        {isHovering && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor}, transparent 50%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Animated Border */}
        <motion.div 
          className="absolute inset-0 rounded-lg border border-transparent"
          animate={{
            borderColor: isHovering ? "rgba(6, 182, 212, 0.5) dark:rgba(168, 85, 247, 0.5)" : "rgba(6, 182, 212, 0.1) dark:rgba(168, 85, 247, 0.1)",
          }}
          transition={{ duration: 0.3 }}
        />
        
        <CardContent className="relative z-10 p-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}