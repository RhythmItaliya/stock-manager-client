import { ApiConfig, getAuthToken } from './api.config'

export const getUpstoxLoginURL = async () => {
  const token = getAuthToken()
  try {
    const response = await ApiConfig.get('/upstox/login', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching Upstox login URL:', error)
    throw error
  }
}
