import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, PhoneCall, Library, GraduationCap, FileText, Users, Activity } from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider.jsx';

export default function Sidebar() {
  const { role } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl bg-white shadow-soft border border-slate-100 p-6">
      <div className="mb-6">
        <div className="text-xl font-extrabold tracking-tight">CS Assistant</div>
        <div className="text-sm text-slate-500">console</div>
      </div>

      <nav className="space-y-2">
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
            className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition text-slate-700 hover:bg-slate-50"
          >
            <div className="grid place-items-center h-9 w-9 rounded-xl bg-white border border-slate-100">
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
    </div>
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
