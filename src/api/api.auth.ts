import { ApiConfig } from './api.config'

export const validateToken = async (token: string) => {
  try {
    const response = await ApiConfig.post(
      '/validate',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error validating token:', error)
    throw error
  }
}

export const loginUser = async (credentials: {
  identifier: string
  password: string
}) => {
  try {
    const response = await ApiConfig.post('/user/login', credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response.data
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}
