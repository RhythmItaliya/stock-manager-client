import { useState, useEffect, useCallback } from 'react'
import marketApi from '@/api/api.marketFeed'
import { WatchMarket, WatchMarketsListSchema } from '../../data/schema'
import WatchMarketsData from '../../data/watch-market'

export const useMarketFeed = () => {
  const [watchMarketList, setWatchMarketList] = useState<WatchMarket[]>([])
  console.log(watchMarketList)
  const [loading, setLoading] = useState<boolean>(false)

  const handleMarketData = useCallback((decodedMessage: any) => {
    setLoading(true)
    try {
      const transformedData = WatchMarketsData(decodedMessage.feeds || {})
      WatchMarketsListSchema.parse(transformedData)
      const deletedMarkets = JSON.parse(
        localStorage.getItem('deletedMarkets') || '[]'
      )
      const filteredTransformedData = transformedData.filter(
        (data: WatchMarket) => {
          return !deletedMarkets.some(
            (deletedMarket: { id: string }) => deletedMarket.id === data.id
          )
        }
      )
      setWatchMarketList((prevList) => {
        const updatedList = prevList.map((item) => {
          const newItem = filteredTransformedData.find(
            (data: WatchMarket) => data.id === item.id
          )
          return newItem ? { ...item, ...newItem } : item
        })

        const newEntries = filteredTransformedData.filter(
          (data: WatchMarket) => !prevList.some((item) => item.id === data.id)
        )

        return [...updatedList, ...newEntries]
      })
    } catch (error) {
      console.error('Error while validating the data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    marketApi.connect('http://localhost:3000')
    marketApi.subscribe(handleMarketData)

    return () => {
      marketApi.unsubscribe(handleMarketData)
      marketApi.disconnect()
    }
  }, [handleMarketData])

  const handleDeleteSuccess = (deletedMarket: WatchMarket) => {
    const deletedMarkets = JSON.parse(
      localStorage.getItem('deletedMarkets') || '[]'
    )
    deletedMarkets.push({ id: deletedMarket.id, timestamp: Date.now() })
    localStorage.setItem('deletedMarkets', JSON.stringify(deletedMarkets))
    setWatchMarketList((prevList) =>
      prevList.filter((market) => market.id !== deletedMarket.id)
    )
  }

  const checkExpiredDeletedMarkets = () => {
    const deletedMarkets = JSON.parse(
      localStorage.getItem('deletedMarkets') || '[]'
    )
    const oneHourAgo = Date.now() - 3600000
    const validMarkets = deletedMarkets.filter(
      (market: { id: string; timestamp: number }) =>
        market.timestamp > oneHourAgo
    )
    localStorage.setItem('deletedMarkets', JSON.stringify(validMarkets))
  }

  useEffect(() => {
    checkExpiredDeletedMarkets()
  }, [])

  return {
    watchMarketList,
    loading,
    handleDeleteSuccess,
  }
}
