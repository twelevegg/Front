import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Check, User, Mail, Shield, AlertCircle } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export default function UserProfileModal({ open, onClose, user, role }) {
    const [passwordForm, setPasswordForm] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [showPwForm, setShowPwForm] = useState(false);

    // Mock Password Change Logic
    const handlePwChange = (e) => {
        e.preventDefault();
        // Validate and API call logic here
        alert("비밀번호 변경 기능은 백엔드 연동 시 구현됩니다.");
        setShowPwForm(false);
        setPasswordForm({ current: '', new: '', confirm: '' });
    };

    const handleClose = () => {
        setShowPwForm(false);
        onClose();
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleClose}>
            <Dialog.Portal>
                {/* Backdrop */}
                <Dialog.Overlay asChild>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />
                </Dialog.Overlay>

                <Dialog.Content asChild>
                    <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none">
                        <div className="relative w-full max-w-md pointer-events-auto p-4">
                            <motion.div
                                layoutId="profile-card-container"
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                layout="position"
                                className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/50"
                            >
                                {/* Header Section */}
                                <div className="relative p-6 bg-gradient-to-br from-indigo-50 to-white border-b border-indigo-100/50">
                                    <button
                                        onClick={handleClose}
                                        className="absolute right-4 top-4 p-2 rounded-full hover:bg-black/5 text-slate-400 transition"
                                    >
                                        <X size={20} />
                                    </button>

                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.1, duration: 0.2 }}
                                            className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-indigo-200"
                                        >
                                            {role === 'admin' ? 'AD' : 'AS'}
                                        </motion.div>

                                        <div className="space-y-1">
                                            <motion.h2
                                                initial={{ x: -10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.15, duration: 0.2 }}
                                                className="text-xl font-extrabold text-slate-800"
                                            >
                                                {user?.name || 'User Name'}
                                            </motion.h2>
                                            <motion.div
                                                initial={{ x: -10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2, duration: 0.2 }}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold"
                                            >
                                                <Shield size={12} />
                                                {role === 'admin' ? 'Administrator' : 'Assistant'}
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Body Section */}
                                <div className="p-6 space-y-6">
                                    {/* User Info */}
                                    <div className="space-y-4">
                                        <InfoItem icon={<Mail size={16} />} label="Email Address" value={user?.email || 'user@company.com'} />
                                        <InfoItem icon={<User size={16} />} label="User ID" value={user?.id || 'USER-001'} />
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-slate-100" />

                                    {/* Password Change Toggle */}
                                    {!showPwForm ? (
                                        <button
                                            onClick={() => setShowPwForm(true)}
                                            className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center gap-2"
                                        >
                                            <Lock size={16} />
                                            Change Password
                                        </button>
                                    ) : (
                                        <motion.form
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="space-y-3 overflow-hidden"
                                            onSubmit={handlePwChange}
                                        >
                                            <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                                                Update Password
                                            </h3>
                                            <input
                                                type="password"
                                                placeholder="Current Password"
                                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                                value={passwordForm.current}
                                                onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                                            />
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                                value={passwordForm.new}
                                                onChange={e => setPasswordForm(p => ({ ...p, new: e.target.value }))}
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                                value={passwordForm.confirm}
                                                onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                                            />

                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPwForm(false)}
                                                    className="flex-1 py-2.5 rounded-1xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </motion.form>
                                    )}

                                    {/* Account Deletion Section */}
                                    {!showPwForm && <AccountDeletionSection onClose={handleClose} />}

                                </div>
                            </motion.div>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3 text-slate-500">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                    {icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>
            <div className="text-sm font-bold text-slate-700">{value}</div>
        </div>
    );
}

// Account Deletion Sub-component
import { deleteAccountApi } from '../../features/auth/api';

function AccountDeletionSection({ onClose }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (!confirm("정말로 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;

        setLoading(true);
        setError(null);
        try {
            await deleteAccountApi({ password });
            alert("계정이 성공적으로 탈퇴되었습니다.");
            // Force logout or redirect
            window.location.href = '/login';
        } catch (err) {
            console.error(err);
            setError("탈퇴 처리에 실패했습니다. 비밀번호를 확인해주세요.");
            setLoading(false);
        }
    };

    if (!isExpanded) {
        return (
            <div className="pt-2 border-t border-slate-100">
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full py-3 rounded-xl border border-red-100 text-red-500 font-bold hover:bg-red-50 hover:border-red-200 transition flex items-center justify-center gap-2"
                >
                    <AlertCircle size={16} />
                    Delete Account
                </button>
            </div>
        );
    }

    return (
        <div className="pt-2 border-t border-slate-100">
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-red-50 rounded-xl p-4 space-y-3"
            >
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-red-700">Danger Zone</h4>
                        <p className="text-xs text-red-600/80 leading-relaxed mt-1">
                            계정을 탈퇴하면 모든 데이터가 삭제되거나 비활성화되며, 이 작업은 되돌릴 수 없습니다.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-3 pt-2">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-red-200 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition placeholder:text-red-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsExpanded(false);
                                setPassword('');
                                setError(null);
                            }}
                            className="flex-1 py-2 rounded-lg bg-white border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md shadow-red-200 transition disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Delete Account'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
