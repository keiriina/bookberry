"use client";

import React, { createContext, useContext } from 'react';
import { UserBook, Book, ReadingStatus } from '@/lib/types';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

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
    // Convex Hooks
    const libraryRaw = useQuery(api.books.get);
    const addBookMutation = useMutation(api.books.add);
    const updateStatusMutation = useMutation(api.books.updateStatus);
    const updateProgressMutation = useMutation(api.books.updateProgress);
    const rateBookMutation = useMutation(api.books.rate);
    const removeBookMutation = useMutation(api.books.remove);
    const clearLibraryMutation = useMutation(api.books.clear);

    // Transform library data if needed, or default to empty array while loading
    const library: UserBook[] = (libraryRaw || []).map((book: any) => ({
        ...book,
        // Ensure status is cast correctly if needed
        status: book.status as ReadingStatus
    }));

    const addBook = (book: Book, status: ReadingStatus = 'WANT_TO_READ') => {
        // Prevent adding if already in library
        // Note: mutation inside has check, but good to check here or rely on UI to disable button
        // The BookCard logic might check 'library' prop.
        // For optimistically updates or just relying on Convex:

        addBookMutation({
            id: book.id, // Google Books ID
            title: book.title,
            authors: book.authors,
            description: book.description,
            coverUrl: book.coverUrl,
            pageCount: book.pageCount,
            isbn: book.isbn,
            status,
        });
    };

    const updateBookStatus = (id: string, status: ReadingStatus) => {
        updateStatusMutation({ id, status });
    };

    const updateProgress = (id: string, page: number) => {
        updateProgressMutation({ id, page });
    };

    const rateBook = (id: string, rating: number, review?: string) => {
        rateBookMutation({ id, rating, review });
    };

    const removeBook = (id: string) => {
        removeBookMutation({ id });
    };

    const clearLibrary = () => {
        clearLibraryMutation({});
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
