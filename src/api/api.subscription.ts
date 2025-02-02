import { ApiConfig, getAuthToken } from './api.config'

/**
 * Get Subscriptions - Fetch subscriptions based on the userId
 * @param userId - The user ID for fetching subscriptions
 */
export const getSubscriptions = async (userId: string) => {
  const token = getAuthToken()
  try {
    const response = await ApiConfig.get(`/subscriptions/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    throw error
  }
}

/**
 * Create Subscription - Handle creation of a subscription for a user
 * @param subscriptionData - The subscription data (userId, instrumentKeys, marketWatchName)
 */
export const createSubscription = async (subscriptionData: {
  userId: string
  instrumentKeys: string[]
  marketWatchName: string
}) => {
  const token = getAuthToken()
  try {
    const response = await ApiConfig.post('/subscriptions', subscriptionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
}

/**
 * Delete Subscription - Delete a subscription by userId
 * @param userId - The ID of the user whose subscription to delete
 */
export const deleteSubscription = async (userId: string) => {
  const token = getAuthToken()
  try {
    const response = await ApiConfig.delete(`/subscriptions/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error deleting subscription:', error)
    throw error
  }
}

/**
 * Delete Instrument Keys - Remove instrument keys from a user's subscription
 * @param userId - The ID of the user whose instrument keys to delete
 * @param instrumentKeys - The instrument keys to be removed
 */
export const deleteInstrumentKeys = async (
  userId: string,
  instrumentKeys: string[]
) => {
  const token = getAuthToken()
  try {
    const response = await ApiConfig.delete(
      `/subscriptions/${userId}/instruments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { instrumentKeys },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error deleting instrument keys:', error)
    throw error
  }
}
