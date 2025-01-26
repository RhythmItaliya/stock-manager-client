import { toast } from '@/hooks/use-toast'

/**
 * Logout - Clears local storage and redirects user to the login page
 */
export const logout = () => {
  localStorage.clear()
  sessionStorage.clear()

  toast({
    title: 'Logged out',
    description: 'You have been logged out successfully.',
  })

  window.location.href = '/'
}
