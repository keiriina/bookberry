"use client";

import { useRouter } from 'next/navigation';
import { Book, UserBook, ReadingStatus } from '@/lib/types';
import { useBookberry } from '@/lib/store';
import { useToast } from './ui/Toast';
import { ProgressBar } from './ui/ProgressBar';
import { StarRating } from './ui/StarRating';
import { StrawberryLogo } from './ui/StrawberryLogo';
import { useState } from 'react';
import { clsx } from 'clsx';

interface BookCardProps {
    book: Book | UserBook;
    isLibraryMode?: boolean;
    viewMode?: 'grid' | 'list';
    readOnly?: boolean;
    onBookClick?: () => void;
}

export function BookCard({ book, isLibraryMode = false, viewMode = 'list', readOnly = false, onBookClick }: BookCardProps) {
    const { addBook, updateProgress, rateBook, updateBookStatus, removeBook } = useBookberry();
    const router = useRouter();
    const { addToast } = useToast();

    const handleBookClick = () => {
        onBookClick?.();
        router.push(`/books/${book.id}`);
    };

    // Progress State
    const userBook = isLibraryMode ? (book as UserBook) : undefined;
    const [pageInput, setPageInput] = useState(userBook?.userCurrentPage || 0);
    const [isEditingProgress, setIsEditingProgress] = useState(false);

    const handleSaveProgress = () => {
        updateProgress(book.id, pageInput);
        setIsEditingProgress(false);
        addToast('Progress updated!', 'success');
    };

    // Date formatter
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (viewMode === 'grid' && isLibraryMode) {
        return (
            <>
                <div
                    onClick={handleBookClick}
                    className="group relative aspect-[2/3] bg-[var(--color-accent-pink)] rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-pointer border border-[var(--color-secondary-pink)]"
                >
                    {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-2 w-full h-full opacity-50">
                            <StrawberryLogo className="w-8 h-10" />
                        </div>
                    )}

                    {/* Rating Overlay for Completed Books */}
                    {userBook?.status === 'COMPLETED' && userBook.userRating && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 flex justify-center">
                            <div className="scale-75 origin-bottom">
                                <StarRating rating={userBook.userRating} readonly={true} />
                            </div>
                        </div>
                    )}
                </div>

            </>
        );
    }

    return (
        <>
            <div className={clsx(
                "group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-[var(--color-accent-pink)] flex items-start gap-4",
                viewMode === 'list' && "w-full"
            )}>
                {/* Cover Image */}
                <div
                    onClick={handleBookClick}
                    className="relative w-24 h-36 flex-shrink-0 shadow-md rounded-md overflow-hidden bg-[var(--color-accent-pink)] flex items-center justify-center border border-[var(--color-secondary-pink)] cursor-pointer hover:opacity-90 transition-opacity"
                >
                    {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-2 w-full h-full bg-[var(--color-accent-pink)]/50">
                            <StrawberryLogo className="w-12 h-16 opacity-90" />
                            <span className="text-[10px] text-[var(--color-primary-pink)] font-bold mt-2 leading-tight">No Cover</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                        <h3
                            onClick={handleBookClick}
                            className="font-bold text-[var(--color-text-main)] line-clamp-2 leading-tight mb-1 truncate cursor-pointer hover:text-[var(--color-primary-pink)] transition-colors"
                        >
                            {book.title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-muted)] mb-2 truncate">{book.authors?.join(', ')}</p>

                        {/* Date Added */}
                        {isLibraryMode && userBook && (
                            <p className="text-[10px] text-gray-400 font-medium mb-2">
                                Added {formatDate(userBook.addedAt)}
                            </p>
                        )}

                        {isLibraryMode && userBook?.status === 'READING' && (
                            <div className="mt-3 space-y-2">
                                <div className="flex justify-between items-end text-xs font-bold text-[var(--color-text-muted)] px-1">
                                    <span>
                                        Page <span className="text-[var(--color-text-main)]">{userBook.userCurrentPage || 0}</span>
                                        <span className="font-normal text-gray-400"> of {book.pageCount}</span>
                                    </span>
                                    <span className="text-[var(--color-primary-pink)] bg-[var(--color-accent-pink)] px-2 py-0.5 rounded-full text-[10px]">
                                        {Math.round(((userBook.userCurrentPage || 0) / (book.pageCount || 1)) * 100)}%
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <ProgressBar current={userBook.userCurrentPage || 0} total={book.pageCount} showLabel={false} />
                                    </div>

                                    {!readOnly && (
                                        <div className="flex items-center bg-[var(--color-bg-secondary)] rounded-full p-1 shadow-inner border border-transparent hover:border-[var(--color-secondary-pink)] transition-colors flex-shrink-0">
                                            <button
                                                onClick={() => updateProgress(book.id, Math.max(0, (userBook.userCurrentPage || 0) - 1))}
                                                className="w-7 h-7 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-white hover:shadow-sm hover:text-[var(--color-primary-pink)] transition-all flex-shrink-0"
                                            >
                                                -
                                            </button>
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (pageInput !== (userBook.userCurrentPage || 0)) {
                                                        handleSaveProgress();
                                                    }
                                                }}
                                                className="w-14 mx-1"
                                            >
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={book.pageCount}
                                                        value={pageInput}
                                                        onChange={(e) => setPageInput(Number(e.target.value))}
                                                        onBlur={() => {
                                                            if (pageInput !== (userBook.userCurrentPage || 0)) {
                                                                handleSaveProgress();
                                                            }
                                                        }}
                                                        className="w-full text-center text-sm font-bold bg-transparent border-none outline-none text-[var(--color-text-main)] p-0 focus:ring-0"
                                                    />
                                                </div>
                                            </form>
                                            <button
                                                onClick={() => updateProgress(book.id, Math.min(book.pageCount, (userBook.userCurrentPage || 0) + 1))}
                                                className="w-7 h-7 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-white hover:shadow-sm hover:text-[var(--color-primary-pink)] transition-all flex-shrink-0"
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {isLibraryMode && userBook?.status === 'COMPLETED' && (
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center gap-2">
                                    <StarRating rating={userBook.userRating || 0} readonly={true} />
                                </div>

                                {/* Read-Only Review */}
                                {userBook.review && (
                                    <div className="mt-3 text-sm text-[var(--color-text-main)] leading-relaxed whitespace-pre-wrap break-words">
                                        {userBook.review}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>

        </>
    );
}
