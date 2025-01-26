import { ApiConfig, getAuthToken } from './api.config'

/**
 * Get Users - Fetch users based on the role and permissions
 * @param token - The Bearer token for authentication
 */
export const getUsers = async () => {
  const token = getAuthToken()
  try {
    const response = await ApiConfig.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

/**
 * Create User - Handle creation of a user
 * @param userData - The user data (username, email, password, role)
 */
export const createUser = async (userData: {
  username: string
  email: string
  password: string
  role: string
}) => {
  const token = getAuthToken()
  try {
    const response = await ApiConfig.post('/user/create', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
