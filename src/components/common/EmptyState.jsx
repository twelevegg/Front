import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, description, className = '' }) {
    return (
        <div className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}>
            <div className="bg-slate-50 p-4 rounded-full mb-3 border border-slate-100">
                <Icon size={24} className="text-slate-400" />
            </div>
            <div className="text-slate-900 font-bold mb-1">{title}</div>
            {description && <div className="text-sm text-slate-500 max-w-[200px] leading-relaxed">{description}</div>}
        </div>
    );
}
