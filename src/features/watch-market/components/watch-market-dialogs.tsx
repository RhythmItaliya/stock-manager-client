import { useWatchMarkets } from '../context/watch-market-context'
import { WatchMarketsDeleteDialog } from './watch-market-delete-dialog'

export function WatchMarketsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useWatchMarkets()
  return (
    <>
      {currentRow && (
        <>
          <WatchMarketsDeleteDialog
            key={`WatchMarket-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
