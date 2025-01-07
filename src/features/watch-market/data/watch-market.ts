import { WatchMarketsListSchema } from './schema'
import { WatchMarket } from './types'

/**
 * Transforms and validates raw data into WatchMarket objects.
 * @param rawData - The raw data to process
 * @returns An array of validated WatchMarket objects
 */
const WatchMarketsData = (rawData: any): WatchMarket[] => {
  const transformedData = Object.keys(rawData).map((instrumentKey) => {
    const feed = rawData[instrumentKey]?.ff?.marketFF || {}

    const ltpc = feed.ltpc || {}

    return {
      id: instrumentKey,
      displayName: instrumentKey,
      ltpc: {
        ltp: ltpc?.ltp || 0,
        ltt: String(ltpc?.ltt || ''),
        ltq: String(ltpc?.ltq || ''),
        cp: ltpc?.cp || 0,
      },
      marketLevel: {
        bidAskQuote: (feed.marketLevel?.bidAskQuote || []).map(
          (quote: any) => ({
            bq: quote?.bq || 0,
            bp: quote?.bp || 0,
            bno: quote?.bno || 0,
            aq: quote?.aq || 0,
            ap: quote?.ap || 0,
            ano: quote?.ano || 0,
            bidQ: String(quote?.bidQ || ''),
            askQ: String(quote?.askQ || ''),
          })
        ),
      },
      optionGreeks: {
        op: feed.optionGreeks?.op || 0,
        up: feed.optionGreeks?.up || 0,
        iv: feed.optionGreeks?.iv || 0,
        delta: feed.optionGreeks?.delta || 0,
        theta: feed.optionGreeks?.theta || 0,
        gamma: feed.optionGreeks?.gamma || 0,
        vega: feed.optionGreeks?.vega || 0,
        rho: feed.optionGreeks?.rho || 0,
      },
      marketOHLC: {
        ohlc: (feed.marketOHLC?.ohlc || []).map((ohlc: any) => ({
          interval: String(ohlc?.interval || ''),
          open: ohlc?.open || 0,
          high: ohlc?.high || 0,
          low: ohlc?.low || 0,
          close: ohlc?.close || 0,
          volume: ohlc?.volume || 0,
          ts: String(ohlc?.ts || ''),
          vol: ohlc?.vol || 0,
        })),
      },
      eFeedDetails: {
        atp: feed.eFeedDetails?.atp || 0,
        cp: feed.eFeedDetails?.cp || 0,
        vtt: String(feed.eFeedDetails?.vtt || ''),
        oi: feed.eFeedDetails?.oi || 0,
        tbq: feed.eFeedDetails?.tbq || 0,
        tsq: feed.eFeedDetails?.tsq || 0,
        lc: feed.eFeedDetails?.lc || 0,
        uc: feed.eFeedDetails?.uc || 0,
        fp: feed.eFeedDetails?.fp || 0,
        fv: feed.eFeedDetails?.fv || 0,
        dhoi: feed.eFeedDetails?.dhoi || 0,
        dloi: feed.eFeedDetails?.dloi || 0,
        poi: feed.eFeedDetails?.poi || 0,
      },
    }
  })

  const validation = WatchMarketsListSchema.safeParse(transformedData)
  if (!validation.success) {
    throw new Error(
      `Validation Error: ${JSON.stringify(validation.error.issues, null, 2)}`
    )
  }

  return validation.data
}

export default WatchMarketsData
