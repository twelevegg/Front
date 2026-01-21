import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../features/auth/AuthProvider.jsx';
import { ROUTES } from '../app/routeConstants.js';

const titleMap = {
  [ROUTES.DASH_ADMIN]: 'Admin Dashboard',
  [ROUTES.DASH_ASSISTANT]: 'Assistant Dashboard',
  [ROUTES.CALL_HISTORY]: 'Call history',
  [ROUTES.CASE_LIBRARY]: 'Case library',
  [ROUTES.TRAIN_PPT]: 'Training Center · PPT 교육',
  [ROUTES.TRAIN_ROLEPLAY]: 'Training Center · RolePlaying',
  [ROUTES.ADMIN_ATTRITION]: 'Admin · Attrition Prediction',
  [ROUTES.ADMIN_BURNOUT]: 'Admin · Burnout Analysis'
};

export default function Topbar({ pathname }) {
  const { user, role, logout } = useAuth();
  const nav = useNavigate();

  const title = useMemo(() => titleMap[pathname] || 'Dashboard', [pathname]);

  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-white/50 bg-white/70 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="text-2xl font-extrabold">{title}</div>
      </div>

      <div className="flex items-center gap-3">
        {/* Actions moved to Sidebar */}
      </div>
    </div>
  );
}
