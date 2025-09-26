"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function SkipLink() {
  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault()
    const mainContent = document.querySelector('main')
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1')
      mainContent.focus()
      mainContent.removeAttribute('tabindex')
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 z-50"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handleSkip}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-md shadow-lg"
      >
        Skip to main content
      </Button>
    </motion.div>
  )
}