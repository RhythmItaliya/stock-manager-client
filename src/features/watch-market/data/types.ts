// types.ts

export interface BidAskQuote {
  bq: number // Bid quantity
  bp: number // Bid price
  bno: number // Bid number of orders
  aq: number // Ask quantity
  ap: number // Ask price
  ano: number // Ask number of orders
  bidQ: string // Bid quantity as a string
  askQ: string // Ask quantity as a string
}

export interface OptionGreeks {
  op: number // Option price
  up: number // Underlying price
  iv: number // Implied volatility
  delta: number // Delta
  theta: number // Theta
  gamma: number // Gamma
  vega: number // Vega
  rho: number // Rho
}

export interface OHLC {
  interval: string // Time interval, e.g., "1d"
  open: number // Open price
  high: number // High price
  low: number // Low price
  close: number // Close price
  volume: number // Volume
  ts: string // Timestamp as a string
  vol: number // Vol
}

export interface EFeedDetails {
  atp: number // Average traded price
  cp: number // Change percentage
  vtt: string // Volume traded today as a string
  oi: number // Open interest
  tbq: number // Total bid quantity
  tsq: number // Total sell quantity
  lc: number // Lower circuit limit
  uc: number // Upper circuit limit
  fp: number // Future price
  fv: number // Future volume
  dhoi: number // Day's high open interest
  dloi: number // Day's low open interest
  poi: number // Previous open interest
}

export interface MarketLevel {
  bidAskQuote: BidAskQuote[] // Array of bid/ask quotes
}

export interface Ltpc {
  ltp: number // Last traded price
  ltt: string // Last traded time (timestamp)
  ltq: string // Last traded quantity
  cp: number // Change percentage
}

export interface WatchMarket {
  id: string // Unique market ID
  displayName: string // Display name of the market
  ltpc: Ltpc // Last traded price and related details
  marketLevel: MarketLevel // Market level details (bid/ask quotes)
  optionGreeks: OptionGreeks // Option Greek values
  marketOHLC: { ohlc: OHLC[] } // OHLC data for market
  eFeedDetails: EFeedDetails // eFeed related data
}

export type PriceChange = 'up' | 'down' | 'same';

// open
// close
//  high
// bidq
// aslq