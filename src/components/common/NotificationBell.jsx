import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import NotificationModal from './NotificationModal.jsx';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);

    const toggleModal = () => setIsOpen(!isOpen);
    const closeModal = () => setIsOpen(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={toggleModal}
                className="relative flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
            >
                <Bell size={20} />
                {hasUnread && (
                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
            </button>

            {isOpen && <NotificationModal onClose={closeModal} />}
        </div>
    );
}
