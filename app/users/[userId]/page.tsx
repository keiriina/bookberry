"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BookCard } from '@/components/BookCard';
import { ReadingStatus } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, LayoutGrid, List, ChevronDown, User, Loader2 } from 'lucide-react';
import { UserBook } from "@/lib/types";

export default function UserProfilePage() {
    const params = useParams();
    const userId = params.userId as string;

    const userProfile = useQuery(api.users.getPublicProfile, { userId });
    const userBooks = useQuery(api.books.getPublicBooks, { userId });

    const [activeFilter, setActiveFilter] = useState<ReadingStatus>('COMPLETED');
    const [sortBy, setSortBy] = useState<'date' | 'rating' | 'title'>('date');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Filter and Sort Logic (Client-Side for now, as volume is low)
    const filteredLibrary = useMemo(() => {
        if (!userBooks) return [];
        let books = userBooks.filter((b: any) => b.status === activeFilter);
        return books.sort((a: any, b: any) => {
            if (sortBy === 'date') return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
            if (sortBy === 'rating') return (b.userRating || 0) - (a.userRating || 0);
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            return 0;
        });
    }, [userBooks, activeFilter, sortBy]);

    if (userProfile === undefined || userBooks === undefined) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--color-primary-green)]" size={48} />
            </div>
        );
    }

    if (userProfile === null) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center flex-col">
                <div className="text-2xl font-bold text-[var(--color-text-main)]">User Not Found</div>
                <div className="text-[var(--color-text-muted)]">This user does not exist or has no profile.</div>
            </div>
        );
    }

    // Since we don't have Clerk user object here for arbitrary users, we fall back to placeholders or stored Convex data if available (e.g., username).
    // Convex `users` table has `username`. We don't have the avatar URL stored in Convex currently (it was coming from Clerk `user.imageUrl`). 
    // We can use a placeholder avatar.

    const bookCount = userBooks.length;
    const completedCount = userBooks.filter((b: any) => b.status === 'COMPLETED').length;
    const goal = userProfile.readingGoal || 10;
    const progressPercentage = Math.min(100, Math.round((completedCount / goal) * 100));

    return (
        <main className="min-h-screen bg-[var(--color-accent-pink)] px-8 py-12">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Profile Header Block */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-secondary-pink)] flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar Placeholder */}
                    <div className="w-24 h-24 rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center text-[var(--color-primary-pink)] border-4 border-[var(--color-accent-pink)]">
                        <span className="text-3xl font-black">
                            {(userProfile.username?.[0] || "U").toUpperCase()}
                        </span>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-black text-[var(--color-text-main)] mb-2">
                            {userProfile.username || "Anonymous User"}
                        </h1>
                        <p className="text-[var(--color-text-muted)] font-medium">
                            {bookCount} books in collection
                        </p>
                    </div>

                    {/* Simple Goal Stat */}
                    <div className="bg-[var(--color-primary-green)] text-white p-6 rounded-2xl min-w-[200px] text-center shadow-lg transform rotate-1">
                        <div className="text-3xl font-black mb-1">{completedCount}/{goal}</div>
                        <div className="text-xs opacity-90 uppercase font-bold tracking-widest">
                            Goal Progress
                        </div>
                    </div>
                </div>

                {/* Library Section */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 items-center bg-white p-2 rounded-xl shadow-sm">
                            <div className="flex items-center px-2 text-gray-400">
                                <Filter size={18} />
                            </div>
                            {['COMPLETED', 'READING', 'WANT_TO_READ'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setActiveFilter(status as any)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === status
                                        ? 'bg-[var(--color-primary-green)] text-white shadow-sm'
                                        : 'hover:bg-gray-100 text-gray-500'
                                        }`}
                                >
                                    {status.replace(/_/g, ' ')}
                                </button>
                            ))}
                        </div>

                        {/* Sort & View (Right) */}
                        <div className="flex gap-4">
                            {/* View Toggle */}
                            <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-[100px]">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all flex-1 flex justify-center ${viewMode === 'grid'
                                        ? 'bg-[var(--color-primary-green)] text-white shadow-sm'
                                        : 'text-gray-400 hover:bg-gray-50'}`}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all flex-1 flex justify-center ${viewMode === 'list'
                                        ? 'bg-[var(--color-primary-green)] text-white shadow-sm'
                                        : 'text-gray-400 hover:bg-gray-50'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>

                            {/* Sort */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors w-[180px]"
                                >
                                    <div className="flex items-center px-2 text-gray-400">
                                        <ArrowUpDown size={18} />
                                    </div>
                                    <span className="flex-1 text-left text-xs font-bold text-gray-600">
                                        {sortBy === 'date' && 'Date Added'}
                                        {sortBy === 'rating' && 'Rating'}
                                        {sortBy === 'title' && 'Title'}
                                    </span>
                                    <div className="px-2 text-gray-400">
                                        <ChevronDown size={16} />
                                    </div>
                                </button>

                                {isSortOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsSortOpen(false)}
                                        />
                                        <div className="absolute right-0 top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                            {[
                                                { value: 'date', label: 'Date Added' },
                                                { value: 'rating', label: 'Rating' },
                                                { value: 'title', label: 'Title' }
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSortBy(option.value as any);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${sortBy === option.value
                                                        ? 'text-[var(--color-primary-green)] bg-[var(--color-accent-pink)]/50'
                                                        : 'text-gray-600 hover:bg-[var(--color-accent-pink)]/30'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
                        : "flex flex-col gap-4"
                    }>
                        {filteredLibrary.map((book: any) => (
                            // Use BookCard in a "Read Only" mode if possible. 
                            // The current BookCard has isLibraryMode meant for the owner (it opens edit modal).
                            // We need a mode that just shows details without edit capability.
                            // However, let's reuse isLibraryMode=true but we might need to suppress the edit actions.
                            // Or better, passing a new prop `readOnly`.
                            <BookCard
                                key={book.id}
                                book={book as UserBook}
                                isLibraryMode={true}
                                viewMode={viewMode}
                            // Hack: We treat it as library mode for display, but we need to ensure actions are disabled.
                            // I will update BookCard to accept `readOnly` prop to hide edit buttons.
                            />
                        ))}
                    </div>

                    {filteredLibrary.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            {userProfile.username || "This user"} hasn't added any books to this shelf yet.
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
