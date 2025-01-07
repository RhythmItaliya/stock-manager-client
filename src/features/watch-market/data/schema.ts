import { z } from 'zod'

const bidAskQuoteSchema = z.object({
  bq: z.number(), // Bid quantity
  bp: z.number(), // Bid price
  bno: z.number(), // Bid number of orders
  aq: z.number(), // Ask quantity
  ap: z.number(), // Ask price
  ano: z.number(), // Ask number of orders
  bidQ: z.string(), // Bid quantity as string
  askQ: z.string(), // Ask quantity as string
})

// Define schema for OptionGreeks
const optionGreeksSchema = z.object({
  op: z.number(), // Option price
  up: z.number(), // Underlying price
  iv: z.number(), // Implied volatility
  delta: z.number(), // Delta
  theta: z.number(), // Theta
  gamma: z.number(), // Gamma
  vega: z.number(), // Vega
  rho: z.number(), // Rho
})

// Define schema for OHLC (Open, High, Low, Close)
const ohlcSchema = z.object({
  interval: z.string(), // Time interval (e.g., "1d")
  open: z.number(), // Open price
  high: z.number(), // High price
  low: z.number(), // Low price
  close: z.number(), // Close price
  volume: z.number(), // Volume
  ts: z.string(), // Timestamp as string
  vol: z.number(), // Vol
})

// Define schema for EFeedDetails
const eFeedDetailsSchema = z.object({
  atp: z.number(), // Average traded price
  cp: z.number(), // Change percentage
  vtt: z.string(), // Volume traded today as string
  oi: z.number(), // Open interest
  tbq: z.number(), // Total bid quantity
  tsq: z.number(), // Total sell quantity
  lc: z.number(), // Lower circuit
  uc: z.number(), // Upper circuit
  fp: z.number(), // Future price
  fv: z.number(), // Future volume
  dhoi: z.number(), // Day's high open interest
  dloi: z.number(), // Day's low open interest
  poi: z.number(), // Previous open interest
})

// Define schema for Ltpc (Last Traded Price and related details)
const ltpcSchema = z.object({
  ltp: z.number(), // Last traded price
  ltt: z.string(), // Last traded time (timestamp)
  ltq: z.string(), // Last traded quantity
  cp: z.number(), // Change percentage
})

// Define schema for MarketLevel (Bid/Ask Quotes)
const marketLevelSchema = z.object({
  bidAskQuote: z.array(bidAskQuoteSchema), // Array of bid/ask quotes
})

// Define schema for WatchMarket
const watchMarketSchema = z.object({
  id: z.string(), // Unique market ID
  displayName: z.string(), // Market display name
  ltpc: ltpcSchema, // Last traded price and related details
  marketLevel: marketLevelSchema, // Market level details (bid/ask quotes)
  optionGreeks: optionGreeksSchema, // Option Greeks
  marketOHLC: z.object({
    ohlc: z.array(ohlcSchema), // OHLC data
  }),
  eFeedDetails: eFeedDetailsSchema, // eFeed related data
})

export type WatchMarket = z.infer<typeof watchMarketSchema>
export type WatchMarketsList = z.infer<typeof WatchMarketsListSchema>

export const WatchMarketsListSchema = z.array(watchMarketSchema)
