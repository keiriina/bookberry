"use client";

import { useState, useEffect } from 'react';
import { Book, ReadingStatus } from '@/lib/types';
import { Modal } from './ui/Modal';
import { StarRating } from './ui/StarRating';
import { Check, BookOpen, Bookmark } from 'lucide-react';
import { clsx } from 'clsx';

interface AddToShelfModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book;
    onConfirm: (status: ReadingStatus, rating?: number, review?: string) => void;
}

type Step = 'STATUS' | 'REVIEW';

export function AddToShelfModal({ isOpen, onClose, book, onConfirm }: AddToShelfModalProps) {
    const [step, setStep] = useState<Step>('STATUS');
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('STATUS');
            setRating(0);
            setReview('');
        }
    }, [isOpen]);

    const handleStatusSelect = (status: ReadingStatus) => {
        if (status === 'COMPLETED') {
            setStep('REVIEW');
        } else {
            onConfirm(status);
            onClose();
        }
    };

    const handleSaveReview = () => {
        onConfirm('COMPLETED', rating, review);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={step === 'STATUS' ? "Add to Shelf" : "Rate & Review"}>
            <div className="flex flex-col gap-6 min-w-[300px]">
                {step === 'STATUS' ? (
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => handleStatusSelect('WANT_TO_READ')}
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-[var(--color-secondary-pink)]/30 hover:border-[var(--color-primary-green)] hover:bg-[var(--color-accent-pink)] transition-all group text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-[var(--color-accent-pink)] flex items-center justify-center text-[var(--color-primary-pink)] group-hover:bg-white transition-colors">
                                <Bookmark size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[var(--color-text-main)]">Want to Read</h4>
                                <p className="text-xs text-[var(--color-text-muted)]">Save for later</p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleStatusSelect('READING')}
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-[var(--color-secondary-pink)]/30 hover:border-[var(--color-primary-green)] hover:bg-[var(--color-accent-pink)] transition-all group text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-[var(--color-accent-pink)] flex items-center justify-center text-[var(--color-primary-pink)] group-hover:bg-white transition-colors">
                                <BookOpen size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[var(--color-text-main)]">Currently Reading</h4>
                                <p className="text-xs text-[var(--color-text-muted)]">Track your progress</p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleStatusSelect('COMPLETED')}
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-[var(--color-secondary-pink)]/30 hover:border-[var(--color-primary-green)] hover:bg-[var(--color-accent-pink)] transition-all group text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-[var(--color-accent-pink)] flex items-center justify-center text-[var(--color-primary-pink)] group-hover:bg-white transition-colors">
                                <Check size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[var(--color-text-main)]">Completed</h4>
                                <p className="text-xs text-[var(--color-text-muted)]">Rate and review</p>
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex flex-col items-center gap-2 py-2">
                            <span className="text-sm font-bold text-[var(--color-text-muted)]">How was it?</span>
                            <div className="scale-125">
                                <StarRating rating={rating} onChange={setRating} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wide">Your Review</label>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="What did you think about this book?"
                                className="w-full h-32 p-3 text-sm bg-[var(--color-accent-pink)]/30 rounded-xl border-2 border-[var(--color-secondary-pink)]/50 focus:border-[var(--color-primary-green)] outline-none resize-none placeholder:text-[var(--color-text-muted)]/50"
                                autoFocus
                            />
                        </div>

                        <button
                            onClick={handleSaveReview}
                            className="mt-2 w-full py-3 bg-[var(--color-primary-green)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
                        >
                            <Check size={18} />
                            Save to Shelf
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
