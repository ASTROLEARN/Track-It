"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, FileSpreadsheet, FileText, Database, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { toast } from "sonner"

interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json'
  dateRange: {
    start: string
    end: string
  }
  dataType: 'attendance' | 'analytics' | 'students' | 'classes'
  filters: {
    class?: string
    status?: 'present' | 'late' | 'absent' | 'all'
    student?: string
  }
}

const formatOptions = [
  { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma-separated values' },
  { value: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format' },
  { value: 'pdf', label: 'PDF', icon: FileText, description: 'Portable Document Format' },
  { value: 'json', label: 'JSON', icon: Database, description: 'JavaScript Object Notation' },
]

const dataTypeOptions = [
  { value: 'attendance', label: 'Attendance Records', description: 'Individual attendance data' },
  { value: 'analytics', label: 'Analytics Reports', description: 'Statistical analysis and insights' },
  { value: 'students', label: 'Student Information', description: 'Student profiles and data' },
  { value: 'classes', label: 'Class Information', description: 'Class schedules and details' },
]

export function DataExport() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: {
      start: '',
      end: ''
    },
    dataType: 'attendance',
    filters: {
      status: 'all'
    }
  })
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate generating a download
      const blob = new Blob(['Sample export data'], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${exportOptions.dataType}_export.${exportOptions.format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success(`Data exported successfully as ${exportOptions.format.toUpperCase()}!`)
    } catch (error) {
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const updateExportOptions = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({ ...prev, [key]: value }))
  }

  const updateFilters = (key: string, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value }
    }))
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Data Export
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Export your attendance data in various formats for analysis and reporting
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Export Format */}
              <div className="space-y-3">
                <Label className="text-gray-700 dark:text-gray-300 font-medium">
                  Export Format
                </Label>
                <Select
                  value={exportOptions.format}
                  onValueChange={(value) => updateExportOptions('format', value)}
                >
                  <SelectTrigger className="bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-gray-500">{option.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Data Type */}
              <div className="space-y-3">
                <Label className="text-gray-700 dark:text-gray-300 font-medium">
                  Data Type
                </Label>
                <Select
                  value={exportOptions.dataType}
                  onValueChange={(value) => updateExportOptions('dataType', value)}
                >
                  <SelectTrigger className="bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <Label className="text-gray-700 dark:text-gray-300 font-medium">
                  Date Range
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="date"
                      value={exportOptions.dateRange.start}
                      onChange={(e) => updateExportOptions('dateRange', { ...exportOptions.dateRange, start: e.target.value })}
                      className="pl-10 bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="date"
                      value={exportOptions.dateRange.end}
                      onChange={(e) => updateExportOptions('dateRange', { ...exportOptions.dateRange, end: e.target.value })}
                      className="pl-10 bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-3">
                <Label className="text-gray-700 dark:text-gray-300 font-medium">
                  Filters
                </Label>
                <div className="space-y-2">
                  <Select
                    value={exportOptions.filters.status}
                    onValueChange={(value) => updateFilters('status', value)}
                  >
                    <SelectTrigger className="bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Attendance status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Export Summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Export Summary</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {exportOptions.dataType} data in {exportOptions.format.toUpperCase()} format
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white dark:bg-black">
                    {exportOptions.format.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="bg-white dark:bg-black">
                    {exportOptions.dataType}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <motion.div
              className="mt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Exporting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    <span>Export Data</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Export Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Export Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Weekly Report',
              description: 'Export this week\'s attendance data',
              format: 'pdf',
              icon: FileText,
              color: 'from-purple-500 to-pink-500'
            },
            {
              title: 'Monthly Analytics',
              description: 'Export monthly analytics and insights',
              format: 'excel',
              icon: FileSpreadsheet,
              color: 'from-green-500 to-emerald-500'
            },
            {
              title: 'Student Records',
              description: 'Export all student attendance records',
              format: 'csv',
              icon: Database,
              color: 'from-blue-500 to-cyan-500'
            }
          ].map((template, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center`}>
                    <template.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{template.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {template.format.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {template.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}