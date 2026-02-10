import { X, AlertTriangle, PhoneCall } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function SimulationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100">

                {/* Header with Icon */}
                <div className="bg-slate-50 p-6 flex flex-col items-center justify-center border-b border-slate-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 mb-4 text-indigo-600">
                        <PhoneCall size={32} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 text-center">
                        실시간 상담 시뮬레이션
                    </h2>
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="bg-indigo-50/50 rounded-2xl p-5 mb-6 border border-indigo-100">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                            <div className="text-sm text-slate-700 leading-relaxed font-medium">
                                "실제 실시간 전화를 하기 위해서는 휴대폰 환경 설정이 추가적으로 필요합니다.
                                때문에 심사위원분들께 상담 시뮬레이션을 제공해드리며,
                                <span className="text-indigo-600 font-bold"> AI Agent는 실제로 동작하고 있습니다.</span>"
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-slate-500 text-sm mb-2">
                        계속 하시겠습니까?
                    </p>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 px-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-lg shadow-indigo-200"
                    >
                        시뮬레이션 시작
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
