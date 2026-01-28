import { PhoneCall, PhoneOff, X } from 'lucide-react';
import { useCoPilot } from '../copilot/CoPilotProvider.jsx';
import { maskName } from '../../utils/mask.js';

/**
 * IncomingCallToast
 * - 전화가 왔을 때(=pendingCall) 우측 하단에 "수신/무시" UI를 띄웁니다.
 * - 수신을 누르면 CoPilotModal을 openWithCall()로 엽니다.
 */
export default function IncomingCallToast() {
  const { pendingCall, acceptPendingCall, ignorePendingCall } = useCoPilot();

  if (!pendingCall) return null;

  const customerName = pendingCall.customerName || '고객';
  const customerPhone = pendingCall.customerPhone || pendingCall.phone || '';
  const issue = pendingCall.issue || '문의';

  return (
    <div className="fixed bottom-24 right-6 z-[98] w-[340px] max-w-[calc(100vw-48px)] rounded-3xl border border-slate-200 bg-white shadow-soft overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-extrabold text-slate-500">전화 수신</div>
            <div className="mt-1 text-sm font-extrabold text-slate-900">
              {maskName(customerName)}
              {customerPhone ? <span className="text-slate-500"> · {customerPhone}</span> : null}
            </div>
            <div className="mt-1 text-xs text-slate-500 line-clamp-1">{issue}</div>
          </div>

          <button
            type="button"
            onClick={ignorePendingCall}
            className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 hover:bg-slate-50"
            aria-label="무시"
            title="무시"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={acceptPendingCall}
            className="flex-1 rounded-2xl bg-indigo-600 text-white px-4 py-2 text-sm font-extrabold hover:brightness-110"
          >
            <span className="inline-flex items-center gap-2">
              <PhoneCall size={16} /> 수신
            </span>
          </button>
          <button
            type="button"
            onClick={ignorePendingCall}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50"
          >
            <span className="inline-flex items-center gap-2">
              <PhoneOff size={16} /> 무시
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
