'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';

interface DateFacetProps {
    minYear: number;
    maxYear: number;
}

export default function DateFacetClient({ minYear, maxYear }: DateFacetProps) {
    const [range, setRange] = useState<[number, number]>([minYear, maxYear]);
    const router = useRouter();

    const isRangeLimited = minYear === maxYear;

    useEffect(() => {
        setRange([minYear, maxYear]);
    }, [minYear, maxYear]);

    const handleSliderChange = (newRange: [number, number]) => {
        setRange(newRange);
    };

    const handleInputChange = (index: 0 | 1, value: string) => {
        const newRange = [...range] as [number, number];
        const numericValue = parseInt(value, 10);
        
        if (!isNaN(numericValue) && numericValue >= minYear && numericValue <= maxYear) {
            newRange[index] = numericValue;
            if (newRange[0] > newRange[1]) {
                if (index === 0) newRange[1] = newRange[0];
                else newRange[0] = newRange[1];
            }
            setRange(newRange);
        } else if (value === '') {
            newRange[index] = index === 0 ? minYear : maxYear;
            setRange(newRange);
        }
    };
    
    const handleSubmit = () => {
        router.push(`/search?facet=date&startDate=${range[0]}&endDate=${range[1]}`);
    };

    if (isRangeLimited) {
        return (
            <div className="space-y-4 text-center text-sm text-gray-500 p-4 bg-gray-50 rounded-md">
                <p>All items are from {minYear}.</p>
                <p>Date filter is unavailable.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="w-1/2">
                    <label htmlFor="start-date" className="text-sm font-medium">Start</label>
                    <Input 
                        id="start-date"
                        type="number"
                        value={range[0]}
                        min={minYear}
                        max={maxYear}
                        onChange={(e) => handleInputChange(0, e.target.value)}
                        className="mt-1"
                        disabled={isRangeLimited}
                    />
                </div>
                <div className="w-1/2">
                    <label htmlFor="end-date" className="text-sm font-medium">End</label>
                     <Input 
                        id="end-date"
                        type="number"
                        value={range[1]}
                        min={minYear}
                        max={maxYear}
                        onChange={(e) => handleInputChange(1, e.target.value)}
                        className="mt-1"
                        disabled={isRangeLimited}
                    />
                </div>
            </div>
            <Slider 
                min={minYear}
                max={maxYear}
                step={1}
                value={range}
                onValueChange={handleSliderChange}
                disabled={isRangeLimited}
            />
            <Button onClick={handleSubmit} className="w-full" disabled={isRangeLimited}>
                Apply Date Range
            </Button>
        </div>
    );
}
