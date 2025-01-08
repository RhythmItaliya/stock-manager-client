import { ApiConfig, getUserId } from './api.config'

export const postMarketWatch = async (name: string) => {
  const userId = getUserId()

  try {
    const response = await ApiConfig.post('/marketwatch', { userId, name })
    return response.data
  } catch (error) {
    console.error('Error creating MarketWatch:', error)
    throw error
  }
}

export const deleteMarketWatch = async (name: string) => {
  const userId = getUserId()

  try {
    const response = await ApiConfig.delete(`/marketwatch/${userId}/${name}`)
    return response.data
  } catch (error) {
    console.error('Error deleting MarketWatch:', error)
    throw error
  }
}
