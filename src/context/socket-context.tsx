import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SocketContext = createContext<Socket | null>(null)
const UserStatusContext = createContext<Map<string, boolean>>(new Map())

export const useSocket = () => {
  return useContext(SocketContext)
}

export const useUserStatus = () => {
  return useContext(UserStatusContext)
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [userStatus, setUserStatus] = useState<Map<string, boolean>>(new Map())

  useEffect(() => {
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)
    newSocket.on('user_status', (data) => {
      const { userId, isOnline } = data
      setUserStatus((prev) => new Map(prev).set(userId, isOnline))
      console.log(`User ${userId} is ${isOnline ? 'online' : 'offline'}`)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      <UserStatusContext.Provider value={userStatus}>
        {children}
      </UserStatusContext.Provider>
    </SocketContext.Provider>
  )
}
