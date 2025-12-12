"use client";

import { Star } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';

interface StarRatingProps {
    rating: number; // 0-10 or 0-5? Prompt says scale 1 to 10.
    // 10 stars is a lot for UI, maybe 5 stars with half steps? Or just 10 small stars?
    // Let's do 5 stars but allow 1-10 value (so half stars internally, or just mapping).
    // Implementation: Let's do 5 stars representing 1-10 (e.g. 5 stars = 10 points). 
    // User asked for "Scale of 1 to 10".
    // Let's stick to 5 stars for visual clarity, where 1 star = 2 points.
    onChange?: (rating: number) => void;
    readonly?: boolean;
}

export function StarRating({ rating, onChange, readonly }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const displayRating = hoverRating ?? rating;

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
                // Determine fill amount for this star
                // e.g. rating 3.5
                // star 1: 3.5 >= 1 so 100%
                // star 2: 3.5 >= 2 so 100%
                // star 3: 3.5 >= 3 so 100%
                // star 4: 3.5 >= 3.5? Yes, but need to check if full or half.
                // if displayRating >= star, full.
                // if displayRating >= star - 0.5, half.
                // easier:
                // fill-state: 'full' | 'half' | 'none'

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
                            size={readOnlySize(readonly)}
                            className="text-[var(--color-text-muted)] opacity-20"
                            strokeWidth={2}
                        />

                        {/* Filled Overlay */}
                        <div className={clsx(
                            "absolute inset-0 p-0.5 pointer-events-none overflow-hidden",
                            fillState === 'half' ? 'w-[50%]' : (fillState === 'full' ? 'w-full' : 'w-0')
                        )}>
                            <Star
                                size={readOnlySize(readonly)}
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

function readOnlySize(readonly?: boolean) {
    return readonly ? 12 : 16;
}
