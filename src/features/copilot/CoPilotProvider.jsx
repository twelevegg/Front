import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { callEventBus } from '../calls/callEvents.js';
import { useAuth } from '../auth/AuthProvider.jsx';
import { getWebSocketUrl } from '../../utils/websocketUtils.js';

const CoPilotContext = createContext(null);

export function CoPilotProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [call, setCall] = useState(null);
  const { user } = useAuth();

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
      // ✅ 통화가 종료되더라도 팝업을 바로 닫지 않고, 사용자가 닫을 수 있게 유지
      // setOpen(false); 
      console.log("Call Ended received. Keeping popup open for review.");
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

  // [NEW] WebSocket Reference for sending messages
  const socketRef = React.useRef(null);

  // [NEW] Monitor WebSocket Connection
  useEffect(() => {
    if (!call?.callId) return;

    // ✅ URL 결정 로직 (환경변수 기반)
    // ✅ URL 결정 로직 (환경변수 기반 - FastAPI 연결용)
    const getWsBase = () => {
      // 이 서비스는 FastAPI(/ai)에 연결되므로 FAST_API_BASE_URL 우선 사용
      let apiBase = import.meta.env.VITE_FAST_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '';

      // http -> ws, https -> wss 자동 변환
      if (apiBase.startsWith('http')) {
        apiBase = apiBase.replace(/^http/, 'ws');
      }

      // URL 결합 시 /ai 중복 방지 (기존 하드코딩된 suffix가 /ai를 포함하므로, base에서는 제거)
      if (apiBase.endsWith('/ai')) {
        apiBase = apiBase.slice(0, -3);
      }
      return apiBase;
    };

    const wsBase = getWsBase();
    const wsUrl = `${wsBase}/ai/api/v1/agent/monitor/${call.callId}`;

    console.log(`CoPilotProvider: Connecting to Monitor WS: ${wsUrl}`);

    let socket;
    try {
      socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("CoPilotProvider: Monitor WS Connected");
        // [NEW] Identify the agent monitoring this call
        if (user?.id) {
          const identifyMsg = {
            type: "IDENTIFY",
            memberId: user.id,
            tenantName: user.tenantName || "default" // Assuming user object might have tenant info, fallback to default
          };
          console.log("Sending IDENTIFY:", identifyMsg);
          socket.send(JSON.stringify(identifyMsg));
        }
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // console.log("Monitor WS Received:", data);

          if (data.type === 'transcript_update') {
            setTranscript(prev => [...prev, data.data]);
          } else if (data.type === 'result') {
            setAgentResults(prev => [...prev, data]);
          } else if (data.type === 'CALL_ENDED') {
            console.log("CoPilotProvider: Server confirmed CALL_ENDED");
          }
        } catch (e) {
          console.error("Monitor WS Error parsing:", e);
        }
      };

      socket.onclose = () => {
        console.log("CoPilotProvider: Monitor WS Disconnected");
        socketRef.current = null;
      };
      socket.onerror = (err) => console.error("CoPilotProvider: Monitor WS Error:", err);

    } catch (e) {
      console.error("CoPilotProvider: Failed to create WebSocket", e);
    }

    return () => {
      if (socket) {
        socket.close();
      }
      socketRef.current = null;
      setTranscript([]);
      setAgentResults([]);
    };
  }, [call?.callId, user?.id]);

  // [NEW] Send Call End Event
  const sendCallEnd = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending CALL_ENDED event to backend...");
      socketRef.current.send(JSON.stringify({ type: "CALL_ENDED", callId: call?.callId }));
    } else {
      console.error("Cannot send CALL_ENDED: WebSocket is not open.");
    }
  };

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
      agentResults,

      // [NEW] Actions
      sendCallEnd
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
