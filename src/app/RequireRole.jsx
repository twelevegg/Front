import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { ROUTES } from './routeConstants.js';

/**
 * Role-based route guard.
 *
 * ✅ Backend 연동 시 변경 포인트
 * - 백엔드 /me 응답에 role (예: 'admin' | 'assistant') 포함 필요
 * - 프론트는 그 role로 allow 체크만 수행 (권한은 서버에서도 반드시 검증)
 */
export default function RequireRole({ allow = [], children }) {
  // DEV ONLY: 백엔드 권한이 아직 붙지 않았을 때도 화면을 확인할 수 있도록 우회합니다.
  // TODO(Backend 연동 후): 아래 값을 false로 바꾸거나, env로 제어하세요.
  const DEV_BYPASS_AUTH = false;
  if (DEV_BYPASS_AUTH) return children;

  const { loading, role } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;
  if (!allow.includes(role)) return <Navigate to={ROUTES.DASH_ASSISTANT} replace />;

  return children;
}
