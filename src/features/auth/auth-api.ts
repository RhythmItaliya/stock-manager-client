import Cookies from 'js-cookie'
import { useNavigate } from '@tanstack/react-router'
import { jwtDecode } from 'jwt-decode'
import { loginUser } from '@/api/api.auth'
import { useAuthStore } from '@/stores/authStore'
import { AuthUser } from '@/stores/types'
import { useApi } from '@/hooks/use-api'
import { toast } from '@/hooks/use-toast'

const ACCESS_TOKEN = 'accessToken'

export const useAuth = () => {
  const navigate = useNavigate()
  const { setUser, setAccessToken } = useAuthStore((state) => state.auth)

  const { mutate: loginApi, isLoading } = useApi({
    apiCall: loginUser,
    method: 'POST',
    onSuccess: (data) => {
      const token = data.data.token
      if (token) {
        Cookies.set(ACCESS_TOKEN, token, { expires: 1 / 24 })
        const decodedToken = jwtDecode<AuthUser>(token)
        setAccessToken(token)
        setUser({
          id: decodedToken.id,
          email: decodedToken.email,
          role: decodedToken.role,
          username: decodedToken.username,
          exp: decodedToken.exp,
        })
        toast({
          title: 'Login successful',
          description: `Welcome back, ${decodedToken.username}!`,
        })
        navigate({ to: '/' })
      } else {
        toast({
          title: 'Login failed',
          description: 'Token was not received',
          variant: 'destructive',
        })
      }
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    },
  })

  return { loginApi, isLoading }
}
