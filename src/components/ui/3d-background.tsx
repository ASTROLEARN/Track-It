"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  z: number
  size: number
  color: string
  speed: number
}

export function ThreeDBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const colors = [
      "rgba(249, 115, 22, 0.6)",  // Orange
      "rgba(6, 182, 212, 0.6)",   // Cyan
      "rgba(16, 185, 129, 0.6)",  // Emerald
      "rgba(34, 197, 94, 0.6)",   // Green
      "rgba(245, 158, 11, 0.6)",  // Amber
    ]

    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 2 + 1
    }))

    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ opacity: 0.1 }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            x: [0, Math.sin(particle.id) * 50, 0],
            y: [0, Math.cos(particle.id) * 30, 0],
            z: [0, particle.z, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.speed * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.id * 0.1
          }}
        />
      ))}

      {/* 3D Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(249, 115, 22, 0.3)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Animated Grid Lines */}
        {Array.from({ length: 10 }, (_, i) => (
          <motion.line
            key={i}
            x1="0"
            y1={i * 10 + "%"}
            x2="100%"
            y2={i * 10 + "%"}
            stroke="rgba(249, 115, 22, 0.2)"
            strokeWidth="1"
            animate={{
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>

      {/* Floating 3D Objects */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32"
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        animate={{
          rotateX: 360,
          rotateY: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <motion.div
          className="w-full h-full border-2 border-orange-400/30 rounded-lg"
          style={{ transform: "translateZ(50px)" }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24"
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        animate={{
          rotateX: -360,
          rotateZ: 360,
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <motion.div
          className="w-full h-full border-2 border-cyan-400/30 rounded-full"
          style={{ transform: "translateZ(30px)" }}
        />
      </motion.div>
    </div>
  )
}