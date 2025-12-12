"use client";

import { BookberryProvider } from '@/lib/store';
import { ToastProvider } from './ui/Toast';
import { Navbar } from './Navbar';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <BookberryProvider>
                <Navbar />
                {children}
            </BookberryProvider>
        </ToastProvider>
    );
}
