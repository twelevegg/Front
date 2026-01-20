import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { ROUTES } from './routeConstants.js';

export default function HomeRedirect() {
  const { role } = useAuth();
  return <Navigate to={role === 'admin' ? ROUTES.DASH_ADMIN : ROUTES.DASH_ASSISTANT} replace />;
}
