export const columnTitleMapping: Record<string, string> = {
  displayName: 'Market Name',
  'ltpc.ltp': 'Last Traded Price',
  'ltpc.ltt': 'Last Traded Time',
  'ltpc.date': 'Last Traded Date',
  'ltpc.time': 'Last Traded Time',
  'ltpc.ltq': 'Last Traded Quantity',
  'ltpc.cp': 'Close Price',

  'ltpc.cp-t': 'Change Percentage',

  'marketLevel.bidAskQuote': 'Bid/Ask Quote',
  'marketLevel.bidAskQuote.bq': 'Bid Quantity',
  'marketLevel.bidAskQuote.bp': 'Bid Price',
  'marketLevel.bidAskQuote.bno': 'Bid Number of Orders',
  'marketLevel.bidAskQuote.aq': 'Ask Quantity',
  'marketLevel.bidAskQuote.ap': 'Ask Price',
  'marketLevel.bidAskQuote.ano': 'Ask Number of Orders',
  'marketLevel.bidAskQuote.bidQ': 'Bid Quantity',
  'marketLevel.bidAskQuote.askQ': 'Ask Quantity',

  optionGreeks: 'Option Greeks',
  'optionGreeks.op': 'Option Price',
  'optionGreeks.up': 'Underlying Price',
  'optionGreeks.iv': 'Implied Volatility',
  'optionGreeks.delta': 'Delta',
  'optionGreeks.theta': 'Theta',
  'optionGreeks.gamma': 'Gamma',
  'optionGreeks.vega': 'Vega',
  'optionGreeks.rho': 'Rho',

  'marketOHLC.ohlc': 'OHLC Data Feed',
  'marketOHLC.ohlc.interval': 'Interval',
  'marketOHLC.ohlc.open': 'Open Price',
  'marketOHLC.ohlc.high': 'High Price',
  'marketOHLC.ohlc.low': 'Low Price',
  'marketOHLC.ohlc.close': 'Close Price',
  'marketOHLC.ohlc.volume': 'Volume',
  'marketOHLC.ohlc.ts': 'Timestamp',
  'marketOHLC.ohlc.vol': 'Volume (Alternative)',

  'marketOHLC.open': 'Open Price',
  'marketOHLC.high': 'High Price',
  'marketOHLC.low': 'Low Price',

  eFeedDetails: 'E-Feed Details',
  'eFeedDetails.atp': 'Average Traded Price (ATP)',
  'eFeedDetails.cp': 'Change Percentage (CP)',
  'eFeedDetails.vtt': 'Volume Traded Today (VTT)',
  'eFeedDetails.oi': 'Open Interest (OI)',
  'eFeedDetails.tbq': 'Total Bid Quantity (TBQ)',
  'eFeedDetails.tsq': 'Total Sell Quantity (TSQ)',
  'eFeedDetails.lc': 'Lower Circuit Limit (LC)',
  'eFeedDetails.uc': 'Upper Circuit Limit (UC)',
  'eFeedDetails.fp': 'Future Price (FP)',
  'eFeedDetails.fv': 'Future Volume (FV)',
  'eFeedDetails.dhoi': 'Day’s High Open Interest (DHOI)',
  'eFeedDetails.dloi': 'Day’s Low Open Interest (DLOI)',
  'eFeedDetails.poi': 'Previous Open Interest (POI)',
  actions: 'Actions',
}
