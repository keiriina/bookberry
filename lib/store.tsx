"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserBook, Book, ReadingStatus } from '@/lib/types';
interface BookberryContextType {
    library: UserBook[];
    addBook: (book: Book, status?: ReadingStatus) => void;
    updateBookStatus: (id: string, status: ReadingStatus) => void;
    updateProgress: (id: string, page: number) => void;
    rateBook: (id: string, rating: number, review?: string) => void;
    removeBook: (id: string) => void;
    clearLibrary: () => void;
}

const BookberryContext = createContext<BookberryContextType | undefined>(undefined);

export function BookberryProvider({ children }: { children: React.ReactNode }) {
    const [library, setLibrary] = useState<UserBook[]>([]);

    useEffect(() => {
        // Load from local storage
        const saved = localStorage.getItem('bookberry_library');
        if (saved) {
            setLibrary(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (library.length > 0) {
            localStorage.setItem('bookberry_library', JSON.stringify(library));
        } else {
            // Check if we previously had data; if library is empty we might want to clear LS too
            // to avoid sync issues if we reload.
            if (localStorage.getItem('bookberry_library')) {
                localStorage.removeItem('bookberry_library');
            }
        }
    }, [library]);

    const addBook = (book: Book, status: ReadingStatus = 'WANT_TO_READ') => {
        if (library.find(b => b.id === book.id)) return;
        const newBook: UserBook = {
            ...book,
            status,
            addedAt: new Date().toISOString()
        };
        setLibrary(prev => [...prev, newBook]);
    };

    const updateBookStatus = (id: string, status: ReadingStatus) => {
        setLibrary(prev => prev.map(book =>
            book.id === id ? { ...book, status } : book
        ));
    };

    const updateProgress = (id: string, page: number) => {
        setLibrary(prev => prev.map(book =>
            book.id === id ? { ...book, userCurrentPage: page } : book
        ));
    };

    const rateBook = (id: string, rating: number, review?: string) => {
        setLibrary(prev => prev.map(book =>
            book.id === id ? { ...book, userRating: rating, review, status: 'COMPLETED' } : book
        ));
    };

    const removeBook = (id: string) => {
        setLibrary(prev => prev.filter(b => b.id !== id));
    };

    const clearLibrary = () => {
        setLibrary([]);
        localStorage.removeItem('bookberry_library');
    };

    return (
        <BookberryContext.Provider value={{ library, addBook, updateBookStatus, updateProgress, rateBook, removeBook, clearLibrary }}>
            {children}
        </BookberryContext.Provider>
    );
}

export function useBookberry() {
    const context = useContext(BookberryContext);
    if (context === undefined) {
        throw new Error('useBookberry must be used within a BookberryProvider');
    }
    return context;
}
