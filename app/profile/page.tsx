"use client";

import { useBookberry } from '@/lib/store';
import { BookCard } from '@/components/BookCard';
import { ReadingStatus } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, LayoutGrid, List, ChevronDown } from 'lucide-react';

export default function ProfilePage() {
    const { library, clearLibrary } = useBookberry();
    const [activeFilter, setActiveFilter] = useState<ReadingStatus>('COMPLETED');
    const [sortBy, setSortBy] = useState<'date' | 'rating' | 'title'>('date');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [isSortOpen, setIsSortOpen] = useState(false);

    const filteredLibrary = useMemo(() => {
        let books = library.filter(b => b.status === activeFilter);

        // If filtering by ALL, maybe exclude 'READING' to avoid dupes? 
        // Usually 'Library' implies everything. But let's show all for now.

        return books.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
            }
            if (sortBy === 'rating') {
                return (b.userRating || 0) - (a.userRating || 0);
            }
            if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });
    }, [library, activeFilter, sortBy]);

    return (
        <main className="min-h-screen bg-[var(--color-accent-pink)] px-6 py-10">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm">
                            🍓
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-[var(--color-primary-green)]">My Berry Shelf</h1>
                            <p className="text-gray-500">{library.length} books collected</p>
                        </div>
                    </div>
                    {library.length > 0 && (
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to remove all books from your shelf? This cannot be undone.')) {
                                    clearLibrary();
                                }
                            }}
                            className="text-xs font-bold text-red-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                        >
                            Clear Shelf
                        </button>
                    )}
                </div>



                {/* Library List */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        {/* Filters (Left) */}
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
                        {filteredLibrary.map(book => (
                            <BookCard key={book.id} book={book} isLibraryMode viewMode={viewMode} />
                        ))}
                    </div>

                    {filteredLibrary.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            No books found in this category. Time to add some!
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}
