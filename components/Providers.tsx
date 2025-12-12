"use client";

import { BookberryProvider } from '@/lib/store';
import { ToastProvider } from './ui/Toast';
import { Navbar } from './Navbar';
import { ConvexClientProvider } from './ConvexClientProvider';
import { Authenticated } from 'convex/react';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <ConvexClientProvider>
                <BookberryProvider>
                    <Authenticated>
                        <Navbar />
                    </Authenticated>
                    {children}
                </BookberryProvider>
            </ConvexClientProvider>
        </ToastProvider>
    );
}
