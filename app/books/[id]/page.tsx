"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Book } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { StrawberryLogo } from "@/components/ui/StrawberryLogo";
import { useBookberry } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { Loader2, ArrowLeft, Plus, Check } from "lucide-react";
import { AddToShelfModal } from "@/components/AddToShelfModal";

export default function BookDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const bookId = params.id as string;
    const { addToast } = useToast();
    const { addBook } = useBookberry();

    const [book, setBook] = useState<Book | null>(null);
    const [loadingBook, setLoadingBook] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Fetch Reviews & User Status
    const reviewData = useQuery(api.books.getReviews, { bookId });
    const userBook = useQuery(api.books.getUserBook, { bookId });

    useEffect(() => {
        if (!bookId) return;

        const fetchBook = async () => {
            try {
                const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
                const data = await res.json();

                if (data) {
                    const formattedBook: Book = {
                        id: data.id,
                        title: data.volumeInfo.title,
                        authors: data.volumeInfo.authors || ['Unknown Author'],
                        description: data.volumeInfo.description,
                        coverUrl: data.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || data.volumeInfo.imageLinks?.large?.replace('http:', 'https:'),
                        pageCount: data.volumeInfo.pageCount || 0,
                        isbn: data.volumeInfo.industryIdentifiers?.[0]?.identifier
                    };
                    setBook(formattedBook);
                }
            } catch (error) {
                console.error("Failed to fetch book details", error);
                addToast("Failed to load book details", "error");
            } finally {
                setLoadingBook(false);
            }
        };

        fetchBook();
    }, [bookId, addToast]);

    const handleConfirmAdd = (status: any, rating?: number, review?: string) => {
        if (book) {
            addBook(book, status);
            addToast(`Added "${book.title}" to your shelf!`, 'success');
        }
    };

    if (loadingBook) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
                <Loader2 className="animate-spin text-[var(--color-primary-pink)]" size={48} />
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)]">
                <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-4">Book Not Found</h1>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[var(--color-primary-pink)] hover:underline"
                >
                    <ArrowLeft size={20} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] pb-20">
            {/* Header / Nav Back */}
            <div className="max-w-5xl mx-auto px-8 py-12">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary-pink)] transition-colors mb-6"
                >
                    <ArrowLeft size={20} /> Back to Search
                </button>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 bg-white rounded-3xl p-8 shadow-sm">
                    {/* Left: Cover */}
                    <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
                        <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-md relative bg-[var(--color-accent-pink)]">
                            {book.coverUrl ? (
                                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full opacity-50">
                                    <StrawberryLogo className="w-20 h-24" />
                                </div>
                            )}
                        </div>

                        {userBook ? (
                            <div className="space-y-4">
                                <div className="bg-[var(--color-bg-secondary)] p-4 rounded-xl">
                                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase mb-1">Your Status</p>
                                    <div className="flex items-center gap-2 text-[var(--color-primary-green)] font-black text-lg">
                                        <Check size={20} />
                                        {userBook.status.replace(/_/g, ' ')}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="w-full py-3 bg-white border-2 border-[var(--color-primary-green)] text-[var(--color-primary-green)] font-bold rounded-xl hover:bg-[var(--color-primary-green)] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    Manage Shelf
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="w-full py-3 bg-[var(--color-primary-pink)] text-white font-bold rounded-xl hover:bg-[var(--color-secondary-pink)] hover:text-[var(--color-primary-pink)] transition-all shadow-md transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <Plus size={20} /> Add to Shelf
                            </button>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-[var(--color-text-main)] mb-2 leading-tight">
                                {book.title}
                            </h1>
                            <p className="text-xl text-[var(--color-primary-pink)] font-medium">
                                {book.authors?.join(', ')}
                            </p>
                        </div>

                        {/* Ratings Overview */}
                        <div className="flex items-center gap-4 bg-[var(--color-bg-secondary)] p-4 rounded-2xl w-fit">
                            <div className="flex flex-col items-center border-r border-gray-200 pr-4">
                                <div className="text-3xl font-bold text-[var(--color-text-main)]">
                                    {reviewData?.averageRating.toFixed(1) || "0.0"}
                                </div>
                                <div className="text-xs text-[var(--color-text-muted)] uppercase font-bold tracking-wider">
                                    Average
                                </div>
                            </div>
                            <div className="pl-2">
                                <StarRating rating={Math.round(reviewData?.averageRating || 0)} size={24} readonly />
                                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                    {reviewData?.totalRatings || 0} Ratings & Reviews
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-[var(--color-text-muted)]">
                            {book.pageCount > 0 && (
                                <div className="bg-white p-3 rounded-xl border border-[var(--color-bg-secondary)]">
                                    <span className="block font-bold text-[var(--color-text-main)]">{book.pageCount}</span> Pages
                                </div>
                            )}
                            {book.isbn && (
                                <div className="bg-white p-3 rounded-xl border border-[var(--color-bg-secondary)]">
                                    <span className="block font-bold text-[var(--color-text-main)]">ISBN</span> {book.isbn}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-[var(--color-text-main)] border-l-4 border-[var(--color-primary-green)] pl-3">Synopsis</h3>
                            <div
                                className="text-gray-600 leading-relaxed text-lg"
                                dangerouslySetInnerHTML={{ __html: book.description || 'No summary available.' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-8 flex items-center gap-3">
                        Community Reviews
                        <span className="text-lg font-normal text-[var(--color-text-muted)] bg-white px-3 py-1 rounded-full border border-[var(--color-bg-secondary)]">
                            {reviewData?.totalRatings || 0}
                        </span>
                    </h2>

                    <div className="space-y-6">
                        {reviewData === undefined ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[var(--color-text-muted)]" /></div>
                        ) : reviewData.reviews.length === 0 ? (
                            <div className="bg-white p-12 rounded-3xl border border-dashed border-[var(--color-secondary-pink)] text-center">
                                <StrawberryLogo className="w-16 h-20 mx-auto mb-4 opacity-50" />
                                <p className="text-lg text-[var(--color-text-muted)]">
                                    No reviews yet. Be the first to review this book!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reviewData.reviews.map((review) => (
                                    <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <Link href={`/users/${review.userId}`} className="flex items-center gap-3 group">
                                                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-pink)] flex items-center justify-center text-[var(--color-primary-pink)] font-bold group-hover:scale-110 transition-transform">
                                                    {(review.user?.username || 'User')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-primary-pink)] transition-colors">
                                                        {review.user?.username || 'Bookworm User'}
                                                    </p>
                                                    <p className="text-xs text-[var(--color-text-muted)]">
                                                        {new Date(review.addedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </Link>
                                            {review.userRating && (
                                                <div className="bg-[var(--color-bg-secondary)] px-2 py-1 rounded-lg">
                                                    <StarRating rating={review.userRating} size={16} readonly />
                                                </div>
                                            )}
                                        </div>
                                        {review.review ? (
                                            <p className="text-gray-600 leading-relaxed italic">"{review.review}"</p>
                                        ) : (
                                            <p className="text-gray-400 italic text-sm">No written review.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddToShelfModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                book={book}
                onConfirm={handleConfirmAdd}
            />
        </div>
    );
}
