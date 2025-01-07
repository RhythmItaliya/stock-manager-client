import protobuf from 'protobufjs'
import { io, Socket } from 'socket.io-client'

type FeedResponseType = {
  feeds: Record<string, any>
}

class MarketApi {
  private socket: Socket | null = null
  private protobufRoot: protobuf.Root | null = null
  private subscribers: ((data: FeedResponseType) => void)[] = []

  constructor() {
    // Load Protobuf schema
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

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
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
