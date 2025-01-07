import { useState, useEffect, useRef } from 'react';
import { PriceChange } from '../data/types';

export const usePriceChangeText = (currentPrice: number): { priceChange: PriceChange, className: string } => {
    const [priceChange, setPriceChange] = useState<PriceChange>('same');
    const previousPrice = useRef<number | null>(null);
    const [className, setClassName] = useState<string>('');

    useEffect(() => {
        if (previousPrice.current !== null) {
            if (currentPrice === 0) {
                setPriceChange('same');
                setClassName('');
            } else if (currentPrice < previousPrice.current) {
                setPriceChange('down');
                setClassName('text-red-500 font-semibold');
            } else if (currentPrice > previousPrice.current) {
                setPriceChange('up');
                setClassName('text-green-500 font-semibold');
            } else {
                setPriceChange('same');
                setClassName('text-gray-500');
            }
        }

        previousPrice.current = currentPrice;
    }, [currentPrice]);

    return { priceChange, className };
};

export const usePriceChangeIcon = (currentPrice: number): string | undefined => {
    const [icon, setIcon] = useState<string | undefined>(undefined);
    const previousPrice = useRef<number | null>(null);

    useEffect(() => {
        if (previousPrice.current !== null) {
            if (currentPrice === 0) {
                setIcon(undefined);
            } else if (currentPrice < previousPrice.current) {
                setIcon('-');
            } else if (currentPrice > previousPrice.current) {
                setIcon('+');
            } else {
                setIcon(undefined);
            }
        }

        previousPrice.current = currentPrice;
    }, [currentPrice]);

    return icon;
};
