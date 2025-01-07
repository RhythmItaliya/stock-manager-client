import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { WatchMarket } from '../data/schema'

type WatchMarketsDialogType = 'add' | 'edit' | 'delete'

interface WatchMarketsContextType {
  open: WatchMarketsDialogType | null
  setOpen: (str: WatchMarketsDialogType | null) => void
  currentRow: WatchMarket | null
  setCurrentRow: React.Dispatch<React.SetStateAction<WatchMarket | null>>
}

const WatchMarketsContext = React.createContext<WatchMarketsContextType | null>(
  null
)

interface Props {
  children: React.ReactNode
}

export default function WatchMarketsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<WatchMarketsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<WatchMarket | null>(null)

  return (
    <WatchMarketsContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </WatchMarketsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWatchMarkets = () => {
  const watchMarketsContext = React.useContext(WatchMarketsContext)

  if (!watchMarketsContext) {
    throw new Error(
      'useWatchMarkets must be used within <WatchMarketsProvider>'
    )
  }

  return watchMarketsContext
}
