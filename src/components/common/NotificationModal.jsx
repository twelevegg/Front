import React, { useState, useMemo } from 'react';
import { X, AlertCircle, CheckCircle, Info, ArrowLeft, Calendar, Trash2, Check, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastProvider';

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'critical',
        category: 'risk',
        title: 'Burnout Alert: Team B',
        message: 'Fatigue levels in Team B have exceeded the 85% threshold.',
        detail: 'Team B has shown consistent high fatigue levels over the last 3 days. Average break time has decreased by 40%. It is recommended to schedule a mandatory team break or distribute workload immediately.',
        time: '10 mins ago',
        date: '2025-01-20',
        read: false
    },
    {
        id: 2,
        type: 'warning',
        category: 'risk',
        title: 'Attrition Risk: Grace Park',
        message: 'Grace Park shows signs of disengagement.',
        detail: 'Analysis of recent call logs and sentiment analysis indicates a 30% drop in positive language usage. Grace Park has been flagged for potential burnout-induced attrition.',
        time: '2 hours ago',
        date: '2025-01-20',
        read: false
    },
    {
        id: 3,
        type: 'info',
        category: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 2:00 AM.',
        detail: 'The system will undergo routine maintenance from 02:00 AM to 04:00 AM. Services may be intermittent during this period.',
        time: 'Yesterday',
        date: '2025-01-19',
        read: true
    },
    {
        id: 4,
        type: 'success',
        category: 'system',
        title: 'Deployment Successful',
        message: 'New dashboard features are now live.',
        detail: 'The generic deployment pipeline finished successfully. All systems are operational.',
        time: '2 days ago',
        date: '2025-01-18',
        read: true
    },
];

