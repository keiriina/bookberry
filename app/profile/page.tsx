"use client";

import { useBookberry } from '@/lib/store';
import { BookCard } from '@/components/BookCard';
import { ReadingStatus } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, LayoutGrid, List, ChevronDown } from 'lucide-react';

import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Settings, Pencil, Trophy } from "lucide-react";
import { SettingsModal } from '@/components/SettingsModal';

export default function ProfilePage() {
    const { library, clearLibrary } = useBookberry();
    const { user } = useUser();
    const { openUserProfile } = useClerk();

    // Convex User Data
    const userProfile = useQuery(api.users.getProfile);
    const updateGoal = useMutation(api.users.updateGoal);
    const updateUsername = useMutation(api.users.updateUsername);

    const [activeFilter, setActiveFilter] = useState<ReadingStatus>('COMPLETED');
    const [sortBy, setSortBy] = useState<'date' | 'rating' | 'title'>('date');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Goal & Settings State
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [goalInput, setGoalInput] = useState(10);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Sync local state when profile loads
    useMemo(() => {
        if (userProfile?.readingGoal) {
            setGoalInput(userProfile.readingGoal || 10);
        }
    }, [userProfile?.readingGoal]);

    const completedCount = library.filter(b => b.status === 'COMPLETED').length;
    const currentGoal = userProfile?.readingGoal || 10;
    const progressPercentage = Math.min(100, Math.round((completedCount / currentGoal) * 100));

    const handleUpdateGoal = (e: React.FormEvent) => {
        e.preventDefault();
        updateGoal({ goal: Number(goalInput) });
        setIsEditingGoal(false);
    };

    const handleUpdateUsername = (newUsername: string) => {
        updateUsername({ username: newUsername });
    };

    const filteredLibrary = useMemo(() => {
        let books = library.filter(b => b.status === activeFilter);
        return books.sort((a, b) => {
            if (sortBy === 'date') return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
            if (sortBy === 'rating') return (b.userRating || 0) - (a.userRating || 0);
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            return 0;
        });
    }, [library, activeFilter, sortBy]);

    if (!user) return null;

    return (
        <main className="min-h-screen bg-[var(--color-accent-pink)] px-6 py-10">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Profile & Goal Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Profile Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[var(--color-secondary-pink)] flex items-center gap-6">
                        <div className="relative group">
                            <img
                                src={user.imageUrl}
                                alt={user.fullName || "User"}
                                className="w-24 h-24 rounded-full object-cover border-4 border-[var(--color-accent-pink)] shadow-md"
                            />
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="absolute bottom-0 right-0 bg-[var(--color-primary-green)] text-white p-1.5 rounded-full shadow-sm hover:scale-105 transition-transform"
                                title="Edit Profile"
                            >
                                <Pencil size={14} />
                            </button>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-black text-[var(--color-text-main)] truncate">
                                {userProfile?.username || user.fullName}
                            </h1>
                            <p className="text-[var(--color-text-muted)] text-sm mb-3 truncate">
                                {user.primaryEmailAddress?.emailAddress}
                            </p>
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary-pink)] bg-[var(--color-accent-pink)] px-3 py-1.5 rounded-full hover:bg-[var(--color-secondary-pink)] transition-colors"
                            >
                                <Settings size={14} />
                                <span>Manage Account</span>
                            </button>
                        </div>
                    </div>

                    <SettingsModal
                        isOpen={isSettingsOpen}
                        onClose={() => setIsSettingsOpen(false)}
                        currentUsername={userProfile?.username || user.fullName || ""}
                        onSaveUsername={handleUpdateUsername}
                    />

                    {/* Reading Goal Card */}
                    <div className="bg-[var(--color-primary-green)] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-center">
                        <Trophy className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12" />

                        <div className="flex justify-between items-start z-10 mb-4">
                            <div>
                                <h2 className="font-bold text-lg opacity-90">Reading Goal</h2>
                                <p className="text-sm opacity-75">Challenge yourself!</p>
                            </div>
                            <button
                                onClick={() => setIsEditingGoal(!isEditingGoal)}
                                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors backdrop-blur-sm"
                            >
                                {isEditingGoal ? 'Cancel' : 'Edit Goal'}
                            </button>
                        </div>

                        {isEditingGoal ? (
                            <form onSubmit={handleUpdateGoal} className="flex gap-2 z-10">
                                <input
                                    type="number"
                                    min="1"
                                    value={goalInput}
                                    onChange={(e) => setGoalInput(Number(e.target.value))}
                                    className="w-20 rounded-lg px-3 py-1 text-gray-800 font-bold outline-none"
                                />
                                <button type="submit" className="bg-white text-[var(--color-primary-green)] font-bold px-4 rounded-lg text-sm hover:opacity-90">
                                    Save
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-3 z-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-3xl font-black">{completedCount}</span>
                                    <span className="text-lg opacity-80 font-medium">/ {currentGoal} books</span>
                                </div>
                                <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div
                                        className="h-full bg-white transition-all duration-1000 ease-out rounded-full"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                                <p className="text-xs font-medium text-center opacity-80">
                                    {progressPercentage >= 100 ? "🎉 Goal Reached! Amazing!" : `${Math.round(progressPercentage)}% completed`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Library Header (Small) */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                        <span>📚</span> Your Collection
                    </h2>
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
