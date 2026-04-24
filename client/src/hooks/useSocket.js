import { useEffect, useCallback, useState } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import useAuthStore from '../store/authStore'

// GLOBAL SINGLETON — one socket for the entire app lifetime
let socketInstance = null
const listeners = new Set()

const notifyListeners = () => {
  listeners.forEach(listener => listener({ socket: socketInstance, isConnected: socketInstance?.connected || false }))
}

export const useSocket = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const [socketState, setSocketState] = useState({ socket: socketInstance, isConnected: socketInstance?.connected || false })

  const connect = useCallback(() => {
    if (socketInstance) return socketInstance

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 7,
      timeout: 15000,
    })

    newSocket.on('connect', () => {
      notifyListeners()
      if (user?._id) newSocket.emit('join', user._id)
    })

    // Real-time notification invalidation
    newSocket.on('new_notification', () => {
      queryClient.invalidateQueries(['notifications'])
    })

    newSocket.on('disconnect', () => {
      notifyListeners()
      console.warn('[SOCKET] Disconnected from server.')
    })

    socketInstance = newSocket
    notifyListeners()
    return socketInstance
  }, [user, queryClient])

  const disconnect = useCallback(() => {
    if (socketInstance) {
      socketInstance.disconnect()
      socketInstance = null
      notifyListeners()
    }
  }, [])

  useEffect(() => {
    listeners.add(setSocketState)

    if (!socketInstance) {
      connect()
    }

    return () => {
      listeners.delete(setSocketState)
    }
  }, [connect])

  return { socket: socketState.socket, isConnected: socketState.isConnected, disconnect }
}