export default function NotificationModal({ onClose }) {
    const { addToast } = useToast();
    const [selectedId, setSelectedId] = useState(null);
    const [filter, setFilter] = useState('all'); // all, risk, system
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const filteredNotifications = useMemo(() => {
        if (filter === 'all') return notifications;
        return notifications.filter(n => n.category === filter);
    }, [notifications, filter]);

    const groupedNotifications = useMemo(() => {
        const today = '2025-01-20'; // Mock "Today"
        const groups = { today: [], earlier: [] };

        filteredNotifications.forEach(n => {
            if (n.date === today) groups.today.push(n);
            else groups.earlier.push(n);
        });
        return groups;
    }, [filteredNotifications]);

    const selectedNotif = notifications.find(n => n.id === selectedId);

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        addToast('All notifications marked as read', 'success');
    };

    const handleClearAll = () => {
        if (filter === 'all') {
            setNotifications([]);
            addToast('All notifications cleared', 'info');
        } else {
            setNotifications(prev => prev.filter(n => n.category !== filter));
            addToast(`${filter} notifications cleared`, 'info');
        }
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
        addToast('Notification removed', 'info');
    };

    const handleMarkRead = (e, id) => {
        e.stopPropagation();
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute top-14 right-4 z-50 overflow-hidden ${selectedId ? 'w-[600px]' : 'w-[420px]'}`}
            >
                <div className="rounded-2xl bg-white/95 backdrop-blur-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden border border-white/60 flex flex-col max-h-[80vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white/50 shrink-0">
                        <div className="flex items-center gap-3">
                            {selectedId ? (
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                            ) : (
                                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                                    <Bell size={18} />
                                </div>
                            )}
                            <h3 className="font-extrabold text-slate-800 text-lg">
                                {selectedId ? 'Details' : 'Notifications'}
                            </h3>
                        </div>
                        <div className="flex gap-2">
                            {!selectedId && notifications.length > 0 && (
                                <>
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition"
                                        title="Mark all as read"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={handleClearAll}
                                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition"
                                        title="Clear all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            )}
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    {!selectedId && (
                        <div className="px-5 pt-3 pb-0 flex gap-4 border-b border-slate-50 shrink-0">
                            {['all', 'risk', 'system'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`pb-3 text-sm font-bold capitalize transition-colors relative ${filter === f ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {f}
                                    {filter === f && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="overflow-y-auto p-2 scrollbar-hide flex-1 bg-slate-50/30">
                        {selectedId && selectedNotif ? (
                            <DetailView notification={selectedNotif} />
                        ) : (
                            <div className="space-y-6 p-2">
                                {notifications.length === 0 && (
                                    <div className="py-12 text-center text-slate-400">
                                        <Bell size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="text-sm font-medium">No notifications</p>
                                    </div>
                                )}

                                {groupedNotifications.today.length > 0 && (
                                    <div>
                                        <div className="px-2 mb-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Today</div>
                                        <div className="space-y-2">
                                            {groupedNotifications.today.map(n => (
                                                <NotificationItem
                                                    key={n.id}
                                                    notification={n}
                                                    onClick={() => setSelectedId(n.id)}
                                                    onDelete={handleDelete}
                                                    onMarkRead={handleMarkRead}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {groupedNotifications.earlier.length > 0 && (
                                    <div>
                                        <div className="px-2 mb-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Earlier</div>
                                        <div className="space-y-2">
                                            {groupedNotifications.earlier.map(n => (
                                                <NotificationItem
                                                    key={n.id}
                                                    notification={n}
                                                    onClick={() => setSelectedId(n.id)}
                                                    onDelete={handleDelete}
                                                    onMarkRead={handleMarkRead}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="fixed inset-0 z-[-1]" onClick={onClose} />
            </motion.div>
        </AnimatePresence>
    );
}

function NotificationItem({ notification, onClick, onDelete, onMarkRead }) {
    const icons = {
        critical: <AlertCircle size={20} className="text-red-500" />,
        warning: <AlertCircle size={20} className="text-amber-500" />,
        info: <Info size={20} className="text-blue-500" />,
        success: <CheckCircle size={20} className="text-green-500" />
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onClick}
            className={`group relative flex gap-4 p-4 rounded-2xl transition-all cursor-pointer border ${notification.read
                    ? 'bg-transparent border-transparent hover:bg-white hover:shadow-sm hover:border-slate-100'
                    : 'bg-white shadow-sm border-blue-100/50 hover:border-blue-200 hover:shadow-md'
                }`}
        >
            <div className={`mt-0.5 shrink-0 ${!notification.read && 'animate-pulse'}`}>
                {icons[notification.type]}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                    <h4 className={`text-sm font-bold truncate pr-8 ${notification.read ? 'text-slate-600' : 'text-slate-900'}`}>
                        {notification.title}
                    </h4>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {notification.time}
                    </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {notification.message}
                </p>
            </div>

            {/* Hover Actions */}
            <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.read && (
                    <button
                        onClick={(e) => onMarkRead(e, notification.id)}
                        className="p-1.5 rounded-full bg-slate-50 text-blue-500 hover:bg-blue-50 shadow-sm border border-slate-100"
                        title="Mark as read"
                    >
                        <Check size={12} />
                    </button>
                )}
                <button
                    onClick={(e) => onDelete(e, notification.id)}
                    className="p-1.5 rounded-full bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm border border-slate-100"
                    title="Delete"
                >
                    <Trash2 size={12} />
                </button>
            </div>
        </motion.div>
    );
}

function DetailView({ notification }) {
    const tones = {
        critical: 'bg-red-50 text-red-600',
        warning: 'bg-amber-50 text-amber-600',
        info: 'bg-blue-50 text-blue-600',
        success: 'bg-green-50 text-green-600'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 h-full"
        >
            <div className="flex items-start gap-4 mb-6">
                <div className={`p-4 rounded-2xl shadow-sm ${tones[notification.type]}`}>
                    {notification.type === 'critical' && <AlertCircle size={32} />}
                    {notification.type === 'warning' && <AlertCircle size={32} />}
                    {notification.type === 'info' && <Info size={32} />}
                    {notification.type === 'success' && <CheckCircle size={32} />}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${tones[notification.type].replace('text', 'border').replace('bg', 'bg-transparent')}`}>
                            {notification.type}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                            <Calendar size={12} />
                            {notification.date}
                        </div>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                        {notification.title}
                    </h2>
                </div>
            </div>

            <div className="prose prose-slate prose-sm max-w-none">
                <p className="font-bold text-slate-700 text-base leading-relaxed">
                    {notification.message}
                </p>
                <div className="my-6 border-t border-slate-100" />
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed text-sm">
                    {notification.detail}
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition">
                    View Related Report →
                </button>
            </div>
        </motion.div>
    );
}
