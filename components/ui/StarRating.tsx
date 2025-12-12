"use client";

import { Star } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';

interface StarRatingProps {
    rating: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    size?: number;
}

export function StarRating({ rating, onChange, readonly, size }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const displayRating = hoverRating ?? rating;
    const iconSize = size || (readonly ? 12 : 16);

    // 5 stars total (representing 0-5)
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
        if (readonly) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const x = e.clientX - rect.left;

        // If mouse is on left half, rating is (starIndex - 0.5)
        // If mouse is on right half, rating is starIndex
        const isLeftHalf = x < width / 2;
        const newRating = isLeftHalf ? starIndex - 0.5 : starIndex;

        setHoverRating(newRating);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
        if (readonly) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const x = e.clientX - rect.left;

        const isLeftHalf = x < width / 2;
        const newRating = isLeftHalf ? starIndex - 0.5 : starIndex;

        onChange?.(newRating);
    };

    return (
        <div className="flex flex-wrap items-center gap-0.5 group">
            {stars.map((star) => {
                let fillState: 'full' | 'half' | 'none' = 'none';
                if (displayRating >= star) {
                    fillState = 'full';
                } else if (displayRating >= star - 0.5) {
                    fillState = 'half';
                }

                return (
                    <button
                        key={star}
                        type="button"
                        disabled={readonly}
                        onClick={(e) => handleClick(e, star)}
                        onMouseMove={(e) => handleMouseMove(e, star)}
                        onMouseLeave={() => !readonly && setHoverRating(null)}
                        className={clsx(
                            "relative transition-transform focus:outline-none p-0.5",
                            !readonly && "hover:scale-110 cursor-pointer",
                            readonly && "cursor-default"
                        )}
                    >
                        {/* Base Empty Star */}
                        <Star
                            size={iconSize}
                            className="text-[var(--color-text-muted)] opacity-20"
                            strokeWidth={2}
                        />

                        {/* Filled Overlay */}
                        <div className={clsx(
                            "absolute inset-0 p-0.5 pointer-events-none overflow-hidden",
                            fillState === 'half' ? 'w-[50%]' : (fillState === 'full' ? 'w-full' : 'w-0')
                        )}>
                            <Star
                                size={iconSize}
                                className="fill-[var(--color-secondary-green)] text-[var(--color-secondary-green)]"
                                strokeWidth={2}
                            />
                        </div>
                    </button>
                );
            })}
            <span className="ml-2 text-[10px] font-bold text-[var(--color-text-muted)] min-w-max">{rating}/5</span>
        </div>
    );
}
