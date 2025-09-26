"use client"

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const useIOSocket = (url: string = 'http://localhost:3000') => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize Socket.IO connection
    const socketInstance = io(url, {
      transports: ['websocket', 'polling']
    })
    
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      console.log('Socket.IO connected')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket.IO disconnected')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error)
      setIsConnected(false)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [url])

  return socket
}