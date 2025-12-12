"use client";

import { Modal } from './ui/Modal';
import { BookSearch } from './BookSearch';

interface LogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LogModal({ isOpen, onClose }: LogModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Log a Book">
            <div className="max-h-[70vh] overflow-y-auto pr-2">
                <BookSearch />
            </div>
        </Modal>
    );
}
