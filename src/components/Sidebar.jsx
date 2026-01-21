import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, PhoneCall, Library, GraduationCap, FileText, Users, Activity, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import NotificationBell from './common/NotificationBell.jsx';
import { ROUTES } from '../app/routeConstants.js';

export default function Sidebar() {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-soft border border-white/50 p-6 sticky top-6 self-start flex flex-col h-[calc(100vh-3rem)]"
    >
      <div className="mb-6 shrink-0">
        <div className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          CS-Navigator
        </div>
        <div className="text-sm text-slate-500">Console</div>
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
        {role === 'admin' && (
          <>
            <SideLink to="/dashboard/admin" icon={LayoutGrid} label="Admin Dashboard" />
            <div className="mt-6 mb-2 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Admin Analysis
            </div>
            <SideLink to="/admin/attrition-prediction" icon={Users} label="Attrition Prediction" />
            <SideLink to="/admin/burnout-analysis" icon={Activity} label="Burnout Analysis" />
            <div className="my-4 border-t border-slate-100" />
          </>
        )}

        <SideLink to="/dashboard/assistant" icon={Users} label="Assistant Dashboard" />
        <SideLink to="/call-history" icon={PhoneCall} label="Call history" />
        <SideLink to="/case-library" icon={Library} label="Case library" />

        {/* Training Center (hover -> sub menu) */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => navigate('/training/ppt')}
            className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition text-slate-700 hover:bg-slate-50 hover:shadow-sm"
          >
            <div className="grid place-items-center h-9 w-9 rounded-xl bg-white border border-slate-100 shadow-sm">
              <GraduationCap size={18} />
            </div>
            Training Center
          </button>

          <div className="hidden group-hover:block group-focus-within:block ml-12 mt-1 space-y-1">
            <SubLink to="/training/ppt" icon={FileText} label="PPT 교육" />
            <SubLink to="/training/role-playing" icon={Users} label="RolePlaying" />
          </div>
        </div>
      </nav>

      {/* Footer / Navigation Rail */}
      <div className="mt-4 pt-4 border-t border-slate-100/50 shrink-0">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="text-xs font-bold text-slate-400">USER PROFILE</div>
          <NotificationBell />
        </div>

        <div className="bg-white/50 rounded-2xl p-3 border border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {role === 'admin' ? 'AD' : 'AS'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-extrabold text-slate-800 truncate">{user?.name || 'User'}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">{role === 'admin' ? 'Administrator' : 'Assistant'}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SideLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${isActive
          ? 'bg-blue-50 text-blue-600 border border-blue-100'
          : 'text-slate-700 hover:bg-slate-50'
        }`
      }
    >
      <div className="grid place-items-center h-9 w-9 rounded-xl bg-white border border-slate-100">
        <Icon size={18} />
      </div>
      {label}
    </NavLink>
  );
}

function SubLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive
          ? 'bg-blue-50 text-blue-600 border border-blue-100'
          : 'text-slate-600 hover:bg-slate-50'
        }`
      }
    >
      <Icon size={16} />
      {label}
    </NavLink>
  );
}
