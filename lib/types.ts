export type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'COMPLETED';

export interface Book {
    id: string; // Google Books ID
    title: string;
    authors: string[];
    description?: string;
    coverUrl?: string;
    pageCount: number;
    isbn?: string;
}

export interface UserBook extends Book {
    status: ReadingStatus;
    userRating?: number; // 0-5
    review?: string;
    userCurrentPage?: number;
    addedAt: string; // ISO Date
}
