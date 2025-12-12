"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { Check, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={clsx(
                            "pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transform transition-all animate-in slide-in-from-bottom-5 fade-in duration-300 border-2",
                            toast.type === 'success' && "bg-[#9FAA74] border-[#4A6644] text-[#4A6644]",
                            toast.type === 'error' && "bg-red-100 border-red-200 text-red-800",
                            toast.type === 'info' && "bg-[#F4C7D0] border-[#F4C7D0] text-[#C66F80]"
                        )}
                    >
                        {toast.type === 'success' && <div className="bg-[#4A6644] p-1 rounded-full text-white"><Check size={14} strokeWidth={4} /></div>}
                        {toast.type === 'error' && <div className="bg-red-200 p-1 rounded-full text-red-700"><X size={14} strokeWidth={4} /></div>}
                        {toast.type === 'info' && <div className="bg-[#C66F80] p-1 rounded-full text-white"><Info size={14} strokeWidth={4} /></div>}
                        <span className="font-bold text-sm tracking-wide">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
