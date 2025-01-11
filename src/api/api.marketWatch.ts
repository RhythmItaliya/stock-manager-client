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

export const deleteAllMarketWatches = async () => {
  const userId = getUserId()

  try {
    const response = await ApiConfig.delete(`/marketwatch/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting all MarketWatches:', error)
    throw error
  }
}

export const getMarketWatches = async () => {
  const userId = getUserId()

  try {
    const response = await ApiConfig.get(`/marketwatch/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching MarketWatches:', error)
    throw error
  }
}

export const getMarketWatchInstruments = async (name: string) => {
  const userId = getUserId()

  try {
    const response = await ApiConfig.get(
      `/marketwatch/${userId}/${name}/instruments`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching instruments for MarketWatch:', error)
    throw error
  }
}

export const getMarketWatchNames = async () => {
  const userId = getUserId()

  try {
    const response = await ApiConfig.get(`/marketwatch/names/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching MarketWatch names:', error)
    throw error
  }
}

export const setDefaultMarketWatch = async (name: string) => {
  const userId = getUserId()

  try {
    const response = await ApiConfig.put(
      `/marketwatch/${userId}/${name}/set-default`
    )
    return response.data
  } catch (error) {
    console.error('Error setting MarketWatch as default:', error)
    throw error
  }
}
