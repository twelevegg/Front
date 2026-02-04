import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { tokenStorage } from './tokenStorage.js';
import { loginApi, meApi } from './api.js';
import { notificationService } from '../../services/NotificationService.js';
import { emitCallRinging } from '../calls/callEvents.js';

const AuthContext = createContext(null);

/**
 * AuthProvider: 전역 인증 상태 제공
 *
 * ✅ Backend 연동 시 변경 포인트
 * - loginApi / signupApi / meApi 를 실제 서버 엔드포인트로 변경 (features/auth/api.js)
 * - 토큰 정책(리프레시 토큰, httpOnly cookie 등)에 맞춰 tokenStorage를 조정
 * - role은 서버에서도 반드시 검증(프론트의 RequireRole은 UX 가드 역할)
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, role }
  const [loading, setLoading] = useState(true);

  const role = user?.role || null;

  // 앱 시작 시: 토큰이 있으면 /me로 세션 복구
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = tokenStorage.get();
        if (!token) return;

        const me = await meApi();
        setUser(me);
      } catch {
        // ✅ Backend 연동 시: /me 실패 시 정책(토큰 만료/리프레시) 적용
        tokenStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  // 토큰이 없으면 로딩 종료
  useEffect(() => {
    if (!tokenStorage.get()) setLoading(false);
  }, []);

  // [NEW] WebSocket Connection for Notifications
  useEffect(() => {
    if (!user?.id) return;

    // Connect to WebSocket using user ID
    // (FastAPI broadcasts to ALL connected users anyway, but ID is used for connection)
    notificationService.connect(user.id);

    // Listen for CALL_STARTED event from backend
    const handleCallStarted = (payload) => {
      console.log("AuthProvider: CALL_STARTED received", payload);

      // Trigger the ringing UI (IncomingCallToast)
      emitCallRinging({
        callId: payload.callId,
        customerName: payload.customer_info?.name || 'Unknown',
        customerPhone: payload.customer_number || 'Unknown',
        issue: '상담 요청',
        ...payload
      });
    };

    notificationService.on('CALL_STARTED', handleCallStarted);

    return () => {
      // Cleanup on logout or unmount
      notificationService.off('CALL_STARTED', handleCallStarted);
      notificationService.disconnect();
    };
  }, [user?.id]);

  const login = async ({ tenantName, email, password }) => {
    const res = await loginApi({ tenantName, email, password });
    const data = await res.json();
    console.log(data);
    tokenStorage.set(data.accessToken);
    if (data.refreshToken) {
      tokenStorage.setRefresh(data.refreshToken);
    }
    const me = await meApi();
    setUser(me);
    return me;
  };

  const logout = () => {
    tokenStorage.clear();
    setUser(null);
  };

  const value = useMemo(() => ({ user, role, loading, login, logout }), [user, role, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
