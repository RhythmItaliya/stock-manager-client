import { useWatchMarkets } from '../context/watch-market-context'
import { WatchMarket } from '../data/types'
import { WatchMarketsDeleteDialog } from './watch-market-delete-dialog'

export function WatchMarketsDialogs({
  onDeleteSuccess,
}: {
  onDeleteSuccess: (deletedMarket: WatchMarket) => void
}) {
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
            onDeleteSuccess={onDeleteSuccess}
          />
        </>
      )}
    </>
  )
}
