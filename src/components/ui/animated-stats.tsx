"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface AnimatedStatsProps {
  title: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  color?: string
}

export function AnimatedStats({ 
  title, 
  value, 
  change, 
  icon, 
  color = "text-cyan-600 dark:text-purple-600" 
}: AnimatedStatsProps) {
  const getChangeIcon = () => {
    if (!change) return <Minus className="w-4 h-4 text-gray-500" />
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    return <TrendingDown className="w-4 h-4 text-red-500" />
  }

  const getChangeColor = () => {
    if (!change) return "text-gray-500"
    if (change > 0) return "text-green-500"
    return "text-red-500"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-cyan-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </CardTitle>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className={color}
          >
            {icon}
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="text-2xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              delay: 0.1 
            }}
          >
            {value}
          </motion.div>
          {change !== undefined && (
            <motion.div 
              className={`flex items-center text-xs mt-1 ${getChangeColor()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {getChangeIcon()}
              <span className="ml-1">
                {change > 0 ? "+" : ""}{change.toFixed(1)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">
                from last week
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}