import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto dismiss
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {createPortal(
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                    <AnimatePresence>
                        {toasts.map((toast) => (
                            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                        ))}
                    </AnimatePresence>
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onRemove }) {
    const icons = {
        success: <CheckCircle size={18} className="text-green-500" />,
        error: <AlertCircle size={18} className="text-red-500" />,
        info: <Info size={18} className="text-blue-500" />
    };

    const bgColors = {
        success: 'bg-white border-green-100',
        error: 'bg-white border-red-100',
        info: 'bg-white border-blue-100'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            layout
            className={`pointer-events-auto flex items-center gap-3 min-w-[300px] p-4 rounded-2xl shadow-xl border ${bgColors[toast.type] || bgColors.info} backdrop-blur-md`}
        >
            <div className="shrink-0">{icons[toast.type] || icons.info}</div>
            <div className="flex-1 text-sm font-bold text-slate-800">{toast.message}</div>
            <button
                onClick={() => onRemove(toast.id)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition"
            >
                <X size={14} />
            </button>
        </motion.div>
    );
}
