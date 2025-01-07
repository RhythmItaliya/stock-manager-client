import { createLazyFileRoute } from '@tanstack/react-router'
import WatchMarkets from '@/features/watch-market'

export const Route = createLazyFileRoute('/_authenticated/watch-market/')({
  component: WatchMarkets,
})
