// useLogout.ts
import { useEffect } from 'react'
import { logout } from '@/api/api.logout'
import { useSocket } from '@/api/api.socket-context'

export const useLogout = () => {
  const socket = useSocket()
  useEffect(() => {
    if (!socket) return
    const handleForceLogout = () => {
      console.warn('You have been logged out due to another login session.')
      logout(socket)
    }
    socket.on('force_logout', handleForceLogout)
    return () => {
      socket.off('force_logout', handleForceLogout)
    }
  }, [socket])

  const handleLogout = () => {
    if (socket) {
      logout(socket)
    } else {
      console.error('Socket not found')
    }
  }
  return { handleLogout }
}
