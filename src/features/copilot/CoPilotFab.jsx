import { Phone } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider.jsx';
import { mockCalls } from '../calls/mockCalls.js';
import { emitCallRinging } from '../calls/callEvents.js';

export default function CoPilotFab() {
  const { user } = useAuth();
  const isDev = user?.name === 'DEV';
  if (!isDev) return null;

  const handleClick = () => {
    const demo = mockCalls?.[0];

    // ✅ 매번 새로운 콜ID를 만들어야 "무시" 이후에도 다시 뜸
    const callId = `DEMO-CALL-${Date.now()}`;

    // ✅ 실제 전화 온 것처럼: CALL_RINGING 이벤트 발생 → pendingCall 세팅 → 토스트 표시
    emitCallRinging({
      callId,
      customerName: demo?.customerName || '평가관',
      phone: '010-1234-5678',
      customerPhone: '010-1234-5678',
      issue: demo?.title || '데모 수신',
      channel: 'DEV(가상수신)'
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="가상 전화 수신"
      title="가상 전화 수신"
      className="fixed bottom-6 right-6 z-[98] h-12 w-12 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:brightness-110 active:brightness-95"
    >
      <Phone size={20} />
    </button>
  );
}
