import { ColumnDef } from '@tanstack/react-table'
import LongText from '@/components/long-text'
import { BidAskQuote, OHLC, OptionGreeks, WatchMarket } from '../data/types'
import { DataTableColumnHeader } from './data-table-column-header'
import DataDialog from './data-table-dialog'
import { DataTableRowActions } from './data-table-row-actions'
import { formatDate, formatTime } from '../utilities/formatTimestamp'
import { columnTitleMapping } from '../utilities/columnTitleMapping'
import { usePriceChangeIcon, usePriceChangeText } from '../context/useChange'

export const columns: ColumnDef<WatchMarket>[] = [
  {
    accessorKey: 'displayName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['displayName']} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 font-medium'>
        {row.getValue<string>('displayName')}
      </LongText>
    ),
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['ltpc.ltp']} />
    ),
    accessorFn: (row) => row.ltpc?.ltp,
    id: 'ltpc.ltp',
    cell: ({ row }) => {
      const currentPrice = row.getValue<number>('ltpc.ltp');
      const { className } = usePriceChangeText(currentPrice);
      const iconChange = usePriceChangeIcon(currentPrice);
      return (
        <div className={className}>
          {iconChange && <span>{iconChange}</span>}
          {currentPrice}
        </div>
      );
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['marketLevel.bidAskQuote.bp']} />
    ),
    accessorFn: (row) => row.marketLevel?.bidAskQuote?.[0]?.bp,
    id: 'marketLevel.bidAskQuote.bp',
    cell: ({ row }) => {
      const currentPrice = row.getValue<number>('marketLevel.bidAskQuote.bp');
      const { className } = usePriceChangeText(currentPrice);
      const iconChange = usePriceChangeIcon(currentPrice);
      return (
        <div className={className}>
          {iconChange && <span>{iconChange}</span>}
          {currentPrice}
        </div>
      );
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['marketLevel.bidAskQuote.ap']} />
    ),
    accessorFn: (row) => row.marketLevel?.bidAskQuote?.[0]?.ap,
    id: 'marketLevel.bidAskQuote.ap',
    cell: ({ row }) => {
      const currentPrice = row.getValue<number>('marketLevel.bidAskQuote.ap');
      const { className } = usePriceChangeText(currentPrice);
      const iconChange = usePriceChangeIcon(currentPrice);
      return (
        <div className={className}>
          {iconChange && <span>{iconChange}</span>}
          {currentPrice}
        </div>
      );
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['marketOHLC.ohlc.open']} />
    ),
    accessorFn: (row) => row.marketOHLC?.ohlc?.[0]?.open,
    id: 'marketOHLC.open',
    cell: ({ row }) => <div>{row.getValue<number>('marketOHLC.open')}</div>
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['marketOHLC.ohlc.high']} />
    ),
    accessorFn: (row) => row.marketOHLC?.ohlc?.[0]?.high,
    id: 'marketOHLC.high',
    cell: ({ row }) => <div>{row.getValue<number>('marketOHLC.high')}</div>
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['marketOHLC.ohlc.low']} />
    ),
    accessorFn: (row) => row.marketOHLC?.ohlc?.[0]?.low,
    id: 'marketOHLC.low',
    cell: ({ row }) => <div>{row.getValue<number>('marketOHLC.low')}</div>
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['ltpc.cp']} />
    ),
    accessorFn: (row) => row.ltpc?.cp,
    id: 'ltpc.cp',
    cell: ({ row }) => <div>{row.getValue<number>('ltpc.cp')}</div>,
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['marketLevel.bidAskQuote']} />
    ),
    accessorFn: (row) => row.marketLevel?.bidAskQuote,
    enableSorting: false,
    id: 'marketLevel.bidAskQuote',
    cell: ({ row }) => {
      const bidAskQuote = row.getValue<BidAskQuote[]>('marketLevel.bidAskQuote')
      const headers = [
        { key: 'bq', title: columnTitleMapping['marketLevel.bidAskQuote.bq'] },
        { key: 'bp', title: columnTitleMapping['marketLevel.bidAskQuote.bp'] },
        { key: 'bno', title: columnTitleMapping['marketLevel.bidAskQuote.bno'] },
        { key: 'aq', title: columnTitleMapping['marketLevel.bidAskQuote.aq'] },
        { key: 'ap', title: columnTitleMapping['marketLevel.bidAskQuote.ap'] },
        { key: 'ano', title: columnTitleMapping['marketLevel.bidAskQuote.ano'] },
      ];
      return (
        <DataDialog title={columnTitleMapping['marketLevel.bidAskQuote']} data={bidAskQuote} headers={headers} />
      )
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['marketOHLC.ohlc']} />
    ),
    accessorFn: (row) => row.marketOHLC?.ohlc,
    enableSorting: false,
    id: 'marketOHLC.ohlc',
    cell: ({ row }) => {
      const ohlcData = row.getValue<OHLC[]>('marketOHLC.ohlc');
      const headers = [
        { key: 'interval', title: columnTitleMapping['marketOHLC.ohlc.interval'] },
        { key: 'open', title: columnTitleMapping['marketOHLC.ohlc.open'] },
        { key: 'high', title: columnTitleMapping['marketOHLC.ohlc.high'] },
        { key: 'low', title: columnTitleMapping['marketOHLC.ohlc.low'] },
        { key: 'close', title: columnTitleMapping['marketOHLC.ohlc.close'] },
        { key: 'volume', title: columnTitleMapping['marketOHLC.ohlc.volume'] },
        { key: 'ts', title: columnTitleMapping['marketOHLC.ohlc.ts'] },
        { key: 'vol', title: columnTitleMapping['marketOHLC.ohlc.vol'] },
      ];
      return (
        <DataDialog title={columnTitleMapping['marketOHLC.ohlc']} data={ohlcData} headers={headers} />
      );
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['eFeedDetails']} />
    ),
    accessorFn: (row) => row.eFeedDetails,
    enableSorting: false,
    id: 'eFeedDetails',
    cell: ({ row }) => {
      const eFeedDetailsData = row.getValue<any>('eFeedDetails');
      const headers = [
        { key: 'atp', title: columnTitleMapping['eFeedDetails.atp'] },
        { key: 'cp', title: columnTitleMapping['eFeedDetails.cp'] },
        { key: 'vtt', title: columnTitleMapping['eFeedDetails.vtt'] },
        { key: 'oi', title: columnTitleMapping['eFeedDetails.oi'] },
        { key: 'tbq', title: columnTitleMapping['eFeedDetails.tbq'] },
        { key: 'tsq', title: columnTitleMapping['eFeedDetails.tsq'] },
        { key: 'lc', title: columnTitleMapping['eFeedDetails.lc'] },
        { key: 'uc', title: columnTitleMapping['eFeedDetails.uc'] },
        { key: 'fp', title: columnTitleMapping['eFeedDetails.fp'] },
        { key: 'fv', title: columnTitleMapping['eFeedDetails.fv'] },
        { key: 'dhoi', title: columnTitleMapping['eFeedDetails.dhoi'] },
        { key: 'dloi', title: columnTitleMapping['eFeedDetails.dloi'] },
        { key: 'poi', title: columnTitleMapping['eFeedDetails.poi'] },
      ];

      return (
        <DataDialog
          title={columnTitleMapping['eFeedDetails']}
          data={[eFeedDetailsData]}
          headers={headers}
        />
      );
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['optionGreeks']} />
    ),
    accessorFn: (row) => row.optionGreeks,
    enableSorting: false,
    id: 'optionGreeks',
    cell: ({ row }) => {
      const optionGreeks = row.getValue<OptionGreeks>('optionGreeks');
      const headers = [
        { key: 'op', title: columnTitleMapping['optionGreeks.op'] },
        { key: 'up', title: columnTitleMapping['optionGreeks.up'] },
        { key: 'iv', title: columnTitleMapping['optionGreeks.iv'] },
        { key: 'delta', title: columnTitleMapping['optionGreeks.delta'] },
        { key: 'theta', title: columnTitleMapping['optionGreeks.theta'] },
        { key: 'gamma', title: columnTitleMapping['optionGreeks.gamma'] },
        { key: 'vega', title: columnTitleMapping['optionGreeks.vega'] },
        { key: 'rho', title: columnTitleMapping['optionGreeks.rho'] },
      ];
      return (
        <DataDialog title={columnTitleMapping['optionGreeks']} data={[optionGreeks]} headers={headers} />
      );
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['ltpc.date']} />
    ),
    accessorFn: (row) => row.ltpc?.ltt,
    id: 'ltpc.date',
    cell: ({ row }) => {
      const rawTimestamp = row.getValue<string>('ltpc.date');
      const formattedDate = formatDate(rawTimestamp);
      return <div>{formattedDate}</div>;
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnTitleMapping['ltpc.time']} />
    ),
    accessorFn: (row) => row.ltpc?.ltt,
    id: 'ltpc.time',
    cell: ({ row }) => {
      const rawTimestamp = row.getValue<string>('ltpc.time');
      const formattedTime = formatTime(rawTimestamp);
      return <div>{formattedTime}</div>;
    },
  },

  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]