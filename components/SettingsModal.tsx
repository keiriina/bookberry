"use client";

import { Modal } from './ui/Modal';
import { useClerk } from "@clerk/nextjs";
import { useState } from 'react';
import { User, Lock, Save } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUsername: string;
    onSaveUsername: (newUsername: string) => void;
}

export function SettingsModal({ isOpen, onClose, currentUsername, onSaveUsername }: SettingsModalProps) {
    const { openUserProfile } = useClerk();
    const [username, setUsername] = useState(currentUsername);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveUsername(username);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Account">
            <div className="space-y-8">
                {/* App Settings */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-[var(--color-text-main)] border-b pb-2">Profile Details</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--color-text-muted)]">Display Name</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary-pink)] focus:ring-2 focus:ring-[var(--color-accent-pink)] outline-none transition-all font-medium"
                                        placeholder="Enter a display name"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={username === currentUsername}
                                    className="bg-[var(--color-primary-green)] text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Save
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 pl-1">This is how you will appear on your public shelf.</p>
                        </div>
                    </form>
                </section>

                {/* Clerk Settings */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-[var(--color-text-main)] border-b pb-2">Login & Security</h3>

                    <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400">
                                <Lock size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-700">Authentication</p>
                                <p className="text-xs text-gray-500">Manage your email, password, and connected accounts.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => openUserProfile()}
                            className="text-sm font-bold text-[var(--color-primary-pink)] hover:bg-[var(--color-accent-pink)] px-4 py-2 rounded-lg transition-colors"
                        >
                            Open Settings
                        </button>
                    </div>
                </section>
            </div>
        </Modal>
    );
}
