import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, Info, ArrowLeft, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationModal({ onClose }) {
    const [selectedId, setSelectedId] = useState(null);

    const notifications = [
        {
            id: 1,
            type: 'critical',
            title: 'Burnout Alert: Team B',
            message: 'Fatigue levels in Team B have exceeded the 85% threshold. Immediate check-in required.',
            detail: 'Team B has shown consistent high fatigue levels over the last 3 days. Average break time has decreased by 40%. It is recommended to schedule a mandatory team break or distribute workload immediately.',
            time: '10 mins ago',
            date: '2025-01-20 14:30'
        },
        {
            id: 2,
            type: 'warning',
            title: 'Attrition Risk: Grace Park',
            message: 'Grace Park shows signs of disengagement. Predicted attrition risk: High.',
            detail: 'Analysis of recent call logs and sentiment analysis indicates a 30% drop in positive language usage. Grace Park has been flagged for potential burnout-induced attrition.',
            time: '2 hours ago',
            date: '2025-01-20 12:15'
        },
        {
            id: 3,
            type: 'info',
            title: 'System Maintenance',
            message: 'Scheduled maintenance will occur tonight at 2:00 AM.',
            detail: 'The system will undergo routine maintenance from 02:00 AM to 04:00 AM. Services may be intermittent during this period.',
            time: '5 hours ago',
            date: '2025-01-20 09:00'
        },
    ];

    const selectedNotif = notifications.find(n => n.id === selectedId);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute top-12 right-0 z-50 overflow-hidden ${selectedId ? 'w-[600px]' : 'w-[400px]'}`}
            >
                <div className="rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 overflow-hidden transition-all duration-300 border border-white/50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100/50 bg-white/50">
                        <div className="flex items-center gap-2">
                            {selectedId && (
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="p-1 rounded-full hover:bg-slate-200/50 text-slate-600 mr-1 transition-colors"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                            )}
                            <h3 className="font-bold text-slate-800">
                                {selectedId ? 'Notification Details' : 'Notifications'}
                            </h3>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Content */}
                    {selectedId && selectedNotif ? (
                        // Detail View
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 min-h-[300px]"
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className={`p-3 rounded-full shadow-sm ${selectedNotif.type === 'critical' ? 'bg-red-50 text-red-600' :
                                        selectedNotif.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                                            'bg-blue-50 text-blue-600'
                                    }`}>
                                    {selectedNotif.type === 'critical' && <AlertCircle size={32} />}
                                    {selectedNotif.type === 'warning' && <AlertCircle size={32} />}
                                    {selectedNotif.type === 'info' && <Info size={32} />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">
                                        {selectedNotif.title}
                                    </h2>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar size={14} />
                                        {selectedNotif.date}
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-slate prose-sm max-w-none">
                                <p className="font-medium text-slate-700 text-base">
                                    {selectedNotif.message}
                                </p>
                                <hr className="my-4 border-slate-100" />
                                <p className="text-slate-600 leading-relaxed">
                                    {selectedNotif.detail}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        // List View
                        <>
                            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 scrollbar-hide">
                                {notifications.map((notif) => (
                                    <motion.div
                                        layoutId={notif.id}
                                        key={notif.id}
                                        onClick={() => setSelectedId(notif.id)}
                                        className="flex gap-3 rounded-xl p-3 hover:bg-white/60 transition cursor-pointer group hover:shadow-sm border border-transparent hover:border-slate-100"
                                    >
                                        <div className="mt-1 shrink-0">
                                            {notif.type === 'critical' && <AlertCircle className="text-red-500" size={20} />}
                                            {notif.type === 'warning' && <AlertCircle className="text-amber-500" size={20} />}
                                            {notif.type === 'info' && <Info className="text-blue-500" size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {notif.title}
                                                </p>
                                                <span className="text-xs text-slate-400">{notif.time}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                                                {notif.message}
                                            </p>
                                        </div>
                                        {notif.type === 'critical' && (
                                            <div className="self-center shrink-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-red-100" />
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-2 border-t border-slate-100/50 bg-slate-50/30 text-center">
                                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                                    Mark all as read
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="fixed inset-0 z-[-1]" onClick={onClose} />
            </motion.div>
        </AnimatePresence>
    );
}
