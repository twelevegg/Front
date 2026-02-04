import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, PhoneCall, Library, GraduationCap, FileText, Users, Activity, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import NotificationBell from './common/NotificationBell.jsx';
import { ROUTES } from '../app/routeConstants.js';
import UserProfileModal from './common/UserProfileModal.jsx';
import { useState } from 'react';

export default function Sidebar() {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-soft border border-white/50 p-6 sticky top-6 self-start flex flex-col h-[calc(100vh-3rem)] z-50"
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

            <SideLink to={ROUTES.ADMIN_ANALYTICS} icon={Activity} label="Admin Analytics" />
          </>
        )}

        <SideLink to="/dashboard/assistant" icon={Users} label="Assistant Dashboard" />
        <SideLink to="/call-history" icon={PhoneCall} label="Call history" />
        <SideLink to="/case-library" icon={Library} label="Case library" />

        {/* Training Center Dropdown */}
        <SidebarDropdown
          icon={GraduationCap}
          label="Training Center"
          routes={[
            { to: "/training/ppt", label: "PPT 교육", icon: FileText },
            { to: "/training/role-playing", label: "RolePlaying", icon: Users }
          ]}
        />
      </nav>

      {/* Footer / Navigation Rail */}
      <div className="mt-4 pt-4 border-t border-slate-100/50 shrink-0">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="text-xs font-bold text-slate-400">USER PROFILE</div>
          <NotificationBell />
        </div>

        <motion.div
          layoutId="profile-card-container"
          layout="position"
          transition={{ duration: 0 }}
          onClick={() => setIsProfileOpen(true)}
          className="bg-white/50 rounded-2xl p-3 border border-slate-100 flex items-center gap-3 cursor-pointer hover:bg-white hover:shadow-md transition-all group relative"
        >
          <div
            className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform"
          >
            {role === 'admin' ? 'AD' : 'AS'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-extrabold text-slate-800 truncate">
              {user?.name || 'User'}
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">
              {role === 'admin' ? 'Administrator' : 'Assistant'}
            </div>
          </div>

          {/* Quick Logout Button (Stop Propagation to prevent opening modal) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition relative z-10"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </motion.div>
      </div>

      <UserProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        role={role}
      />
    </motion.div>
  );
}

function SideLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${isActive
          ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
          : 'text-slate-700 hover:bg-slate-50'
        }`
      }
    >
      <div className="grid place-items-center h-9 w-9 rounded-xl bg-white border border-slate-100 shadow-sm">
        <Icon size={18} />
      </div>
      {label}
    </NavLink>
  );
}

function SidebarDropdown({ icon: Icon, label, routes }) {
  // Check if any child route is active to highlight the parent
  // (This is a simplified check, ideally specific to logic needed)
  return (
    <div className="relative group">
      <button
        type="button"
        className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition text-slate-700 hover:bg-slate-50 hover:shadow-sm"
      >
        <div className="grid place-items-center h-9 w-9 rounded-xl bg-white border border-slate-100 shadow-sm">
          <Icon size={18} />
        </div>
        {label}
      </button>

      <div className="hidden group-hover:block group-focus-within:block ml-12 mt-1 space-y-1">
        {routes.map((route) => (
          <NavLink
            key={route.to}
            to={route.to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? "text-indigo-600 bg-indigo-50 font-extrabold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
              }`
            }
          >
            <route.icon size={16} />
            {route.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
