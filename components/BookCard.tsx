"use client";

import { Book, UserBook, ReadingStatus } from '@/lib/types';
import { useBookberry } from '@/lib/store';
import { useToast } from './ui/Toast';
import { ProgressBar } from './ui/ProgressBar';
import { StarRating } from './ui/StarRating';
import { StrawberryLogo } from './ui/StrawberryLogo';
import { Modal } from './ui/Modal';
import { AddToShelfModal } from './AddToShelfModal';
import { Plus, Check, Save } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

interface BookCardProps {
    book: Book | UserBook;
    isLibraryMode?: boolean;
    viewMode?: 'grid' | 'list';
}

export function BookCard({ book, isLibraryMode = false, viewMode = 'list' }: BookCardProps) {
    const { addBook, updateProgress, rateBook, updateBookStatus, removeBook } = useBookberry();
    const { addToast } = useToast();
    const [isAdding, setIsAdding] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // Progress State
    const userBook = isLibraryMode ? (book as UserBook) : undefined;
    const [pageInput, setPageInput] = useState(userBook?.userCurrentPage || 0);
    const [isEditingProgress, setIsEditingProgress] = useState(false);

    const handleConfirmAdd = (status: ReadingStatus, rating?: number, review?: string) => {
        setIsAdding(true);
        addBook(book, status);

        if (status === 'COMPLETED' && rating) {
            rateBook(book.id, rating, review);
        }

        addToast(`Added "${book.title}" to your shelf!`, 'success');
        setTimeout(() => setIsAdding(false), 2000);
    };

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
                    onClick={() => setShowDetails(true)}
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

                {/* Details Modal (Same as List View) */}
                <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title={book.title}>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-6 items-start">
                            <div className="w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden shadow-md bg-[var(--color-accent-pink)] border border-[var(--color-secondary-pink)]">
                                {book.coverUrl ? (
                                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center p-2 w-full h-full bg-[var(--color-accent-pink)]/50">
                                        <StrawberryLogo className="w-16 h-20 opacity-90" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-1">{book.title}</h3>
                                <p className="text-[var(--color-primary-pink)] font-medium mb-4">{book.authors?.join(', ')}</p>

                                {isLibraryMode && userBook && (
                                    <div className="text-xs text-gray-500 mb-2">
                                        Added on {formatDate(userBook.addedAt)}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                    {book.pageCount > 0 && <span className="bg-gray-100 px-2 py-1 rounded-md">{book.pageCount} pages</span>}
                                    {book.isbn && <span className="bg-gray-100 px-2 py-1 rounded-md">ISBN: {book.isbn}</span>}
                                </div>
                            </div>
                        </div>
                        {/* ... (rest of details modal content logic if needed or just reuse) ... */}
                        {/* We need to duplicate or extract the modal content if we return early. 
                            To avoid duplication, I will restructure the return to share the modal.
                        */}
                    </div>
                    <div className="space-y-2 mt-6">
                        <h4 className="font-bold text-[var(--color-primary-green)] text-sm uppercase tracking-wide">Synopsis</h4>
                        <div className="text-sm text-gray-600 leading-relaxed max-h-60 overflow-y-auto pr-2">
                            {book.description ? (
                                <div dangerouslySetInnerHTML={{ __html: book.description }} />
                            ) : (
                                <p className="italic text-gray-400">No synopsis available.</p>
                            )}
                        </div>
                    </div>
                </Modal>
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
                    onClick={() => setShowDetails(true)}
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
                            onClick={() => setShowDetails(true)}
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
                            <div className="mt-2 text-sm">
                                <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                                    <span>Page {userBook.userCurrentPage || 0} {book.pageCount > 0 && `of ${book.pageCount}`}</span>
                                </div>
                                <ProgressBar current={userBook.userCurrentPage || 0} total={book.pageCount} />

                                {/* Enhanced Progress Input */}
                                <div className="mt-3 flex items-center gap-2">
                                    {isEditingProgress ? (
                                        <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                                            <span className="text-xs text-[var(--color-text-muted)] font-bold">Pg</span>
                                            <input
                                                type="number"
                                                value={pageInput}
                                                onChange={(e) => setPageInput(Number(e.target.value))}
                                                className="w-16 h-8 text-sm px-2 border-2 border-[var(--color-primary-green)]/50 rounded-lg outline-none focus:border-[var(--color-primary-green)] text-center font-bold"
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleSaveProgress}
                                                className="w-8 h-8 flex items-center justify-center bg-[var(--color-primary-green)] text-white rounded-lg hover:opacity-90 shadow-sm"
                                            >
                                                <Save size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditingProgress(true)}
                                            className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary-pink)] underline decoration-dashed underline-offset-4 transition-colors"
                                        >
                                            Update Progress
                                        </button>
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

                    {/* Actions */}
                    <div className="mt-3 flex justify-end">
                        {!isLibraryMode ? (
                            <button
                                onClick={() => !isAdding && setShowAddModal(true)}
                                disabled={isAdding}
                                className={clsx(
                                    "px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all duration-300 transform active:scale-95",
                                    isAdding
                                        ? "bg-[var(--color-primary-green)] text-white"
                                        : "bg-[var(--color-primary-pink)] hover:bg-[var(--color-secondary-pink)] text-white"
                                )}
                            >
                                {isAdding ? <Check size={16} /> : <Plus size={16} />}
                                <span>{isAdding ? 'Added!' : 'Add to Shelf'}</span>
                            </button>
                        ) : (
                            <div className="flex gap-2 items-center">
                                <select
                                    value={userBook?.status}
                                    onChange={(e) => updateBookStatus(book.id, e.target.value as ReadingStatus)}
                                    className="text-xs font-bold bg-[var(--color-accent-pink)] border-2 border-[var(--color-secondary-pink)] text-[var(--color-primary-pink)] rounded-xl px-3 py-1.5 outline-none focus:border-[var(--color-primary-green)] focus:text-[var(--color-primary-green)] transition-all cursor-pointer hover:border-[var(--color-primary-pink)]"
                                >
                                    <option value="COMPLETED">Completed</option>
                                    <option value="READING">Reading</option>
                                    <option value="WANT_TO_READ">Want to Read</option>
                                </select>
                                <button
                                    onClick={() => {
                                        if (confirm('Remove this book from your shelf?')) {
                                            removeBook(book.id);
                                            addToast('Book removed from shelf.', 'info');
                                        }
                                    }}
                                    className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-all"
                                    title="Remove from Shelf"
                                >
                                    <span className="sr-only">Remove</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Book Details Modal */}
            <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title={book.title}>
                <div className="flex flex-col gap-6">
                    <div className="flex gap-6 items-start">
                        {/* Cover in Modal */}
                        <div className="w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden shadow-md bg-[var(--color-accent-pink)] border border-[var(--color-secondary-pink)]">
                            {book.coverUrl ? (
                                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center p-2 w-full h-full bg-[var(--color-accent-pink)]/50">
                                    <StrawberryLogo className="w-16 h-20 opacity-90" />
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-1">{book.title}</h3>
                            <p className="text-[var(--color-primary-pink)] font-medium mb-4">{book.authors?.join(', ')}</p>

                            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                {book.pageCount > 0 && (
                                    <span className="bg-gray-100 px-2 py-1 rounded-md">{book.pageCount} pages</span>
                                )}
                                {book.isbn && (
                                    <span className="bg-gray-100 px-2 py-1 rounded-md">ISBN: {book.isbn}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-[var(--color-primary-green)] text-sm uppercase tracking-wide">Synopsis</h4>
                        <div className="text-sm text-gray-600 leading-relaxed max-h-60 overflow-y-auto pr-2">
                            {book.description ? (
                                <div dangerouslySetInnerHTML={{ __html: book.description }} />
                            ) : (
                                <p className="italic text-gray-400">No synopsis available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Add To Shelf Modal */}
            <AddToShelfModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                book={book}
                onConfirm={handleConfirmAdd}
            />
        </>
    );
}
