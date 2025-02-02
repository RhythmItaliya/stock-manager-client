import { create } from 'zustand'

interface MarketWatchState {
  defaultMarketWatch: string | null
  setDefaultMarketWatch: (marketName: string) => void
  resetDefaultMarketWatch: () => void
}

export const useMarketWatchStore = create<MarketWatchState>((set) => ({
  defaultMarketWatch: null,
  setDefaultMarketWatch: (marketName: string) =>
    set({ defaultMarketWatch: marketName }),
  resetDefaultMarketWatch: () => set({ defaultMarketWatch: null }),
}))
