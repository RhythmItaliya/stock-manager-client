import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import marketApi, { deleteInstrumentKey } from '../../api/api.marketFeed'
import { columns } from './components/watch-market-columns'
import { WatchMarketsDialogs } from './components/watch-market-dialogs'
import { WatchMarketsPrimaryButtons } from './components/watch-market-primary-buttons'
import { WatchMarketsTable } from './components/watch-market-table'
import WatchMarketProvider from './context/watch-market-context'
import { WatchMarketsListSchema } from './data/schema'
import { WatchMarket } from './data/types'
import WatchMarketsData from './data/watch-market'

export default function WatchMarkets() {
  const [watchMarketList, setWatchMarketList] = useState<WatchMarket[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const handleMarketData = (decodedMessage: any) => {
      setLoading(true)
      try {
        const transformedData = WatchMarketsData(decodedMessage.feeds || {})
        WatchMarketsListSchema.parse(transformedData)

        setWatchMarketList((prevList) => {
          // Ensure prevList is an array before using .map
          const updatedList = Array.isArray(prevList) ? prevList.map((item) => {
            const newItem = transformedData.find(
              (data: WatchMarket) => data.id === item.id
            )
            return newItem ? { ...item, ...newItem } : item
          }) : []

          const newEntries = transformedData.filter(
            (data: WatchMarket) => !updatedList.some((item) => item.id === data.id)
          )

          return [...updatedList, ...newEntries]
        })
      } catch (error) {
        console.error('Error while validating the data:', error)
      } finally {
        setLoading(false)
      }
    }

    marketApi.connect('http://localhost:3000')
    marketApi.subscribe(handleMarketData)

    return () => {
      marketApi.unsubscribe(handleMarketData)
      marketApi.disconnect()
    }
  }, [])

  const handleDeleteSuccess = (updatedSubscription: any) => {
    setWatchMarketList(updatedSubscription)
  }

  async (instrumentKeys: string[]) => {
    try {
      const updatedSubscription = await deleteInstrumentKey(instrumentKeys)
      handleDeleteSuccess(updatedSubscription.subscriptions || [])
    } catch (error) {
      console.error('Error deleting instrument keys:', error)
    }
  }

  return (
    <WatchMarketProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Watch Market List
            </h2>
            <p className='text-muted-foreground'>
              Manage your Watch Market and their roles here.
            </p>
          </div>
          <WatchMarketsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <WatchMarketsTable
            data={watchMarketList}
            columns={columns}
            loading={loading}
          />
        </div>
      </Main>

      <WatchMarketsDialogs onDeleteSuccess={handleDeleteSuccess} />
    </WatchMarketProvider>
  )
}
