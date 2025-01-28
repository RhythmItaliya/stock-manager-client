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

/**
 * Delete User - Delete a user by ID
 * @param userId - The ID of the user to delete
 */
export const deleteUser = async (userId: string) => {
  const token = getAuthToken()
  try {
    const response = await ApiConfig.delete(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

/**
 * Update User - Update a user's details by ID
 * @param userId - The ID of the user to update
 * @param userData - The updated user data (username, email, role, status, etc.)
 */
export const updateUser = async (
  userId: string,
  userData: {
    username?: string
    email?: string
    role?: string
    status?: string
  }
) => {
  const token = getAuthToken()
  try {
    const response = await ApiConfig.put(`/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}
