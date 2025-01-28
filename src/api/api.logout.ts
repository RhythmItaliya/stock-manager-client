import Cookies from 'js-cookie'
import { toast } from '@/hooks/use-toast'

/**
 * Logout - Clears storage, cookies, and redirects user to the login page
 */
export const logout = () => {
  localStorage.clear()
  sessionStorage.clear()
  Cookies.remove('accessToken')
  toast({
    title: 'Logged out',
    description: 'You have been logged out successfully.',
  })

  window.location.href = '/'
}
