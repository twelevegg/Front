import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { ROUTES } from './routeConstants.js';

/**
 * Protect routes that require an authenticated session.
 *
 * ✅ Backend 연동 시 변경 포인트
 * - AuthProvider에서 /me API를 호출해 user를 복구합니다. (tokenStorage.get() 사용)
 * - /me가 401을 반환하면 토큰을 비우고 로그인 화면으로 보내세요.
 */
export default function RequireAuth({ children }) {
  // DEV ONLY: 백엔드 인증이 아직 붙지 않았을 때도 다른 페이지를 확인할 수 있도록 우회합니다.
  // TODO(Backend 연동 후): 아래 값을 false로 바꾸거나, VITE_DEV_BYPASS_AUTH 같은 env로 제어하세요.
  const DEV_BYPASS_AUTH = true;
  if (DEV_BYPASS_AUTH) return children;

  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }
  return children;
}
