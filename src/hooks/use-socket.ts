"use client"

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface AttendanceUpdate {
  sessionId: string;
  studentId: string;
  status: string;
  studentName: string;
  timestamp: string;
  method: string;
}

interface SessionUpdate {
  sessionId: string;
  presentCount: number;
  totalCount: number;
  isActive: boolean;
}

interface AIRecognitionUpdate {
  sessionId: string;
  studentId: string;
  success: boolean;
  confidence?: number;
  timestamp: string;
}

export const useSocket = (url?: string) => {
  // Determine the socket URL based on environment
  const socketUrl = url || (typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}` 
    : 'http://localhost:3000')
  
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [attendanceUpdates, setAttendanceUpdates] = useState<AttendanceUpdate[]>([])
  const [sessionUpdates, setSessionUpdates] = useState<SessionUpdate[]>([])
  const [aiUpdates, setAiUpdates] = useState<AIRecognitionUpdate[]>([])

  useEffect(() => {
    let socket: Socket
    let isMounted = true

    try {
      socket = io(socketUrl, {
        path: '/api/socketio',
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })
      socketRef.current = socket

      socket.on('connect', () => {
        if (!isMounted) return
        console.log('Socket.IO connected')
        setIsConnected(true)
        setConnectionError(null)
      })

      socket.on('disconnect', (reason) => {
        if (!isMounted) return
        console.log('Socket.IO disconnected:', reason)
        setIsConnected(false)
      })

      socket.on('connect_error', (error) => {
        if (!isMounted) return
        console.error('Socket.IO connection error:', error)
        setIsConnected(false)
        setConnectionError(error.message)
      })

      // Custom event handlers
      socket.on('attendance-updated', (data) => {
        if (!isMounted) return
        setAttendanceUpdates(prev => [...prev, data])
      })

      socket.on('session-updated', (data) => {
        if (!isMounted) return
        setSessionUpdates(prev => [...prev, data])
      })

      socket.on('ai-recognition-completed', (data) => {
        if (!isMounted) return
        setAiUpdates(prev => [...prev, data])
      })

    } catch (error) {
      console.error('Failed to create Socket.IO connection:', error)
      if (isMounted) {
        setIsConnected(false)
        setConnectionError('Failed to create Socket.IO connection')
      }
    }

    return () => {
      isMounted = false
      if (socket) {
        socket.disconnect()
      }
    }
  }, [url])

  const joinClass = (classId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join-class', classId)
    }
  }

  const leaveClass = (classId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave-class', classId)
    }
  }

  const joinSession = (sessionId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join-session', sessionId)
    }
  }

  const sendAttendanceUpdate = (update: AttendanceUpdate) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('attendance-update', update)
    }
  }

  const sendSessionUpdate = (update: SessionUpdate) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('session-update', update)
    }
  }

  const sendAIRecognitionStart = (data: { sessionId: string, studentId?: string }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('ai-recognition-start', data)
    }
  }

  const sendAIRecognitionComplete = (data: { 
    sessionId: string, 
    studentId: string, 
    success: boolean, 
    confidence?: number 
  }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('ai-recognition-complete', data)
    }
  }

  const clearUpdates = () => {
    setAttendanceUpdates([])
    setSessionUpdates([])
    setAiUpdates([])
  }

  return {
    isConnected,
    connectionError,
    attendanceUpdates,
    sessionUpdates,
    aiUpdates,
    joinClass,
    leaveClass,
    joinSession,
    sendAttendanceUpdate,
    sendSessionUpdate,
    sendAIRecognitionStart,
    sendAIRecognitionComplete,
    clearUpdates
  }
}