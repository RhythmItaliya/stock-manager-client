// api.marketFeed.ts
import protobuf from 'protobufjs'
import { io, Socket } from 'socket.io-client'
import { ApiConfig, getUserId } from '@/api/api.config'

type FeedResponseType = {
  feeds: Record<string, any>
}

class MarketApi {
  private socket: Socket | null = null
  private protobufRoot: protobuf.Root | null = null
  private subscribers: ((data: FeedResponseType) => void)[] = []

  constructor() {
    protobuf.load('MarketDataFeed.proto', (err, root) => {
      if (err) {
        console.error('Error loading Protobuf:', err)
        return
      }
      this.protobufRoot = root
      console.log('Protobuf Loaded Successfully')
    })
  }

  connect(url: string) {
    this.socket = io.connect(url)

    this.socket.on('connect', async () => {
      console.log('WebSocket connected')

      const userId = 'user123'
      try {
        const subscriptionData = await getSubscription(userId)
        console.log('Subscription data:', subscriptionData)
      } catch (error) {
        console.error('Error fetching subscription data on connect:', error)
      }
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    this.socket.on('marketData', (data) => {
      if (!this.protobufRoot) {
        console.error('Protobuf root not loaded yet.')
        return
      }

      try {
        const arrayBuffer = new Uint8Array(data)
        const FeedResponse = this.protobufRoot.lookupType(
          'com.upstox.marketdatafeeder.rpc.proto.FeedResponse'
        )
        const decodedMessage = FeedResponse.decode(arrayBuffer)
        this.notifySubscribers(decodedMessage as FeedResponseType)
      } catch (err) {
        console.error('Error decoding WebSocket data:', err)
      }
    })

    this.socket.on('error', (err) => {
      console.error('WebSocket error:', err)
    })
  }

  subscribe(callback: (data: FeedResponseType) => void) {
    this.subscribers.push(callback)
  }

  unsubscribe(callback: (data: FeedResponseType) => void) {
    this.subscribers = this.subscribers.filter((sub) => sub !== callback)
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  private notifySubscribers(data: FeedResponseType) {
    this.subscribers.forEach((callback) => callback(data))
  }
}

const marketApi = new MarketApi()
export default marketApi

export const postSubscription = async (
  userId: string,
  instrumentKeys: string[]
) => {
  try {
    const response = await ApiConfig.post('/subscribe', {
      userId,
      instrumentKeys,
    })
    return response.data
  } catch (error) {
    console.error('Error subscribing to instruments:', error)
    throw error
  }
}

export const getSubscription = async (userId: string) => {
  try {
    const response = await ApiConfig.get(`/subscribe/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching subscription:', error)
    throw error
  }
}

export const deleteAllSubscription = async (userId: string) => {
  try {
    const response = await ApiConfig.delete(`/subscribe/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting all subscribe:', error)
    throw error
  }
}

export const deleteInstrumentKey = async (
  instrumentKeys: string[]
): Promise<any> => {
  const userId = 'user123'
  try {
    const response = await ApiConfig.delete(
      `/subscribe/${userId}/instruments`,
      { data: { instrumentKeys } }
    )
    return response.data
  } catch (error) {
    console.error('Error deleting instrument keys:', error)
    throw error
  }
}
