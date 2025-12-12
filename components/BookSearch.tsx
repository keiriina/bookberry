"use client";

import { useState } from 'react';
import { Book } from '@/lib/types';
import { BookCard } from '@/components/BookCard';
import { Search, Loader2 } from 'lucide-react';

export function BookSearch() {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);

    const searchBooks = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`);
            const data = await res.json();

            if (data.items) {
                const formattedBooks: Book[] = data.items.map((item: any) => ({
                    id: item.id,
                    title: item.volumeInfo.title,
                    authors: item.volumeInfo.authors || ['Unknown Author'],
                    description: item.volumeInfo.description,
                    coverUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
                    pageCount: item.volumeInfo.pageCount || 0,
                    isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier
                }));
                setBooks(formattedBooks);
            } else {
                setBooks([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <form onSubmit={searchBooks} className="relative flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, author, or ISBN..."
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-[var(--color-primary-pink)]/30 focus:border-[var(--color-primary-pink)] focus:ring-4 focus:ring-[var(--color-accent-pink)] outline-none md:text-md text-sm shadow-sm transition-all"
                />
                <Search className="absolute left-3.5 text-[var(--color-text-muted)]" size={20} />
                <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1.5 bg-[var(--color-primary-pink)] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-[var(--color-secondary-pink)] hover:text-[var(--color-primary-pink)] disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {loading && (
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-[var(--color-primary-pink)]" size={48} />
                </div>
            )}

            {!loading && books.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}

            {!loading && books.length === 0 && query && (
                <div className="text-center text-gray-400 mt-12">No books found. Try another search!</div>
            )}
        </div>
    );
}
