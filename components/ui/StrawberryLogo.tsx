import React from 'react';
import { clsx } from 'clsx';

export function StrawberryLogo({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body */}
            <path d="M10 40C10 40 0 60 10 85C20 110 50 115 50 115C50 115 80 110 90 85C100 60 90 40 90 40H10Z" fill="#C66F80" stroke="#F4C7D0" strokeWidth="2" />
            {/* Seeds */}
            <circle cx="30" cy="60" r="2" fill="#FFFFFF" opacity="0.6" />
            <circle cx="70" cy="60" r="2" fill="#FFFFFF" opacity="0.6" />
            <circle cx="50" cy="75" r="2" fill="#FFFFFF" opacity="0.6" />
            <circle cx="30" cy="90" r="2" fill="#FFFFFF" opacity="0.6" />
            <circle cx="70" cy="90" r="2" fill="#FFFFFF" opacity="0.6" />
            {/* Leaves */}
            <path d="M50 40C50 40 40 20 20 25C20 25 30 35 35 40H50Z" fill="#4A6644" />
            <path d="M50 40C50 40 60 20 80 25C80 25 70 35 65 40H50Z" fill="#4A6644" />
            <path d="M50 40C50 40 50 15 50 10" stroke="#9FAA74" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}
