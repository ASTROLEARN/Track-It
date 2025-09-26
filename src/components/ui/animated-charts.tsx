"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react"

interface ChartData {
  name: string
  value: number
  color: string
}

interface AnimatedChartsProps {
  data: ChartData[]
  title: string
  type: "bar" | "line"
  icon?: React.ReactNode
}

export function AnimatedCharts({ data, title, type, icon }: AnimatedChartsProps) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-purple-200 dark:border-purple-800 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {type === "bar" ? (
            <div className="space-y-4">
              {data.map((item, index) => (
                <motion.div
                  key={item.name}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {item.value}%
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full relative overflow-hidden"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / maxValue) * 100}%` }}
                      transition={{ 
                        duration: 1, 
                        delay: index * 0.1 + 0.2,
                        ease: "easeOut"
                      }}
                    >
                      {/* Shimmer Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                          delay: index * 0.1 + 0.5
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="relative h-48">
              {/* Line Chart */}
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Grid Lines */}
                {Array.from({ length: 5 }, (_, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 50}
                    x2="400"
                    y2={i * 50}
                    stroke="rgba(168, 85, 247, 0.1)"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Line Path */}
                <motion.path
                  d={`M ${data.map((item, index) => `${index * 80},${200 - (item.value / 100) * 180}`).join(' L ')}`}
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                
                {/* Data Points */}
                {data.map((item, index) => (
                  <motion.circle
                    key={index}
                    cx={index * 80}
                    cy={200 - (item.value / 100) * 180}
                    r="5"
                    fill={item.color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.5, type: "spring" }}
                    whileHover={{ scale: 1.5 }}
                  />
                ))}
              </svg>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Animated Donut Chart Component
interface DonutChartProps {
  data: { name: string; value: number; color: string }[]
  title: string
  size?: number
}

export function AnimatedDonutChart({ data, title, size = 200 }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = -90 // Start from top

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-purple-200 dark:border-purple-800 shadow-lg p-6">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100
                const angle = (percentage / 100) * 360
                const startAngle = currentAngle
                const endAngle = currentAngle + angle
                
                // Convert to radians
                const startRad = (startAngle * Math.PI) / 180
                const endRad = (endAngle * Math.PI) / 180
                
                // Calculate coordinates
                const x1 = size / 2 + (size / 2 - 10) * Math.cos(startRad)
                const y1 = size / 2 + (size / 2 - 10) * Math.sin(startRad)
                const x2 = size / 2 + (size / 2 - 10) * Math.cos(endRad)
                const y2 = size / 2 + (size / 2 - 10) * Math.sin(endRad)
                
                const largeArcFlag = angle > 180 ? 1 : 0
                
                currentAngle += angle
                
                return (
                  <motion.path
                    key={index}
                    d={`M ${size / 2} ${size / 2} L ${x1} ${y1} A ${size / 2 - 10} ${size / 2 - 10} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={item.color}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    style={{ transformOrigin: "center" }}
                  />
                )
              })}
              
              {/* Center circle for donut effect */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={size / 4}
                fill="white"
                className="dark:fill-slate-900"
              />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {total}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {data.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 1 }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}