import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useMarketFeed } from './components/hook/use-market-feed'
import { columns } from './components/watch-market-columns'
import { WatchMarketsDialogs } from './components/watch-market-dialogs'
import { WatchMarketsPrimaryButtons } from './components/watch-market-primary-buttons'
import { WatchMarketsTable } from './components/watch-market-table'
import WatchMarketProvider from './context/watch-market-context'

export default function WatchMarkets() {
  const { watchMarketList, loading, handleDeleteSuccess } = useMarketFeed()
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
