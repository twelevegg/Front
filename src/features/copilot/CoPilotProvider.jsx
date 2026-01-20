import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { callEventBus } from '../calls/callEvents.js';

const CoPilotContext = createContext(null);

export function CoPilotProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [call, setCall] = useState(null);
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

  useEffect(() => {
    const handler = (e) => openWithCall(e.detail);
    callEventBus.addEventListener('CALL_CONNECTED', handler);
    const endHandler = () => setOpen(false);
    callEventBus.addEventListener('CALL_ENDED', endHandler);
    return () => {
      callEventBus.removeEventListener('CALL_CONNECTED', handler);
      callEventBus.removeEventListener('CALL_ENDED', endHandler);
    };
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      call,
      openWithCall,
      close,
      compact,
      setCompact,
      sttOn,
      setSttOn,
      diarizationOn,
      setDiarizationOn,
      summaryOn,
      setSummaryOn
    }),
    [open, call, compact, sttOn, diarizationOn, summaryOn]
  );

  return <CoPilotContext.Provider value={value}>{children}</CoPilotContext.Provider>;
}

export function useCoPilot() {
  const ctx = useContext(CoPilotContext);
  if (!ctx) throw new Error('useCoPilot must be used within CoPilotProvider');
  return ctx;
}
