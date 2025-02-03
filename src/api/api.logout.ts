// api.logout.ts
import Cookies from 'js-cookie'
import { ApiConfig, getAuthToken, getUserId } from './api.config'

export const logout = async (socket: any) => {
  const userId = getUserId() || ''
  const token = getAuthToken()
  const socketId = socket?.id
  try {
    if (!token) {
      console.warn('No token found, logging out locally.')
      handleLocalLogout(socket, userId)
      return
    }
    await ApiConfig.post(
      '/user/logout',
      { socketId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    socket.emit('user_logout', { userId, socketId })
    handleLocalLogout(socket, userId)
  } catch (error) {
    console.error('Error logging out:', error)
    handleLocalLogout(socket, userId)
  }
}

/**
 * Handles clearing local storage and redirecting the user after logout.
 */
const handleLocalLogout = (socket: any, userId: string | undefined) => {
  localStorage.clear()
  sessionStorage.clear()
  Cookies.remove('accessToken')
  if (socket && userId) {
    // socket.emit('force_logout', { userId }) // Emit force_logout event with userId
  }
  window.location.href = '/'
}
