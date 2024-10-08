'use client'

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

import type { Socket } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
      transports: ['websocket'],
    })

    socketIo.on('connect', () => {
      console.log('Socket connected')
    })

    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [])

  return socket
}
