import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import { useAuth } from '../features/auth/AuthProvider.jsx';
import { ROUTES } from '../app/routeConstants.js';

const titleMap = {
  [ROUTES.DASH_ADMIN]: 'Admin Dashboard',
  [ROUTES.DASH_ASSISTANT]: 'Assistant Dashboard',
  [ROUTES.CALL_HISTORY]: 'Call history',
  [ROUTES.CASE_LIBRARY]: 'Case library',
  [ROUTES.TRAIN_PPT]: 'Training Center · PPT 교육',
  [ROUTES.TRAIN_ROLEPLAY]: 'Training Center · RolePlaying'
};

export default function Topbar({ pathname }) {
  const { user, role, logout } = useAuth();
  const nav = useNavigate();

  const title = useMemo(() => titleMap[pathname] || 'Dashboard', [pathname]);

  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="text-2xl font-extrabold">{title}</div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-500 border border-slate-200 rounded-full px-3 py-1">
          {role === 'admin' ? '관리자(Admin)' : '상담사(Assistant)'}
        </span>

        <div className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold">
          👤 {user?.name || 'User'}
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            nav(ROUTES.LOGIN, { replace: true });
          }}
          className="ml-1 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50"
          title="Logout"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
