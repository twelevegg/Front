import React, { useState, useMemo } from 'react';
import { X, AlertCircle, CheckCircle, Info, ArrowLeft, Calendar, Trash2, Check, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastProvider';

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'critical',
        category: 'risk',
        title: '번아웃 경고: B팀',
        message: 'B팀의 피로도가 85% 임계값을 초과했습니다.',
        detail: '지난 3일간 B팀의 평균 피로도가 지속적으로 높게 측정되었습니다. 평균 휴식 시간이 40% 감소했습니다. 즉각적인 팀 휴식 일정 조정 또는 업무 분배가 권장됩니다.',
        time: '10분 전',
        date: '2025-01-20',
        read: false
    },
    {
        id: 2,
        type: 'warning',
        category: 'risk',
        title: '이탈 위험: 박은지 상담사',
        message: '박은지 상담사에게서 직무 몰입도 저하 징후가 포착되었습니다.',
        detail: '최근 통화 로그 및 감성 분석 결과, 긍정적 언어 사용이 30% 감소했습니다. 번아웃으로 인한 이탈 위험군으로 분류되었습니다.',
        time: '2시간 전',
        date: '2025-01-20',
        read: false
    },
    {
        id: 3,
        type: 'info',
        category: 'system',
        title: '시스템 정기 점검',
        message: '오늘 밤 오전 2시에 정기 점검이 예정되어 있습니다.',
        detail: '오전 02:00부터 04:00까지 시스템 안정화를 위한 정기 점검이 진행됩니다. 해당 시간에는 서비스 이용이 원활하지 않을 수 있습니다.',
        time: '어제',
        date: '2025-01-19',
        read: true
    },
    {
        id: 4,
        type: 'success',
        category: 'system',
        title: '배포 완료',
        message: '대시보드 신규 기능이 성공적으로 반영되었습니다.',
        detail: '배포 파이프라인이 정상적으로 완료되었으며, 모든 시스템이 정상 가동 중입니다.',
        time: '2일 전',
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
        addToast('모든 알림을 읽음 처리했습니다.', 'success');
    };

    const handleClearAll = () => {
        if (filter === 'all') {
            setNotifications([]);
            addToast('모든 알림을 삭제했습니다.', 'info');
        } else {
            setNotifications(prev => prev.filter(n => n.category !== filter));
            addToast('선택된 알림을 삭제했습니다.', 'info');
        }
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
        addToast('알림이 삭제되었습니다.', 'info');
    };

    const handleMarkRead = (e, id) => {
        e.stopPropagation();
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const filterLabels = {
        all: '전체',
        risk: '위험 감지',
        system: '시스템'
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`absolute bottom-full left-14 z-50 mb-[-40px] ${selectedId ? 'w-[600px]' : 'w-[420px]'}`}
            >
                {/* 
                   Fixed Height enforced here (h-[600px]) to prevent layout shifts 
                   when filtering changes the content size.
                */}
                <div className="rounded-2xl bg-white/95 backdrop-blur-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden border border-white/60 flex flex-col h-[600px]">
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
                                {selectedId ? '상세 정보' : '알림 센터'}
                            </h3>
                        </div>
                        <div className="flex gap-2">
                            {!selectedId && notifications.length > 0 && (
                                <>
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition"
                                        title="모두 읽음 처리"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={handleClearAll}
                                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition"
                                        title="전체 삭제"
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
                                    className={`pb-3 text-sm font-bold transition-colors relative ${filter === f ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {filterLabels[f]}
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
                                        <p className="text-sm font-medium">새로운 알림이 없습니다</p>
                                    </div>
                                )}

                                {groupedNotifications.today.length > 0 && (
                                    <div>
                                        <div className="px-2 mb-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">오늘</div>
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
                                        <div className="px-2 mb-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">이전 알림</div>
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
                        title="읽음 처리"
                    >
                        <Check size={12} />
                    </button>
                )}
                <button
                    onClick={(e) => onDelete(e, notification.id)}
                    className="p-1.5 rounded-full bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm border border-slate-100"
                    title="삭제"
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
                    관련 보고서 보기 →
                </button>
            </div>
        </motion.div>
    );
}
