"use client";

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Use portal to render at root level to avoid z-index issues
    // Note: In Next.js App Router, purely client-side portals usually need a mounted check or just standard fixed overlay.
    // For simplicity given the environment, we'll use a fixed overlay. 
    // If strict Portal is needed, we'd need a layout element id. 
    // We'll trust fixed z-[999] works for now.

    const modalContent = (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border-4 border-[var(--color-secondary-pink)]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--color-secondary-pink)] bg-[var(--color-accent-pink)]">
                    <h2 className="text-xl font-black text-gray-800 line-clamp-1">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-red-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );

    // Render directly (React 18 handles this well usually, or use createPortal if 'document' is available)
    if (typeof document !== 'undefined') {
        return createPortal(modalContent, document.body);
    }
    return null;
}
