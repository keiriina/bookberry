import React from 'react';

export function ProgressBar({ current, total, showLabel = true }: { current: number, total: number, showLabel?: boolean }) {
    // Prevent division by zero and ensure valid number
    const safeTotal = total > 0 ? total : 1;
    const rawPercentage = (current / safeTotal) * 100;

    // Clamp between 0 and 100 and ensure no NaN
    const percentage = Math.round(Math.min(100, Math.max(0, isNaN(rawPercentage) ? 0 : rawPercentage)));

    const displayPercentage = total > 0 ? `${percentage}%` : '— %';

    return (
        <div className="w-full flex items-center gap-2">
            <div className="flex-1 h-3 bg-white rounded-full overflow-hidden border border-[var(--color-secondary-pink)] relative">
                <div
                    className="h-full bg-[var(--color-primary-green)]/80 transition-all duration-500 ease-out flex items-center justify-end pr-1"
                    style={{ width: total > 0 ? `${percentage}%` : '0%' }}
                />
            </div>
            {showLabel && (
                <span className="text-xs font-bold text-[var(--color-primary-green)] w-8 text-right">{displayPercentage}</span>
            )}
        </div>
    );
}
