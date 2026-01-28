import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { callEventBus } from '../calls/callEvents.js';

const CoPilotContext = createContext(null);

export function CoPilotProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [call, setCall] = useState(null);

  // ✅ 전화가 왔을 때(울림) 잠시 대기하는 콜(수신/무시 팝업에서 사용)
  const [pendingCall, setPendingCall] = useState(null);

  // ✅ 무시한 callId는 같은 세션에서 다시 팝업이 안 뜨게 처리(선택)
  const [ignoredCallIds, setIgnoredCallIds] = useState(() => new Set());

  const [compact, setCompact] = useState(false);
  const [sttOn, setSttOn] = useState(true);
  const [diarizationOn, setDiarizationOn] = useState(true);
  const [summaryOn, setSummaryOn] = useState(true);

  const openWithCall = (payload) => {
    setCall(payload);
    setCompact(false);
    setOpen(true);
  };

  const close = () => setOpen(false);

  // ✅ 수신 버튼: 이때 모달을 연다
  const acceptPendingCall = () => {
    if (!pendingCall) return;
    openWithCall(pendingCall);
    setPendingCall(null);
  };

  // ✅ 무시 버튼: 모달 안 뜨게 종료
  const ignorePendingCall = () => {
    if (!pendingCall) return;
    if (pendingCall?.callId) {
      setIgnoredCallIds((prev) => {
        const next = new Set(prev);
        next.add(pendingCall.callId);
        return next;
      });
    }
    setPendingCall(null);
  };

  useEffect(() => {
    // ✅ 전화가 울리면: 모달을 바로 띄우지 않고 pendingCall만 세팅
    const ringingHandler = (e) => {
      const payload = e.detail;
      const callId = payload?.callId;
      if (callId && ignoredCallIds.has(callId)) return;
      setPendingCall(payload);
    };

    // ✅ 연결 이벤트만 오는 환경이라면(최소 구현): CONNECTED도 동일하게 pending 처리
    const connectedHandler = (e) => {
      const payload = e.detail;
      const callId = payload?.callId;
      if (callId && ignoredCallIds.has(callId)) return;
      setPendingCall(payload);
    };

    const endHandler = () => {
      setOpen(false);
      setPendingCall(null);
    };

    callEventBus.addEventListener('CALL_RINGING', ringingHandler);
    callEventBus.addEventListener('CALL_CONNECTED', connectedHandler);
    callEventBus.addEventListener('CALL_ENDED', endHandler);

    return () => {
      callEventBus.removeEventListener('CALL_RINGING', ringingHandler);
      callEventBus.removeEventListener('CALL_CONNECTED', connectedHandler);
      callEventBus.removeEventListener('CALL_ENDED', endHandler);
    };
  }, [ignoredCallIds]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      call,
      openWithCall,
      close,

      // ✅ 수신/무시 팝업에 필요한 것들
      pendingCall,
      acceptPendingCall,
      ignorePendingCall,

      compact,
      setCompact,
      sttOn,
      setSttOn,
      diarizationOn,
      setDiarizationOn,
      summaryOn,
      setSummaryOn
    }),
    [open, call, pendingCall, compact, sttOn, diarizationOn, summaryOn]
  );

  return <CoPilotContext.Provider value={value}>{children}</CoPilotContext.Provider>;
}

export function useCoPilot() {
  const ctx = useContext(CoPilotContext);
  if (!ctx) throw new Error('useCoPilot must be used within CoPilotProvider');
  return ctx;
}
