import { useState, useEffect, useRef } from 'react';
import { PriceChange } from '../data/types';

export const usePriceChange = (currentPrice: number): PriceChange => {
    const [priceChange, setPriceChange] = useState<PriceChange>('same');
    const previousPrice = useRef<number | null>(null);

    useEffect(() => {
        if (previousPrice.current !== null) {
            if (currentPrice < previousPrice.current) {
                setPriceChange('down');
            } else if (currentPrice > previousPrice.current) {
                setPriceChange('up');
            } else {
                setPriceChange('same');
            }
        }

        previousPrice.current = currentPrice;
    }, [currentPrice]);

    return priceChange;
};