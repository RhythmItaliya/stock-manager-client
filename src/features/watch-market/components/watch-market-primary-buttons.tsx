import { IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useWatchMarkets } from '../context/watch-market-context'

export function WatchMarketsPrimaryButtons() {
  const { setOpen } = useWatchMarkets()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add WatchMarket</span> <IconUserPlus size={18} />
      </Button>
    </div>
  )
}
