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

  // [NEW] 실시간 데이터 상태
  const [transcript, setTranscript] = useState([]);
  const [agentResults, setAgentResults] = useState([]);

  // [NEW] Monitor WebSocket Connection
  useEffect(() => {
    if (!call?.callId) return;

    // 실제 환경에서는 환경변수나 base URL 사용 권장
    // 나중에 실제 base URL로 변경해야함.
    const wsUrl = `ws://localhost:8000/api/v1/agent/monitor/${call.callId}`;
    console.log(`CoPilotProvider: Connecting to Monitor WS: ${wsUrl}`);

    let socket;
    try {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("CoPilotProvider: Monitor WS Connected");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Monitor WS Received:", data);

          if (data.type === 'transcript_update') {
            setTranscript(prev => [...prev, data.data]);
          } else if (data.type === 'result') {
            setAgentResults(prev => [...prev, data]);
          }
        } catch (e) {
          console.error("Monitor WS Error parsing:", e);
        }
      };

      socket.onclose = () => console.log("CoPilotProvider: Monitor WS Disconnected");
      socket.onerror = (err) => console.error("CoPilotProvider: Monitor WS Error:", err);

    } catch (e) {
      console.error("CoPilotProvider: Failed to create WebSocket", e);
    }

    return () => {
      if (socket) {
        socket.close();
      }
      setTranscript([]);
      setAgentResults([]);
    };
  }, [call?.callId]);

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
      setSummaryOn,

      // [NEW] Real-time Data
      transcript,
      agentResults
    }),
    [open, call, pendingCall, compact, sttOn, diarizationOn, summaryOn, transcript, agentResults]
  );

  return <CoPilotContext.Provider value={value}>{children}</CoPilotContext.Provider>;
}

export function useCoPilot() {
  const ctx = useContext(CoPilotContext);
  if (!ctx) throw new Error('useCoPilot must be used within CoPilotProvider');
  return ctx;
}
